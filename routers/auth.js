const { Router } = require('express')
const router = Router();

const { saveUser, verifyUser, getErrorsInObject } = require('../controllers/user')
const { guestAccess, getUserStatus } = require('../controllers/auth')

router.get('/register', guestAccess, getUserStatus, async (req, res) => {
    return res.render('register', {
        isLogged: req.isLogged
    })
})

router.post('/register', async (req, res) => {
    const areThereErrors = await saveUser(req, res)

    if (JSON.stringify(areThereErrors) != JSON.stringify({})) {
        return res.render('register', {
            errors: areThereErrors,
            username: req.body.username,
            isLogged: false
        })
    }

    return res.redirect('/');
})

router.get('/login', guestAccess, getUserStatus, async (req, res) => {
    return res.render('login', {
        isLogged: req.isLogged
    })
})

router.post('/login', guestAccess, async (req, res) => {
    const { isSuccessfullyLogged } = await verifyUser(req, res);

    if (isSuccessfullyLogged) { return res.redirect('/') }

    return res.render('login', {
        username: req.body.username,
        errorMessage: 'Username or password is wrong',
        isLogged: false,
        email: req.body.email
    })
})

router.get('/logout', async (__, res) => {
    res.clearCookie('auth');
    res.redirect('/')
})

module.exports = router;