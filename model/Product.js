const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    category: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Integer
    },
    largeImageUrl: {
        type: String
    },
    mrp: {
        type: Integer,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productImageUrl: {
        type: String
    },
    sp: {
        type: Integer,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Integer
    },
    weightUnitType: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);