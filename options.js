function saveOptions() {
  const token = document.getElementById('token').value
  const deviceId = document.getElementById('deviceId').value

  chrome.storage.local.set({ token, deviceId }, () => {
    const status = document.getElementById('save')
    save.value = 'Saved'
    setTimeout(() => (status.value = 'Save'), 1000)
  })
}

function restoreOptions() {
  chrome.storage.local.get({ token: '', deviceId: '' }, (items) => {
    document.getElementById('token').value = items.token
    document.getElementById('deviceId').value = items.deviceId
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
