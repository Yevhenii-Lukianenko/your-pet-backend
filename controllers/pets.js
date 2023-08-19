const {Pets} = require("../models/pets");

const {ctrlWrapper} = require("../helpers");

const add = async(req, res) => {
    const {_id: owner} = req.user;
    const result = await Pets.create({...req.body, owner});
    res.status(201).json(result);
};


module.exports = {
    add: ctrlWrapper(add)
}
