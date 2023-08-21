const {User} = require("../models/user");
const {Pets} = require("../models/pets");
const {ctrlWrapper} = require("../helpers");


const userPets = async(req, res) => {
      const {id} = req.params;
      const user = await User.findById(id);

      if(!user) {
       return res.status(404).json({message: "User not found"})
      }

      const userPets = await Pets.find({owner: id});

      return res.json({user, userPets})
};

module.exports = {
    userPets: ctrlWrapper(userPets),
}