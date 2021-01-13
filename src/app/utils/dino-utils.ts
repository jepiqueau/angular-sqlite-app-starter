
export const firstImport: any = {
    "database": "logbookdirector",
    "version": 1,
    "encrypted": false,
    "mode": "full",
    "tables": [
      {
        "name": "User_Credential",
        "schema": [
          {
            "column": "Id",
            "value": "INTEGER PRIMARY KEY NOT NULL"
          },
          {
            "column": "MobilePhone",
            "value": "TEXT NOT NULL"
          },
          {
            "column": "last_modified",
            "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
          }
        ],
        "values": []
      },
      {
        "name": "User_Data",
        "schema": [
          {
            "column": "Id",
            "value": "INTEGER PRIMARY KEY NOT NULL"
          },
          {
            "column": "User_Credential_Id",
            "value": "INTEGER NOT NULL"
          },
          {
            "column": "FirstName",
            "value": "TEXT"
          },
          {
            "column": "LastName",
            "value": "TEXT"
          },
          {
            "column": "MobileNoPersonal",
            "value": "TEXT"
          },
          {
            "column": "MobileNoWork",
            "value": "TEXT"
          },
          {
            "column": "EmailPersonal",
            "value": "TEXT"
          },
          {
            "column": "EmailWork",
            "value": "TEXT"
          },
          {
            "column": "MiddleName",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetUnit",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetNumber",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetAddress1",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetAddress2",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetSuburb",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetPostCode",
            "value": "TEXT"
          },
          {
            "column": "User_AddressStreetState",
            "value": "TEXT"
          },
          {
            "column": "last_modified",
            "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
          },
          {
            "foreignkey": "User_Credential_Id",
            "value": "REFERENCES User_Credential(id)"
          }
        ],
        "values": []
      },
      {
        "name": "User_Driver",
        "schema": [
          {
            "column": "Id",
            "value": "INTEGER PRIMARY KEY NOT NULL"
          },
          {
            "column": "User_Credential_Id",
            "value": "INTEGER NOT NULL"
          },
          {
            "column": "LicenseNumber",
            "value": "TEXT"
          },
          {
            "column": "LicenseStateId",
            "value": "INTEGER"
          },
          {
            "column": "LicenseExpiry",
            "value": "TEXT"
          },
          {
            "column": "LicenseClassId",
            "value": "INTEGER"
          },
          {
            "column": "DateOfBirth",
            "value": "TEXT"
          },
          {
            "column": "TimeZoneOfBaseDepot",
            "value": "TEXT"
          },
          {
            "column": "IsSnowAccredited",
            "value": "NUMERIC"
          },
          {
            "column": "IsDGAccredited",
            "value": "NUMERIC"
          },
          {
            "column": "IsAFMAAccredited",
            "value": "NUMERIC"
          },
          {
            "column": "IsDCAccredited",
            "value": "NUMERIC"
          },
          {
            "column": "IsPPlater",
            "value": "NUMERIC"
          },
          {
            "column": "DCExpiryDate",
            "value": "TEXT"
          },
          {
            "column": "SnowExpiryDate",
            "value": "TEXT"
          },
          {
            "column": "PPlatesExpiryDate",
            "value": "TEXT"
          },
          {
            "column": "UDI",
            "value": "TEXT"
          },
          {
            "column": "last_modified",
            "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
          },
          {
            "foreignkey": "User_Credential_Id",
            "value": "REFERENCES User_Credential(id)"
          }
        ],
        "values": []
      },
      {
        "name": "DD_States",
        "schema": [
          {
            "column": "Id",
            "value": "INTEGER PRIMARY KEY NOT NULL"
          },
          {
            "column": "State_Code",
            "value": "TEXT NOT NULL"
          },
          {
            "column": "State_Name",
            "value": "TEXT NOT NULL"
          },
          {
            "column": "last_modified",
            "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
          }
        ],
        "values": [
          [
            1,
            "VIC",
            "Victoria",
            1604396241
          ],
          [
            2,
            "NSW",
            "New South Wales",
            1604396241
          ],
          [
            3,
            "ACT",
            "Australian Capital Territory",
            1604396241
          ],
          [
            4,
            "QLD",
            "Queensland",
            1604396241
          ],
          [
            5,
            "NT",
            "Northern Territory",
            1604396241
          ],
          [
            6,
            "SA",
            "South Australian",
            1604396241
          ],
          [
            7,
            "WA",
            "Western Australian",
            1604396241
          ],
          [
            8,
            "TAS",
            "Tasmania",
            1604396241
          ],
          [
            9,
            "OTH",
            "Other",
            1604396241
          ]
        ]
      }
    ]
}
  
export const secondImport: any = {
    "database": "logbookdirector",
    "version": 1,
    "encrypted": false,
    "mode": "partial",
    "tables": [
        {
            "name": "User_Credential",
            "values": [
                [
                    8,
                    "0424354569",
                    1604396241
                ]
            ]
        }
    ]
}
