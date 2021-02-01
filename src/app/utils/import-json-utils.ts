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
                {column:"last_modified", value:"INTEGER"}
            ],
            indexes: [
                {name: "index_user_on_name",value: "name"},
                {name: "index_user_on_last_modified",value: "last_modified DESC"},
                {name: "index_user_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
            ],
            values: [
                [1,"Whiteley.com","Whiteley",30.5,1582536810],
                [2,"Jones.com","Jones",44.2,1582812800],
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
                [5,"Addington.com","Addington",22.7,1590388335],
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
  
