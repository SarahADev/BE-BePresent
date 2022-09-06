const { selectUsers } = require("../models/selectUsers")

exports.getUsers = (req, res) => {
    selectUsers().then((response) => {
        res.status(200).send(response);
    }).catch((err) => {
        console.log(err);
    });
};