import { building } from '$app/environment';
import sqlite from 'sqlite3';

let db;

if (!building) {
    db = new sqlite.Database('db.sqlite');
}

export default db;
