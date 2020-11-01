const { Router } = require('express');
const { getUserStatus, isAuthenticated } = require('../controllers/auth');
const { getFirstNPlaysOrderByLikes, getAllPlaysOrderByCreatedAt } = require('../controllers/play')
const { getUserAndPlaysById } = require('../controllers/user')
 
const router = Router();

router.get('/', getUserStatus, async (req, res) => {
    const plays = req.isLogged ? await getAllPlaysOrderByCreatedAt() : await getFirstNPlaysOrderByLikes(3)
    return res.render('home', {
        isLogged: req.isLogged,
        plays
    })
})

router.get('/all/my/plays', isAuthenticated, getUserStatus, async (req, res) => {
    const user = await getUserAndPlaysById(req.session.userID)

    return res.render('home', {
        isLogged: req.isLogged,
        plays: user.plays
    })
})

module.exports = router;