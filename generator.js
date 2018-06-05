const randomInt = require("random-int")
const rethinkLog = require("./log")

if (process.argv.length !== 4) {
  console.log('Usage: node generator <nb> <sleep-between-add>')
  process.exit(1)
}

function genLevel() {
  const availLevels = ["info", "debug", "error"]

  return availLevels[randomInt(0, availLevels.length-1)]
}

function genMsg() {
  const avail = [
    "coucou world",
    "segmentation fault",
    "Returns an integer from 0 to max.",
    "npm Orgs is powerful collaboration - for free",
    "GitLab is open core, GitHub is closed source",
  ]

  return avail[randomInt(0, avail.length-1)]
}


function sleep(nbSeconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, nbSeconds * 1000) // in ms
  })
}

async function gen(level) {
  const nb = parseInt(process.argv[2])
  const nbSecondsSleep = parseFloat(process.argv[3])

  console.log(`nb to gen = ${nb}, sleep = ${nbSecondsSleep}`)

  if (nb <= 0) {
    console.log("nothing to generate..")
  } else {
    for (let i = 1; i <= nb; ++i) {

      if (nbSecondsSleep === 0) {
        rethinkLog.pushData({
          level: genLevel(),
          msg: genMsg()
        }).then(() => {

        }).catch((err) => {
          console.error(err)
        })
      } else {
        await pushData({
          level: genLevel(),
          msg: genMsg()
        })

        await sleep(nbSecondsSleep)
      }
    }
  }
}

gen(process.argv[2]).then(() => {
  console.log("generator finished")
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
