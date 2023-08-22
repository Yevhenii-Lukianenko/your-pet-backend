const {Friends} = require("../models/ourFriends")

const {ctrlWrapper, HttpError} = require("../helpers");

const getAllFriends = async(req, res) => {
    const result = await Friends.find();
    res.json(result)
}

const getInfo = async(req, res) => {
    const {id} = req.params;
    const result = await Friends.findOne({_id: id})
    if (!result) {
        throw HttpError(404, "Not found");
      }
    res.json(result)
}

module.exports = {
    getAllFriends:ctrlWrapper(getAllFriends),
    getInfo: ctrlWrapper(getInfo)
};