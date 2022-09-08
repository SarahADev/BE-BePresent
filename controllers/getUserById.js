const { selectUserById } = require("../models/getUserById");

exports.getUserById = (req, res, next) => {
    const id = req.params.userId;
    selectUserById(id).then((user) => {
        res.status(200).send({user});
    }).catch(next);
};