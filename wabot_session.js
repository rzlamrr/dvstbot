const { create, Client } = require('@open-wa/wa-automate')
const start = (dvstbot = new Client()) => {
    console.log('dvstbot')
}

create({
  sessionId: "dvstbot",
  authTimeout: 0,
  restartOnCrash: start,
  cacheEnabled: false,
  headless: true,
  killProcessOnBrowserClose: true,
  throwErrorOnTosBlock: false,
  useChrome: true,
  qrTimeout: 0,
  chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0']
}).then((dvstbot) => start(dvstbot))
