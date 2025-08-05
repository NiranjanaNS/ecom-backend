import cartVar from "../model/cart.js";
import mongoose from "mongoose";

const addCart = async (req, res) => {
    try {
        const { prodId, quantity } = req.body;
        const userId = req.session._id;

        const cart = await cartVar.aggregate([
            {$match: {userId: {$eq: mongoose.Types.ObjectId}}},
            {$lookup: {
                from: "productinfos",
                localField: "prodId",
                foreignField: "_id",
                as: "product"
            }},
            {$unwind: "$items"},
            {$unwind: "$product"},
            // {$match: {prodId: mongoose.Types.ObjectId(_id)}},
            {$group: {_id: "$_id", total: {$sum: "$subtotal"}}},
            {$project: {userId: 1, prodId: 1, quantity: 1, subtotal: {$multiply: ["$items.quantity", "$product.price"]}, total: {$sum: "$items.subtotal"}}}
        ]);

        const add = await cartVar.create({ userId, prodId, quantity, cart });
        return res.json({ message: "cart added successfully", add })
        }
    catch(err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

export { addCart };