import db from '$lib/db';
import { compare, genSaltSync, hashSync } from "bcrypt";
import { randomUUID, type UUID } from "crypto";

export class User {
    public id: UUID;
    public username: string;
    private passwordHash: string;

    private constructor(id: UUID, username: string, hash: string) {
        this.id = id;
        this.username = username;
        this.passwordHash = hash;
    }


    public static insert(username: string, password: string) : User | undefined {
        let id = randomUUID();
        let salt = genSaltSync(10);
        let passwordHash = hashSync(password, salt);

        const insert_stmt = db.prepare('INSERT INTO `user`(`id`, `username`, `password`) VALUES (?,?,?)');
        
        let result;
        try {
            console.log('CP1');
            result = insert_stmt.run(id, username, passwordHash);
            console.log('CP2');
        } catch (error) {
            return undefined;
        }

        if (result.changes == 0) {
            return undefined;
        }
        console.log('CP3');

        return new User(id, username, passwordHash)
    }

    public static async login(username: string, password: string) : Promise<User | undefined> {
        const login_stmt = db.prepare('SELECT * FROM `user` WHERE `username` = ?');
        const row : any = login_stmt.get(username)

        if (row == undefined)
            return undefined;

        const hash = row.password;
        if (await compare(password, hash)) {
            return new User(row.id, row.username, row.password);
        }

        return undefined;
    }
}
