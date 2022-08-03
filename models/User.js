const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
})

UserSchema.methods.verifyPassword = () => {
    
    console.log('User model method')
}


module.exports = mongoose.model('Users', UserSchema)