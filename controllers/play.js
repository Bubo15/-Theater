require('dotenv').config()
const theatreErrorHandler = require('../errors/theater')
const { addPlayToUser, getUserById } = require('../controllers/user')

const Play = require('../models/play')

const createTheatre = async (req) => {
    const errors = await theatreErrorHandler(req)

    if (JSON.stringify(errors) !== JSON.stringify({})) {
        return errors
    }

    const {title, description, imageUrl, isPublic } = req.body

    const play = new Play({
        title,
        description,
        imageUrl,
        isPublic: isPublic == 'on' ? true : false,
        createdAt: new Date()
    })

    try {
        const playObject = await play.save()
        await addPlayToUser(req.session.userID, playObject.id)
        return errors
    } catch (err) {
        errors['error'] = err;
        return errors
    }
}

const getFirstNPlaysOrderByLikes = async (N) => {
    return await Play
        .find({
            'isPublic': true
        })
        .sort({
            'usersLiked.length': 1
        })
        .limit(N)
        .lean()
}

const getAllPlaysOrderByCreatedAt = async () => {
    return await Play
        .find({
            'isPublic': true
        })
        .sort({
            'createdAt': -1
        })
        .populate('usersLiked')
        .lean()
}

const getPlayById = async (id) => {
    return await Play.findById(id).lean();
}

const like = async (id, userID) => {
    await Play.findByIdAndUpdate(id, {
        $addToSet: {
            usersLiked: [userID]
        }
    })
}

const deleteTheatreById = async (req) => {
    const playId = req.params.id
    const user = await getUserById(req.session.userID)

    const playIndex = JSON.stringify(user.plays).indexOf(playId)

    user.plays.splice(playIndex, 1)

    // await user.save();

    const isDeleted = await Play.findByIdAndDelete(playId);
    return isDeleted
}

const editPlayById = async (req) => {
    const objErrors = await theatreErrorHandler(req);
    const play = await Play.findById(req.params.id)
  
    if(play.name === req.body.name){
        delete objErrors.name
    }

    if (JSON.stringify(objErrors) !== JSON.stringify({})) {
        return objErrors;
    }

    req.body.isPublic = req.body.isPublic === 'on' ? true : false

    await Play.findByIdAndUpdate(req.params.id, req.body)
}

module.exports = {
    createTheatre,
    getFirstNPlaysOrderByLikes,
    getAllPlaysOrderByCreatedAt,
    getPlayById,
    like,
    deleteTheatreById,
    editPlayById
};