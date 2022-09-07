export const versionUpgrades = [
    {
        toVersion: 1,
        statements: [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY NOT NULL,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                company TEXT,
                size REAL,
                age INTEGER,
                last_modified INTEGER DEFAULT (strftime('%s', 'now'))    
            );`,
            `CREATE INDEX IF NOT EXISTS users_index_name ON users (name);`,
            `CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);`,            
            `CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
             AFTER UPDATE ON users
             FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
             BEGIN
                UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
             END;`,
            `INSERT INTO users (name,email,age) VALUES ('Whiteley', 'whiteley@local.host', 30);`,
            `INSERT INTO users (name,email,age) VALUES ('Jones', 'jones@local.host', 44);`,
        ]
    },
    {
        toVersion: 2,
        statements: [
            `ALTER TABLE users ADD COLUMN country TEXT;`,
            `ALTER TABLE users ADD COLUMN sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1));`,
            `CREATE TABLE messages (
                id INTEGER PRIMARY KEY NOT NULL,
                userid INTEGER,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
                last_modified INTEGER DEFAULT (strftime('%s', 'now')),        
                FOREIGN KEY (userid) REFERENCES users(id) ON DELETE SET DEFAULT
            );`,
            `CREATE INDEX messages_index_title ON messages (title);`,
            `CREATE INDEX messages_index_last_modified ON messages (last_modified);`,
            `INSERT INTO messages (userid,title,body) VALUES (1,'test message 1','content test message 1');`,
            `INSERT INTO messages (userid,title,body) VALUES (2,'test message 2','content test message 2');`,
            `INSERT INTO messages (userid,title,body) VALUES (1,'test message 3','content test message 3');`,
            `UPDATE users SET country = 'United Kingdom'  WHERE id = 1;`,
            `UPDATE users SET country = 'Australia'  WHERE id = 2;`,
        ]
    } 
]