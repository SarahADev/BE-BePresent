const { selectPresents } = require("../models/selectPresents");

exports.getPresents = (req, res, next) => {
    selectPresents(req.params.category).then((presents) => {
        console.log("made it to controller")
        res.status(200).send({presents});
    }).catch((err) => {
        console.log(err);
    });
};