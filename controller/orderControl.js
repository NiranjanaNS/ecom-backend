import orderVar from "../model/order.js";
import prodVar from "../model/product.js";
import cartVar from "../model/cart.js";

import multer from "multer";

// multer
const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, files, cb) => {
    cb(null, Date.now() + "-" + files.originalname);
  },
});
const uploads = multer({ storage: storage });

const addOrder = async (req, res) => {
  try {
    console.log("Session:", req.session);
    console.log("User:", req.session?.user);

    const userId = req.session.user.id;

    console.log(req.session.user.id, userId)

    const cart = await cartVar.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const prodIds = cart.items.map((item) => item.prodId);

    const products = await prodVar.find({ _id: { $in: prodIds } });

    let total = 0;
    let orderItems = [];

    for (let cartItem of cart.items) {
      const productData = products.find(
        (p) => p._id.toString() === cartItem.prodId.toString()
      );

      if (!productData) {
        return res.status(403).json({ message: "product data not found" });
      }

      const subtotal = productData.price * cartItem.quantity;
      total += subtotal;

      orderItems.push({
        prodId: productData._id,
        productName: productData.name,
        price: productData.price,
        quantity: cartItem.quantity,
        subtotal,
      });
    }

    const newOrder = await orderVar.create({
      userId,
      items: orderItems,
      total,
    });

    await cartVar.deleteOne({ userId });

    res.json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order", error: err });
  }
};

const addOrderItem = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const prodId = req.params.id;

    const product = await prodVar.findOne({ _id: prodId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const name = product.name;
    const price = product.price;

    const cart = await cartVar.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.prodId.toString() === prodId.toString()
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    let images = find.image;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    const subtotal = existingItem.quantity * price;

    const order = [
      {
        prodId: prodId,
        image: images,
        productName: name,
        quantity: existingItem.quantity,
        price,
        subtotal,
      },
    ];

    const total = subtotal;

    const addOrder = await orderVar.create({
      userId,
      items: order,
      total,
    });

    return res
      .status(201)
      .json({ message: "Order placed successfully", addOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error", err });
  }
};

const getOrder = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const orders = await orderVar.find({ userId: userId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res
      .status(200)
      .json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

const getOrderAdmin = async (req, res) => {
  try {
    const orders = await orderVar.find({});

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res
      .status(200)
      .json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }

  try {
    // For admin, fetch all orders
    const orders = await orderVar.find({});
    return res
      .status(200)
      .json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

const getOrderId = async (req, res) => {
  try {
    const orderid = req.params.id;

    const order = await orderVar.findOne({ _id: orderid });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Order details fetched successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const orderid = req.params.id;

    const order = await orderVar.findByIdAndUpdate(
      { _id: orderid },
      { status: status }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

const delOrder = async (req, res) => {
  try {
    const orderid = req.params.id;

    const order = await orderVar.findById({ _id: orderid });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const cancel = order.status == "cancelled";

    if (!cancel) {
      return res.status(404).json({ message: "No permission to delete" });
    }

    await orderVar.findByIdAndDelete({ _id: orderid });

    return res.json({ message: "Order deleted successfully", order });
  } catch (err) {
    res.status(500).json({ message: "error", err });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderid = req.params.id;

    const order = await orderVar.findByIdAndUpdate(
      { _id: orderid },
      { status: "cancelled" }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order cancelled successfully", order });
  } catch (err) {}
};

export {
  addOrder,
  addOrderItem,
  getOrderId,
  getOrder,
  getOrderAdmin,
  updateOrder,
  delOrder,
  cancelOrder,
};

export { uploads }