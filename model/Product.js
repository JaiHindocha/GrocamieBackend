const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sp: {
        type: Number
    },
    mrp: {
        type: Number
    },
    DealerPrice: {
        type: Number
    },
    discount: {
        type: Number
    },
    gst: {
        type: Number
    },
    weight: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    productImageUrl: {
        type: String
    },
    keywords: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model user with UserSchema
module.exports = mongoose.model("product", ProductSchema);