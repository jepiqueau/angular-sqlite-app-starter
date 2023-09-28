
export const getCurrentTimeAsSeconds = () => {
  const curtime = Math.floor(Date.now() / 1000);
  console.log(`##### curtime: ${curtime} #####`);
  return curtime
}
export const schemaExtrasIssue470: string = `
DROP TABLE IF EXISTS Extras;
DROP TABLE IF EXISTS Fares;
CREATE TABLE IF NOT EXISTS Extras (
  ExtraId TEXT PRIMARY KEY NOT NULL,
  Amount REAL NOT NULL,
  Name TEXT NOT NULL,
  FareId TEXT NOT NULL,
  last_modified INTEGER DEFAULT (strftime('%s', 'now')),
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  FOREIGN KEY(FareId) REFERENCES Fares(FareId)
 );

CREATE TRIGGER IF NOT EXISTS Extras_trigger_last_modified
 AFTER UPDATE ON Extras
 FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
 BEGIN
  UPDATE Extras SET last_modified= (strftime('%s', 'now'))
  WHERE ExtraId=NEW.ExtraId;
 END;
 `;
export const schemaFaresIssue470: string = `
CREATE TABLE IF NOT EXISTS Fares (
    FareId TEXT NOT NULL,
    description TEXT,
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    PRIMARY KEY (FareId)
);
CREATE INDEX IF NOT EXISTS fares_index_primarykey ON Fares (FareId);
CREATE INDEX IF NOT EXISTS fares_index_last_modified ON Fares (last_modified);
CREATE INDEX IF NOT EXISTS extras_index_id ON Extras (FareId);
CREATE INDEX IF NOT EXISTS extras_index_last_modified ON Extras (last_modified);
CREATE TRIGGER IF NOT EXISTS Fares_trigger_last_modified
 AFTER UPDATE ON Fares
 FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
 BEGIN
  UPDATE Fares SET last_modified= (strftime('%s', 'now'))
  WHERE FareId=NEW.FareId;
 END;
`;

export const dataIssue470 : string = `
INSERT INTO Fares (FareId,description) VALUES
  ('834efdb6-6044-4b44-8fcb-560710936f37', 'my_description_1'),
  ('e8fa8d54-641a-4d7b-9422-91474d713c62', 'my_description_2'),
  ('dff59ac0-4d80-4b96-85c4-14f3a118e7fe', 'my_description_3'),
  ('511fea83-9f5f-4606-85ec-3d769da4bf63', 'my_description_4');
INSERT INTO Extras (ExtraId,Amount,Name,FareId) VALUES
    ('3bc82ef7-1138-4f97-945a-08626a42a648',75.20, 'Test1', '834efdb6-6044-4b44-8fcb-560710936f37'),
    ('9aec3d5a-a339-4f24-b5a3-8419ac8542f2', 135.00, 'Test2', 'e8fa8d54-641a-4d7b-9422-91474d713c62'),
    ('2a38839e-3b0d-47f0-9e60-d6b19c0978ad', '95.50', 'Test3', 'dff59ac0-4d80-4b96-85c4-14f3a118e7fe'),
    ('74dca5e8-c702-4e70-ad16-0a16a64d55fa', '27.70', 'Test3', '511fea83-9f5f-4606-85ec-3d769da4bf63');
  ;
`;



