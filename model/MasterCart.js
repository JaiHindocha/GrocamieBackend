const mongoose = require("mongoose");

const MasterCartSchema = mongoose.Schema({
    _id: {
      type: mongoose.ObjectId,
      required: true
    },
    products: [{
        _productId: String,
        quantity: Number
    }],
    total: {
      type: Number,
      default: 0
    }
});

// export model user with UserSchema
module.exports = mongoose.model("mastercart", MasterCartSchema);
