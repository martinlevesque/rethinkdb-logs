
const { exec } = require('child_process')

function pushData(obj) {
  return new Promise((resolve, reject) => {
    exec(`node adder ${obj.level} "${obj.msg}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('errr')
        console.error(err)
        return reject(err)
      }

      resolve()
    });
  })
}

module.exports = {
  pushData
}
