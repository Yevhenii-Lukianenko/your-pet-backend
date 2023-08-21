const {Notice} = require('../models/notices');

const {HttpError, ctrlWrapper} = require('../helpers');

const getAll = async (req, res) => {
    const {category} = req.params;
    const {search = null} = req.query; 
    const {page = 1, limit = 12} = req.query;
    const skip = (page - 1) * limit;
    let result;

    if (search) {
        result = await Notice.find({category, title: { $regex: search, $options: 'i' }}, 
        "-createdAt -updatedAt", {skip, limit});
    } else {
        result = await Notice.find({category}, 
            "-createdAt -updatedAt", {skip, limit});
    } 

    if (result.length === 0) {
        throw HttpError (404, 'Not found');
    } 
    res.status(200).json(result);    
};

const getById = async (req, res) => {
    const {noticeId} = req.params;
    const result = await Notice.findOne({_id: noticeId}, "-createdAt -updatedAt");

    if (!result) {
       throw HttpError (404, 'Not found')
    }
    res.status(200).json(result);
};

const addFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const result = await Notice.findByIdAndUpdate(
        noticeId,
        {
          $push: { usersAddFavorite: {_id} }, 
        },
        { new: true },
      );

    res.status(201).json({userId: _id});
};

const removeFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const result = await Notice.findByIdAndUpdate(
        noticeId,
        {
          $pull: { usersAddFavorite: {_id} }, 
        },
        { new: true },
      );

    res.status(201).json({userId: _id});
};

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Notice.create({...req.body, owner});
    res.status(201).json(result);
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addFavorite: ctrlWrapper(addFavorite),
    removeFavorite: ctrlWrapper(removeFavorite),
    add: ctrlWrapper(add),
};