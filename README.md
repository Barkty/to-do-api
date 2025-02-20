# Developer Foundry API

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

# Table of Contents

-   [General Info](#general-info)

-   [Technologies](#technologies)

-   [3rd party services](#services)

-   [Setup](#setup)

-   [Conventions](#conventions)

-   [Status](#status)

### General Info

Backend codebase of the Developer Foundry app

### Technologies

This project is built with:

-   [Nodejs/ExpressJS](https://expressjs.com)
-   [MongoDB](https://cloud.mongodb.com)
-   [Redis](https://redis.io)
-   [Socket.io](https://socket.io)

### Services

-   [MongoDB](https://cloud.mongodb.com): Database management
-   [New Relic](https://newrelic.com): Observability
-   [Better Uptime](https://betteruptime.com): Web Monitoring & Status page
-   [Cronjob.org](https://cronjob.org): Cronjob management

### Conventions

-   **File Structure**
    Entities are self-contained and organized by modules e.g. all items related features or folders are in
    the `task` directory.

```
├── module
│ ├── tasks
│ ├──── controller.js
│ ├──── model.js
| ├──── services.js
│ └──── route.js
│ ├── auth
│ ├──── controller.js
│ ├──── model.js
| ├──── services.js
│ └──── route.js
```

-   **Exports**
    Exports are to be inline. \*\*Most are currently at the end of every file but we are moving towards inline so
    everything is tidier.
-   **Imports**
    Imports are sorted alphabetically. To enable this setting on `VSCode`:
    Open the settings (⇧⌘P or Ctrl+Shift+P), find `Preferences: Configure Language Specific Settings...` and then find
    the `JavaScript`. It will open the `settings.json` file. Now add the configuration:

```
"editor.codeActionsOnSave": {
	"source.organizeImports": true
},
```

-   **Naming**

    -   Models are capitalized and singular e.g.
        `const Task = model("Task", schema);`

    -   Filenames for entities are lowercase, plural and are hyphen-separated e.g. `holds`, `transactions` etc

-   **Documentation**
    _Always namespace files_ e.g. `/** @namespace PrescriptionController */`

Sample:

```
/**
* Fetches tasks
* @async
* @function fetch
* @param {Object} req
* @param {Object} res
* @returns Promise<Object>
*/

```

-   **Postman**
    Try to be as modular as possible. Store endpoints used in a single module together in a folder.

-   **Tests**
-   _Coming Soon._

### Setup

#### Prerequisites

To run this locally, you need to have [Redis](https://redis.io) setup on your PC

#### Installation

To run this project,

```
npm install
npm run dev
```

### Status

Status page generated by BetterUptime: [View Status Page](https://task.betteruptime.com)
