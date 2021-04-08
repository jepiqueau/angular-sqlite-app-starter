import { Images } from './base64images';

export const dataToImport: any = {
    database : "db-from-json",
    version : 1,
    encrypted : false,
    mode : "full",
    tables :[
        {
            name: "users",
            schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"email", value:"TEXT UNIQUE NOT NULL"},
                {column:"name", value:"TEXT"},
                {column:"age", value:"INTEGER"},
                {column:"last_modified", value:"INTEGER"}
            ],
            indexes: [
                {name: "index_user_on_name",value: "name"},
                {name: "index_user_on_last_modified",value: "last_modified DESC"},
                {name: "index_user_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
            ],
            values: [
                [1,"Whiteley.com","Whiteley",30,1582536810],
                [2,"Jones.com","Jones",44,1582812800],
                [3,"Simpson@example.com","Simpson",69,1583570630],
                [4,"Brown@example.com","Brown",15,1590383895]
            ]
        },
        {
          name: "messages",
          schema: [
            {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
            {column:"title", value:"TEXT NOT NULL"},
            {column:"body", value:"TEXT NOT NULL"},
            {column:"last_modified", value:"INTEGER"}
          ],
          values: [
              [1,"test post 1","content test post 1",1587310030],
              [2,"test post 2","content test post 2",1590388125]
          ]
        },
        {
          name: "images",
          schema: [
            {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
            {column:"name", value:"TEXT UNIQUE NOT NULL"},
            {column:"type", value:"TEXT NOT NULL"},
            {column:"size", value:"INTEGER"},
            {column:"img", value:"BLOB"},
            {column:"last_modified", value:"INTEGER"}
          ],
          values: [
            [1,"feather","png","NULL",Images[1],1582536810],
            [2,"meowth","png","NULL",Images[0],1590151132]
          ]
        }

    ]
};
export const partialImport1: any = {
    database : "db-from-json",
    version : 1,
    encrypted : false,
    mode : "partial",
    tables :[
        {
            name: "users",
            values: [
                [5,"Addington.com","Addington",22,1590388335],
                [6,"Bannister.com","Bannister",59,1590393015],
                [2,"Jones@example.com","Jones",45,1590393325]

            ]
        },
        {
          name: "messages",
          indexes: [
            {name: "index_messages_on_title",value: "title"},
            {name: "index_messages_on_last_modified",value: "last_modified DESC"}

          ],
          values: [
              [3,"test post 3","content test post 3",1590396146],
              [4,"test post 4","content test post 4",1590396288]
          ]
        }

    ]
};

export const dataToImport59: any = {
  database : "db-from-json59",
  version : 1,
  encrypted : false,
  mode : "full",
  tables :[
      {
          name: "countries",
          schema: [
              {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
              {column:"name", value:"TEXT UNIQUE NOT NULL"},
              {column:"code", value:"TEXT"},
              {column:"language", value:"TEXT"},
              {column:"phone_code", value:"TEXT"},
              {column:"last_modified", value:"INTEGER"}
          ],
          indexes: [
              {name: "index_country_on_name",value: "name", mode: "UNIQUE"},
              {name: "index_country_on_last_modified",value: "last_modified DESC"}
          ],
          values: [
              ["3","Afghanistan","AF","fa","93",1608216034],
              ["6","Albania","AL","sq","355",1608216034],
              ["56","Algeria","DZ","ar","213",1608216034],
          ]
      },
      {
        name: "customers",
        schema: [
          {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
          {column:"first_name", value:"TEXT NOT NULL"},
          {column:"last_name", value:"TEXT NOT NULL"},
          {column:"gender", value:"TEXT NOT NULL"},
          {column:"email", value:"TEXT UNIQUE NOT NULL"},
          {column:"phone", value:"TEXT"},
          {column:"national_id", value:"TEXT NOT NULL"},
          {column:"date_of_birth", value:"TEXT"},
          {column:"created_at", value:"TEXT"},
          {column:"created_by", value:"TEXT"},
          {column:"last_edited", value:"TEXT"},
          {column:"organization", value:"TEXT"},
          {column:"comment_id", value:"TEXT"},
          {column:"country_id", value:"TEXT NOT NULL"},
          {column:"last_modified", value:"INTEGER"},
          {foreignkey: "country_id", value:"REFERENCES countries(id) ON DELETE CASCADE"}
        ],
        indexes: [
          {name: "index_customers_on_email",value: "email", mode: "UNIQUE"},
          {name: "index_customers_on_last_modified",value: "last_modified DESC"}
        ],
        triggers: [
          {
            name: "validate_email_before_insert_customers",
            timeevent: "BEFORE INSERT",
            logic: "BEGIN SELECT CASE WHEN NEW.email NOT LIKE '%_@__%.__%' THEN RAISE (ABORT,'Invalid email address') END; END"
          }
        ],
        values: [
            ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","William","Jones","1","peterjones@mail.com<peterjones@mail.com>","420305202","1234567","1983-01-04","2020-11-1212:39:02","3","2020-11-19 05:10:10","1","NULL","3",1608216040],
            ["bced3262-5d42-470a-9585-d3fd12c45452","Alexander","Brown","1","alexanderbrown@mail.com<alexanderbrown@mail.com>","420305203","1234572","1990-02-07","2020-12-1210:35:15","1","2020-11-19 05:10:10","2","NULL","6",1608216040]
        ]
      }
  ]
};

export const dataToImport2: any = {
  database : "db-from-json",
  version : 1,
  encrypted : false,
  mode : "full",
  tables :[
      {
        name: "images",
        schema: [
          {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
          {column:"name", value:"TEXT UNIQUE NOT NULL"},
          {column:"type", value:"TEXT NOT NULL"},
          {column:"size", value:"INTEGER"},
          {column:"img", value:"BLOB"},
          {column:"last_modified", value:"INTEGER"}
        ],
        values: [
          [1,"feather","png","NULL",Images[1],1582536810],
          [2,"meowth","png","NULL",Images[0],1590151132]
        ]
      }

  ]
};
export const dataToImport71: any = {
  database : "db-from-json71",
  version : 1,
  encrypted : false,
  mode : "full",
  tables :[
      {
          name: "company",
          schema: [
              {column:"id", value: "INTEGER NOT NULL"},
              {column:"name", value:"TEXT NOT NULL"},
              {column:"age", value:"INTEGER NOT NULL"},
              {column:"country", value:"TEXT"},
              {column:"salary", value:"REAL"},
              {column:"last_modified", value:"INTEGER"},
              {constraint:"PK_id_name", value:"PRIMARY KEY (id,name,age)"}
          ],
          values: [
              [1,"Jones",55,"Australia",1250.98,1608216034],
              [2,"Lawson",32,"Ireland",2345.60,1608216034],
              [3,"Bush",44,"USA",1850.10,1608216034],
          ]
      },
    ]
  };
  export const dataToImport94: any = {
    database : "db-from-json94",
    version : 1,
    encrypted : false,
    mode : "full",
    tables :[
        {
            name: "reps",
            schema: [
                {column:"id", value: "INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE"},
                {column:"fk_workoutexercices", value:"INTEGER NOT NULL"},
                {column:"weight", value:"REAL NOT NULL"},
                {column:"reps", value:"INTEGER NOT NULL"},
                {column:"rest", value:"INTEGER NOT NULL"},
                {column:"note", value:"TEXT"},
            ],
            values: [
                [1,1,11,21,31,"NULL"],
                [2,1,12,22,32,"NULL"],
                [3,1,13,23,33,"NULL"],
            ]
        },
    ]
  };
    
export const dataToImport101: any = { 
  database: "testdb",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    { 
      name: "access",
      schema: [ 
        { column: "AccessID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "Access", value: "TEXT NOT NULL" }
      ],
      values: [
        [ "A101", "Update, delete" ],
        [ "A102", "View" ]
      ]
    },
    { 
      name: "asset",
      schema: [
        { column: "AssetID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "AssetType", value: "TEXT DEFAULT NULL" },
        { column: "Status", value: "TEXT DEFAULT NULL" },
        { column: "GPSLatitude", value: "TEXT DEFAULT NULL" },
        { column: "GPSLongitude", value: "TEXT DEFAULT NULL" },
        { column: "Region", value: "TEXT DEFAULT NULL" },
        { column: "Division", value: "TEXT DEFAULT NULL" },
        { column: "SubDivision", value: "TEXT DEFAULT NULL" },
        { column: "NearestMilePost", value: "TEXT DEFAULT NULL" },
        { column: "LastTestedDate", value: "TEXT DEFAULT NULL" }
      ],
      values: [
        [ "A101", "NULL", "Functions", "40.741895", "-73.989308", "NY", "Manhatten", "Bronx", "MP251", "2019-08-14T00:00:00.000Z" ],
        [ "A102", "NULL", "Functions", "40.96418572610003", "-76.5923811201172", "PA", "Mechanicsville", "Brook Avenue", "MP211", "2018-09-12T03:16:39.000Z" ],
        [ "A103", "NULL", "Not fucntioning", "39.283157046013734", "-80.50712966683095", "WV", "Lake Floyd", "Country route", "MP511", "2018-01-24T07:36:06.000Z" ],
        [ "A104", "NULL", "Functions", "50.651895", "-29.889308", "NC", "Carolina", "Suburbs", "MP564", "2018-01-24T07:36:06.000Z" ],
        [ "A105", "NULL", "Working", "40.742066", "-73.989204", "a", "c", "v", "b", "2020-11-26T00:00:00.000Z" ],
        [ "A106", "NULL", "as", "40.742023", "-73.989252", "d", "d", "a", "s", "2020-11-25T00:00:00.000Z" ]
      ]
    },
    {
      name: "role",
      schema: [
        { column: "RoleID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "Title", value: "TEXT NOT NULL" },
        { column: "CreatedDate", value: "TEXT NOT NULL" },
        { column: "UpdatedDate", value: "TEXT DEFAULT NULL" },
        { column: "DeletedDate", value: "TEXT DEFAULT NULL" }
      ],
      values: [
        [ "R101", "Supervisor", "2018-09-12T06:24:04.000Z", "NULL", "NULL" ],
        [ "R102", "Inspector", "2019-05-16T16:16:23.000Z", "2019-10-25T03:52:31.000Z", "NULL" ],
        [ "R103", "Engineer", "2018-08-15T07:29:21.000Z", "NULL", "NULL" ]
      ]
    },
    {
      name: "user",
      schema: [
        { column: "UserID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "Email", value: "TEXT NOT NULL" },
        { column: "Password", value: "TEXT NOT NULL" },
        { column: "Region", value: "TEXT NOT NULL" },
        { column: "RoleID", value: "TEXT NOT NULL" },
        { constraint: "user_ibfk_1", value: "FOREIGN KEY (RoleID) REFERENCES role (RoleID) ON DELETE CASCADE" }
      ],
      values: [
        [ "EMP101", "Edith Franco", "Edith.F@gmail.com", "$2b$10$XiczolHXWQIYIvfHR4XCk.WRMMNkBKejohH3NwWeGdheQToZrJ3KC", "CAL", "R102" ],
        [ "EMP102", "Sofie Andrew", "Sofie.A@gmail.com", "$2b$10$skJne7h0YrStWOGPHutEhuCrQQbFWmuh.55GYSYWsjYK2XfWuajJG", "CAL", "R101" ],
        [ "EMP103", "Eren Johns", "Eren.J@gmail.com", "$2b$10$XGAJtiLV5/TrVEYBNC6axO2vYsjbiYXAsoAShOP3UvH7YCQYO69C2", "NY", "R101" ],
        [ "EMP104", "Nyle Franklin", "Nyle.F@gmail.com", "$2b$10$hG9goEpz.q4bwICgMn0JH.XeWiUNN4059SqOwXEiFsbjqyz4z1JYy", "TX", "R103" ],
        [ "EMP105", "Robson Eaton", "Robson.E@gmail.com", "$2b$10$YCQ92k1H6FfgJZMuJou2Quo1e5kcafyX0taibfxqztk.Scxfo4AKW", "NC", "R103" ]
      ]
    },
    {
      name: "device",
      schema: [
        { column: "DeviceID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "UserID", value: "TEXT NOT NULL" },
        { column: "PIN", value: "TEXT NOT NULL" },
        { constraint: "device_ibfk_1", value: "FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE" }
      ],
      values: [
        [ "D101", "EMP101", "8426" ],
        [ "D102", "EMP102", "6248" ],
        [ "D103", "EMP103", "7946" ],
        [ "D104", "EMP104", "4613" ],
        [ "D105", "EMP105", "1234" ]
      ]
    },
    {
      name: "repair",
      schema: [
        { column: "AssetID", value: "TEXT NOT NULL" },
        { column: "CreatedDate", value: "TEXT NOT NULL" },
        { column: "EngineerID", value: "TEXT DEFAULT NULL" },
        { column: "CompletedDate", value: "TEXT DEFAULT NULL" },
        { column: "comments", value: "TEXT DEFAULT NULL" },
        { constraint: "PK_repair", value: "PRIMARY KEY (AssetID, CreatedDate)" },
        { constraint: "repair_ibfk_2", value: "FOREIGN KEY (EngineerID) REFERENCES user(UserID) ON DELETE CASCADE" },
        { constraint: "repair_ibfk_1", value: "FOREIGN KEY (AssetID) REFERENCES asset(AssetID) ON DELETE CASCADE" }
      ],
      values: [
        [ "A101", "2020-04-17T00:00:00.000Z", "EMP105", "2021-03-19T00:00:00.000Z", "Complete" ],
        [ "A101", "2020-04-17T23:16:38.000Z", "EMP105", "2020-11-18T00:48:00.000Z", "Complete" ],
        [ "A101", "2020-11-11T00:00:00.000Z", "EMP103", "2020-12-10T00:00:00.000Z", "THis is a comment" ],
        [ "A101", "2020-11-15T16:38:55.000Z", "NULL", "NULL", "COmment" ],
        [ "A102", "2020-05-16T09:45:09.000Z", "NULL", "NULL", "NULL" ],
        [ "A102", "2020-05-26T09:45:09.000Z", "NULL", "NULL", "NULL" ],
        [ "A104", "2021-03-16T00:00:00.000Z", "EMP102", "2021-03-19T00:00:00.000Z", "Fixed" ],
        [ "A104", "2021-03-17T00:00:00.000Z", "EMP102", "NULL", "Fixed" ],
        [ "A106", "2020-11-13T19:26:00.000Z", "NULL", "2021-03-27T00:00:00.000Z", "NULL" ]
      ]
    },
    {
      name: "roleaccess",
      schema: [
        { column: "RoleID", value: "TEXT NOT NULL" },
        { column: "AccessID", value: "TEXT NOT NULL" },
        { column: "CreatedDate", value: "TEXT NOT NULL" },
        { column: "UpdatedDate", value: "TEXT DEFAULT NULL" },
        { column: "DeletedDate", value: "TEXT DEFAULT NULL" },
        { constraint: "PK_roleaccesss", value: "PRIMARY KEY (RoleID, AccessID)" },
        { constraint: "roleaccess_ibfk_1", value: "FOREIGN KEY (RoleID) REFERENCES role(RoleID) ON DELETE CASCADE" },
        { constraint: "roleaccess_ibfk_2", value: "FOREIGN KEY (AccessID) REFERENCES access(AccessID) ON DELETE CASCADE" }
      ],
      values: [
        [ "R101", "A101", "2019-11-22T07:20:15.000Z", "NULL", "NULL" ],
        [ "R102", "A101", "2019-12-27T12:13:30.000Z", "NULL", "NULL" ],
        [ "R103", "A101", "2019-09-13T00:00:00.000Z", "NULL", "2020-06-24T06:24:33.000Z" ],
        [ "R103", "A102", "2020-01-24T05:19:29.000Z", "2020-04-17T07:22:09.000Z", "NULL" ]
      ]
    },
    {
      name: "testmodule",
      schema: [
        { column: "TestModID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "SupervisorID", value: "TEXT NOT NULL" },
        { column: "Description", value: "TEXT NOT NULL" },
        { constraint: "testmodule_ibfk_1", value: "FOREIGN KEY (SupervisorID) REFERENCES user (UserID) ON DELETE CASCADE" }
      ],
      values: [
        [ "TM101", "EMP102", "Check Lights" ],
        [ "TM102", "EMP105", "Check Energy source" ]
      ]
    },
    {
      name: "test",
      schema: [
        { column: "TestID", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "DateIssued", value: "TEXT NOT NULL" },
        { column: "AssetID", value: "TEXT NOT NULL" },
        { column: "InspectorID", value: "TEXT NOT NULL" },
        { column: "Result", value: "TEXT DEFAULT NULL" },
        { column: "SupervisorID", value: "TEXT NOT NULL" },
        { column: "DateCompleted", value: "TEXT DEFAULT NULL" },
        { column: "Frequency", value: "INTEGER NOT NULL" },
        { column: "Priority", value: "INTEGER DEFAULT NULL" },
        { column: "TestModID", value: "TEXT NOT NULL" },
        { column: "comments", value: "TEXT DEFAULT NULL" },
        { constraint: "test_ibfk_1", value: "FOREIGN KEY (AssetID) REFERENCES asset(AssetID) ON DELETE CASCADE" },
        { constraint: "test_ibfk_2", value: "FOREIGN KEY (InspectorID) REFERENCES user(UserID) ON DELETE CASCADE" },
        { constraint: "test_ibfk_3", value: "FOREIGN KEY (SupervisorID) REFERENCES user (UserID) ON DELETE CASCADE" },
        { constraint: "test_ibfk_4", value: "FOREIGN KEY (TestModID) REFERENCES testmodule (TestModID) ON DELETE CASCADE" }
      ],
      values: [
        [ "T101", "2019-09-20T08:25:04.000Z", "A102", "EMP104", "Completed", "EMP105", "2020-07-16T19:13:09.000Z", 2, 0, "TM102", "This is a comment" ],
        [ "T102", "2020-04-23T01:17:28.000Z", "A101", "EMP101", "Pending", "EMP103", "NULL", 1, 1, "TM101", "" ],
        [ "T103", "2020-03-19T00:00:00.000Z", "A102", "EMP104", "Pending", "EMP102", "NULL", 3, 0, "TM102", "" ],
        [ "T104", "2020-07-16T19:13:09.000Z", "A102", "EMP101", "Fail", "EMP102", "2020-05-16T09:45:09.000Z", 1, 1, "TM102", "Just to check if a change happened again" ],
        [ "T105", "2020-11-20T08:40:18.000Z", "A106", "EMP104", "Fail", "EMP103", "2020-11-27T00:21:00.000Z", 1, 1, "TM102", "Checked" ],
        [ "T106", "2020-07-16T19:13:09.000Z", "A102", "EMP101", "NULL", "EMP102", "NULL", 1, 1, "TM102", "NULL" ],
        [ "T110", "2021-03-27T10:23:15.000Z", "A102", "EMP101", "NULL", "EMP102", "NULL", 1, 3, "TM101", "NULL" ]
      ]
    }
  ]
}
export const dataToImport102: any = { 
  "database": "doublenote-db",
  "version": 1,
  "encrypted": false,
  "mode": "full",
  "tables": [ 
    { 
      "name": "notes",
      "schema": [
        { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
        { "column": "title", "value": "TEXT NOT NULL" },
        { "column": "note", "value": "TEXT NOT NULL" },
        { "column": "color", "value": "TEXT NOT NULL" },
        { "column": "created", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" },
        { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" }
      ],
      "values": [ 
        
      ]
    },
    { 
      "name": "trash",
      "schema": [
        { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
        { "column": "title", "value": "TEXT NOT NULL" },
        { "column": "note", "value": "TEXT NOT NULL" },
        { "column": "color", "value": "TEXT NOT NULL" },
        { "column": "created", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" },
        { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" }
      ],
      "values": [

      ]
    },
    { 
      "name": "archive",
      "schema": [
        { "column": "id", "value": "INTEGER PRIMARY KEY NOT NULL" },
        { "column": "title", "value": "TEXT NOT NULL" },
        { "column": "note", "value": "TEXT NOT NULL" },
        { "column": "color", "value": "TEXT NOT NULL" },
        { "column": "created", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" },
        { "column": "last_modified", "value": "INTEGER DEFAULT (strftime('%s', 'now'))" }
      ],
      "values": [

      ]
    }
  ]  
}

export const dataToImport104: any = {
  "database": "products104-db",
  "version": 1,
  "encrypted": false,
  "mode": "full",
  "tables": [
    {
      "name": "categories",
      "schema": [
        {
          "column": "id",
          "value": "TEXT PRIMARY KEY NOT NULL"
        },
        {
          "column": "name",
          "value": "TEXT NOT NULL"
        },
        {
          "column": "description",
          "value": "TEXT NOT NULL"
        },
        { 
          "column": "last_modified",
          "value": "INTEGER DEFAULT (strftime('%s', 'now'))" 
        }

      ]
    },
    {
      "name": "products",
      "schema": [
        {
          "column": "id",
          "value": "TEXT PRIMARY KEY NOT NULL"
        },
        {
          "column": "categoryId",
          "value": "TEXT NOT NULL"
        },
        {
          "column": "expiredAt",
          "value": "TEXT"
        },
        { 
          "column": "last_modified",
          "value": "INTEGER DEFAULT (strftime('%s', 'now'))" 
        },
        {
          "foreignkey": "categoryId",
          "value": "REFERENCES categories(id)"
        }
      ]
    },
  ]
}
