const mongoose = require("mongoose");

const CommunitySchema = mongoose.Schema({
    leaderUid: {
        type: String
    },
    betaUsers: {
        type: [String]
    },
    name: {
        type: String,
        required: true
    },
    requests: {
        type: [String]
    }
});

module.exports = mongoose.model("community", CommunitySchema);