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
        ref: 'category',
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
})

const prodVar = mongoose.model("productInfo", product)

export default prodVar