![Pockethub](Pockethub.png "Pockethub")

# Abstract

Pockethub is a full stack webpage to facilitate the trading of cards in the game [Pokémon TCG Pocket](https://tcgpocket.pokemon.com/en-us/).

> As this is a currently a student project, only the cards from set A1 are availble to trade.

[Trello board](https://trello.com/b/6gqlg9CJ/pockethub)

# Attributions

The literal and graphical information presented on this website about the Pokémon Trading Card Game Pocket, including card images and text, is copyright The Pokémon Company, DeNA Co., Ltd., and/or Creatures, Inc.. This website is not produced by, endorsed by, supported by, or affiliated with any of those copyright holders.

# .env files

## Frontend

- VITE_API_URL : the URL of the server

## Backend

- DB : the name of the database
- DB_HOST : the url of the server (or localhost)
- DB_PASSWORD
- DB_PORT : the default port for postgresSQL is 5432
- DB_USER
- JWT_SECRET_KEY

# React Component Tree

![React](React_Diagram.png)

# Database schema diagram

![Database](Database_Diagram.png)

# Technologies used

## Frontend

- React
- React Router
- Tanstack Query
- Bootstrap
- Bootstrap React
- jwt-decode

## Backend

- Flask
- psycopg2
- flask-cors
- python-dotenv
- bcrypt
- flask-jwt-extended
- PostgresSQL

# Next steps:

The stretch goals will improve on the current known limitations of the website, including

- Admins having more power over users
- The ability to change gameID and password after account creation (this has been addressed in a dev build)
- Not being able to trade with yourself
