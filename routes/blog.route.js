const controller = require('../controllers/blog.controller')
const express = require('express')
const blogRouter = express.Router()
const route = express.Router()

route.get('/blogs', controller.getAllBlogs)

blogRouter.post('/blogs/new', controller.addBlog)

blogRouter.get('/blogs', controller.myBlogs)

route.get('/blogs/order', controller.getBlogByOrder)

route.get('/blogs/:id', controller.getBlogById)

blogRouter.patch('/blogs/:id/edit', controller.editBlogState)

blogRouter.put('/blogs/:id/edit', controller.editBlog)

blogRouter.delete('/blogs/:id', controller.deleteBlog)

module.exports = {
    route,
    blogRouter
}