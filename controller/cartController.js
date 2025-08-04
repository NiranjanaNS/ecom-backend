import cartVar from "../model/cart";

const addCart = async (req, res) => {
    try {
        const add = await cartVar.aggregate({
            
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ err });
    }
}