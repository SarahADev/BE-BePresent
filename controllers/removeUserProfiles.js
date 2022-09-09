const { deleteUserProfiles } = require("../models/deleteUserProfiles")

exports.removeUserProfiles = (req, res, next) => {
    deleteUserProfiles(req.params, req.body).then(() => {
        res.status(204).send();
    });
};