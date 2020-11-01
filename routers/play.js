const { Router } = require('express');
const { getUserStatus, isAuthenticated } = require('../controllers/auth');
const { createTheatre, getPlayById, like, deleteTheatreById, editPlayById } = require('../controllers/play');
const { getUserById } = require('../controllers/user');

const router = Router();

router.get('/create/theater', isAuthenticated,  getUserStatus, async (req, res) => {
    return res.render('create-theater', {
        isLogged: req.isLogged,
    })
})

router.post('/create/theater', getUserStatus, async (req, res) => {
    const areThereErrors = await createTheatre(req)

    if(JSON.stringify(areThereErrors) !== JSON.stringify({})){
        return res.render('create-theater', {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            errors: areThereErrors,
            isLogged: req.isLogged
        })
    }

    return res.redirect('/')
})

router.get('/details/theatre/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const play = await getPlayById(req.params.id)
    const user = await getUserById(req.session.userID)

    const isAlreadyLiked = play.usersLiked.map(id => JSON.stringify(id)).includes(`"${req.session.userID}"`)
    const isCurrentUserCreator = user.plays.map(id => JSON.stringify(id)).includes(JSON.stringify(play._id))

    return res.render('theater-details', {
        isLogged: req.isLogged,
        isCurrentUserCreator,
        isAlreadyLiked,
        play
    })
})

router.get('/like/theatre/:id', isAuthenticated, async (req, res) => {
    await like(req.params.id, req.session.userID);
    res.redirect('/details/theatre/' + req.params.id)
})

router.get('/edit/theatre/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const play = await getPlayById(req.params.id)
 
    res.render('edit-theater', {
        isLogged: req.isLogged,
        id: play._id,
        title: play.title,
        description: play.description,
        imageUrl: play.imageUrl
    })
})

router.post('/edit/theatre/:id', getUserStatus, async (req, res) => {
    const areThereErrors = await editPlayById(req)
    const play = await getPlayById(req.params.id);
 
    if (areThereErrors && areThereErrors.length !== 0) {
        return res.render('edit-theater', {
            errors: areThereErrors,
            isLogged: req.isLogged,
            id: play._id,
            title: play.title,
            description: play.description,
            imageUrl: play.imageUrl
        })
    }

    return res.redirect('/details/theatre/' + play._id)
})

router.get('/delete/theatre/:id', isAuthenticated, async (req, res) => {
    const isDeleted = await deleteTheatreById(req);

    if (isDeleted) {
        return res.redirect('/')
    }

    return res.status(404);
})

module.exports = router;