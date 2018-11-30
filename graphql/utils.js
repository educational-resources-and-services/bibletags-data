module.exports = {

  origLangAndLXXVersionIds: [
    'uhb',
    'ugnt',
    'lxx',
  ],

  wordIdRegEx: /^[0-9a-z]{4}$/i,
  verseIdRegEx: /^[0-9]{8}$/,
  versionIdRegEx: /^[a-z0-9]{2,9}$/,
  definitionIdRegEx: /^[HAG][0-9]{5}[a-z]?$/,  // strongs number
  languageIdRegEx: /^[a-z]{3}$/,
  scopeRegEx: /^[a-z]{1,2}|[0-9]{2}$/,

  getOrigLangVersionIdFromVerseId: verseId => (
    parseInt(verseId.substr(0,2), 10) <= 39 ? 'uhb' : 'ugnt'
  ),

}