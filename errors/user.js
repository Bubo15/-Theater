const User = require('../models/user')

module.exports = userErrorHandler = async (req) => {
    const { username, password, rePassword } = req.body

    let errors = {}

    if (username.length < 3) {
        errors['username'] = 'Username must be least 3 characters'

        const user = await User.findOne({ username })
        if (user) {
            errors['username'] = 'Username already exist'
        }
    }

    if(password.length < 3){
        errors['password'] = 'Password must be least 3 characters'
    }

    if(JSON.stringify(password) !== JSON.stringify(rePassword)){
        errors['rePassword'] = 'Passwords do not match'
    }

    return errors
}