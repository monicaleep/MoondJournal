# MOOND journal

## About this app

An app where you can record your feelings, keep track of your self-care tasks, and see how your sentiments are affected by the celestial cycles.
Live demo [here](https://moondjournal.herokuapp.com/)

----------------------------------------------------------

### ERD


ERD for the models are hosted [here](https://lucid.app/invitations/accept/7a5e6e3b-52ab-4939-b5ee-4985d39d198e).

----------------------------------------------------------
### User Stories

- As a user I can write a diary entry for a date.
- As a user, I can the sentiment of my diary entry alongside the moon phase and if mecury is in retrograde
- As a user I can populate a list of self care ideas
- As a user I can tick off when I do self-care tasks
- As a user I can see the last time I did a certain self-care task
- Future Development Plans: As a user I can view aggregate sentiment data for a certain date to see how the world feels when mercury is in retrograde

----------------------------------------------------------
### Wireframes


Wireframes are hosted [here](https://wireframepro.mockflow.com/view/M26c6fa717eb51bc48851b5d82b9c500e1604695539054).

----------------------------------------------------------
### APIs and Tech Used

- Node packages: Express, ejs, ejs-layouts, dotenv, passport authentication (local), express-sessions, Sentiment, axios, bcrypt, pg, sequelize
- Postgres database connected via Sequelize ORM.
- Bulma CSS Framework extended with custom SCSS.
- Sentiment NPM package
- Mecury Retrograde API
- [Moon Phase API]("https://www.icalendar37.net/lunar/api/?month=11&year=2020&lightColor=rgb(255%2C255%2C100)&shadeColor=black&LDZ=1604206800")

----------------------------------------------------------
### Approach Taken

0. Finalize ERD and setup my database models for all required functionality
1. Stub out all of the routes I will need. Use res.send to ensure I am hitting them.
2. Start on the backend first, started with the TODO (Self-Care Task) routes as they were a bit more straightforward At this point I added a very basic front end for these routes to ensure data is coming across in the right formats
3. Continue on the backend to get the Journal Entries
4. Error handling on backend
5. Style the front end
6. Handle route protections

----------------------------------------------------------
### Major Challenges
- As the Moment JS library is no longer maintained, I opted to use native JS Date objects. They took a bit of finagling to get to behave with both my API calls and be stored in my database.
- Bulma is customizable via SASS/SCSS so I had to learn how to use that in order to overwrite some default styles, luckily there was very good documentation.


----------------------------------------------------------
### Unsolved issues
None! In the future I would like to add the ability to view a summary of all entries sentiments by date and correlate against moon phases and mercury retrograde.

----------------------------------------------------------

#### Instructions to Install it locally
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
