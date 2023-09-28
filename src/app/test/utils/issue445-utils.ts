
export const getCurrentTimeAsSeconds = () => {
  const curtime = Math.floor(Date.now() / 1000);
  console.log(`##### curtime: ${curtime} #####`);
  return curtime
}
/*
export const createSchemaIssue445: string = `
DROP TABLE IF EXISTS table_1;
DROP TABLE IF EXISTS table_2;
CREATE TABLE IF NOT EXISTS Table_1 (
  id INTEGER PRIMARY KEY NOT NULL,
  result_id TEXT,
  result_slug TEXT,
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  last_modified INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (result_id, result_slug) REFERENCES Table_2(id, slug) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS table_2 (
  id TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  last_modified INTEGER DEFAULT (strftime('%s', 'now')),
  PRIMARY KEY (id, slug)
);
CREATE INDEX IF NOT EXISTS table_2_index_primarykey ON table_2 (id,slug);
CREATE INDEX IF NOT EXISTS table_2_index_last_modified ON table_2 (last_modified);
CREATE INDEX IF NOT EXISTS table_1_index_id ON table_1 (id);
CREATE INDEX IF NOT EXISTS table_1_index_last_modified ON table_1 (last_modified);
CREATE TRIGGER IF NOT EXISTS table_1_trigger_last_modified
  AFTER UPDATE ON table_1
  FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
  BEGIN
    UPDATE table_1 SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
  END;
  CREATE TRIGGER IF NOT EXISTS table_2_trigger_last_modified
  AFTER UPDATE ON table_2
  FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
  BEGIN
    UPDATE table_2 SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
  END;
  INSERT INTO table_2 (id,slug,description ) VALUES
  ('834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1', 'my_slug_1'),
  ('e8fa8d54-641a-4d7b-9422-91474d713c62', 'slug_2', 'my_slug_2'),
  ('dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'slug_1', 'my_slug_3'),
  ('511fea83-9f5f-4606-85ec-3d769da4bf63', 'slug_3', 'my_slug_4'),
  ('3bc82ef7-1138-4f97-945a-08626a42a648', 'slug_3', 'my_slug_5'),
  ('a33abc11-264e-4bbb-82e8-b87226bb4383', 'slug_4', 'my_slug_6'),
  ('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5', 'my_slug_7'),
  ('74dca5e8-c702-4e70-ad16-0a16a64d55fa', 'slug_1', 'my_slug_8'),
  ('cd13d088-21cf-4286-ae61-0643d321dd9e', 'slug_4', 'my_slug_9'),
  ('9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 'slug_3', 'my_slug_10');
  INSERT INTO table_1 (result_id,result_slug) VALUES
    ('834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1'),
    ('e8fa8d54-641a-4d7b-9422-91474d713c62', 'slug_2'),
    ('dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'slug_1'),
    ('511fea83-9f5f-4606-85ec-3d769da4bf63', 'slug_3'),
    ('3bc82ef7-1138-4f97-945a-08626a42a648', 'slug_3'),
    ('9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 'slug_3'),
    ('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5')
  ;
`;
export const deleteFromTable2INIssue445: string = `
DELETE FROM table_2 WHERE (id,slug) IN (VALUES ('834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1'),('cd13d088-21cf-4286-ae61-0643d321dd9e', 'slug_4'));
`;
export const deleteFromTable2Issue445: string = `
DELETE FROM table_2 WHERE (id,slug) = ('dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'slug_1');
`;
export const deleteFromTable2ANDIssue445: string = `
DELETE FROM table_2 WHERE (id,slug) = ('9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 'slug_3') OR (id,slug) = ('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5');
`;

export const deleteFromTable1Issue445: string = `
DELETE FROM table_1 WHERE id = 1;
`;
*/
export const schemaTable1DefaultIssue445: string = `
DROP TABLE IF EXISTS Table_1;
DROP TABLE IF EXISTS Table_3;
DROP TABLE IF EXISTS Table_2;
CREATE TABLE IF NOT EXISTS Table_1 (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    product_type TEXT DEFAULT 'object' CHECK (product_type IN ('object', 'book')),
    result_id TEXT,
    result_slug TEXT,
    person_id INTEGER,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (result_id, result_slug) REFERENCES Table_2(id, slug) ON DELETE SET DEFAULT,
    FOREIGN KEY (person_id) REFERENCES Table_3(id) ON DELETE SET DEFAULT
);
`;
export const schemaTable1RestrictIssue445: string = `
DROP TABLE IF EXISTS Table_1;
DROP TABLE IF EXISTS Table_3;
DROP TABLE IF EXISTS Table_2;
CREATE TABLE IF NOT EXISTS Table_1 (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    product_type TEXT DEFAULT 'object' CHECK (product_type IN ('object', 'book')),
    result_id TEXT,
    result_slug TEXT,
    person_id INTEGER,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (result_id, result_slug) REFERENCES Table_2(id, slug) ON DELETE RESTRICT,
    FOREIGN KEY (person_id) REFERENCES Table_3(id) ON DELETE RESTRICT
);
`;export const schemaTable1CascadeIssue445: string = `
DROP TABLE IF EXISTS Table_1;
DROP TABLE IF EXISTS Table_3;
DROP TABLE IF EXISTS Table_2;
CREATE TABLE IF NOT EXISTS Table_1 (
    id INTEGER PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    product_type TEXT DEFAULT 'object' CHECK (product_type IN ('object', 'book')),
    result_id TEXT,
    result_slug TEXT,
    person_id INTEGER,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (result_id, result_slug) REFERENCES Table_2(id, slug) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES Table_3(id) ON DELETE CASCADE
);
`;
export const schemaTable2_3Issue445: string = `
CREATE TABLE IF NOT EXISTS Table_2 (
    id TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    PRIMARY KEY (id, slug)
);
CREATE TABLE IF NOT EXISTS Table_3 (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS table_2_index_primarykey ON Table_2 (id,slug);
CREATE INDEX IF NOT EXISTS table_2_index_last_modified ON Table_2 (last_modified);
CREATE INDEX IF NOT EXISTS table_1_index_id ON Table_1 (id);
CREATE INDEX IF NOT EXISTS table_1_index_last_modified ON Table_1 (last_modified);
CREATE INDEX IF NOT EXISTS table_3_index_id ON Table_3 (id);
CREATE INDEX IF NOT EXISTS table_3_index_last_modified ON Table_3 (last_modified);
CREATE TRIGGER IF NOT EXISTS table_1_trigger_last_modified
  AFTER UPDATE ON Table_1
  FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
  BEGIN
    UPDATE Table_1 SET last_modified = (strftime('%s', 'now')) WHERE id=NEW.id;
  END;
CREATE TRIGGER IF NOT EXISTS table_2_trigger_last_modified
  AFTER UPDATE ON Table_2
  FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
  BEGIN
    UPDATE Table_2 SET last_modified= (strftime('%s', 'now')) WHERE id=NEW.id;
  END;
CREATE TRIGGER IF NOT EXISTS table_3_trigger_last_modified
  AFTER UPDATE ON Table_3
  FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
  BEGIN
    UPDATE Table_3 SET last_modified= (strftime('%s', 'now')) WHERE id=NEW.id;
  END;

INSERT INTO Table_3 (name,email) VALUES
  ('Jones', 'jones@example.com'),
  ('Adams', 'adams@example.com'),
  ('Brown', 'brown@example.com'),
  ('Watson', 'watson@example.com'),
  ('Linester', 'linester@example.com');
INSERT INTO Table_2 (id,slug,description) VALUES
  ('834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1', 'my_slug_1'),
  ('e8fa8d54-641a-4d7b-9422-91474d713c62', 'slug_2', 'my_slug_2'),
  ('dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'slug_1', 'my_slug_3'),
  ('511fea83-9f5f-4606-85ec-3d769da4bf63', 'slug_3', 'my_slug_4'),
  ('3bc82ef7-1138-4f97-945a-08626a42a648', 'slug_3', 'my_slug_5'),
  ('a33abc11-264e-4bbb-82e8-b87226bb4383', 'slug_4', 'my_slug_6'),
  ('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5', 'my_slug_7'),
  ('74dca5e8-c702-4e70-ad16-0a16a64d55fa', 'slug_1', 'my_slug_1'),
  ('cd13d088-21cf-4286-ae61-0643d321dd9e', 'slug_4', 'my_slug_9'),
  ('9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 'slug_3', 'my_slug_10');
INSERT INTO Table_1 (product_id, product_type) VALUES ('MyProduct1', 'object');
INSERT INTO Table_1 (product_id, product_type) VALUES ('MyProduct2', 'book');
INSERT INTO Table_1 (product_id,product_type,result_id,result_slug,person_id) VALUES
    ('MyProduct3', 'object', '834efdb6-6044-4b44-8fcb-560710936f37', 'slug_1',1),
    ('MyProduct4', 'book', 'e8fa8d54-641a-4d7b-9422-91474d713c62', 'slug_2',2),
    ('MyProduct5', 'object', 'dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'slug_1',1),
    ('MyProduct6', 'object', '511fea83-9f5f-4606-85ec-3d769da4bf63', 'slug_3',3),
    ('MyProduct7', 'book', '3bc82ef7-1138-4f97-945a-08626a42a648', 'slug_3',2),
    ('MyProduct8', 'book', '9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 'slug_3',1),
    ('MyProduct9', 'object', '2a38839e-3b0d-47f0-9e60-d6b19c0978ad', 'slug_5',2),
    ('MyProduct10', 'object', '74dca5e8-c702-4e70-ad16-0a16a64d55fa', 'slug_1',1)
  ;
`;


