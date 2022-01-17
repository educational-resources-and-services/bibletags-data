# Bible Tags

## About

*Original language Bible study for everyone, in every language.*

Vision: That every Christian might have free access to the Bible tagged to the original Hebrew, Aramaic and Greek with parsing and lexical information—all in their own language.

For more information on this project, see the [Bible Tags website](https://bibletags.org).

## Repos

* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data) **(Contains general information on project design and contributing.)**
* [bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app)
* [bibletags-ui-helper](https://github.com/educational-resources-and-services/bibletags-ui-helper)
* [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification)
* [bibletags-usfm](https://github.com/educational-resources-and-services/bibletags-usfm)
* [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget)
* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script)

## Bugs / feature requests

* See [here](https://github.com/educational-resources-and-services/bibletags-data/issues).
* Please first check if your bug report / feature request already exists before submitting a new issue.
* For bug reports, please provide a clear description of the problem and step-by-step explanation of how to reproduce it.
* For feature requests, please first get to the know the project via the [Design section of the bibletags-data README](https://github.com/educational-resources-and-services/bibletags-data#design) to make sure the desired feature is inline with the direction this project is heading.

## Contributing

* Submit pull requests to fix bugs from `Issues` and implement features after [conferring with us](https://bibletags.org/contact).
* Please take note of the present coding style and do your best to write new code that accords with it.

### Open source alignment data

If you are aware of any open source word alignment data (what we call Bible tags) for a particular Bible translation, please [bring it to our attention](https://bibletags.org/contact) and we will gladly make use of it. Both full alignment data, as well as data which simply includes the Strongs number, lexeme or lemma for each word in the translation, are useful.

# bibletags-data

## Basic information

* receives graphql requests
* built with express
* uses a mysql db that lives on aws rds

## Development

### Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-data
cd bibletags-data
npm install
npm run setup-db
```

### Testing

* `npm run test`