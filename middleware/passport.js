const passport = require('passport')
const localStategy = require('passport-local').Strategy;
const { userModel } = require('../models/auth.model')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()
const moment = require('moment')

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET,
            // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async function (token, next) {
            try {
                return next(null, token.user)
            } catch (e) {
                next(e)
            }
        }
    )
)

passport.use(
    'signup',
    new localStategy(
        {
            usernameField: "email",
            passwordField: 'password',
            passReqToCallback: true
        },
        async function (req, username, password, next) {
            const email = req.body.email
            const first_name = req.body.first_name
            const last_name = req.body.last_name
            try {
                const user = await (await userModel.create({ email, password, first_name, last_name }))
                return next(null, user)
            } catch (e) {
                next(e)
            }
        }
    )
)

passport.use(
    'login',
    new localStategy(
        {
            usernameField: "email",
            passwordField: 'password',
            passReqToCallback: true
        },
        async function (req, username, password, next) {
            const email = req.body.email;
            try {
                const user = await userModel.findOne({ email })
                if (!user) {
                    return next(null, false, { message: 'User does not exist' })
                }
                const validate = await user.validPassword(password)

                if (!validate) {
                    return next(null, false, { message: 'Wrong email or password' })
                }
                return next(null, user, { message: `Welcome ${user}` })
            } catch (e) {
                return next(e)
            }
        }
    )
)