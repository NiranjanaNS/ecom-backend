import userVar from "../model/user";

const query = async (req, res) => {
    const details = req.query;
    const name = details.name;
    const n = await userVar.find({ name: name });
}

router.get('/', () => {
    const promise = new promise((req, res) => {

    })
})

promise.race()