module.exports = () => {

  return (
    queries,
    {
      input,
    },
    { req }
  ) => {

    // Log user out by disassociating their account from the session
    req.fullLogOut()
    return true

  }
}