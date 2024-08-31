import db from '$lib/db';
import assert from 'assert';
import { compare, genSaltSync, hashSync } from "bcrypt";
import { randomUUID, type UUID } from "crypto";
import { createUnzip } from 'zlib';

export enum Privacy {
    Public = 'Public',
    SemiPrivate = 'SemiPrivate',
    Private = 'Private'
}

export class MonkeyBox {
    public id: UUID;
    public privacy: Privacy;
    public publishAt: EpochTimeStamp;

    private constructor(id: UUID, privacy: Privacy, publishAt: EpochTimeStamp) {
        this.id = id;
        this.privacy = privacy;
        this.publishAt = publishAt;
    }

    public static get(id: UUID) : MonkeyBox {
        const stmt = db.prepare('SELECT * FROM `monkey_box` WHERE `id` = ?');
        const row: any = stmt.get(id.toLowerCase());
        
        const privacy : keyof typeof Privacy = row.privacy;
        return new MonkeyBox(row.id, Privacy[privacy], row.publish_at);
    }

    public static create(privacy: Privacy, publishAt: EpochTimeStamp) {
        let id = randomUUID();

        const stmt = db.prepare('INSERT INTO `monkey_box`(`id`, `privacy`, `publish_at`) VALUES (?,?,?)');
        const result = stmt.run(id, privacy.toString(), publishAt);
    
        return new MonkeyBox(id, privacy, publishAt);
    }
}

export enum UserType {
    Admin = 'Admin',
    Observer = 'Observer'
}

export class User {
    public key: UUID;
    public type: UserType;
    public box: MonkeyBox;

    private constructor(key: UUID, type: UserType, box: MonkeyBox) {
        this.key = key;
        this.type = type;
        this.box = box;
    }


    public static create(type: UserType, box: MonkeyBox) : User {
        let key = randomUUID();

        const stmt = db.prepare('INSERT INTO `user`(`key`, `type`, `box`) VALUES (?,?,?)');
        
        const result = stmt.run(key, type.toString(), box.id);

        return new User(key, type, box);
    }

    public static get(key: UUID, box?: MonkeyBox) : User {
        const stmt = db.prepare('SELECT * FROM `user` WHERE `key` = ?');
        
        const row : any = stmt.get(key)

        if (box == undefined)
            box = MonkeyBox.get(row.box);
        else
            assert(box.id == row.id)
        
        
        return new User(row.key, UserType[row.type as keyof typeof UserType], box);
    }
}

export class Monkey {
    public id : UUID;
    public box : MonkeyBox;
    public value : String;
    public hash : String;
    public weight : Number;

    private constructor(id: UUID, box: MonkeyBox, value: String, hash: String, weight: Number = 1) {
        this.id = id;
        this.box = box;
        this.value = value;
        this.hash = hash;
        this.weight = weight;
    }

    public static create(box: MonkeyBox, value: String, hash: String, weight: Number = 1) : Monkey {
        let id = randomUUID();
        const stmt = db.prepare('INSERT INTO `monkey`(`box`, `value`, `weight`) VALUES (?,?,?)');

        stmt.run(id, box.id, value, weight);

        return new Monkey(id, box, value, hash, weight);
    }

    public static getAll(box: MonkeyBox) : Monkey[] {
        const stmt = db.prepare('SELECT * FROM `monkey` WHERE `box` = ?');

        const res: any[] = stmt.all(box.id);

        let ret: Monkey[] = []

        res.forEach(row => {
            ret.push(new Monkey(row.id, box, row.value, row.hash, row.weight));
        })

        return ret;
    }
}

export class MonkeySecrets {
    public monkey: Monkey;
    public hash: String;

    private constructor(monkey: Monkey, hash: String) {
        this.monkey = monkey;
        this.hash = hash;
    }

    public static create(monkey: Monkey, hash: String) {
        const stmt = db.prepare('INSERT INTO `monkey_secrets`(`id`, `hash`) VALUES (?,?)');
        const result = stmt.run(monkey.id, hash);
        return new MonkeySecrets(monkey, hash);
    }

    public static get(monkey: Monkey) {
        const stmt = db.prepare('SELECT * FROM `monkey_secrets` WHERE `id` = ?');
        const row: any = stmt.get(monkey.id);
        return new MonkeySecrets(monkey, row.hash);
    }
}
