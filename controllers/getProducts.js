const { selectProduct } = require("../models/selectProduct")

exports.getProducts = (req, res) => {
    const {categories} = req.body
    selectProduct(categories).then((products) => {
        res.status(200).send(products);
    }).catch((err) => {
        console.log(err);
    });
};
