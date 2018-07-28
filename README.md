# Bliends server

## Index

### `/sign`

- `POST /sign`
- `GET /sign`

### `/users`

- `POST /users`
- `GET /users`
- `GET /users/{object_id}`
- `PATCH /users/{object_id}`
- `DELETE /users/{object_id}`

# Error response

모든 PATH 에서 발생하는 에러 Body 는 동일한 형식을 갖춥니다.  
HTTP Status code 는 **각 상황에 따라 다르게 전달**됩니다.

### Response body

```json
{
  "success": false,
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

```json
{
  "success": true,
  "message": "SUCCESS",
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

```json
{
  "success": true,
  "message": "SUCCESS",
  "user": {
    "_id": "5b54633d46b11950198048d7",
    "userid": "TestUser1",
    "name": "홍길동",
    "type": "P",
    "phone": "01012341234",
    "createdAt": "2018-07-22T10:58:05.209Z",
    "updatedAt": "2018-07-22T10:58:05.209Z"
  }
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

### Response

> 성공시 가입 완료된 사용자 정보를 응답합니다.

Expectable status code: **200**, **400**, **409**(Conflict)

```json
{
  "success": true,
  "message": "SUCCESS",
  "user": {
    "_id": "5b546b3ec25c875215905acd",
    "userid": "TestUser2",
    "name": "홍길동",
    "type": "C",
    "phone": "01012341234",
    "createdAt": "2018-07-22T11:32:14.785Z",
    "updatedAt": "2018-07-22T11:32:14.785Z"
  }
}
```

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

```json
{
  "userid": "TestUser1"
}
```

- 조건 AND 일 시:

```json
{
  "$and": [
    { "userid": "TestUser1" },
    { "type": "P" }
  ]
}
```

- 조건 OR 일 시:

```json
{
  "$or": [
    { "userid": "TestUser1" },
    { "type": "P" }
  ]
}
```

### Response

Expectable status code: **200**, **400**

```json
{
  "success": true,
  "mssage": "SUCCESS",
  "users": [
    {
      "_id": "5b546b3ec25c875215905acd",
      "userid": "TestUser2",
      "name": "홍길동",
      "type": "C",
      "phone": "01012341234",
      "createdAt": "2018-07-22T11:32:14.785Z",
      "updatedAt": "2018-07-22T11:32:14.785Z"
    }
  ]
}
```

## `GET /users/{object_id}`

> 사용자 단일 조회시 사용합니다.

### Request

```http
request params
    object_id: string(_id)
```

### Response

Expectable status code: **200**, **400**, **404**

```json
{
  "success": true,
  "message": "SUCCESS",
  "user": {
    "_id": "5b54633d46b11950198048d7",
    "userid": "TestUser1",
    "name": "홍길동",
    "type": "P",
    "phone": "01012341234",
    "createdAt": "2018-07-22T10:58:05.209Z",
    "updatedAt": "2018-07-22T10:58:05.209Z"
  }
}
```

## `PATCH /users/{object_id}`

> 사용자 정보 수정시 사용합니다. (본인만 수정가능)

### Request

```http
request headers
    Authorization: string(token)
request params
    object_id: string(_id)
request body
    password?: string(대소문자, 숫자 필수, 기호 선택)
    name?: string(20자 이내 공백 불가)
    type?: string('P' or 'C') P: 환자, C: 보호자
    phone?: string('-' 를 제외한 번호 9~11자)
```

### Response

> 수정 된 정보를 응답합니다.

Expectable status code: **200**, **400**, **401**(Unauthorized), **403**, **404**

```json
{
  "success": true,
  "message": "SUCCESS",
  "user": {
    "_id": "5b54633d46b11950198048d7",
    "userid": "TestUser1",
    "name": "길동이",
    "type": "C",
    "phone": "01012341234",
    "createdAt": "2018-07-22T10:58:05.209Z",
    "updatedAt": "2018-07-22T10:58:05.209Z"
  }
}
```

## `DELETE /users/{object_id}`

> 회원탈퇴시 사용합니다. (본인만 삭제가능)

### Request

```http
request headers
    Authorization: string(token)
request params
    object_id: string(_id)
```

### Response

> 삭제된 사용자 정보를 응답합니다. 재 접근할 수 없습니다.

Expectable status code: **200**, **400**, **401**(Unauthorized), **403**, **404**

```json
{
  "success": true,
  "message": "SUCCESS",
  "user": {
    "_id": "5b54633d46b11950198048d7",
    "userid": "TestUser1",
    "name": "길동이",
    "type": "P",
    "phone": "01012341234",
    "createdAt": "2018-07-22T10:58:05.209Z",
    "updatedAt": "2018-07-22T10:58:05.209Z"
  }
}
```
