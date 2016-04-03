var storage = require('node-persist')
storage.initSync()

var extractUrl = (str) => {
  return str.match(/http:\/\/challonge.com\/tournaments\/signup\/[a-z]*/i)
}

var getUrl = () => {
  return storage.getItem('royale_url')
}

var saveUrl = (str) => {
  storage.setItem('royale_url', extractUrl(str))
}

module.exports = {
  saveUrl: saveUrl,
  getUrl: getUrl
}
