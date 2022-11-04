const controller = require('../controllers/auth.controller')
const express = require('express')
const authRouter = express.Router()
const passport = require('passport')


authRouter.post('/signup', passport.authenticate('signup', { session: false }), controller.signup)

authRouter.post('/login', controller.login)

module.exports = authRouter;