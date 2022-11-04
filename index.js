require('dotenv').config()
const express = require('express')
const { connectMongoDB } = require('./db/db')
const app = express()
const port = process.env.PORT || 3000;
const passport = require('passport')
const authRouter = require('./routes/auth.route')


require('./middleware/passport')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const { blogRouter } = require('./routes/blog.route')
const { route } = require('./routes/blog.route')

app.use('/user', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/', authRouter)
app.use('/', route)

app.get("/home", (req, res) => {
    return res.status(200).json({ message: "successful" })
})

app.use("*", (req, res) => {
    return res.status(404).json({ message: "route not found" })
})

module.exports = app;