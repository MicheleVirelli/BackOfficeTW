const mongoose = require('mongoose');
const auth = require('../lib/authentication');
const { validateEmail, validateNotEmail } = require('../lib/validation');

const employeeSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: false,
    },
    lastname:{
        type: String,
        required: false,
    },
    loginInfo:{
        username:{
            type: String,
            required: true,
            unique: true,
            validate: validateNotEmail,
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            validate: validateEmail,
        }
    },
    authorization:{
        type: String,   
        required: false,
        enum: [auth.authLevel.admin, auth.authLevel.employee],
        default: auth.authLevel.employee
    }
})

employeeSchema.methods.generateToken = async function() {
    return await auth.generateToken(this.authorization, this.username, this._id);
}

module.exports = mongoose.model('Employee', employeeSchema);