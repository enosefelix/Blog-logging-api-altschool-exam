// require('dotenv').config()
const express = require('express')
const { connectMongoDB } = require('./db/db')
const app = express()
const port = process.env.PORT || 3000;
const passport = require('passport')
const authRouter = require('./routes/auth.route')
const { blogRouter } = require('./routes/blog.route')
const { route } = require('./routes/blog.route')

require('./middleware/passport')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.use('/user', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/', authRouter)
app.use('/', route)

app.get('/', (req, res) => {
    res.send('Welcome to the blogging api')
})

connectMongoDB()

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

