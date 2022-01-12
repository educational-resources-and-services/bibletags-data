const example = () => async (req, res) => {

  // const { models } = global.connection

  try {

    if(req.method === 'POST') {
      // The API will require this post if we ever accept promo codes in the future.
      throw `invalid request method: POST not implemented`

    } else if(req.method === 'GET') {
      // return something
      // const payloadIn = jwt.verify(req.query.payload, process.env.EXAMPLE_API_JWT_SECRET)
      const something = { some: "thing" }
      // const payloadOut = jwt.sign(something, process.env.EXAMPLE_API_JWT_SECRET)
      // return res.send(payloadOut)
      return res.send(something)
    }

    throw `invalid request method: ${req.method}`

  } catch (err) {
    console.log(`⚠️  Example API failure`, err)

    // await sendEmail({
    //   priority: 'NOW',
    //   models,
    //   toAddrs: adminEmail,
    //   subject: "Client ERR: Example API failure",
    //   body: `Method: ${req.method}<br><br>${err}`,
    // })

    return res.sendStatus(400)
  }

}

module.exports = example