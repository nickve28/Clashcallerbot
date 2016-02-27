var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/banned_players.sqlite3');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS players (name TEXT, reason TEXT, until date TEXT)')
  db.run('CREATE TABLE IF NOT EXISTS authorizations (playerId TEXT)')
})

var getPenalties = (callback) => {
  var data = []
  db.all("SELECT * FROM players", function(err, rows) {
    rows.forEach(function (row) {
      console.log(row.name + ": " + row.reason + ", " + row.until);
      data.push({name: row.name, reason: row.reason, until: row.until});
    })
    return callback(null, data)
  })
}

var ban = (data) => {
  var stmt = db.prepare('INSERT INTO players (name, reason, until) VALUES (?, ?, ?)')
  stmt.run(data.player, data.reason, data.until)
  stmt.finalize()
}

module.exports = {
  getPenalties: getPenalties,
  ban: ban
}
