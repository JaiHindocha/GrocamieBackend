const mongoose = require("mongoose");

const ManufacturerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// export model user with UserSchema
module.exports = mongoose.model("manufacturer", ManufacturerSchema);
