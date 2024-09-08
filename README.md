# Authentication API

This API provides essential authentication and password management functionalities. It includes endpoints for user registration, login, password reset, and password recovery.

## Base URL
https://passwordreset-kpey.onrender.com/auth


## Endpoints

### 1. Register

**POST** `/register`

Registers a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}

email: The email address of the user. Must be unique.
password: The password for the user account. Should be at least 6 characters long.

Response:

201 Created:
json
Copy code
{
  "message": "User registered successfully"
}
400 Bad Request:
json
Copy code
{
  "error": "User with this email already exists"
}
2. Login
POST /login

Logs in an existing user and returns a JWT token for authentication.

Request Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "yourpassword"
}
email: The email address of the user.
password: The password for the user account.
Response:

200 OK:
json
Copy code
{
  "token": "your-jwt-token"
}
400 Bad Request:
json
Copy code
{
  "error": "Invalid credentials"
}
3. Forgot Password
POST /forgot-password

Initiates the password reset process by sending a reset link to the user's email.

Request Body:

json
Copy code
{
  "email": "user@example.com"
}
email: The email address of the user who forgot their password.
Response:

200 OK:
json
Copy code
{
  "message": "Password reset link sent to your email"
}
404 Not Found:
json
Copy code
{
  "error": "User not found"
}
4. Reset Password
POST /reset-password

Resets the user's password using a reset token.

Request Body:

json
Copy code
{
  "token": "reset-token",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
token: The reset token received in the password reset email.
newPassword: The new password for the user account.
confirmPassword: A confirmation of the new password. It should match newPassword.
Response:

200 OK:
json
Copy code
{
  "message": "Password has been reset successfully"
}
400 Bad Request:
json
Copy code
{
  "error": "Invalid or expired token, or passwords do not match"
}
How to Test with Postman
To test these endpoints using Postman, follow these steps:

Register
Method: POST
URL: https://passwordreset-kpey.onrender.com/auth/register

Login
Method: POST
URL: https://passwordreset-kpey.onrender.com/auth/login

Forgot Password
Method: POST
URL: https://passwordreset-kpey.onrender.com/auth/forgot-password

Reset Password
Method: POST
URL: https://passwordreset-kpey.onrender.com/auth/reset-password


Error Handling
The API responds with standard HTTP status codes to indicate the success or failure of requests. Common responses include:

200 OK: The request was successful.
201 Created: Resource was successfully created.
400 Bad Request: The request was invalid or contains errors.
404 Not Found: The requested resource was not found.
500 Internal Server Error: An error occurred on the server side.

Postman Document - https://documenter.getpostman.com/view/21169925/2sAXjRWUr6 