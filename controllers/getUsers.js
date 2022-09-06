const { selectUsers } = require("../models/selectUsers")

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    }).catch((err) => {
        console.log(err);
    });
};