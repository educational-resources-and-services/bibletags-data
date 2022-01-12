module.exports = {

  origLangAndLXXVersionIds: [
    'uhb',
    'ugnt',
    'lxx',
  ],

  wordIdRegEx: /^[0-9]{2}[0-9a-z]{3}$/i,
  locRegEx: /^[0-9]{8}$/,
  versionIdRegEx: /^[a-z0-9]{2,9}$/,
  definitionIdRegEx: /^[HAG][0-9]{1,4}(?:\.[0-9])?$/,  // strongs number
  languageIdRegEx: /^[a-z]{3}$/,
  scopeRegEx: /^[a-z]{1,2}|[0-9]{2}$/,
  wordsHashRegEx: /^[a-zA-Z0-9\+\/=]{2,}$/,  // base 64 digits only

  translationLength: 300,
  translationWordLength: 200,
  languageNameLength: 100,
  glossLength: 100,
  versionNameLength: 150,
  wordsHashLength: 255,

}