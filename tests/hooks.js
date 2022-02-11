const request = require('supertest')(`http://localhost:8082`)
const chai = require('chai')

chai.should()

exports.mochaHooks = {

  beforeAll(done) {
    require('../app.js')
    request
      .post('/graphql')  // simply to get db connection started
      .send()
      .end(() => {
        console.log("\n")
        done()
      })
  },

  afterAll(done) {
    done()
    process.exit()
  },

}