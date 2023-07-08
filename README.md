# Cossack - multi-language, multipurpose discord bot created using discord.js, typescript, MongoDB and i18next

**This bot is currently under development. Stay tuned for new updates!**

## Featuring:

<ul>
  <li>Over 15 commands</li>
  <li>Advanced logging system</li>
  <li>Ticket system</li>
  <li>Reaction roles</li>
  <li>Private voice channels on your server</li>
  <li>Online member counter</li>
</ul>

## Folder structure explanation

```
.env.example - Environment variables example
src/
├── commands/ - Discord slash commands
├── components/
│   ├── subcommandGroups/ - Extracted subcommand groups to increase modularity
│   ├── subcommands/ - Extracted subcommands
│   ├── logs/ - Log messages (So called "Audit log messages")
│   ├── buttons/ - Button message component
│   └── context/ - Context menu commands
├── events/ - Discord events
├── functions/ - Reusable code
├── handlers/ - Handlers for commands/buttons/events/etc
├── lib/ - Initialize different services
│   ├── client.ts - Discord client
│   ├── i18next.ts - i18next
│   └── mongodb.ts - MongoDB
├── locales/ - Resources for localization
│   ├── en/
│   ├── uk/
│   ├── fr/
│   └── resources.ts - File to specify available resources
├── schemas/ - Mongoose schemas
└── index.ts - File to run an application
```

## How to run it?

### Locally with Node.JS

<ol>
  <li>
    <a href="https://nodejs.org/en">Install NodeJS runtime</a>
  </li>
  <li>
    <a>Install Yarn <code>npm i -g yarn<code></a>
  </li>
  <li>
    <a href="https://git-scm.com/">Install Git (Optional)</a>
  </li>
  <li>
    Clone source code with <code>git clone git@github.com:RomaDevWorld/Cossack-BOT.git<code> or however you like it
  </li>
  <li>
    Open cloned directory in terminal, and run <code>yarn install<code> to install the dependencies 
  </li>
  <li>
    Rename <code>.env.example<code> to <code>.env<code> and specify all the necessary values (Like Discord Token or MongoDB url)
  </li>
  <li>
    Build source code with <code>yarn build<code>
  </li>
  <li>
    Run the app <code>yarn start<code>
  </li>
</ol>

### Using Docker

```
docker run \
--name bot \
-d \
--restart unless-stopped \
-e DISCORD_TOKEN='Your discord bot token' \
-e DISCORD_CLIENT_ID='Your discord bot client id' \
-e DB_HOST='MongoDB url without mongodb://' \
-e DB_NAME='Name of your database' \
romadevworld/cossackbot:latest
```
