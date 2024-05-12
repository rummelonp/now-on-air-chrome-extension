let token = ''
let deviceId = ''
let isTurnedOn = false

chrome.storage.local.get({ token: '', deviceId: '' }, (items) => {
  token = items.token
  deviceId = items.deviceId
  if (!token || !deviceId) {
    chrome.runtime.openOptionsPage()
  }
})

chrome.storage.onChanged.addListener((changes) => {
  console.info('Options changed')
  console.dir(changes)
  if (changes.token) {
    token = changes.token.newValue
  }
  if (changes.deviceId) {
    deviceId = changes.deviceId.newValue
  }
})

function watchTabs() {
  if (!token || !deviceId) {
    return
  }

  chrome.tabs.query({}, (tabs) => {
    const isNowOnAir = tabs.some((tab) => {
      return /meet.google.com/.test(tab.url)
    })

    if (isNowOnAir && !isTurnedOn) {
      console.info('Turn on')
      sendCommand(token, deviceId, 'turnOn')
      isTurnedOn = true
    }

    if (!isNowOnAir && isTurnedOn) {
      console.info('Turn off')
      sendCommand(token, deviceId, 'turnOff')
      isTurnedOn = false
    }
  })
}

function sendCommand(token, deviceId, command) {
  fetch(`https://api.switch-bot.com/v1.0/devices/${deviceId}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      command,
      parameter: 'default',
      commandType: 'command',
    }),
  })
    .then((response) => {
      console.dir(response)
      return response.json()
    })
    .then((data) => console.dir(data))
    .catch((error) => console.error(error))
}

chrome.tabs.onUpdated.addListener(watchTabs)
chrome.tabs.onRemoved.addListener(watchTabs)
