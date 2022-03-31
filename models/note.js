const { default: mongoose } = require("mongoose");

const noteSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('note', noteSchema);