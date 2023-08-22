const { Schema, model } = require("mongoose");

const friendsSchema = new Schema(
    {
         title: {
            type: String,
            required: true,
         },
         url: {
            type: String,
            required: true,
         },
         addressUrl: {
            type: String,
         },
         imageUrl: {
            type: String,
            required: true
         },
         address: {
            type: String,
         },
         worksDays: [
            {
                isOpen: {
                  type: Boolean,
                },
                from: {
                    type: String,
                    match: /^([01]\d|2[0-3]):[0-5]\d$/
                },
                to: {
                    type: String,
                    match: /^([01]\d|2[0-3]):[0-5]\d$/
                },
            }
         ],
         phone: {
            type: String
         },
         email: {
            type: String
         },
    }
)


const Friends = model("friends", friendsSchema);

module.exports = {
    Friends
}