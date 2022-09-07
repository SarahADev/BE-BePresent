const { deleteUserById } = require("../models/deleteUsers")

exports.removeUserById= (req, res) => {
    const deleteUserId = req.params
    deleteUserById(deleteUserId).then(()=>{
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status(err.status).send({msg : err.msg})
    });
}