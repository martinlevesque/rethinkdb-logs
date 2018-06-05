const r = require("rethinkdb")
const rethinkUtil = require("./rethink-util")
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const rethinkLog = require("./log")

const dbName = "rethink_logs_dev"
const tableName = "log_entries"

if (process.argv.length !== 3) {
  console.log('Usage: node listener <level>')
  process.exit(1)
}

function stringifyRow(row) {
  if (row.new_val) {
    return `[+] id=${row.new_val.id} - T=${row.new_val.created_at} - [${row.new_val.level}] - ${row.new_val.msg}`
  }
}

async function listen(level) {
  const conn = await rethinkUtil.connect()

  const filter = level === 'all' ? {} : { level }

  r.db(dbName)
    .table(tableName)
    .filter(filter)
    .changes()
    .run(conn, (err, cursor) => {
      if (err)
        throw err;

      cursor.each(function(err, row) {
        if (err) {
          console.error(err)
        } else {
          console.log(stringifyRow(row))
          io.emit('log-change', stringifyRow(row));
        }
      })
    })
}

//// HTTP serv
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('log-change', function(msg){
    io.emit('log-change', msg);
  });

  socket.on('add-log', function(msg){
    const parts = msg.split("---")

    if (parts.length === 2) {
      rethinkLog.pushData({
        level: parts[0],
        msg: parts[1]
      })
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

//// end http serv

listen(process.argv[2]).then(() => {
  console.log("listener initiated")
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
