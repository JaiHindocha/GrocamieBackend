const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    PriorityIndex: {
      type: Number,
      required: true
    },
    margin: {
      type: Number,
      required: true
    },
    availablity:{
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
    imageUrl: {
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
    weight: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model user with UserSchema
module.exports = mongoose.model("product", ProductSchema);
