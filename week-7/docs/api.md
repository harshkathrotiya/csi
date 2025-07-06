# User Authentication and Profile API Documentation

This documentation provides details about the available API endpoints for user authentication and profile management.

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Sign Up

Create a new user account.

- **URL**: `/users/signup`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string" (optional),
  "lastName": "string" (optional),
  "bio": "string" (optional)
}
```

**Success Response**:
- **Code**: `201`
```json
{
  "status": "success",
  "token": "jwt_token",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string",
      "bio": "string",
      "avatar": "string",
      "createdAt": "date",
      "lastLogin": "date"
    }
  }
}
```

### Login

Authenticate existing user.

- **URL**: `/users/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response**:
- **Code**: `200`
```json
{
  "status": "success",
  "token": "jwt_token",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string",
      "bio": "string",
      "avatar": "string",
      "createdAt": "date",
      "lastLogin": "date"
    }
  }
}
```

## Profile Management

### Get Profile

Retrieve the current user's profile.

- **URL**: `/users/profile`
- **Method**: `GET`
- **Authentication**: Required (JWT Token in Authorization header)

**Success Response**:
- **Code**: `200`
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string",
      "bio": "string",
      "avatar": "string",
      "createdAt": "date",
      "lastLogin": "date"
    }
  }
}
```

### Update Profile

Update the current user's profile information.

- **URL**: `/users/profile`
- **Method**: `PATCH`
- **Authentication**: Required (JWT Token in Authorization header)
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "username": "string" (optional),
  "email": "string" (optional),
  "firstName": "string" (optional),
  "lastName": "string" (optional),
  "bio": "string" (optional)
}
```

**Success Response**:
- **Code**: `200`
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string",
      "bio": "string",
      "avatar": "string",
      "createdAt": "date",
      "lastLogin": "date"
    }
  }
}
```

### Upload Avatar

Upload or update user's profile picture.

- **URL**: `/users/profile/avatar`
- **Method**: `POST`
- **Authentication**: Required (JWT Token in Authorization header)
- **Content-Type**: `multipart/form-data`

**Request Body**:
- Form field: `avatar` (file)
- Supported formats: jpg, jpeg, png
- Max file size: 1MB

**Success Response**:
- **Code**: `200`
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "role": "string"
    }
  }
}
```

## Admin Routes

### Get All Users

Retrieve a list of all users (Admin only).

- **URL**: `/users/users`
- **Method**: `GET`
- **Authentication**: Required (JWT Token in Authorization header)
- **Authorization**: Admin role required

**Success Response**:
- **Code**: `200`
```json
{
  "status": "success",
  "results": "number",
  "data": {
    "users": [
      {
        "_id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "firstName": "string",
        "lastName": "string",
        "bio": "string",
        "avatar": "string",
        "createdAt": "date",
        "lastLogin": "date"
      }
    ]
  }
}
```

### Delete User

Delete a user account (Admin only).

- **URL**: `/users/users/:id`
- **Method**: `DELETE`
- **Authentication**: Required (JWT Token in Authorization header)
- **Authorization**: Admin role required

**Success Response**:
- **Code**: `204`
```json
{
  "status": "success",
  "data": null
}
```

## Error Responses

**Bad Request**:
- **Code**: `400`
```json
{
  "status": "fail",
  "message": "Error message"
}
```

**Unauthorized**:
- **Code**: `401`
```json
{
  "status": "fail",
  "message": "Unauthorized"
}
```

**Forbidden**:
- **Code**: `403`
```json
{
  "status": "fail",
  "message": "Forbidden"
}
```

**Not Found**:
- **Code**: `404`
```json
{
  "status": "fail",
  "message": "Resource not found"
}
```

**Server Error**:
- **Code**: `500`
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```