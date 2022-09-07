const { insertUsers } = require("../models/insertUsers")

exports.postUsers = (req, res) => {
    const newUser = req.body
    insertUsers(newUser).then((postedUser)=>{
        res.status(201).send(postedUser)
    })
    .catch((err) => {
        res.status(err.status).send(err.msg)
    });
}