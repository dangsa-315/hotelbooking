import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        trim: true,
        required: true,
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    identification: {
        required: true,
        type: String,

    },
    number: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        minLength: 18,
        maxLength: 65,
        required: true,
    },
    hotelName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    isBook: {
        type: Boolean,
        default: false,
    }
})


const Users = mongoose.model("Users", userSchema)
export default Users
