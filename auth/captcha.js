const fetch = require('node-fetch')

module.exports = {
  checkCaptcha: ({ req, captchaValue }) => {
    return new Promise((resolve, reject) => {
      const captchaPost = {
        secret: process.env.CAPTCHA_SECRET,
        response: captchaValue,
        remoteip: req.ip,
      }
      let captchaBody = []
      for(let key in captchaPost) {
        captchaBody.push(key + '=' + encodeURIComponent(captchaPost[key]))
      }
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: captchaBody.join('&'),
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(json) {
          if(json.success) {
            resolve(true)
          } else {
            reject('no robots')
          }
        })
    })
  }
}
