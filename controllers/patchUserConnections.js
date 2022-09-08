const { updateUserConnections } = require("../models/updateUserConnections")

exports.patchUserConnections = (req, res, next) => {
    updateUserConnections(req.params, req.body).then((user) => {
        res.status(200).send({user});
    }).catch(next);
};