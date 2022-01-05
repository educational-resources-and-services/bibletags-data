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
* [bibletags-widget](https://github.com/educational-resources-and-services/bibletags-widget)
* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script)

## Bugs / feature requests

* See [here](https://github.com/educational-resources-and-services/bibletags-ui-data/issues).
* Please first check if your bug report / feature request already exists before submitting a new issue.
* For bug reports, please provide a clear description of the problem and step-by-step explanation of how to reproduce it.
* For feature requests, please first get to the know the project via the [Design section of the bibletags-data README](https://github.com/educational-resources-and-services/bibletags-data#design) to make sure the desired feature is inline with the direction this project is heading.


## Open source alignment data

If you are aware of any open source word alignment data (what we call Bible tags) for a particular Bible translation, please [bring it to our attention](https://bibletags.org/contact) and we will gladly make use of it. Both full alignment data, as well as data which simply includes the Strongs number, lexeme or lemma for each word in the translation, are useful.


## Contributing

* Get to know the project via the [Design](#design) section below and the [Roadmap](#roadmap) above.
* Submit pull requests to fix bugs from `Issues` and implement features that fall within the Roadmap. You would be wise to examine the active branches so as to avoid taking on a feature that someone else is already actively working on.
* Please take note of the present coding style and do your best to write new code that accords with it.

# Development of bibletags-data

## Installation

```bash
git clone https://github.com/educational-resources-and-services/bibletags-data
cd bibletags-data
npm install
npm run setup
```

## Running

* `npm run open` (to open test.html in your browser)
* `npm start` (to start the local server)

Note: You will need to kill and rerun the server with each change.

# Design

## Project components

* [bibletags-widget-script](https://github.com/educational-resources-and-services/bibletags-widget-script) (widget-script.js)
  * launches the widget in iframes using postMessage for communication
  * contains no dependencies
  * uglified upon deployment
  * lives on a cdn
  * holds as little logic as possible so as to rarely change, since each change requires an embed tag update
* [biblearc-widget](https://github.com/educational-resources-and-services/bibletags-widget)
  * build with `create-react-app`
  * deploys to static files
  * lives on a cdn
  * makes graphql queries and mutations to `bibletags-data`
  * will work offline
* [bibletags-data](https://github.com/educational-resources-and-services/bibletags-data)
  * receives graphql requests
  * built with express
  * uses a mysql db that lives on aws rds
* [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification)
  * included by both `bibletags-data` and `bibletags-widget`
  * exposes three functions for aligning verses between versions
    * `hasCorrespondingVerseInOriginal()`
    * `isValidVerseInOriginal()`
    * `getCorrespondingVerseLocations()`
  * rarely changes as its consistency is foundational to the integrety of crowd-sourced tagging data
* [BibleTags.org](https://bibletags.org)
  * presents the vision and how-to of the Bible Tags project
  * makes api calls to `bibletags-data`
  * contains a data hub with files in cdn (or aws s3)
* [bibletags-react-native-app](https://github.com/educational-resources-and-services/bibletags-react-native-app)
  * an open source app template
  * built in react native
  * built with [expo](https://expo.io/)
  * super simple to deploy a Bible app with original language study components:
    * retrieve permission + data for one or more translations
    * set config settings (language, versions, colors, app name, logo, etc)
    * it is ready to deploy to app stores


## Original language texts

* Hebrew Bible
  * [UHB](https://git.door43.org/unfoldingWord/uhb)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Description: UHB text (based on the WLC)
* Greek New Testament
  * [UGNT](https://git.door43.org/unfoldingWord/UGNT)
  * License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  * Compiled by Alan Bunning via the [Center for New Testament Restoration](https://greekcntr.org)
    * Alan is currently adding parsing and lexical data to all variants
    * Alan aims to create a non-prototype computer generated version (early 2019?)
    * Alan's manuscript types: (1) full books (2) snippets (3) quoted by church fathers (4) foreign languages
      * #1 and #2 currently considered in the `UGNT`.
    * Alan is looking to land on an ID system for words that would allow for new variants to be added without complicating existing data.
      * Andy suggested using a 4-digit random unigue identifier for each unique word, explained in an email sent to Alan on Oct 25, 2018.
    * Alan notes that punctuation and accents are somewhat up-in-the-air in the `UGNT`, but hopes to refine and standardize them after the release of the computer generated version.


## Septuagint

* Text
  * [LXX](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/)
  * License: [Commercial use requires prior written consent](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxvar/0-readme.txt)
  * This [BHS-LXX parallel](http://ccat.sas.upenn.edu/gopher/text/religion/biblical/parallel/) is perfect for deriving both verse alignment and LXX tags.
  * Open Scripture's [GreekResources](https://github.com/openscriptures/GreekResources) will likely also be helpful.
* Deuterocanonical books not included in LXX search results
  * While such results can certainly be useful to the study of the canonical books and their vocabulary, they nonetheless go beyond the scope of this project and will not be included in search results or translation statistics.



## Versification

See [bibletags-versification](https://github.com/educational-resources-and-services/bibletags-versification).


### Word divisions

Most modern languages separate words with spaces or other punctuation, but there are some exceptions. See [here](https://en.wikipedia.org/wiki/Word_divider) and [here](https://linguistics.stackexchange.com/questions/6131/is-there-a-long-list-of-languages-whose-writing-systems-dont-use-spaces).

To address this, the database will need to record a `word divider regex` for any text where the default `/[\\P{L}]+/gu` is not the valid regex for the split function.

This will leave some languages without precise word dividers, resulting, at times, in smaller divisions than words (eg. syllables). While this is not ideal for these languages, it should nonetheless allow all aspects of the widget to function properly, and only require a bit more clicking when tagging these texts to the original languages.

Programmatic exceptions to this approach will be few. To date, the following exception(s) exist:

* Possession and contractions in English using an apostraphe. Eg. `Balaam’s`, `shouldn’t`. Such apostraphes will be escaped before the `word divider regex` is used to split the verse.

*Please contact us to suggest any programmatic exceptions for other languages.*

Known examples of languages without precise word dividers:

* Vietnamese and Tai Lü use spaces to divide by syllable.
* Tibetan and Dzongkha use other marks to divide by syllable.
* While most Chinese characters are a single word, some words are made up of more than one.
* Japanese characters are each a single syllable.
* Lao translation may or may not use spaces.

Note: While embedding sites/apps providing USFM for verse content could distinguish between words, this information cannot be relied upon since other embedding sites/apps may only provide plain text.