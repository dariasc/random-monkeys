import Database from 'better-sqlite3';

let db = new Database('db.sqlite');

db.exec(`
DROP TABLE IF EXISTS \`monkey_secrets\`;
DROP TABLE IF EXISTS \`monkey\`;
DROP TABLE IF EXISTS \`user\`;
DROP TABLE IF EXISTS \`monkey_box\`;
    `);

try {
    db.exec(`
    CREATE TABLE \`monkey_box\` (
        \`id\` TEXT PRIMARY KEY,
        \`name\` TEXT NOT NULL,
        \'winners\' TEXT NOT NULL,
        \`privacy\` TEXT CHECK(\`privacy\` IN ('Public', 'SemiPrivate', 'Private')) NOT NULL,
        \`publish_at\` INTEGER NOT NULL
    );

    CREATE TABLE \`user\` (
        \`key\`  TEXT PRIMARY KEY,
        \`type\` TEXT CHECK(\`type\` IN ('Admin', 'Observer')) NOT NULL,
        \`box\`  TEXT NOT NULL,
        FOREIGN KEY(\`box\`) REFERENCES \`monkey_box\`(\`id\`)
    );

    CREATE TABLE \`monkey\` (
        \'id\' TEXT PRIMARY KEY,
        \`box\` TEXT NOT NULL,
        \`value\` TEXT NOT NULL,
        \`hash\` TEXT NOT NULL,
        \`weight\` FLOAT NOT NULL DEFAULT 1,
        FOREIGN KEY(\`box\`) REFERENCES \`monkey_box\`(\`id\`)
    );

    CREATE TABLE \`monkey_secrets\` (
        \`monkey\` TEXT NOT NULL,
        \`salt\` TEXT NOT NULL,
        FOREIGN KEY(\`monkey\`) REFERENCES \`monkey\`(\`id\`)
    );
    `);
} catch {
    
}

export default db;
