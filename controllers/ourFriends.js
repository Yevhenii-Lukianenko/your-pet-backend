const {Friends} = require("../models/ourFriends")

const {ctrlWrapper} = require("../helpers");

const getAllFriends = async(req, res) => {
    const result = await Friends.find();
    res.json(result)
}

module.exports = {
    getAllFriends:ctrlWrapper(getAllFriends),
};