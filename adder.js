const r = require("rethinkdb")
const rethinkUtil = require("./rethink-util")

const dbName = "rethink_logs_dev"
const tableName = "log_entries"

if (process.argv.length !== 4) {
  console.log('Usage: node adder <level> <msg>')
  process.exit(1)
}

async function add(level, msg) {
  const conn = await rethinkUtil.connect()

  await r.db(dbName)
    .table(tableName)
    .insert([ {
      level,
      msg,
      created_at: new Date()
    }])
    .run(conn, (err, result) => {
      if (err)
        throw err;

      console.log(JSON.stringify(result, null, 2));
    })
}

add(process.argv[2], process.argv[3]).then(() => {
  console.log("entry added.")
  process.exit()
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
