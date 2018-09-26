const FCM = require('fcm-node')
const { serverKey } = require('../config/const-fcm')

const situationSet = {
  E: {
    title: '[Bliends] 도움 요청',
    content: '지금 사용자가 도움을 필요로 합니다. 도와주세요!'
  },
  M: {
    title: '[Bliends] 도움 요청',
    content: '사용자의 금전이 부족합니다. 어서 확인하세요!'
  },
  L: {
    title: '[Bliends] 도움 요청',
    content: '사용자가 길을 잃어버렸습니다. 어서 확인하세요!'
  }
}

const fcm = new FCM(serverKey)

exports.sendHelpFCM = (caregiverId, situation) => new Promise((resolve, reject) => {

  const message = {
    to: `/topics/${caregiverId}`,
    collapse_key: 'AbCdEfGhIjKlMnOpQrStUvWxYz',
    notification: {
      title: situationSet[situation].title,
      body: situationSet[situation].content
    },
    data: {
      title: situationSet[situation].title,
      message: situationSet[situation].content
    }
  }

  fcm.send(message, (err, res) => {
    if (err) return reject(err)
    return resolve(res)
  })

})
