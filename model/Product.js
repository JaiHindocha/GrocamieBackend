const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number
    },
    largeImageUrl: {
        type: String
    },
    mrp: {
        type: Number,
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
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Number
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
module.exports = mongoose.model("product", ProductSchema);