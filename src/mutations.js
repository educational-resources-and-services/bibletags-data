const mutations = `

  requestLoginToken(input: RequestLoginTokenInput!): Boolean
  logIn(input: LogInInput!): Boolean
  logOut: Boolean
  submitWordHashesSet(input: WordHashesSetInput!): TagSet
  submitWordHashesSets(input: [WordHashesSetInput]!): Boolean
  submitTagSet(input: TagSetInput!): TagSetSubmissionUpdate
  submitUIWords(input: UIWordsInput!): [UIWord]
  addVersion(input: VersionInput!): Version
  addEmbeddingApp(input: EmbeddingAppInput!): EmbeddingApp

`

module.exports = mutations