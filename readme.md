# MOOND journal

## About this app

### ERD

[here](https://lucid.app/invitations/accept/7a5e6e3b-52ab-4939-b5ee-4985d39d198e)
----------------------------------------------------------
### User Stories

- As a user I can write a diary entry for a date.
- As a user, I can the sentiment of my diary entry alongside the moon phase? and if mecury is in retrograde
- As a user I can populate a list of self care ideas
- As a user I can tick off when I do self-care tasks
- As a user I can see the last time I did a certain self-care task
- BONUS: As a user I can view aggregate sentiment data for a certain date to see how the world feels when mercury is in retrograde

----------------------------------------------------------
### Wireframes

[here](https://wireframepro.mockflow.com/view/M26c6fa717eb51bc48851b5d82b9c500e1604695539054)
----------------------------------------------------------
### APIs and other outside tech

- Mecury Retrograde API
- Sentiment NPM package
- Moment JS? for dates
- I found [this]("https://www.icalendar37.net/lunar/api/?month=11&year=2020&lightColor=rgb(255%2C255%2C100)&shadeColor=black&LDZ=1604206800") API for moon phases but if I can't play nicely with it I will find something else or just use mercury in retrograde?




## Instructions to install it locally
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
