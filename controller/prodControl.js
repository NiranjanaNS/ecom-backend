import multer from "multer";
import prodVar from "../model/product.js";
import catVar from "../model/category.js";

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

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const products = await prodVar.find({ categoryId: categoryId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in getProductsByCategory:", err); 
    res.status(500).json({ message: "Error fetching products by category", error: err.message });
  }
};

// get all products
const getProd = async (req, res) => {
  try {
    const prodDet = await prodVar.findOne(req.params.id);
    console.log(prodDet);
    const products = await prodVar.find();
    res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Error", error });
  }
};

// get product by id
const getProdId = async (req, res) => {
  try {
    const prodID = req.params.id;
    const prod = await prodVar.findById(prodID);
    if (!prod) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(prod);
  } catch (err) {
    res.status(500).json({ err });
  }
};

// add product
const addProd = async (req, res) => {
  console.log("added")
  try {
    const { name, price, brand, categoryId, description } = req.body;
    console.log(req.files)
    // const image = req.files.filename;
    const images = req.files.map(file => file.filename)

    // get category_id from category
    const catDet = await catVar.findOne({ _id: categoryId });
    if (!catDet) {
      return res.status(404).json({ message: "Category not found" });
    }

    // insert product
    const add = await prodVar.create({
      name,
      image: images,
      price,
      brand,
      categoryId: categoryId,
      description,
    });
    console.log(add);
    return res.json({ message: "Product added successfully", add });
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
};

// update product
const upProd = async (req, res) => {
  try {
    const prodId = req.params.id;
    const { name, price, brand, categoryId, description } = req.body;

    // Find the product first
    const find = await prodVar.findById(prodId);
    if (!find) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate category exists using its _id
    const catDet = await catVar.findById(categoryId);
    if (!catDet) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Handle image: use new upload if available
    // const image = req.file ? req.file.filename : find.image;
    let images = find.image;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }

    // Update product
    const update = await prodVar.findByIdAndUpdate(
      prodId,
      {
        name,
        image : images,
        price,
        brand,
        categoryId, 
        description,
      },
      { new: true }
    );

    return res.json({ message: "Product updated successfully", update });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};


const delProd = async (req, res) => {
  try {
    const prodId = req.params.id;
    await prodVar.findByIdAndDelete(prodId);
    return res.json({ message: "Product successfully deleted" });
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
};

export { uploads, getProductsByCategory, getProd, getProdId, addProd, upProd, delProd };
