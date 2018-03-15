/*
  This example is a Lambda function:
  It can be scheduled to automatically renew a streak freeze every day
  NB: async/await are not available in the Lambda runtime (Node v6.10)
*/

const username = process.env.DUOLINGO_USER
const password = process.env.DUOLINGO_PASS
const Duolingo = require('../main')
const LANG = 'it' // language abbreviation

function isEquipped (items, name) {
  let found = items.shopItems.find((item) => {
    return item.itemName === name
  })

  return !!found
}

function streakMaintenance () {
  if (!username || !password) {
    throw new Error(
      'please set:\n\nDUOLINGO_USER\nDUOLINGO_PASS\n'
    )
  }

  var duo = new Duolingo({
    username,
    password
  })

  duo.login()
    .then(() => {
      return duo.getPurchasedItems()
    })
    .then((res) => {
      if (isEquipped(res, 'streak_freeze')) {
        console.log('\n\nStreak freeze is already equipped\n\n')
        return Promise.resolve()
      } else {
        console.log('\n\nStreak freeze is not equipped; equipping...\n\n')
        return duo.purchaseItem('streak_freeze', LANG)
      }
    })
    .then(() => {
      return duo.logout()
    })
    .catch((err) => {
      console.error(`\n\nResponse: ${err}\n\n`)
    })
}

function handler (event, context) {
  streakMaintenance()
}

module.exports = {
  isEquipped,
  streakMaintenance,
  handler
}
