exports.CL_USER = [
  {
    property: 'userid',
    reg: /^(?=.*)[a-zA-Z0-9]{6,20}$/,
    message: 'ID는 6자이상, 영문자, 숫자(선택)로 이루어져야 합니다.'
  },
  {
    property: 'password',
    reg: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    message: '8자 이상의 영문, 숫자로 이루어진 암호를 기입해주세요.'
  },
  {
    property: 'name',
    reg: /^(?=.*)[^\s]{1,20}$/,
    message: '20자 이내의 이름을 공백 없이 기입해주세요.'
  },
  {
    property: 'type',
    reg: /^(patient|caregiver)$/,
    message: '계정 타입을 선택해주세요.'
  },
  {
    property: 'phone',
    reg: /^(?=.*)[0-9]{9,11}$/,
    message: '올바른 전화번호를 기입해주세요.'
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
