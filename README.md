The server app is created using typescript, JWT are used for authentification, postgreSQL - to store information about users. 

Information about users is stored in two tables:

Table 1
- uuid
- name
- login
- password
- status
- bossuuid

Table 2
- uuid - uuid of Boss or Admin
- [uuid,...] - uuid of subordinats

When server starts, tables are created if they were not existed. Database is assumed to exist. 

Following endpoins are developed:

1. User registration

      endpoint - /register

      method - post

      body - {
          name, 
          status, 
          BossUuid, 
          login, 
          password
        }

Status can be "Boss" or "Regular".
Admin cannot create an account this way. The account is created automatically when server is started. Login and password have to be spicified in .env variables


2. User login

      endpoint - /login

      method - post

      body - {
          login, 
          password
       }

      response
      {
        token
      }


3. Get list of subordinates

      endpoint - /list

      method - get

      header - {
      "authorization": Bearer token
      }

      response - array of subordinats

4. Change boss

      endpoint /change-boss

      method - put

      header - {
      "authorization": Bearer token
      }

      body - {
        uuid,
        newbossuuid
      }
