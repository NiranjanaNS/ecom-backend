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

export { getCategories }