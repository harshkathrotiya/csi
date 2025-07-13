# Enhanced Express.js Authentication API

An advanced Express.js API featuring user authentication, file uploads, weather integration, and robust error handling.

## Features

- 🔐 JWT Authentication
- 📁 File Upload (Avatar)
- 🌤 Weather API Integration
- ⚡ Rate Limiting
- 🛡 Advanced Error Handling
- 👤 User Profile Management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenWeather API Key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar

### Weather
- `GET /api/weather/city/:city` - Get weather by city name
- `GET /api/weather/coordinates?lat=<lat>&lon=<lon>` - Get weather by coordinates

## Security Features

- Rate limiting on all API endpoints
- Stricter rate limiting on authentication routes
- JWT token authentication
- Password hashing
- File upload validation
- Global error handling

## Rate Limits

- API routes: 100 requests per 15 minutes
- Login route: 5 requests per hour

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- File upload errors
- Rate limiting errors

## File Upload

- Supports avatar upload (JPEG, JPG, PNG)
- Maximum file size: 1MB
- Files stored in `/uploads/avatars`

## Development

```bash
# Run in development mode
npm run dev

# Run in production mode
npm start
```