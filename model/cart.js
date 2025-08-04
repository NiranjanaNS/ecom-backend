import mongoose from "mongoose";

const cart = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: [{
        prodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now 
    }
})

const cartVar = mongoose.model('cartinfos', cart);

export default cartVar;