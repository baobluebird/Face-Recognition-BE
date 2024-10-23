const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema(
    {
        //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        image: { type: String, required: true },
        name: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
    },
    {
        timestamps: true 
    }
);


const Face = mongoose.model("Face", faceSchema);
module.exports = Face;
