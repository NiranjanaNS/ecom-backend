import orderVar from "../model/order.js";
import prodVar from "../model/product.js";
import cartVar from "../model/cart.js";

const addOrder = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { prodId } = req.body;

    const product = await prodVar.findOne({ name: prodId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const prod_id = product._id;
    const price = product.price;

    const cart = await cartVar.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.prodId.toString() === prod_id.toString()
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const subtotal = existingItem.quantity * price;

    const order = [
      {
        prodId: prod_id,
        productName: prodId,
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

    const orders = await orderVar.find({ userId });

    if (!orders) {
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
        return res.status(404).json({ message: "No permission to delete" })
    }

    const del = await orderVar.findByIdAndDelete({ _id: orderid });

    return res.json({ message: "Order deleted successfully", order });
  } catch (err) {
    res.status(500).json({ message: "error", err });
  };
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
    }
    catch (err) {

    };
};

export { addOrder, getOrderId, getOrder, updateOrder, delOrder, cancelOrder };
