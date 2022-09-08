const {insertLogin} = require('../models/insertLogin')

exports.postLogin= (req, res) => {
    insertLogin(req.body).then((user_id)=>{
       res.status(201).send({user_id: user_id})
    })
    .catch((err) => {
        res.status(err.status).send({msg: err.msg})
    });
}