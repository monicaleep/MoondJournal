# Express Auth Boilerplate
1. Fork and clone
2. Install dependencies `npm i`
3. create a `config.json` with the following code:
```
{
  "development": {
    "database": "<insert dev db name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "<insert test db name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "<insert prod db name here>",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

```
*note:* if your database requires a username and password, you'll need to include these fields in the above as well
4. create the database
```
sequelize db:create <insert db name here>
```
5. Migrate the user model to your database
```
sequelize db:migrate
```
6. Add a `SESSION_SECRET` environment variable in a `.env` file (can be any string). Add a `PORT` environment variable as well.

7. run `nodemon` in your terminal to start the app
