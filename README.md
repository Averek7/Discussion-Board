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
11. [Implementation Plan](#implementation-plan)
12. [Example Code Structure](#example-code-structure)
13. [Submission Links](#submission-links)

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
