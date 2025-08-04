import mongoose from "mongoose";

const product = mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    description: {
        type: String
    },
    created_on: {
        type: Date,
        default: Date.now
    }
})

const prodVar = mongoose.model("productInfo", product)

export default prodVar