let utils = {
  post: function (uri, body) {
    body = body || {}
    let options = {
      method: 'POST',
      uri,
      body,
      json: true,
      resolveWithFullResponse: true
    }

    return this.rp(options).then((res) => {
      return Promise.resolve({
        code: res.statusCode,
        data: res.body
      })
    })
  },

  get: function (uri) {
    let options = {
      method: `GET`,
      uri,
      resolveWithFullResponse: true
    }

    return this.rp(options).then((res) => {
      return Promise.resolve({
        code: res.statusCode,
        data: res.body
      })
    })
  }
}

module.exports = utils
