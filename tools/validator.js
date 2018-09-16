exports.CL_USER = [
  {
    property: 'userid',
    reg: /^(?=.*)[a-zA-Z0-9]{6,20}$/,
    message: 'ID는 6자이상, 영문자, 숫자(선택)로 이루어져야 합니다. (userid)'
  },
  {
    property: 'password',
    reg: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    message: '8 ~ 20자의 영문, 숫자로 이루어진 암호를 기입해주세요. (password)'
  },
  {
    property: 'name',
    reg: /^(?=.*)[^\s]{1,20}$/,
    message: '20자 이내의 이름을 공백 없이 기입해주세요. (name)'
  },
  {
    property: 'type',
    reg: /^(P|C)$/,
    message: '계정 타입을 선택해주세요. (type)'
  },
  {
    property: 'phone',
    reg: /^(?=.*)[0-9]{9,11}$/,
    message: '올바른 전화번호를 기입해주세요. (phone)'
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

exports.CL_LABEL = [
  {
    property: 'name',
    reg: /^.{1,20}$/,
    message: '20자 이내의 라벨 이름을 기입해주세요. (name)'
  },
  {
    property: 'latitude',
    reg: /^\d+\.\d+$/,
    message: "올바른 위도(latitude) 형식 (0.0)이 아닙니다. (latitude)"
  },
  {
    property: 'longitude',
    reg: /^\d+\.\d+$/,
    message: "올바른 경도(longitude) 형식 (0.0)이 아닙니다. (longitude)"
  },
  {
    property: 'importance',
    reg: /^(1|2|3)$/,
    message: "올바른 중요도 형식(1,2,3)이 아닙니다. (importance)"
  }
]

exports.CL_ACTIVITYLOG = [
  {
    property: 'label',
    reg: /^\d+$/,
    message: "올바른 라벨ID 형식이 아닙니다. (label)"
  },
  {
    property: 'latitude',
    reg: /^\d+\.\d+$/,
    message: "올바른 위도(latitude) 형식 (0.0)이 아닙니다. (latitude)"
  },
  {
    property: 'longitude',
    reg: /^\d+\.\d+$/,
    message: "올바른 경도(longitude) 형식 (0.0)이 아닙니다. (longitude)"
  },
  {
    property: 'payments',
    reg: /^\d+$/,
    message: "올바른 금액 형식이 아닙니다. (payments)"
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
