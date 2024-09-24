const mongoose = require('mongoose');

const roadSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        image: { type: String, required: true },
        
    },
    {
        timestamps: true 
    }
);


const Road = mongoose.model("Road", roadSchema);
module.exports = Road;
