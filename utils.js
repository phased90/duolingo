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
      if (res.statusCode === 200) {
        let body = JSON.parse(res.body)
        return Promise.resolve(body)
      } else {
        return Promise.reject(new Error(`GET to ${uri} returned ${res.statusCode}`))
      }
    }).catch((err) => {
      return Promise.reject(err)
    })
  }
}

module.exports = utils
