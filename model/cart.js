import mongoose from "mongoose";

const cart = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
  },
  items: [
    {
      prodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productinfos",
      },
      quantity: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const cartVar = mongoose.model("cartinfos", cart);

export default cartVar;
