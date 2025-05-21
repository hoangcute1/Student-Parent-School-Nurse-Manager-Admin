# SWP391 API Testing Guide

This guide explains how to use the Postman collection to test the SWP391 API with the new features including:
- Role-based access control (User vs Admin)
- Data validation
- Pagination, filtering, and sorting for students

## Setup

1. Import the `updated_postman_collection.json` and `updated_postman_environment.json` files into Postman
2. Make sure your NestJS API is running on http://localhost:3000
3. Select the "SWP391 API Environment" environment in Postman

## Testing Authentication

### 1. Register Users

First, register two users - one regular user and one admin:

1. Run the "Register (Normal User)" request
2. Run the "Register (Admin User)" request

### 2. Login

1. Run the "Login (User)" request - this will automatically save the user's tokens in environment variables
2. Run the "Login (Admin)" request - this will automatically save the admin's tokens in environment variables

### 3. Get Current User

1. Run the "Get Current User" request using the user's token
2. You can switch between user and admin token to see the different roles

## Testing Student Management

### Admin Operations (Requires Admin Role)

1. Run "Create Student" request (with admin token) to create a new student
2. This will return a student ID that will be saved in the environment variables
3. Try running the same request with a regular user token to see the 403 Forbidden error

### Reading Students (All Users)

These operations work with either user or admin tokens:

1. "Get All Students" - returns all students
2. "Get Students with Pagination" - returns students with pagination (page 1, limit 10)
3. "Get Students with Filtering" - returns filtered students with search, sort, and pagination 
4. "Get Student by ID" - returns a student by MongoDB ID
5. "Get Student by Student ID" - returns a student by the studentId field

### Update and Delete (Admin Only)

1. "Update Student" - updates a student record (admin only)
2. "Delete Student" - deletes a student record (admin only)
3. Try these operations with a regular user token to see 403 Forbidden errors

## Testing Validation

Try creating or updating students with invalid data to see validation errors:

1. Email without @ symbol
2. Phone number with letters
3. Missing required fields

## Testing Filtering and Pagination

The "Get Students with Filtering" request demonstrates:

1. Text search (`search=Nguyen`)
2. Pagination (`page=1&limit=10`)
3. Sorting (`sortBy=fullName&sortOrder=asc`)

You can modify the query parameters to test different filter combinations.

## Token Management

1. "Refresh Token" - use this to get a new access token using the refresh token
2. "Logout" - revokes the refresh token for a user

## Environment Variables

The collection automatically saves important values to environment variables:

- `accessToken` - Regular user's JWT token
- `refreshToken` - Regular user's refresh token
- `userId` - Regular user's ID
- `adminAccessToken` - Admin user's JWT token
- `adminRefreshToken` - Admin user's refresh token
- `adminUserId` - Admin user's ID
- `studentId` - ID of the most recently retrieved student
