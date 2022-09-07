const { deleteUserById } = require("../models/deleteUsers")

exports.removeUserById= (req, res) => {
    const deleteUserId = req.params
    deleteUserById(deleteUserId).then(()=>{
        res.sendStatus(204)
    })
    .catch((err) => {
        console.log('controller catch block')
        console.log(err.status, err.msg, 'err in controller')
        res.status(err.status).send({msg : err.msg})
    });
}