var request = require('request'),
    storage = require('node-persist')

storage.initSync()

var warSizes = [10, 15, 20, 25, 30, 35, 40, 45, 50]

var clashcallerRequest = (name, enemy_name, warsize, timers, searchable) => {
  //DONT EDIT THIS, ITS SAMPLED FROM THE CLASHCALLER SITE
  return {'REQUEST' : 'CREATE_WAR', 'cname' : name, 'ename' : enemy_name,
                            'size' : warsize, 'timer' : timers, 'searchable' : searchable}
}

var extractUrl = (str) => {
  return str.match(/http:\/\/clashcaller\.com\/war\/[a-z0-9]{5}/)
}

var createWar = (clashCallerData, cb) => {
  request({
    url: 'http://clashcaller.com/api.php',
    method: 'POST',
    form: clashCallerData
  }, cb)
}

var initWar = (message, cb) => {
  var nr = parseInt(message.text.match(/\d+/)[0])
  if (warSizes.indexOf(nr) === -1) {
    return cb({code: 400, message: 'Specify a valid size!'})
  }
  var req = clashcallerRequest("Atomic Bullies", "NYI", nr, 0, false)
  createWar(req, (err, res, body) => {
    if (err) {
      return cb(err)
    } else {
      var warUrl = `http://clashcaller.com/${body}`
      storage.setItem('url', warUrl)
      return cb(null, warUrl)
    }
  })
}

var getUrl = () => {
  return storage.getItem('url')
}

var saveUrl = (str) => {
  storage.setItem('url', extractUrl(str))
}

module.exports = {initWar: initWar, getUrl: getUrl, saveUrl: saveUrl}

