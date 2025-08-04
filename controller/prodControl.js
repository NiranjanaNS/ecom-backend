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

export { uploads, getProd, getProdId }