import catVar from "../model/category.js";

// categories
const getCategories = async (req, res) => {
  try {
    const category = await catVar.find();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const addCat = async (req, res) => {
    try {
        const add = await catVar.create(req.body)
        return res.json({ message: "Category added successfully", add })
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}

// update product
const upCat = async (req, res) => {
    try {
        const catId = req.params.id;
        const update = await catVar.findByIdAndUpdate(catId, req.body, { new: true })
        return res.json({ message: "Category updated successfully", update })
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}

const delCat = async (req, res) => {
    try {
        const catId = req.params.id;
        await catVar.findByIdAndDelete(catId);
        return res.json({ message: "Category successfully deleted" });
    }
    catch(err) {
        res.status(500).json({ err });
        console.log(err)
    }
}

const adminAuth = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        return res.status(403).json({ message: "Admin access denied" });
    }
};

export { getCategories, addCat, upCat, delCat, adminAuth }