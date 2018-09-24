# Bliends server

## Index

### Error response

### `/sign`

- `POST /sign`
- `GET /sign`

### `/users`

- `POST /users`
- `GET /users`
- `GET /users/{user_id}`
- `PATCH /users/{user_id}`
- `DELETE /users/{user_id}`

### `/groups`

- `GET /groups`
- `GET /groups/{group_id}`

### `/labels`

- `POST /labels`
- `GET /labels`
- `GET /labels/{label_id}`
- `PATCH /labels/{label_id}`
- `DELETE /labels/{label_id}`

### `/activitylogs`

- `POST /activitylogs`
- `GET /activitylogs`
- `GET /activitylogs/{activitylog_id}`
- `DELETE /activitylogs/{activitylog_id}`

### `/helps`

- `POST /helps`
- `GET /helps`
- `GET /helps/{help_id}`
- `DELETE /helps/{help_id}`
- Attached file path

### `/dashboard`

- `GET /dashboard/by-label`
- `GET /dashboard/by-date`

# Error response

모든 PATH 에서 발생하는 에러 Body 는 동일한 형식을 갖춥니다.  
HTTP Status code 는 **각 상황에 따라 다르게 전달**됩니다.

### Response body

```js
{
  "message": "Error message"
}
```

# `/sign`

## `POST /sign`

> 로그인 시에 사용합니다

### Request

```http
request body
    userid: string
    password: string
```

### Response

> 권한이 필요한 접근 시 사용됩니다.

Expectable status code: **200**, **403**

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6I..."
}
```

## `GET /sign`

> 토큰 신원 확인 시에 사용합니다.

### Request

```http
request headers
    Authorization: string(token)
```

### Response

Expectable status code: **200**, **401**(Unauthorized)

```js
{
  "id": 1,
  "userid": "TestUser1",
  "name": "홍길동",
  "type": "P",
  "phone": "01012341234",
  "createdAt": "2018-07-22T10:58:05.209Z",
  "updatedAt": "2018-07-22T10:58:05.209Z"
}
```

# `/users`

## `POST /users`

> 사용자 회원가입 시에 사용합니다.

### Request

```http
request body
    userid: string(대소문자, 숫자 6~20자)
    password: string(대소문자, 숫자 필수, 기호 선택)
    name: string(20자 이내 공백 불가)
    type: string('P' or 'C') P: 환자, C: 보호자
    phone: string('-' 를 제외한 번호 9~11자)
```

- `type`이 `P` 일 때: `phone`은 `type`이 `P`인 사용자와 중복될 수 없습니다.
- `type`이 `C` 일 때: `type`이 `P`인 사용자의 `phone`을 기입합니다.

### Response

> 성공시 가입 완료된 사용자 정보를 응답합니다.

Expectable status code: **200**, **400**, **409**(Conflict)

#### `type`이 `P` 일 때
```js
{
  "id": 1,
  "userid": "TestUser2",
  "name": "홍길동",
  "type": "P",
  "phone": "01012341234",
  "createdAt": "2018-07-22T11:32:14.785Z",
  "updatedAt": "2018-07-22T11:32:14.785Z"
}
```

#### `type`이 `C` 일 때
```js
{
  "id": 1,
  "userid": "TestUser1",
  "name": "김범수",
  "type": "C",
  "phone": "01012341234",
  "createdAt": "2018-07-29T04:10:35.098Z",
  "updatedAt": "2018-07-29T04:10:35.098Z"
}
```

* 환자와 보호자가 매칭되면 `group`이 생성되고, `label`이나 `activitylog`에 `group_id`컬럼으로 관리됩니다.

## `GET /users`

> 사용자 리스트 조회시 사용합니다.

### Request

```http
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
    q?: string(JSON)검색 쿼리
```

#### 검색 쿼리 작성법

- 조건이 한개일 시:

```js
{
  "userid": "TestUser1"
}
```

- 조건 AND 일 시:

```js
{
  "$and": [
    { "userid": "TestUser1" },
    { "type": "P" }
  ]
}
```

- 조건 OR 일 시:

```js
{
  "$or": [
    { "userid": "TestUser1" },
    { "type": "P" }
  ]
}
```

### Response

Expectable status code: **200**, **400**

```js
[
  {
    "id": 1,
    "userid": "TestUser2",
    "name": "홍길동",
    "type": "C",
    "phone": "01012341234", // 보호자일 때는 환자 전화번호
    "createdAt": "2018-07-22T11:32:14.785Z",
    "updatedAt": "2018-07-22T11:32:14.785Z"
  }
]
```

## `GET /users/{user_id}`

> 사용자 단일 조회시 사용합니다.

### Request

```http
request params
    user_id: number(PK)
```

### Response

Expectable status code: **200**, **400**, **404**

```js
{
  "id": 1,
  "userid": "TestUser2",
  "name": "홍길동",
  "type": "C",
  "phone": "01012341234", // 보호자일 때는 환자 전화번호
  "createdAt": "2018-07-22T11:32:14.785Z",
  "updatedAt": "2018-07-22T11:32:14.785Z"
}
```

## `PATCH /users/{user_id}`

> 사용자 정보 수정시 사용합니다. (본인만 수정가능)

### Request

```http
request headers
    Authorization: string(token)
request params
    user_id: number(PK)
request body
    password?: string(대소문자, 숫자 필수, 기호 선택)
    name?: string(20자 이내 공백 불가)
    type?: string('P' or 'C') P: 환자, C: 보호자
    phone?: string('-' 를 제외한 번호 9~11자)
```

### Response

> 수정 된 정보를 응답합니다.

Expectable status code: **200**, **400**, **401**(Unauthorized), **403**, **404**

```js
{
  "id": 1,
  "userid": "TestUser2",
  "name": "홍길동",
  "type": "C",
  "phone": "01012341234", // 보호자일 때는 환자 전화번호
  "createdAt": "2018-07-22T11:32:14.785Z",
  "updatedAt": "2018-07-22T11:32:14.785Z"
}
```

## `DELETE /users/{user_id}`

> 회원탈퇴시 사용합니다. (본인만 삭제가능)

### Request

```http
request headers
    Authorization: string(token)
request params
    user_id: number(PK)
```

### Response

> 사용자를 삭제합니다. 재 접근할 수 없습니다.

Expectable status code: **204**, **400**, **401**(Unauthorized), **403**, **404**

```
No Contents
```

# `/groups`

* Group은 환자(patient)와 보호자(caregiver)가 매칭되면 **자동으로 생성**됩니다.

## `GET /groups`

> 그룹 리스트 조회 시 사용합니다.

### request

```http
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
    q?: string(JSON)검색 쿼리
```

#### 검색 쿼리 작성법

- 조건이 한개일 시:

```js
{
  "patient_id": 1
}
```

- 조건 AND 일 시:

```js
{
  "$and": [
    { "patient_id": 1 },
    { "caregiver_id": 5 }
  ]
}
```

- 조건 OR 일 시:

```js
{
  "$or": [
    { "patient_id": 1 },
    { "caregiver_id": 5 }
  ]
}
```

### response

> 그룹 리스트를 응답합니다.

Expectable status code: **200**, **400**

```js
[
  {
    "id": 1,
    "created_at": "2018-09-16T05:23:02.000Z",
    "updated_at": "2018-09-16T05:23:02.000Z",
    "patient_id": 1,
    "caregiver_id": 2,
    "patient": {
      "id": 1,
      "userid": "testid1",
      "name": "테스트1",
      "type": "P",
      "phone": "01012345678",
      "created_at": "2018-09-16T05:22:54.000Z",
      "updated_at": "2018-09-16T05:22:54.000Z"
    },
    "caregiver": {
      "id": 2,
      "userid": "testid2",
      "name": "테스트2",
      "type": "C",
      "phone": "01012345678",
      "created_at": "2018-09-16T05:23:02.000Z",
      "updated_at": "2018-09-16T05:23:02.000Z"
    }
  }
]
```

## `GET /groups/{group_id}`

### request

```http
request headers
    Authorization: string(token)
request params
    group_id: number(PK)
```

### response

Expectable status code: **200**, **400**, **401**, **403**, **404**

```js
{
  "id": 1,
  "created_at": "2018-09-16T05:23:02.000Z",
  "updated_at": "2018-09-16T05:23:02.000Z",
  "patient_id": 1,
  "caregiver_id": 2,
  "patient": {
    "id": 1,
    "userid": "testid1",
    "name": "테스트1",
    "type": "P",
    "phone": "01012345678",
    "created_at": "2018-09-16T05:22:54.000Z",
    "updated_at": "2018-09-16T05:22:54.000Z"
  },
  "caregiver": {
    "id": 2,
    "userid": "testid2",
    "name": "테스트2",
    "type": "C",
    "phone": "01012345678",
    "created_at": "2018-09-16T05:23:02.000Z",
    "updated_at": "2018-09-16T05:23:02.000Z"
  }
}
```

# `/labels`

## `POST /labels`

> 라벨 생성 시에 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request body
    name: string
    latitude: number(float)
    longitude: number(float)
    importance: number([1|2|3], 높을수록 중요)
```

### response

> 생성된 라벨 정보를 응답합니다.

Expectable status code: **201**, **400**, **401**(Unauthorized), **403**, **404**

```js
{
  "id": 2,
  "name": "집",
  "latitude": 186.44002,
  "longitude": 32.5005321,
  "importance": 3,
  "updated_at": "2018-09-16T08:21:55.236Z",
  "created_at": "2018-09-16T08:21:55.210Z",
  "group_id": 1
}
```

## `GET /labels`

> 라벨 리스트 조회 시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
    q?: string(JSON)검색 쿼리
```

#### 검색 쿼리 작성법

- 조건이 한개일 시:

```js
{
  "name": "집"
}
```

- 조건 AND 일 시:

```js
{
  "$and": [
    { "name": "집" },
    { "group_id": 5 }
  ]
}
```

- 조건 OR 일 시:

```js
{
  "$or": [
    { "name": "집" },
    { "group_id": 12 }
  ]
}
```

### response

Expectable status code: **200**, **400**

```js
[
  {
    "id": 2,
    "name": "집",
    "latitude": 186.44,
    "longitude": 32.5005,
    "importance": 3,
    "created_at": "2018-09-16T08:21:55.000Z",
    "updated_at": "2018-09-16T08:21:55.000Z",
    "group_id": 1
  }
]
```

## `GET /labels/{label_id}`

> 라벨 조회 시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    label_id: number(PK)
```

### response

Expectable status code: **200**, **400**, **401**, **403**, **404**

```js
{
  "id": 1,
  "name": "흠",
  "latitude": 186.44002,
  "longitude": 32.5005321,
  "importance": 3,
  "created_at": "2018-09-16T05:26:50.000Z",
  "updated_at": "2018-09-16T10:03:03.592Z",
  "group_id": 1
}
```

## `PATCH /labels/{label_id}`

> 라벨 정보를 수정합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    label_id: number(PK)
request body
    name?: string
    latitude?: number(float)
    longitude?: number(float)
    importance?: number([1|2|3], 높을수록 중요)
```

### Response

> 수정 된 정보를 응답합니다.

Expectable status code: **200**, **400**, **401**(Unauthorized), **403**, **404**

```js
{
  "id": 1,
  "name": "흠",
  "latitude": 186.44002,
  "longitude": 32.5005321,
  "importance": 3,
  "created_at": "2018-09-16T05:26:50.000Z",
  "updated_at": "2018-09-16T10:03:03.592Z",
  "group_id": 1
}
```

## `DELETE /labels/{label_id}`

> 라벨을 삭제합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    label_id: number(PK)
```

### response

> 라벨을 삭제합니다. 재 접근할 수 없습니다.

Expectable status code: **204**, **400**, **401**(Unauthorized), **403**, **404**

```
No Contents
```

# `/activitylogs`

## `POST /activitylogs`

> 활동 로그를 새로 추가합니다.

### request

```http
request headers
    Authorization: string(token)
request body
    label: number(PK) // 라벨ID. 없으면 0
    latitude: number(float)
    longitude: number(float)
    payments: number(int) // 결제액. 없으면 0
```

### response

> 생성된 활동 로그를 응답합니다.

Expectable status code: **201**, **400**, **401**(Unauthorized), **403**, **404**

```js
{
  "id": 6,
  "latitude": 170.3,
  "longitude": 32.5005,
  "payments": 1000,
  "created_at": "2018-09-16T10:22:48.000Z",
  "updated_at": "2018-09-16T10:22:48.000Z",
  "group_id": 1,
  "label_id": 2, // 라벨 미지정(0)일 시 null
  "label": {     // 라벨 미지정(0)일 시 null
    "id": 2,
    "name": "흠",
    "latitude": 186.44,
    "longitude": 32.5005,
    "importance": 3,
    "created_at": "2018-09-16T08:21:55.000Z",
    "updated_at": "2018-09-16T08:21:55.000Z",
    "group_id": 1
  }
}
```

## `GET /activitylogs`

> 활동로그 리스트 조회 시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
    q?: string(JSON)검색 쿼리
```

#### 검색 쿼리 작성법

- 조건이 한개일 시:

```js
{
  "label_id": 12
}
```

- 조건 AND 일 시:

```js
{
  "$and": [
    { "label_id": 12 },
    { "group_id": 5 }
  ]
}
```

- 조건 OR 일 시:

```js
{
  "$or": [
    { "label_id": 12 },
    { "group_id": 19 }
  ]
}
```

### response

Expectable status code: **200**, **400**

```js
[
  {
    "id": 6,
    "latitude": 170.3,
    "longitude": 32.5005,
    "payments": 1000,
    "created_at": "2018-09-16T10:22:48.000Z",
    "updated_at": "2018-09-16T10:22:48.000Z",
    "group_id": 1,
    "label_id": 2, // 라벨 미지정(0)일 시 null
    "label": {     // 라벨 미지정(0)일 시 null
      "id": 2,
      "name": "흠",
      "latitude": 186.44,
      "longitude": 32.5005,
      "importance": 3,
      "created_at": "2018-09-16T08:21:55.000Z",
      "updated_at": "2018-09-16T08:21:55.000Z",
      "group_id": 1
    }
  }
]
```

## `GET /activitylogs/{activitylog_id}`

> 활동로그 조회시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    activitylog_id: number(PK)
```

### response

Expectable status code: **200**, **400**, **401**, **403**, **404**

```js
{
  "id": 1,
  "latitude": 186.44,
  "longitude": 32.5005,
  "payments": 1000,
  "created_at": "2018-09-16T05:30:23.000Z",
  "updated_at": "2018-09-16T05:30:23.000Z",
  "group_id": 1,
  "label_id": 1, // 라벨 미지정(0)일 시 null
  "label": {     // 라벨 미지정(0)일 시 null
    "id": 1,
    "name": "흠",
    "latitude": 186.44,
    "longitude": 32.5005,
    "importance": 3,
    "created_at": "2018-09-16T05:26:50.000Z",
    "updated_at": "2018-09-16T10:03:03.000Z",
    "group_id": 1
  }
}
```

## `DELETE /activitylogs/{activitylog_id}`

> 활동로그 삭제시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    activitylog_id: number(PK)
```

### response

Expectable status code: **204**, **400**, **401**, **403**, **404**

```
No Contents
```

# `/helps`

## `POST /helps`

> 도움요청을 생성(?) 할 시에 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request body (multipart)
    latitude: number(float)
    longitude: number(float)
    situation: string(E,M,L)  // Emergency, Money, Lost
    attachments?: file(image or audio file)
```

### response

Expectable status code: **201**, **400**, **401**, **403**, **404**

> `attachments` 가 null이면 `filename` 필드도 null로 지정됩니다. (M의 경우)

```js
{
  "id": 2,
  "latitude": 123.345,
  "longitude": 94.4001,
  "situation": "M",
  "filename": null,
  "created_at": "2018-09-22T19:03:07.000Z",
  "updated_at": "2018-09-22T19:03:07.000Z",
  "group_id": 1
}
```

## `GET /helps`

> 도움요청 리스트 조회 시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
    q?: string(JSON)검색 쿼리
```

#### 검색 쿼리 작성법

- 조건이 한개일 시:

```js
{
  "group_id": 12
}
```

- 조건 AND 일 시:

```js
{
  "$and": [
    { "situation": "E" },
    { "group_id": 5 }
  ]
}
```

- 조건 OR 일 시:

```js
{
  "$or": [
    { "situation": "M" },
    { "group_id": 19 }
  ]
}
```

### response

Expectable status code: **200**, **400**

```js
[
  {
    "id": 3,
    "latitude": 123.345,
    "longitude": 94.4001,
    "situation": "R",
    "filename": "12e60f1f-c9cf-4699-8272-157242eecd1f_test-record.mp3",
    "created_at": "2018-09-22T19:05:02.000Z",
    "updated_at": "2018-09-22T19:05:02.000Z",
    "group_id": 1
  }
]
```

## `GET /helps/{help_id}`

> 도움요청 조회시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    help_id: number(PK)
```

### response

Expectable status code: **200**, **400**, **401**, **403**, **404**

```js
{
  "id": 2,
  "latitude": 123.345,
  "longitude": 94.4001,
  "situation": "L",
  "filename": "4b6e194a-1a88-4fdc-972d-ce57c4590dbd_test-image.jpeg",
  "created_at": "2018-09-22T19:03:07.000Z",
  "updated_at": "2018-09-22T19:03:07.000Z",
  "group_id": 1
}
```

## `DELETE /helps/{help_id}`

> 도움요청 삭제시 사용합니다.

### request

```http
request headers
    Authorization: string(token)
request params
    help_id: number(PK)
```

### response

Expectable status code: **204**, **400**, **401**, **403**, **404**

```
No Contents
```

## Attached file path

```
http://{hostname}/uploads/helps/{filename}
```

### Example

```
http://norr.uy.to:5000/uploads/helps/4b6e194a-1a88-4fdc-972d-ce57c4590dbd_test-image.jpeg
```

# `/dashboard`

## `GET /dashboard/by-label`

> 라벨별로 활동로그 기록수의 통계를 내어줍니다.

### request

```http
request headers
    Authorization: string(token)
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
```

### response

> 인식횟수가 많은 순대로 정렬되어 응답합니다.

```js
[
  { // '홈' 라벨을 총 10번 인식함
    "count": 10,
    "label_id": 1,
    "label": {
      "id": 1,
      "name": "흠",
      "latitude": 186.44,
      "longitude": 32.5005,
      "importance": 3,
      "created_at": "2018-09-16T05:26:50.000Z",
      "updated_at": "2018-09-16T10:03:03.000Z",
      "group_id": 1
    }
  },
  { // '학교' 라벨을 총 6번 인식함
    "count": 6,
    "label_id": 2,
    "label": {
      "id": 2,
      "name": "학교",
      "latitude": 187.9932,
      "longitude": 32.0011,
      "importance": 3,
      "created_at": "2018-09-16T08:21:55.000Z",
      "updated_at": "2018-09-16T08:21:55.000Z",
      "group_id": 1
    }
  }
]
```

## `GET /dashboard/by-date`

> 날짜별로 활동로그 기록수의 통계를 내어줍니다.

```

### request

```http
request headers
    Authorization: string(token)
request query
    limit?: number(가져올 자원 개수)
    offset?: number(건너 뛸 자원 개수)
```

### response

> 최신순으로 정렬되어 응답합니다.

```js
[
  { // 9월 22일 총 7번 인식함
    "month": 9,
    "date": 22,
    "count": 7
  },
  { // 9월 17일 총 3번 인식함
    "month": 9,
    "date": 17,
    "count": 3
  },
  { // 9월 16일 총 4번 인식함
    "month": 9,
    "date": 16,
    "count": 4
  }
]
```
