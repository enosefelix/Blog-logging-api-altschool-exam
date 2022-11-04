const { blogModel } = require('../models/blog.model.js')
const moment = require('moment');
const { userModel } = require('../models/auth.model.js');

async function getAllBlogs(req, res) {
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    var skip = (page - 1) * limit;
    try {
        const author = req.query.author
        const title = req.query.title
        const tags = req.query.tags
        if (author) {
            var blogs = await blogModel.find({ author: author }).skip(skip).limit(limit)
        } else if (title) {
            var blogs = await blogModel.find({ title: title }).skip(skip).limit(limit)
        } else if (tags) {
            var blogs = await blogModel.find({ tags: tags }).skip(skip).limit(limit)
        }
        else {
            var blogs = await blogModel.find({ "state": "published" }).skip(skip).limit(limit)
            if (!blogs.state === "published") {
                return res.status(401).send(`There are no blogs that are published yet`)
            }
        }
        return res.status(200).json({ blogs })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

async function getBlogByOrder(req, res) {
    const readcount = req.query.readcount
    const reading_time = req.query.readingtime
    const timestamp = req.query.timestamp
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    var skip = (page - 1) * limit;
    if (readcount === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ read_count: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "read_count data in ascending order",
            blogs: { asc }
        })
    } else if (readcount === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ read_count: -1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "read_count data in descending order",
            blogs: { des }
        })
    } else if (reading_time === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ reading_time: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "reading_time data in ascending order",
            blogs: { asc }
        })
    } else if (reading_time === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ reading_time: -1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "reading_time data in descending order",
            blogs: { des }
        })
    } else if (timestamp === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ timestamp: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "timestamp data in ascending order",
            blogs: { asc }
        })
    } else if (timestamp === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ timestamp: -1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "timestamp data in descending order",
            blogs: { des }
        })
    }
    const des = await blogModel.find({ "state": "published" }).sort({ read_count: -1 }).skip(skip).limit(limit)
    return res.status(200).json({
        message: "Highest read blog",
        blogs: des
    })
}

async function addBlog(req, res) {
    try {
        const email = req.user.email
        var author = req.body.author
        const title = req.body.title
        const tags = req.body.tags
        const body = req.body.body
        const wpm = 225;
        const words = body.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        const blog = await blogModel.create({
            title: req.body.title,
            description: req.body.description,
            tags: `#${title.toLowerCase()}` || tags,
            author: author || email,
            timestamp: moment().toDate(),
            body: body,
            reading_time: `${time}min`
        })
        const user = await userModel.findById(req.user._id)
        if (!user) {
            return res.status(401).send("Unauthorized, pls login or signup")
        }
        user.blogs.push(blog)
        blog.user = user
        await user.save()
        return res.status(200).json({
            message: "blog added successfully",
            blog: {
                _id: blog._id,
                title: blog.title,
                description: blog.description,
                tags: blog.tags,
                author: blog.author,
                state: blog.state,
                read_count: blog.read_count,
                reading_time: blog.reading_time,
                body: blog.body,
                timestamp: blog.timestamp
            },
            user: {
                _id: user._id
            }
        })
    } catch (e) {
        return res.status(500).send(e)
    }
}

async function editBlogState(req, res) {
    const state = req.body.state
    const { id } = req.params;
    try {
        const blog = await blogModel.findByIdAndUpdate(id, { "state": state }, { new: true })
        if (!blog) {
            return res.status(404).send(`Could not find blog`)
        }
        return res.status(200).json({
            message: `Blog published successfully`,
            blog: { blog }
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}

async function editBlog(req, res) {
    var { id } = req.params
    var body = req.body.body
    var title = req.body.title
    var description = req.body.description
    var tags = req.body.tags || `#${ title.toLowerCase()}`
    var author = req.body.author
    var wpm = 225;
    if (body) {
        var words = body.trim().split(/\s+/).length;
        var time = Math.ceil(words / wpm);
        var blog = await blogModel.findByIdAndUpdate(id, { "body": body, "title": title, "description": description, "tags": tags, "author": author, "reading_time": time }, { new: true })
    } else {
        var blog = await blogModel.findByIdAndUpdate(id, {"title": title, "description": description, "tags": tags, "author": author}, { new: true })
    }
    return res.status(200).json({
        message: "Blog updated successfully",
        blog: blog
    })
}

async function deleteBlog(req, res) {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id)
    return res.status(200).json({ message: "Blog deleted successfully" })
}

async function getBlogById(req, res) {
    const { id } = req.params
    try {
        const blog = await blogModel.findById(id).populate('user')
        if (!blog) {
            return res.status(404).send("Could not find blog")
        }
        else if (blog.state !== "published") {
            return res.status(400).send('This is not a published blog')
        }
        else {
            const userId = await blog.user._id
            const user = await userModel.findById(userId)
            blog.read_count++
            await blog.save()
            return res.status(200).json({
                message: `Data for ${blog.title} by ${blog.author}`,
                blog: {
                    _id: blog._id,
                    title: blog.title,
                    description: blog.description,
                    tags: blog.tags,
                    author: blog.author,
                    state: blog.state,
                    read_count: blog.read_count,
                    reading_time: blog.reading_time,
                    body: blog.body,
                    timestamp: blog.timestamp
                },
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            })
        }
    } catch (e) {
        return res.send(e)
    }
}

async function myBlogs(req, res) {
    try {
        var page = req.query.page * 1 || 1;
        var limit = req.query.limit * 1 || 20;
        var skip = (page - 1) * limit;
        const id = req.user._id;
        var state = req.query.state
        if (!state) {
            var blogs = await userModel.findById(id).populate({
                path: 'blogs',
                options: { skip: skip, limit: limit },
            }).select('blogs').exec()
            return res.status(200).json({
                message: "These are your blogs",
                user: blogs
            })
        } else {
            var blogs = await userModel.findById(id).populate({
                path: 'blogs',
                options: { skip: skip, limit: limit },
                match: { state: state }
            }).select('blogs').exec()
            return res.status(200).json({
                message: `These are your ${state} blogs`,
                user: blogs
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }

}

module.exports = {
    getAllBlogs,
    addBlog,
    editBlog,
    editBlogState,
    myBlogs,
    getBlogById,
    getBlogByOrder,
    deleteBlog
}