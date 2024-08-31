import db from '$lib/db';
import { compare, genSaltSync, hashSync } from "bcrypt";
import { randomUUID, type UUID } from "crypto";

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
    private key: UUID;
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

        if (box == undefined) {
            box = MonkeyBox.get(row.box);
        }
        
        return new User(row.key, UserType[row.type as keyof typeof UserType], box);
    }
}

export class Monkey {
    public box : MonkeyBox;
    public value : String;
    public weight : Number;

    private constructor(id: UUID, box: MonkeyBox, value: String, weight: Number = 1) {
        this.id = id;
        this.box = box;
        this.value = value;
        this.weight = weight;
    }

    public static create(box: MonkeyBox, value: String, weight: Number = 1) {
        const stmt = db.prepare('INSERT INTO `monkey`(`box`, `value`, `weight`) VALUES (?,?,?)');

        stmt.run(box.id, value, weight);

        return new Monkey(value, box, weight);
    }
}
