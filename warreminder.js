var cron = require('cron').CronJob
var cronTimes = ["0 0 21 * 5", "0 0 21 * 1"]

var startReminders = (rtm) => {
  cronTimes.forEach( (cronTime) => {
    new cron({cronTime: cronTime, onTick: () => { remindMe(rtm) }, start: true});
  })
}

var remindMe = (rtm) => {
  rtm.sendMessage('Have you guys started a war yet?', 'C0M8CP4JZ');
}
module.exports = startReminders

