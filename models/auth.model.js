const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    created_at: Date,
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    blogs:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'blogs'
            }
        ]
});

userSchema.pre(
    'save',
    async function (next) {
        if (!this.isModified('password')) return;
        const user = this;
        const hash = await bcrypt.hash(this.password, 6)
        this.password = hash
        next()
    }
)

userSchema.methods.validPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password)
    return compare
}


const userModel = mongoose.model('users', userSchema);

module.exports = { userModel }
