const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()
require('dotenv').config({ path: 'example.env' })

function signup(req, res) {
    try {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

async function login(req, res, next) {
    passport.authenticate('login', async function (e, user, info) {
        try {
            if (e) {
                return next(e)
            }
            if (!user) {
                const error = new Error('email or Password is incorrect')
                return next(error)
            }

            req.login(user, { session: false },
                async function (e) {
                    if (e) {
                        return next(e)
                    }
                    const body = { _id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name };
                    const token = jwt.sign({ user: body }, process.env.SECRET || 'sth-secret', {
                        expiresIn: '1h'
                    })
                    return res.status(200).json({message: "Login successful", token: token })
                })
        } catch (e) {
            return next(e)
        }
    })(req, res, next)
}

module.exports = {
    signup,
    login
}