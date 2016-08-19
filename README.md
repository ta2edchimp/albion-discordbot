# Albion Online - Discord Bot

> Notifications about News & Announcements, Developers Statements and Tweets for your own Discord Server.

## Installation

* Create Discord App & Bot ([Discord Application](https://discordapp.com/developers/applications/me))
* Create Twitter App (Read-Only) ([Twitter Apps](https://apps.twitter.com/))
* Install [Node.js](https://nodejs.org/)
* Copy this Project
* Install all Depencendies in Project Folder with `npm install`
* *Optional: Install Process Manager with ``npm install pm2 -g`` ([PM2](http://pm2.keymetrics.io/))*

## Configuration

* Rename [config.example.json](config.example.json) to `config.json`
* Replace `discord_token`, `consumer_key`, `consumer_secret`, `access_token`, `access_token_secret`
* *Optional: Replace [avatar.png](avatar.png)*

## Usage

Start the Bot with:
> npm install

Or, if Process Manager installed:
> pm2 server.js --name "albionbot"

### Default Commands (Depending on `bot_prefix` in `config.json`)

* En-/Disable Forum (RSS) Notifications
> !notify forum

* En-/Disable Twitter Notifications
> !notify twitter

## License

[MIT License](LICENSE)

Copyright (c) 2016 Dr. Dr. Jojo
