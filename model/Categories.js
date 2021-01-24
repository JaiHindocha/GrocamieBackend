const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
    name: {
      type: String
    },
    subcategories: [{
        name: String,
    }],

});

// export model user with UserSchema
module.exports = mongoose.model("categories", CategoriesSchema);
