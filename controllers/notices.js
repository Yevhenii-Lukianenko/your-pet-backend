const {Notice} = require('../models/notices');

const {HttpError, ctrlWrapper} = require('../helpers');

const getAll = async (req, res) => {
    const {category} = req.params;
    const {search = null} = req.query; 
    const {page = 1, limit = 12} = req.query;
    
    const skip = (page - 1) * limit;
    let result;

    if (!['sell', 'lost-found', 'in-good-hands', 'my-pet'].includes(category)) {
        throw HttpError (400, 'Bad Request');
    } 
    else if (search) {
        result = await Notice.find({category: category, title: { $regex: search, $options: 'i' }})
        .skip(skip).limit(limit).exec();
    } 
    else {
        result = await Notice.find({category: category})
        .skip(skip).limit(limit).exec();
    
        res.status(200).json(result);
    }
        
};

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Notice.create({...req.body, owner});
    res.status(201).json(result);
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    add: ctrlWrapper(add),
};