const userErrorHandler = require('../errors/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const saveUser = async (req, res) => {
    const errors = await userErrorHandler(req)

    if (JSON.stringify(errors) !== JSON.stringify({})) { return errors }

    const { username, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ username, password: hashedPassword })

    try {
        const userObject = await user.save()

        const token = getToken({
            userID: userObject.id,
            username: username
        }, '1h')

        setSession(req, 'userID', userObject.id)
        setSession(req, 'username', username)
        setCookie(res, token, '1h', 'auth', true)
       
        return errors
    } catch (err) {
        errors.push({'error': err})
        return errors
    }
}

const verifyUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username });
        if (!user) { return false; }
        const status = await bcrypt.compare(password, user.password)

        if (status) {
            const token = getToken({
                userID: user.id,
                username: username
            }, '1h')

            setSession(req, 'userID', user.id)
            setSession(req, 'username', username)
            setCookie(res, token, '1h', 'auth', true)
        }
        return { isSuccessfullyLogged: status }
    } catch (err) {
        return { isSuccessfullyLogged: false }
    }
}

const addPlayToUser = async (userID, playID) => {
    await User.findByIdAndUpdate(userID, {
        $addToSet: {
            plays: [playID]
        }
    })
}

const getUserById = async (id) => {
    const user = await User.findById(id).lean();
    return user
}

const getUserAndPlaysById = async (id) => {
    const user = await User.findById(id).populate('plays').lean();
    return user
}

const setCookie = (res, token, expire, name, httpOnly) => {
    res.cookie(name, token, {
        expire: expire,
        httpOnly: httpOnly
    })
}

const setSession = (req, key, value) => {
    req.session[key] = value;
}

const getToken = (data, expire) => {
    return jwt.sign(
        data,
        process.env.PRIVATE_KEY,
        { expiresIn: expire }
    );
}

module.exports = {
    saveUser,
    verifyUser,
    getUserById,
    addPlayToUser,
    getUserAndPlaysById
};