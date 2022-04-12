const { handler } = require('../handler')

;(async () => {

  await handler({ forceRunAll: true })
  process.exit()

})()