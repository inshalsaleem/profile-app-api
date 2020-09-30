const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trime: true
    },
    address:{
        type: String,
        trime: true
    },
    phone:{
        type: String
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trime: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("Email Address is not valid")
            }

        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7
    },
    gender:{
        type: String
    },
    avatar:{
        type: Buffer
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})



userSchema.methods.generateAuthtoken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, 'pakemarketfreshgradtask')

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
    
}


userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username})

    if(!user){
        throw new Error('Login Failed')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Login Failed')
    }

    return user
}


//Password Hashing
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User = mongoose.model('User', userSchema)


module.exports = User