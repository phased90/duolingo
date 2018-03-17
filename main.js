const request = require('request-promise')
// const jwt = require('jsonwebtoken')
const utils = require('./utils')

function DuoLingo (options) {
  let { username, password } = options || {}
  this.username = username || ``
  this.password = password || ``
  this.loggedIn = false
  this.user_id = ``
  this.rp = request.defaults({
    jar: true, // want to store cookies
    simple: false // want to handle non 2xx responses
  })

  this.post = utils.post.bind(this)
  this.get = utils.get.bind(this)
}

DuoLingo.prototype.login2 = function () {
  if (this.username === `` || this.password === ``) {
    return Promise.reject(new Error(`You must provide login credentials!`))
  } else if (this.loggedIn) {
    console.log('You are already logged in')
    return Promise.resolve(true)
  }

  return this.post(
    'https://www.duolingo.com/2016-04-13/login?fields=',
    {
      identifier: this.username,
      password: this.password
    }
  )
    .then((res) => {
      if (res.code === 201) {
        this.loggedIn = true
        return Promise.resolve(true)
      } else {
        this.loggedIn = false
        return Promise.resolve(false)
      }
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

DuoLingo.prototype.getUserInfo = function () {
  // TODO: allow selection of specific fields
  if (!this.user_id || !this.loggedIn) {
    return Promise.reject(new Error('You must be logged in!'))
  }

  return this.get(
    `https://www.duolingo.com/2017-06-30/users/${this.user_id}?fields=adsEnabled,bio,blockedUserIds,canUseModerationTools,courses,creationDate,currentCourse,email,emailAnnouncement,emailAssignment,emailAssignmentComplete,emailClassroomJoin,emailClassroomLeave,emailComment,emailEditSuggested,emailFollow,emailPass,emailWeeklyProgressReport,emailSchoolsAnnouncement,emailStreamPost,emailVerified,emailWeeklyReport,enableMicrophone,enableSoundEffects,enableSpeaker,experiments,facebookId,fromLanguage,globalAmbassadorStatus,googleId,hasPlus,id,joinedClassroomIds,learningLanguage,lingots,location,monthlyXp,name,observedClassroomIds,persistentNotifications,picture,plusDiscounts,practiceReminderSettings,privacySettings,roles,streak,timezone,timezoneOffset,totalXp,trackingProperties,username,webNotificationIds,weeklyXp,xpGains,xpGoal,zhTw,_achievements&_=${Date.now()}`,
    {}
  )
    .then((res) => {
      if (res.code === 200) {
        this.userInfo = res.data
        return Promise.resolve(res.data)
      } else {
        return Promise.resolve(res)
      }
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

/*
  Log in with credentials stored in the DuoLingo object
  (This uses the older/possibly mobile version of the API)
*/
DuoLingo.prototype.login = function () {
  if (this.username === `` || this.password === ``) {
    return Promise.reject(new Error(`You must provide login credentials!`))
  } else if (this.loggedIn) {
    return Promise.reject(new Error(`You are already logged in!`))
  }

  return this.post(
    'https://www.duolingo.com/login',
    {
      login: this.username,
      password: this.password
    }
  )
    .then((res) => {
      if (res.code === 200) {
        this.loggedIn = true
        this.user_id = res.data.user_id
        return Promise.resolve(this.user_id)
      } else {
        this.loggedIn = false
        this.user_id = null
        return Promise.resolve(null)
      }
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

/*
  Log out of the current session
*/
DuoLingo.prototype.logout = function () {
  if (!this.loggedIn) {
    return Promise.reject(new Error(`You aren't logged in!`))
  }

  let options = {
    method: `POST`,
    uri: 'https://www.duolingo.com/logout',
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 302) {
      this.loggedIn = false
      return Promise.resolve(res.body)
    } else {
      return Promise.reject(new Error(`logout returned with code ${res.statusCode}`))
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/*
  Get the notifications for the currently logged in user
*/
DuoLingo.prototype.getNotifications = function () {
  if (!this.loggedIn) {
    return Promise.reject(new Error(`You must be logged in!`))
  }

  let options = {
    method: `GET`,
    uri: `https://www.duolingo.com/notifications?_=${Date.now()}`,
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 200) {
      let body = JSON.parse(res.body)
      return Promise.resolve(body)
    } else {
      return Promise.reject(new Error(`getNotifications returned with code ${res.statusCode}`))
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/*
  Get the subscriptions for the currently logged in user
*/
DuoLingo.prototype.getSubscriptions = function () {
  if (!this.loggedIn) {
    return Promise.reject(new Error(`You must be logged in!`))
  }

  let options = {
    method: `GET`,
    uri: `https://www.duolingo.com/2017-06-30/users/${this.user_id}/subscriptions?_=${Date.now()}`,
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 200) {
      let body = JSON.parse(res.body)
      return Promise.resolve(body)
    } else {
      return Promise.reject(res.statusCode)
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/*
  Get the purchased shop items for the currently logged in user
 */
DuoLingo.prototype.getPurchasedItems = function () {
  if (!this.loggedIn) {
    return Promise.reject(new Error(`getPurchasedItems: You must be logged in!`))
  }

  let options = {
    method: `GET`,
    uri: `https://www.duolingo.com/2017-06-30/users/${this.user_id}?fields=shopItems&_=${Date.now()}`,
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 200) {
      let body = JSON.parse(res.body)
      return Promise.resolve(body)
    } else {
      return Promise.reject(new Error(`getPurchasedItems returned with code ${res.statusCode}`))
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/*
  List the items in the shop (cannot all necessarily be purchased)
*/
DuoLingo.prototype.getShopItems = function () {
  let options = {
    method: `GET`,
    uri: `https://www.duolingo.com/api/1/store/get_items?_=${Date.now()}`,
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 200) {
      let body = JSON.parse(res.body)
      return Promise.resolve(body)
    } else {
      return Promise.reject(new Error(`getShopItems returned with code ${res.statusCode}`))
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

/*
  Purchase the selected item, by item and language
*/
DuoLingo.prototype.purchaseItem = function (item, lang) {
  let options = {
    method: `POST`,
    uri: `https://www.duolingo.com/2017-06-30/users/${this.user_id}/purchase-store-item`,
    body: {
      name: item,
      learningLanguage: lang
    },
    json: true,
    resolveWithFullResponse: true
  }

  return this.rp(options).then((res) => {
    if (res.statusCode === 200) {
      let body = JSON.parse(res.body)
      return Promise.resolve(body)
    } else {
      return Promise.reject(res.statusCode)
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}
module.exports = DuoLingo
