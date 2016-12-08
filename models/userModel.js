var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    displayName: {
        type: String
    },
    image: {
        type: String
    },
    email: {
        type: String
    },
    facebook: {
        type: Object
    },
    twitter: {
        type: Object
    },
    google: {
        type: Object
    },
    local: {
        type: Object
    },
    posts: {
        type: [
            {
                title: {
                    type: String
                },
                body: {
                    type: String
                },
                date: {
                    type: String
                },
                comments: {
                    type: []
                }
            }
        ]
    }
});

module.exports = mongoose.model("User", userSchema);
