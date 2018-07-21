exports.CL_USER = [
  {
    property: 'username',
    reg: /^(?=.*).{2,20}$/,
    message: '올바른 사용자명을 기입해주세요.'
  },
  {
    property: 'password',
    reg: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    message: '8자 이상의 영문, 숫자로 이루어진 암호를 입력해주세요'
  }
]

exports.CL_PAGINATION = [
  {
    property: 'limit',
    reg: /^\d+$/,
    message: "Cannot find property 'limit' in request params"
  },
  {
    property: 'offset',
    reg: /^\d+$/,
    message: "Cannot find property 'offset' in request params"
  }
]

exports.checkProperty = (checkList, data, strict) => new Promise((resolve, reject) => {
  const result = {}
  Array.from(checkList).forEach(item => {
    if (data[item.property] && item.reg.exec(data[item.property])) {
      result[item.property] = data[item.property]
    } else if (strict || data[item.property]) {
      const err = new Error(item.message)
      err.code = 400
      reject(err)
    }
  })
  return resolve(result)
})
