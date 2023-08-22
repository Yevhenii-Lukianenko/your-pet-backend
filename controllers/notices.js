const {Notice} = require('../models/notices');

const {HttpError, ctrlWrapper} = require('../helpers');
const { User } = require('../models/user');

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

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Notice.create({...req.body, owner});
    res.status(201).json(result);
};

const getUsersNotices = async(req, res) => {
        const {_id} = req.user;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

        const usersNotices = await Notice.find({owner: _id});

        return res.json({usersNotices})
}

const deleteUsersNotices = async(req, res) => {
    const {_id} = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    const {id} = req.params
    const deleteNotice = await Notice.find({owner: _id});
    if(!deleteNotice){
        return res.status(404).json({ message: "User not found" });
    }
    const result = await Notice.findByIdAndDelete({_id: id})
    if(!result){
        throw HttpError(404, "Not Found");
    }
    return res.json({message: "Delete success"})
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    getUsersNotices:ctrlWrapper(getUsersNotices),
    deleteUsersNotices: ctrlWrapper(deleteUsersNotices),
};