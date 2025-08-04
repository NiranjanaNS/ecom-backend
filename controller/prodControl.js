import multer from "multer";
import prodVar from "../model/product.js";

// multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const uploads = multer({ storage: storage });

// get all products
const getProd = async (req, res) => {
    try {
        const products = await prodVar.find();
        res.status(200).json({ products });  
    } catch (error) {
        return res.status(500).json({ message: "Error", error });
    }
}

// get product by id
const getProdId = async (req, res) => {
    try {
        const prodID = req.params.id
        const prod = await prodVar.findById(prodID);
        if (!prod) {
        return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(prod);
    } catch (err) {
        res.status(500).json({ err });
    }
};

// add product
const addProd = async (req, res) => {
    try {
        const { name, price, brand, category, description } = req.body;
        const image = req.file.filename;
        const add = await prodVar.create({ name, image, price, brand, category, description })
        return res.json({ message: "Product added successfully", add })
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}

// update product
const upProd = async (req, res) => {
    try {
        const prodId = req.params.id;
        const { name, price, brand, category, description } = req.body;
        const find = await prodVar.findById(req.params.id)
        const image = req.file ? req.file.filename : find.image;
        const update = await prodVar.findByIdAndUpdate(prodId, { name, image, price, brand, category, description }, { new: true })
        console.log(update)
        return res.json({ message: "Product updated successfully", update })
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}

const delProd = async (req, res) => {
    try {
        const prodId = req.params.id;
        const del = await prodVar.findByIdAndDelete(prodId);
        return res.json({ message: "Product successfully deleted" });
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}


export { uploads, getProd, getProdId, addProd, upProd, delProd }