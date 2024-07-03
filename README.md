# Discussion-Board
This document provides a detailed low-level design for a system that handles user management and discussions, following a microservices architecture.

## Table of Contents

1. [Overview](#overview)
2. [Services](#services)
   - [User Service](#user-service)
   - [Discussion Service](#discussion-service)
3. [Database Schema](#database-schema)
   - [User Schema](#user-schema)
   - [Discussion Schema](#discussion-schema)
   - [Comment Schema](#comment-schema)
4. [API Endpoints](#api-endpoints)
   - [User Service Endpoints](#user-service-endpoints)
   - [Discussion Service Endpoints](#discussion-service-endpoints)
5. [Sequence Diagrams](#sequence-diagrams)
   - [User Signup](#user-signup)
   - [User Login](#user-login)
   - [Create Discussion](#create-discussion)
6. [Inter-Service Communication](#inter-service-communication)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)
12. [Submission Links](#submission-links)

## Overview

The system consists of two primary microservices:

1. **User Service**: Manages user-related operations such as signup, login, user profile, follow/unfollow, and user search.
2. **Discussion Service**: Manages discussion-related operations such as creating, updating, deleting discussions, commenting, liking, and viewing discussions.

These services communicate through RESTful APIs.

## Services

### User Service

Responsible for managing user data and authentication.

- **Technologies**: Node.js, Express, MongoDB
- **Endpoints**:
  - `POST /api/users/signup`
  - `POST /api/users/login`
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`
  - `GET /api/users`
  - `GET /api/users/search/:name`
  - `PUT /api/users/follow/:id`
  - `PUT /api/users/unfollow/:id`

### Discussion Service

Handles discussion posts and related operations.

- **Technologies**: Node.js, Express, MongoDB
- **Endpoints**:
  - `POST /api/discussions`
  - `GET /api/discussions`
  - `GET /api/discussions/:id`
  - `PUT /api/discussions/:id`
  - `DELETE /api/discussions/:id`
  - `GET /api/discussions/tag/:tag`
  - `GET /api/discussions/text/:text`
  - `POST /api/discussions/comment/:id`
  - `DELETE /api/discussions/comment/:id/:comment_id`
  - `PUT /api/discussions/like/:id`
  - `PUT /api/discussions/unlike/:id`
  - `PUT /api/discussions/comment/like/:id/:comment_id`
  - `PUT /api/discussions/comment/unlike/:id/:comment_id`
  - `PUT /api/discussions/view/:id`

## Database Schema

### User Schema

```json
{
  "name": "String",
  "mobile": "String (unique)",
  "email": "String (unique)",
  "password": "String",
  "followers": ["ObjectId (User)"],
  "following": ["ObjectId (User)"]
}

```
### Discussion Schema

```json
{
  "user": "ObjectId (User)",
  "text": "String",
  "image": "String",
  "hashtags": ["String"],
  "likes": ["ObjectId (User)"],
  "comments": ["ObjectId (Comment)"],
  "views": "Number",
  "createdAt": "Date"
}
```

### Comment Schema

```json
{
  "user": "ObjectId (User)",
  "text": "String",
  "likes": ["ObjectId (User)"],
  "createdAt": "Date"
}

```

## API Endpoints

### User Service Endpoints

- **POST /api/users/signup**: Create a new user
- **POST /api/users/login**: Authenticate user
- **GET /api/users/:id**: Get user profile
- **PUT /api/users/:id**: Update user profile
- **DELETE /api/users/:id**: Delete user
- **GET /api/users**: Get list of users
- **GET /api/users/search/:name**: Search users by name
- **PUT /api/users/follow/:id**: Follow a user
- **PUT /api/users/unfollow/:id**: Unfollow a user

### Discussion Service Endpoints

- **POST /api/discussions**: Create a discussion
- **GET /api/discussions**: Get all discussions
- **GET /api/discussions/:id**: Get a discussion by ID
- **PUT /api/discussions/:id**: Update a discussion
- **DELETE /api/discussions/:id**: Delete a discussion
- **GET /api/discussions/tag/:tag**: Get discussions by tag
- **GET /api/discussions/text/:text**: Get discussions by text
- **POST /api/discussions/comment/:id**: Add a comment to a discussion
- **DELETE /api/discussions/comment/:id/:comment_id**: Delete a comment from a discussion
- **PUT /api/discussions/like/:id**: Like a discussion
- **PUT /api/discussions/unlike/:id**: Unlike a discussion
- **PUT /api/discussions/comment/like/:id/:comment_id**: Like a comment
- **PUT /api/discussions/comment/unlike/:id/:comment_id**: Unlike a comment
- **PUT /api/discussions/view/:id**: Increment view count

## Sequence

### User Signup

1. User submits signup form.
2. User Service validates and processes the request.
3. User Service saves the user data to the database.
4. User Service returns a success response and JWT token.

### User Login

1. User submits login form.
2. User Service validates and processes the request.
3. User Service verifies user credentials.
4. User Service returns a success response and JWT token.

### Create Discussion

1. User submits a new discussion post.
2. Discussion Service validates and processes the request.
3. Discussion Service saves the discussion data to the database.
4. Discussion Service returns a success response.

## Inter-Service Communication

- **User Service to Discussion Service**: Fetch user details for discussion posts and comments.
- **Discussion Service to User Service**: Verify user authentication and fetch user data for various operations.

## Authentication and Authorization

- **JWT Tokens**: Used for user authentication and authorization.
- **Middleware**: Common authentication middleware to verify JWT tokens for protected routes.

## Error Handling

- **Validation Errors**: Use `express-validator` to handle validation errors.
- **Server Errors**: Return 500 status code with appropriate error messages for unhandled exceptions.
- **Not Found Errors**: Return 404 status code for resources not found.
- **Authorization Errors**: Return 401 status code for unauthorized access.

## Testing

- **Unit Tests**: Write unit tests for individual functions and components.
- **Integration Tests**: Write integration tests for API endpoints using tools like Postman or Jest.
- **Postman Collection**: Create a Postman collection to test all endpoints and share its public link.

## Deployment

- **Docker**: Containerize the services using Docker.
- **CI/CD**: Set up continuous integration and deployment pipelines.
- **Hosting**: Deploy the services to a cloud platform like AWS, Azure, or Heroku.

## Submission Links

- **Postman Collection**: https://www.postman.com/supply-architect-92301278/workspace/spyne-task
- **Deployed Link**: https://discussion-board-w07n.onrender.com
