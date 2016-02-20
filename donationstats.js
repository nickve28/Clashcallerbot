var request = require('request')


function getDonations(query, cb) {
  var options = {
    url: 'http://www.devnix.nl:8001/index',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  request(options, (err, res, body) => {
    if (err) return cb(err, null);

    limit = query.limit
    if (limit > 5) limit = 5

    var result = JSON.parse(body)
    if (query.order === 'asc') {
      result = result.reverse()
    }
    result = result.slice(0, limit)
    console.log(result)
    result = result.map((player) => {
      return `Player ${player.name}: Donated: ${player.donations}, Received: ${player.donationsReceived}, Ratio: ${player.donationRatio}`
    })
    console.log(result)
    return cb(null, result)
  })
}

module.exports = {
  getDonations: getDonations
}
