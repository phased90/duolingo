# Duolingo for Node

An unofficial node client to the Duolingo API.

## Summary

This library is a promise-based JS wrapper for interacting with the Duolingo API:
```javascript
const Duolingo = require('duolingo');

let duo = new Duolingo({
  username: <username>,
  password: <password>
})

duo.login()
  .then(() => {
    return duo.getPurchasedItems()
  }).then((items) => {
    console.log(JSON.stringify(items, null, 2))
    return duo.logout()
  }).catch((err) => {
    console.error(err)
  })
```

Further usage examples can be found in /examples.

## Available Methods
- login
- logout
- getNotifications
- getSubscriptions
- getPurchasedItems
- getUserInfo
- getShopItems
- purchaseItem
