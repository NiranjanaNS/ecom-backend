import cartVar from "../model/cart.js";
import prodVar from "../model/product.js";
import mongoose from "mongoose";

const addCart = async (req, res) => {
  try {
    const { prodId, quantity } = req.body;
    const user = req.session.user;
    const userId = user.id;

    const product = await prodVar.findOne({ _id: prodId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const prod_name = product.name;

    const cart = await cartVar.findOne({ userId: userId });

    if (!cart) {
      const new_items = {
        prodId: prodId,
        productName: prod_name,
        quantity,
      };
      const newcart = await cartVar.create({
        userId,
        items: [new_items],
      });
      return res.json({ message: "cart created successfully", newcart });
    } else {
      const existingItem = cart.items.find(
        (item) => item.prodId.toString() === prodId.toString()
      );

      if (quantity <= 0) {
        return res.status(404).json({ message: "invalid quantity" });
      }

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          prodId: prodId,
          productName: prod_name,
          quantity,
        });
      }

      await cart.save();
    }
    return res.json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const prodId = req.params.id;
    const userId = req.session.user.id;
  
    const cart = await cartVar.findOne({ userId: userId });
  
    if (!cart) {
      return res.json({ message: "no cart found" });
    }
  
    const existingItem = cart.items.find(
      (item) => item.prodId.toString() === prodId.toString()
    );
    if (!existingItem) {
      return res.status(404).json({ message: "no items found" });
    }
  
    if (quantity <= 0) {
      return res.status(404).json({ message: "invalid quantity" });
    }
  
    existingItem.quantity = quantity;
    await cart.save();
    return res.json({ message: "items updated successfully", existingItem });
  } 
  catch (err) {
    return res.status(500).json({ message: "error", err });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    console.log(userId);

    const cart = await cartVar.findOneAndDelete({ userId: userId });

    console.log(cart);

    return res.json({ message: "Cart successfully deleted" });
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const prodId = req.params.id;
    const userId = req.session.user.id;

    const product = await prodVar.findOne({ _id: prodId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const prod_name = product.name;

    const cart = await cartVar.findOne({ userId: userId });

    if (!cart) {
      return res.json({ message: "no cart found" });
    }

    const existingItem = cart.items.find(
      (item) => item.prodId.toString() === prodId.toString()
    );
    if (!existingItem) {
      return res.status(404).json({ message: "no items found" });
    }

    const itemid = existingItem.id;

    cart.items.pull({
      prodId: prodId,
      productName: prod_name,
      quantity: existingItem.quantity,
      _id: itemid,
    });

    await cart.save();
    return res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
};

const getCart = async (req, res) => {
  try {
    const user = req.session.user;
    const userId = new mongoose.Types.ObjectId(user.id);

    const cart = await cartVar.find({ userId: userId });
    if (!cart.length) {
      return res.json({ message: "cart not found" });
    }

    const items = await cartVar.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "productinfos",
          localField: "items.prodId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $addFields: {
          "items.productName": "$productInfo.name",
          "items.price":   "$productInfo.price" ,
          "items.subtotal": {
            $multiply: [
              { $toInt: "$items.quantity" },
              { $toDouble: "$productInfo.price" },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          items: { $push: "$items" },
          total: {
            $sum: {
              $multiply: [
                { $toInt: "$items.quantity" },
                { $toDouble: "$productInfo.price" },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          items: 1,
          total: 1,
        },
      },
    ]);

    console.log(items);

    return res.json({ message: "get cart", items });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

const getCartItem = async (req, res) => {
  try {
    const prodId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    const cart = await cartVar.findOne({ userId: userId });

    if (!cart) {
      return res.json({ message: "cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.prodId.toString() === prodId.toString()
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const items = await cartVar.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $unwind: "$items" ,
      },
      {
        $match: { "items.prodId": prodId },
      },
      {
        $lookup: {
          from: "productinfos",
          localField: "items.prodId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $addFields: {
          "items.productName": "$productInfo.name",
          "items.price": { $toDouble: "$productInfo.price" },
          "items.subtotal": {
            $multiply: [
              { $toInt: "$items.quantity" },
              { $toDouble: "$productInfo.price" },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          items: { $push: "$items" },
          total: {
            $sum: {
              $multiply: [
                { $toInt: "$items.quantity" },
                { $toDouble: "$productInfo.price" },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          items: 1,
          total: 1,
        },
      },
    ]);

    return res.json({ message: "get cart", items });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

export {
  addCart,
  updateCart,
  deleteCart,
  deleteCartItem,
  getCart,
  getCartItem,
};
