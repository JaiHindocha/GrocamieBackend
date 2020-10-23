const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
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
        type: Int32Array
    },
    largeImageUrl: {
        type: String
    },
    mrp: {
        type: Int32Array,
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
        type: Int32Array,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    weight: {
        type: Int32Array
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
module.exports = mongoose.model("product", UserSchema);