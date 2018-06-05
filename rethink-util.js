const rethink = require("rethinkdb")

const config = {
  port: 28015,
  host: "localhost"
}


function connect() {
  return new Promise((resolve, reject) => {
    rethink.connect(config, function(err, conn) {
      if (err)
        return reject(err)

      resolve(conn);
    })
  })
}




module.exports = {
  connect
}
