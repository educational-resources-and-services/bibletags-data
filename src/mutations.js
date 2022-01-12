const mutations = `

  requestLoginToken(input: RequestLoginTokenInput!): Boolean
  logIn(input: LogInInput!): Boolean
  logOut: Boolean
  submitWordHashesSet(input: WordHashesSetInput!): TagSet
  submitTagSet(input: TagSetInput!): TagSet
  submitUIWords(input: UIWordsInput!): [UIWord]

`

module.exports = mutations