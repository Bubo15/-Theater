require('dotenv').config()
const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
    const token = req.cookies['auth']
    if (!token) { return res.redirect('/') }

    try {
        jwt.verify(token, process.env.PRIVATE_KEY)
        next()
    } catch (e) {
        return res.redirect('/')
    }
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['auth']
    if (token) { return res.redirect('/') }
    next()
}

const getUserStatus = (req, res, next) => {
    
    const token = req.cookies['auth']
    if (!token) { req.isLogged = false }

    try {
        jwt.verify(token, process.env.PRIVATE_KEY)
        req.isLogged = true
    } catch (e) {
        req.isLogged = false
    }

    next()
}

module.exports = {
    isAuthenticated,
    guestAccess,
    getUserStatus,
};