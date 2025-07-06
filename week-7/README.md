# User Authentication and Profile API

A secure and feature-rich REST API implementation with JWT-based authentication and profile management, built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing
- Protected routes
- Enhanced user profile management
  - Profile picture upload
  - Bio and personal information
  - Last login tracking
- Admin user management
- Comprehensive API documentation
- Input validation and sanitization

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

3. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/users/signup`
  - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- `POST /api/users/login`
  - Login user
  - Body: `{ "email": "string", "password": "string" }`

### Protected Routes (Requires Authentication)

- `GET /api/users/profile`
  - Get user profile
  - Headers: `Authorization: Bearer <token>`

- `PATCH /api/users/profile`
  - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: 
    ```json
    { 
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "bio": "string"
    }
    ```

- `POST /api/users/profile/avatar`
  - Upload profile picture
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Body: `avatar` (file field)

### Admin Routes (Requires Admin Role)

- `GET /api/users/users`
  - Get all users
  - Headers: `Authorization: Bearer <token>`

- `DELETE /api/users/users/:id`
  - Delete user by ID
  - Headers: `Authorization: Bearer <token>`

## Authentication

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- Password hashing using bcrypt
- JWT token expiration
- Role-based access control
- Input validation
- CORS protection
- Secure HTTP headers