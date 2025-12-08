# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).

## Repos

* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data)
* [bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app)
* [bibletags-ui-helper](https://github.com/educational-resources-and-services/bibletags-ui-helper)
* [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification)
* [bibletags-usfm](https://github.com/educational-resources-and-services/bibletags-usfm)
* [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget)
* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script)

## Bugs

* Report [here](https://github.com/educational-resources-and-services/bibletags-data/issues).

# bibletags-data

## Basic information

* Receives graphql requests
* Built with express
* Uses a mysql db that lives on aws rds
* Deployed to AWS Lambda using Serverless

## Development

Note that a local MySQL 8 database install is required.

### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-data
git clone https://github.com/educational-resources-and-services/bibletags-usfm
cd bibletags-data
cp .env.example .env
```

Create a local MySQL database called `BibleTags` with `utf8mb4` encoding and `utf8mb4_bin` collation. Update `RDS_USERNAME` and `RDS_PASSWORD` in `.env` to access this database.

better-sqlite3 needs to compile C++ code which may may require you to install certain build tools before you can run `npm install`

```bash
npm install
npm run setup-db
```

### Testing

```bash
npm run test
```

### Updating `/src/db/connect.js`

After making edits to this file, run the following:

```bash
npm run update-db
```