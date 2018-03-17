let utils = {
  post: function (uri, data) {
    data = data || {}
    let options = {
      method: data ? 'POST' : 'GET',
      uri,
      data,
      json: true,
      resolveWithFullResponse: true
    }

    return this.rp(options).then((res) => {
      if (res.statusCode === 201) {
        let body = Object.keys(res.body).length ? JSON.parse(res.body) : {}
        return Promise.resolve(body)
      } else {
        return Promise.reject(new Error(`POST to ${uri} returned ${res.statusCode}`))
      }
    }).catch((err) => {
      return Promise.reject(err)
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
