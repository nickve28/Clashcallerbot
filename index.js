var config = require('config'),
    RtmClient = require('slack-client').RtmClient,
    clashcaller = require('./clashcaller')
    messageMap = require('./message-map'),
    donations = require('./donationstats'),
    token = config.get('token')

var rtm = new RtmClient(token, {logLevel: 'DEBUG'})
rtm.start()

rtm.on('message', (message) => {
  if(!message.text) return; //workaround for 'raw message returning from bot?'

  var txt = message.text.toLowerCase()
  if (txt.match(/start a \d+ man war/)) {
    rtm.sendMessage('I\'m on it!', message.channel)
    clashcaller.initWar(message, function (err, result) {
      if (err) return rtm.sendMessage('Oh no! Something went horribly wrong!', message.channel)

      rtm.sendMessage(`I created the war! It can be found here: ${result}`, message.channel)
    })
  } else if (txt.indexOf('save the following link:') > -1) {
    rtm.sendMessage('Sure, I\'ll hold on to that link!', message.channel)
    clashcaller.saveUrl(txt)
  } else if (txt.indexOf('give me the war link') > -1) {
    rtm.sendMessage(`The current war link is ${clashcaller.getUrl()}`, message.channel)
  } else if (txt.match(/give me the top (\d+) donation ratio/)) {
    var num = txt.match(/\d+/)[0]
    rtm.sendMessage('DEBUG: DONATION RESULTS CALLED', message.channel)
    rtm.sendMessage(`registered value ${num} regex`, message.channel)
    donations.getDonations({limit: num, order: 'desc'}, (err, res) => {
      if (err) {
        rtm.sendMessage(`Oh no chief! I got an error: ${err}`, message.channel)
      } else {
        res.forEach((player) => {
          rtm.sendMessage(player, message.channel)
        })
      }
    })
  } else if (txt.indexOf('fgt') > -1) {
    rtm.sendMessage('bruh', message.channel)
  } else if (txt.indexOf('dizzy') > -1) {
    rtm.sendMessage('That\'s me! best playa in the world!', message.channel)
  } else {
    //direct message mapping
    if (messageMap[txt]) rtm.sendMessage(messageMap[txt], message.channel)
  }
});
