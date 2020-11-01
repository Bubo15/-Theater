const Play = require('../models/play')

module.exports = theaterErrorHandler = async (req) => {
    const { title, description, imageUrl } = req.body

    let errors = {}

    if (!title) {
        errors['title'] = 'Title is required'

        const play = await Play.findOne({ title })
        if (play) {
            errors['title'] = 'Title already exist'
        }
    }

    if(!description){
        errors['description'] = 'Description is required'
    }else{
        if(description.length > 50){
            errors['description'] = 'Description can not be more than 50 symbols'
        }
    }

    if(!imageUrl){
        errors['imageUrl'] = 'Image Url is required'
    }

    return errors
}