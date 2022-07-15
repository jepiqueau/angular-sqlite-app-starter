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
                {column:"age", value:"REAL"},
                {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
                {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
            ],
            indexes: [
                {name: "index_user_on_name",value: "name"},
                {name: "index_user_on_last_modified",value: "last_modified DESC"},
                {name: "index_user_on_email_name", value: "email ASC, name", mode: "unique"}
            ],
            values: [
                [1,"Whiteley.com","Whiteley",30.5,0,1582536810],
                [2,"Jones.com","Jones",44.2,0,1582812800],
                [3,"Simpson@example.com","Simpson",69.0,0,1583570630],
                [4,"Brown@example.com","Brown",15.0,0,1590383895]
            ]
        },
        {
          name: "messages",
          schema: [
            {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
            {column:"userid", value: "INTEGER"},
            {column:"title", value:"TEXT NOT NULL"},
            {column:"body", value:"TEXT NOT NULL"},
            {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
            {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
            {foreignkey: "userid", value:"REFERENCES users(id) ON DELETE CASCADE"}
          ],
          values: [
              [1,3,"test post 1","content test post 1",0,1587310030],
              [2,1,"test post 2","content test post 2",0,1590388125]
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
            {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
            {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
      ],
          values: [
            [1,"feather","png",null,Images[1],0,1582536810],
            [2,"meowth","png",null,Images[0],0,1590151132]
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
                [5,"Addington.com","Addington",22.7,0,1590388335],
                [6,"Bannister.com","Bannister",59.3,0,1590393015],
                [2,"Jones@example.com","Jones",45.2,0,1590393325],
                [1,"Whiteley.com","Whiteley",30.5,0,1582536810]
            ]
        },
    ]
};
export const partialImport2: any = {
  database : "db-from-json",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
      {
        name: "messages",

        indexes: [
          {name: "index_messages_on_title",value: "title"},
          {name: "index_messages_on_last_modified",value: "last_modified DESC"}

        ],
        values: [
            [3,2,"test post 3","content test post 3",0,1590396146],
            [4,1,"test post 4","content test post 4",0,1590396288]
        ]
      }

  ]
};
export const partialImport3: any = {
  database : "db-from-json",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
      {
        name: "test113",
        schema: [
          {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
          {column:"name", value:"TEXT UNIQUE NOT NULL"},
          {column:"code", value:"TEXT"},
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
  ],
        indexes: [
          {name: "index_test113_on_title",value: "name"},
          {name: "index_test113_on_last_modified",value: "last_modified DESC"}

        ],
        values: [
            ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","valve","BV50",0,1590396146],
            ["bced3262-5d42-470a-9585-d3fd12c45452","pipe","PIPE100",0,1590396288],
            ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","valve","BV100",0,1590396300],
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
              {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
              {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
        ],
          indexes: [
              {name: "index_country_on_name",value: "name", mode: "UNIQUE"},
              {name: "index_country_on_last_modified",value: "last_modified DESC"}
          ],
          values: [
              ["3","Afghanistan","AF","fa","93",0,1608216034],
              ["6","Albania","AL","sq","355",0,1608216034],
              ["56","Algeria","DZ","ar","213",0,1608216034],
          ]
      },
      {
        name: "customers",
        schema: [
          {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
          {column:"first_name", value:"TEXT NOT NULL"},
          {column:"last_name", value:"TEXT NOT NULL"},
          {column:"gender", value:"TEXT NOT NULL"},
          {column:"email", value:"TEXT NOT NULL"},
          {column:"phone", value:"TEXT"},
          {column:"national_id", value:"TEXT NOT NULL"},
          {column:"date_of_birth", value:"TEXT"},
          {column:"created_at", value:"TEXT"},
          {column:"created_by", value:"TEXT"},
          {column:"last_edited", value:"TEXT"},
          {column:"organization", value:"TEXT"},
          {column:"comment_id", value:"TEXT"},
          {column:"country_id", value:"TEXT NOT NULL"},
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
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
            ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","William","Jones","1","peterjones@mail.com<peterjones@mail.com>","420305202","1234567","1983-01-04","2020-11-1212:39:02","3","2020-11-19 05:10:10","1",null,"3",0,1608216040],
            ["bced3262-5d42-470a-9585-d3fd12c45452","Alexander","Brown","1","alexanderbrown@mail.com<alexanderbrown@mail.com>","420305203","1234572","1990-02-07","2020-12-1210:35:15","1","2020-11-19 05:10:10","2",null,"6",0,1608216040]
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
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
  ],
        values: [
          [1,"feather","png",null,Images[1],0,1582536810],
          [2,"meowth","png",null,Images[0],0,1590151132]
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
              {column:"name", value:"VARCHAR(25) NOT NULL"},
              {column:"age", value:"INT NOT NULL"},
              {column:"country", value:"CHARACTER(20)"},
              {column:"salary", value:"DECIMAL(10,2)"},
              {column:'manager', value:'BOOLEAN DEFAULT 0 CHECK (manager IN (0, 1))'},
              {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
              {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
              {constraint:"PK_id_name", value:"PRIMARY KEY (id,name,age)"}
          ],
          values: [
              [1,'Jones',55,'Australia',1250,1,0,1608216034],
              [2,'Lawson',32,'Ireland',2345.60,0,0,1608216034],
              [3,'Bush',44,'USA',1850.10,0,0,1608216034],
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
                [1,1,11,21,31,null],
                [2,1,12,22,32,null],
                [3,1,13,23,33,null],
            ]
        },
    ]
};
export const schemaToImport237: any = {
  database: "test_issue237",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
      {
          name: "contacts",
          schema: [
            {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
            {column:"email", value:"TEXT UNIQUE NOT NULL"},
            {column:"name", value:"TEXT"},
            {column:"age", value:"REAL"},
            {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
            {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
          ],
          indexes: [
            {name: "index_contact_on_last_modified",value: "last_modified DESC"},
            {name: "index_contact_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
        ],
    },
      {
          name: "messages",
          schema: [
            {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
            {column:"contactid", value: "TEXT"},
            {column:"title", value:"TEXT NOT NULL"},
            {column:"body", value:"TEXT NOT NULL"},
            {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
            {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
            {foreignkey: "contactid", value: "REFERENCES contacts(id) ON DELETE SET DEFAULT"}
          ],
      }
  ]
}
export const contactsToImportPartial237: any = {
  database : "test_issue237",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
      {
          name: "contacts",
          values: [
              ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","Whiteley.com","Whiteley",0.5,0,1608216034],
              ["bced3262-5d42-470a-9585-d3fd12c45452","Jones.com","Jones",44.2,0,1608216034],
              ["a401c18d-053b-46e8-84ee-83da561c88c9","Simpson@example.com","Simpson",69,0,1608216034],
              ["deaafccf-5b66-433d-a93f-495b0e141e74","Brown@example.com","Brown",15,0,1608216034]
          ]
      },
    ]
}
export const messagesToImportPartial237: any = {
  database : "test_issue237",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
    {
      name: "messages",
      values: [
          ["07aec950-68ee-4c2b-a092-44abdfffbb6b","ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","test post 1","content test post 1",0,1608217042],
          ["b08e941e-3ead-4ce0-8833-2e14400d1b39","bced3262-5d42-470a-9585-d3fd12c45452","test post 2","content test post 2",0,1608217042]
      ]
    },
  ]
}
export const schemaVersion1: any = {
  database : "db-issue164",
  version : 1,
  overwrite: true,
  encrypted : false,
  mode : "full",
  tables :[
      {
          name: "users",
          schema: [
              {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
              {column:"email", value:"TEXT UNIQUE NOT NULL"},
              {column:"name", value:"TEXT"},
              {column:"age", value:"REAL"},
              {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
              {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
        ],
          indexes: [
              {name: "index_user_on_name",value: "name"},
              {name: "index_user_on_last_modified",value: "last_modified DESC"},
              {name: "index_user_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
          ],
      },
      {
        name: "messages",
        schema: [
          {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
          {column:"title", value:"TEXT NOT NULL"},
          {column:"body", value:"TEXT NOT NULL"},
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
  ],
      },
      {
        name: "images",
        schema: [
          {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
          {column:"name", value:"TEXT UNIQUE NOT NULL"},
          {column:"type", value:"TEXT NOT NULL"},
          {column:"size", value:"INTEGER"},
          {column:"img", value:"BLOB"},
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
  ],
      }

  ]

}

export const dataVersion1: any = {
  database : "db-issue164",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
      {
          name: "users",
          values: [
              [1,"Whiteley.com","Whiteley",30.5,0,1582536810],
              [2,"Jones.com","Jones",44.2,0,1582812800],
              [3,"Simpson@example.com","Simpson",69,0,1583570630],
              [4,"Brown@example.com","Brown",15,0,1590383895]
          ]
      },
      {
        name: "messages",
        values: [
            [1,"test post 1","content test post 1",0,1587310030],
            [2,"test post 2","content test post 2",0,1590388125]
        ]
      },
      {
        name: "images",
        values: [
          [1,"feather","png",null,Images[1],0,1582536810],
          [2,"meowth","png",null,Images[0],0,1590151132]
        ]
      }

  ]

}
export const schemaVersion2: any = {
  database : "db-issue164",
  version : 2,
  encrypted : false,
  mode : "full",
  tables :[
      {
          name: "users",
          schema: [
              {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
              {column:"email", value:"TEXT UNIQUE NOT NULL"},
              {column:"name", value:"TEXT"},
              {column:"age", value:"REAL"},
              {column:"country", value:"TEXT"},
              {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
              {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
        ],
          indexes: [
              {name: "index_user_on_name",value: "name"},
              {name: "index_user_on_last_modified",value: "last_modified DESC"},
              {name: "index_user_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
          ],
      },
      {
        name: "messages",
        schema: [
          {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
          {column:"title", value:"TEXT NOT NULL"},
          {column:"body", value:"TEXT NOT NULL"},
          {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
          {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
        ],
      },
  ]

}
export const dataVersion2: any = {
  database : "db-issue164",
  version : 2,
  encrypted : false,
  mode : "partial",
  tables :[
      {
          name: "users",
          values: [
              [1,"Whiteley.com","Whiteley",30.5,"United of Kingdom",0,1582536810],
              [2,"Jones.com","Jones",44.2,"Australia",0,1582812800],
              [3,"Simpson@example.com","Simpson",69,"South Africa",0,1583570630],
              [4,"Brown@example.com","Brown",15,"United States",0,1590383895],
              [5,"Jeep@example.com","Jeep",70,"France",0,1590383980]
          ]
      },
      {
        name: "messages",
        values: [
            [1,"test post 1","content test post 1",0,1587310030],
            [2,"test post 2","content test post 2",0,1590388125],
            [3,"test post 3","content test post 3",0,1590389355],
        ]
      },
  ]

}
export const dataToImport167: any = {
  database: "db-issue167",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "departments",
      schema: [
        {column: "id", value: "INTEGER PRIMARY KEY AUTOINCREMENT" },
        {column: "name", value: "TEXT NOT NULL" },
        {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
],
      indexes: [
        {name: "index_departments_on_last_modified",value: "last_modified DESC"}
      ],
      values: [
        [1,"Admin",0,1608216034],
        [2,"Sales",0,1608216034],
        [3,"Quality Control",0,1608216034],
        [4,"Marketing",0,1608216034],
      ]
    },
    {
      name: "employees",
      schema: [
        {column: "id", value: "INTEGER PRIMARY KEY AUTOINCREMENT" },
        {column: "first_name", value: "TEXT" },
        {column: "last_name", value: "TEXT" },
        {column: "salary", value: "NUMERIC" },
        {column: "dept_id", value: "INTEGER" },
        {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
],
      indexes: [
        {name: "index_departments_on_last_modified",value: "last_modified DESC"}
      ],
      values: [
        [1,"John","Brown",27500,1,0,1608216034],
        [2,"Sally","Brown",37500,2,0,1608216034],
        [3,'Vinay','Jariwala', 35100,3,0,1608216034],
        [4,'Jagruti','Viras', 9500,2,0,1608216034],
        [5,'Shweta','Rana',12000,3,0,1608216034],
        [6,'sonal','Menpara', 13000,1,0,1608216034],
        [7,'Yamini','Patel', 10000,2,0,1608216034],
        [8,'Khyati','Shah', 50000,3,0,1608216034],
        [9,'Shwets','Jariwala',19400,2,0,1608216034],
        [10,'Kirk','Douglas',36400,4,0,1608216034],
        [11,'Leo','White',45000,4,0,1608216034],
      ],
    }
  ],
  views: [
    {name: "SalesTeam", value: "SELECT id,first_name,last_name from employees WHERE dept_id IN (SELECT id FROM departments where name='Sales')"},
    {name: "AdminTeam", value: "SELECT id,first_name,last_name from employees WHERE dept_id IN (SELECT id FROM departments where name='Admin')"},
  ]
}
export const viewsToImport167: any = {
  database: "db-issue167",
  version: 1,
  encrypted: false,
  mode: "partial",
  tables: [],
  views: [
    {name: "QualityControlTeam", value: "SELECT id,first_name,last_name from employees WHERE dept_id IN (SELECT id FROM departments where name='Quality Control')"},
    {name: "MarketingTeam", value: "SELECT id,first_name,last_name from employees WHERE dept_id IN (SELECT id FROM departments where name='Marketing')"},
  ]
}
export const dataToImport231: any = {
 database : "db-from-json231",
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
          ],
          indexes: [
              {name: "index_country_on_name",value: "name", mode: "UNIQUE"},
          ],
      },
      {
        name: "customers",
        schema: [
          {column:"id", value: "TEXT PRIMARY KEY NOT NULL"},
          {column:"first_name", value:"TEXT NOT NULL"},
          {column:"last_name", value:"TEXT NOT NULL"},
          {column:"gender", value:"TEXT NOT NULL"},
          {column:"email", value:"TEXT NOT NULL"},
          {column:"phone", value:"TEXT"},
          {column:"national_id", value:"TEXT NOT NULL"},
          {column:"date_of_birth", value:"TEXT"},
          {column:"created_at", value:"TEXT"},
          {column:"created_by", value:"TEXT"},
          {column:"last_edited", value:"TEXT"},
          {column:"organization", value:"TEXT"},
          {column:"comment_id", value:"TEXT"},
          {column:"country_id", value:"TEXT NOT NULL"},
          {foreignkey: "country_id", value:"REFERENCES countries(id) ON DELETE CASCADE"}
        ],
        indexes: [
          {name: "index_customers_on_email",value: "email", mode: "UNIQUE"},
        ],
        triggers: [
          {
            name: "validate_email_before_insert_customers",
            timeevent: "BEFORE INSERT",
            logic: "BEGIN SELECT CASE WHEN NEW.email NOT LIKE '%_@__%.__%' THEN RAISE (ABORT,'Invalid email address') END; END"
          }
        ],
      }
  ]
 
};
export const dataToImportPartial231: any = {
  database : "db-from-json231",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
    {
      name: "countries",
      values: [
        ["3","Afghanistan","AF","fa","93"],
        ["6","Albania","AL","sq","355"],
        ["56","Algeria","DZ","ar","213"],
      ]
    },
    {
      name: "customers",
      values: [
        ["ef5c57d5-b885-49a9-9c4d-8b340e4abdbc","William","Jones","1","peterjones@mail.com<peterjones@mail.com>","420305202","1234567","1983-01-04","2020-11-1212:39:02","3","2020-11-19 05:10:10","1",null,"3"],
        ["bced3262-5d42-470a-9585-d3fd12c45452","Alexander","Brown","1","alexanderbrown@mail.com<alexanderbrown@mail.com>","420305203","1234572","1990-02-07","2020-12-1210:35:15","1","2020-11-19 05:10:10","2",null,"6"]
      ]
    },
  ]
};
export const schemaToImport240: any = {
  database: "test_issue240",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "task_list",
      schema: [
        { column: "id", value: "INTEGER PRIMARY KEY AUTOINCREMENT" },
        { column: "_id", value: "TEXT UNIQUE NOT NULL" },
        { column: "assignee", value: "INTEGER" },
        { column: "approved", value: "INTEGER" },
        { column: "cid", value: "TEXT" },
        { column: "createAt", value: "TEXT" },
        { column: "updateAt", value: "TEXT" },
        { column: "desc", value: "TEXT" },
        { column: "oid", value: "INTEGER" },
        { column: "files", value: "TEXT" },
        { column: "status", value: "TEXT NOT NULL" },
        { column: "title", value: "TEXT" },
        { column: "type", value: "TEXT" },
        { column: "isBusiness", value: "INTEGER" },
        { column: "unreadCount", value: "INTEGER" },
        { column: "category", value: "TEXT" },
        { column: "aCustomer", value: "TEXT" },
        { column: "fCustomer", value: "TEXT" },
        { column: "du", value: "TEXT" },
        { column: "aWorkType", value: "TEXT" },
        { column: "fWorkType", value: "TEXT" },
        { column: "last", value: "TEXT" },
        { column: "delivers", value: "TEXT" },
        { column: "reads", value: "TEXT" },
        { column: "cInfo", value: "TEXT" },
        {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
],
      indexes: [
        { name: "index_id", value: "cid,oid" },
        { name: "index_last_modified", value: "updateAt DESC" },
        { name: "index_cust", value: "aCustomer,fCustomer" }
      ],
    },    
  ]
}
export const schemaToImport245V1: any = {
  database: 'product-db',
  version: 1,
  overwrite: true,
  encrypted: false,
  mode: 'full',
  tables: [
    {
      name: 'vendors',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'company_name', value: 'TEXT NOT NULL' },
        { column: 'company_info', value: 'TEXT NOT NULL' },
        {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
],
      values: [
        [1, 'Devdactic', 'The main blog of Simon Grimm',0,1587310030],
        [2, 'Ionic Academy', 'The online school to learn Ionic',0,1590388125],
        [3, 'Ionic Company', 'Your favourite cross platform framework',0,1590383895]
      ]
    },

    {
      name: 'products',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'name', value: 'TEXT NOT NULL' },
        { column: 'currency', value: 'TEXT' },
        { column: 'value', value: 'INTEGER' },
        { column: 'vendorid', value: 'INTEGER' },
        { column: 'status', value: 'TEXT NOT NULL DEFAULT \'available\'' },
        { column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        { column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
        { foreignkey: 'vendorid', value: 'REFERENCES vendors(id)'},
      ],
      values: [
        [1, 'Devdactic Fan Hat', 'EUR', 9, 1, 'available', 0, 1604396241],
        [2, 'Ionic Academy Membership', 'USD', 25, 2, 'available', 0, 1604296241],
        [3, 'Ionic Sticker Swag', 'USD', 4, 3, 'available', 0, 1594196241],
        [4, 'Practical Ionic Book', 'USD', 79, 1, 'available', 0, 1603396241]
      ]
    }
  ]

}

export const schemaToImport245V2: any = {
  database: 'product-db',
  version: 2,
  encrypted: false,
  mode: 'full',
  tables: [
    {
      name: 'vendors',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'company_name', value: 'TEXT NOT NULL' },
        { column: 'company_info', value: 'TEXT NOT NULL' },
        { column: 'company_email', value: 'TEXT NOT NULL'},
        { column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        { column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
      ],
      values: [
        [1, 'Devdactic', 'The main blog of Simon Grimm','devdactic@example.com' , 0, 1624396241],
        [2, 'Ionic Academy', 'The online school to learn Ionic','ionic.academy@example.com', 0, 1624396241],
        [3, 'Ionic Company', 'Your favourite cross platform framework','ionic@example.com', 0, 1624396241]
      ],
      triggers: [
        {
          name: "validate_email_before_insert_vendors",
          timeevent: "BEFORE INSERT",
          logic: "BEGIN SELECT CASE WHEN NEW.company_email NOT LIKE '%_@__%.__%' THEN RAISE (ABORT,'Invalid company_email address') END; END"
        }
      ],

    },

    {
      name: 'products',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'name', value: 'TEXT NOT NULL' },
        { column: 'currency', value: 'TEXT' },
        { column: 'value', value: 'INTEGER' },
        { column: 'vendorid', value: 'INTEGER' },
        { column: 'status', value: 'TEXT NOT NULL DEFAULT \'available\'' },
        { column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        { column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
        { foreignkey: 'vendorid', value: 'REFERENCES vendors(id)'},
      ],
      values: [
        [1, 'Devdactic Fan Hat', 'EUR', 9, 1, 'available', 0, 1624396241],
        [2, 'Ionic Academy Membership', 'USD', 25, 2, 'available', 0, 1624396241],
        [3, 'Ionic Sticker Swag', 'USD', 4, 3, 'available', 0, 1624396241],
        [4, 'Practical Ionic Book', 'USD', 79, 1, 'available', 0, 1624396241]
      ]
    }
  ]

}
export const testIssue292: any = {
  database : "db-issue292",
  version : 1,
  overwrite: true,
  encrypted : false,
  mode : "full",
  tables :[
      {
          name: "inbox",
          schema: [
              {column:'id', value: 'INTEGER PRIMARY KEY NOT NULL'},
              {column:'content', value:'TEXT NOT NULL'},
              {column:'created', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
              {column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
              {column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'}
          ],
          indexes: [
              {name: "index_inbox_on_last_modified",value: "last_modified DESC"}
          ],
          values: [
            [1, 'tests', 1656152832, 0, 1656152832],
            [2, 'sdfsdfds', 1656152834, 0, 1656152834],
            [3, 'sadasd', 1656152899, 0, 1656152899],
            [4, 'asdasdasdas', 1656153182, 0, 1656153182]
          ]
      },
    

  ]

}
