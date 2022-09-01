const { doMutation } = require('./testUtils')

describe('Mutation: addEmbeddingApp', async () => {

  it('A Bible Society', async () => {

    const embeddingApp = await doMutation(`
      addEmbeddingApp(input: { uri: "https://abiblesociety.com", appSlug: "abiblesociety", appName: "Our App", orgName: "A Bible Society", contactEmail: "admin@abiblesociety.com" }) {
        id
        uri
        notes
        createdAt
        updatedAt
        awsAccessKeyId
        awsSecretAccessKey
      }
    `)

    ;(!!embeddingApp).should.eql(true)

  })

})