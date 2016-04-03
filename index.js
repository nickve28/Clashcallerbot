var config = require('config'),
    RtmClient = require('slack-client').RtmClient,
    clashcaller = require('./clashcaller')
    messageMap = require('./message-map'),
    donations = require('./donationstats'),
    banlist = require('./war-penalties.js'),
    royale = require('./clashroyale.js')
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
    donations.getDonations({limit: num, order: 'desc'}, (err, res) => {
      if (err) {
        rtm.sendMessage(`Oh no chief! I got an error: ${err}`, message.channel)
      } else {
        rtm.sendMessage(res.join('\n'), message.channel)
      }
    })
  } else if (txt.indexOf('fgt') > -1) {
    rtm.sendMessage('bruh', message.channel)
  } else if (txt.indexOf('dizzy') > -1) {
    rtm.sendMessage('That\'s me! best playa in the world!', message.channel)
  } else if (txt === '!banlist') {
    banlist.getPenalties( (err, players) => {
      if (err) {
        rtm.sendMessage(`Oh no chief! I've got an error: ${err}`, message.channel);
        return;
      }
      var playersOverview = players.map( (player) => {
        return `Player ${player.name} has been banned until ${player.until} for reason: ${player.reason}`
      })
      rtm.sendMessage(`War banlist:\n ${playersOverview.join('\n')}`, message.channel)
    })
  } else if (txt.indexOf('save the following tournament:') > -1)  {
    royale.saveUrl(txt);
    rtm.sendMessage('Saved the tournament!', message.channel)
  } else if (txt.indexOf('get the current tournament') > -1) {
    var tournamentUrl = royale.getUrl()
    rtm.sendMessage(`The current tournament can be found at ${tournamentUrl}`, message.channel)
  } else if (txt.match(/^!ban/)) {
    //just a draft for now
    var split = txt.split(';')
    if (split.length < 4) return;

    var player = split[1].trim()
    var reason = split[2].trim()
    var until = split[3].trim().toUpperCase()
    var payload = {player: player, reason: reason, until: until}
    banlist.ban(payload)
    rtm.sendMessage(`Banned ${player}, for reason: ${reason}`, message.channel)
  } else {
    //direct message mapping
    if (messageMap[txt]) rtm.sendMessage(messageMap[txt], message.channel)
  }
});
