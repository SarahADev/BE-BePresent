const { deleteUserConnection } = require("../models/deleteUserConnection")


exports.removeUserConnection = (req, res, next) => {
    deleteUserConnection(req.params, req.body).then(() => {
        res.status(204).send();
    });
};