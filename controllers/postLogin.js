const {insertLogin} = require('../models/insertLogin')

exports.postLogin= (req, res) => {
    insertLogin(req.body).then(({user_id, first_name, last_name})=>{
       res.status(201).send({user_id, first_name, last_name})
    })
    .catch((err) => {
        res.status(err.status).send({msg: err.msg})
    });
}