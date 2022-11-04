# Blogging API
This is an api for a blog app

---

## Requirements
1. Users should have a first_name, last_name, email, password
2. A user should be able to sign up and sign in into the blog app
3. JWT token should expire after 1 hour
4. Logged in and not logged in users should be able to get a list of published blogs created
5. Logged in and not logged in users should be able to to get a published blog
6. Logged in users should be able to create a blog.
7. The owner of the blog should be able to update the state of the blog to published
8. The owner of a blog should be able to edit the blog in draft or published state
9. The owner of the blog should be able to delete the blog in draft or published state
10. The owner of the blog should be able to get a list of their blogs. 
    - The endpoint should be paginated
    - It should be filterable by state
11. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
12. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, 
    - default it to 20 blogs per page. 
    - It should also be searchable by author, title and tags.
    - It should also be orderable by read_count, reading_time and timestamp
13. When a single blog is requested, the api should return the user information(the author) with the blog, the read_count of the blog too should be updated by 1
---
## Setup
- Install NodeJS, mongodb,bcrypt, dotenv, express, jest, jsonwebtoken, moment, mongodb-memory-server, mongoose, nodemon, passport, passport-jwt, passport-local, passport-local-mongoose, supertest
- pull this repo
update env with example.env
- run `npm start`

---
## Base URL
- somehostsite.com


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  first_name | string  |  required|
|  last_name  |  string |  required  |
|  email     | string  |  required, unique |
|  password |   string |  required  |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title |  string |  required, unique |
|  description | string  |  optional |
|  tags  |  string |  optional  |
|  author     | string  |  optional |
|  timestamp |   string |  optional  |
|  state |  string |  optional, enum: ["draft", "published"] |
|  read_count |  number |  optional |
|  reading_time |  string |  optional |
|  body |  string |  require |



## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "first_name": "jon",
  "last_name": "doe"
}
```

- Responses

Success
```
{
  "message": "Signup successful",
  "user": {
    "first_name": "john",
    "last_name": "doe",
    "email": "doe@example.com",
    "password": "<your hashed password>",
    "blogs": [],
    "_id": "<your id>"
  }
}

```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "first_name": "john",
  "last_name": "doe",
  "email": "doe@example.com",
  "password": "Password1"
}
```

- Responses

Success
```
{
  "message": "Login successful",
  "token": "<your token>"
}
```

---
### Create blog

- Route: user/blogs/new
- Method: POST
- Http Header
    - Authorization = bearer {token}
- Body: 
```
{
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?"
}
```

- Responses

Success
```
{
  "message": "blog added successfully",
  "blog": {
    "_id": "<blog id>",
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "draft",
    "read_count": 0,
    "reading_time": "1min",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
    "user": [
      {
        "_id": "<your id>"
      }
    ]
  }
}
```
---
### Get a blog

- Route: /blogs/:id
- Method: GET
- Responses

Success
```
{
  "message": "Data for Lorem by john doe",
  "blog": {
    "_id": "<blog id>",
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "published",
    "read_count": 1,
    "reading_time": "1min",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
    "user": [
      {
        "first_name": "john",
        "last_name": "doe",
        "email": "doe@example.com"
      }
    ]
  }
}
```
Note: Only published posts will be sent
---

### Get blogs

- Route: /blogs
- Method: GET
- Query params: 
    - page (default: 1)
    - limit (default: 20)
    - author = john doe
    - title = Lorem
    - tags = #lorem
- Responses

Success
```
{
    "_id": "<blog id>",
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "published",
    "read_count": 1,
    "reading_time": "1min",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
    "user": [
      "<user id>"
    ]
  }
```
Note: Only published posts will be sent
---

### Get blogs by order

- Route: /blogs/order
- Method: GET
- Query params: 
    - page (default: 1)
    - limit (default: 20)
    - readcount = asc || desc
    - readingtime = asc || desc
    - timestamp = asc || desc

Note: asc if for ascending order, and desc is for descending order

- Responses

Success
```
{
    "_id": "<blog id>",
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "published",
    "read_count": 1,
    "reading_time": "1min",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
    "user": [
      "<user id>"
    ]
  }
  ```
  Note: returns the blog with the highest number of read_count if no params is entered
---

### Update blog state

- Route: user/blogs/:id/edit
- Method: PATCH
- Http Header
    - Authorization = bearer {token}

- Body: 
```
{
    "state": "published",
}
```
- Responses

Success
```
{
  "message": "Blog published successfully",
  "blog": {
    "blog": {
      "_id": "<blog id>",
    "title": "Lorem",
    "description": "lorem ipsum dodlor",
    "tags": "#lorem",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "published",
    "read_count": 1,
    "reading_time": "1min",
    "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
      "user": [
        "<user id>"
      ]
    }
  }
}
```
---
### Update blog

- Route: user/blogs/:id/edit
- Method: PUT
- Http Header
    - Authorization = bearer {token}

- Body: 
```
{
  "title": "ipsum",
  "tags": "#ipsum",
  "description": "lo lo lorem",
  "body": "lorem ipsum, the default"
}
```
- Responses

Success
```
{
  "message": "Blog updated successfully",
  "blog": {
    "_id": "<blog id>",
    "title": "ipsum",
    "description": "lo lo lorem",
    "tags": "#ipsum",
    "author": "john doe",
    "timestamp": "Mon Oct 31 2022 13:05:07 GMT+0000 (Greenwich Mean Time)",
    "state": "published",
    "read_count": 1,
    "reading_time": "1",
    "body": "lorem ipsum, the default",
    "user": [
      "<user id>"
    ]
  }
}
```
---

### Get my blogs
- Route: user/blogs/:id/edit
- Method: PUT
- Http Header
    - Authorization = bearer {token}
    - page = (default: 1)
    - limit = (default: 20)
    - state = draft
- Responses

Success
```
{
  "message": "These are your draft blogs",
  "user": {
    "_id": "<user id>",
    "blogs": [
      {
        "_id": "<draft id>",
        "title": "Lorem",
        "description": "lorem ipsum dodlor",
        "tags": "#lorem",
        "author": "john doe",
        "timestamp": "Tue Nov 01 2022 13:31:14 GMT+0000 (Greenwich Mean Time)",
        "state": "draft",
        "read_count": 0,
        "reading_time": "1min",
        "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
        "user": [
          "<user id>"
        ]
      }
    ]
  }
}
```
---

### Delete Blog

- Route: user/blogs/:id
- Method: DELETE
- Http Header
    - Authorization = bearer {token}

- Responses

Success
```
{
  "message": "Blog deleted successfully"
}
```


...

## Contributor
- Enosejolagbon Abhademere
- enosefelix@gmail.com