const { updateUserProfiles } = require("../models/updateUserProfiles");

exports.patchUserProfiles = (req, res, next) => {
    updateUserProfiles(req.params, req.body).then((user) => {
        res.status(200).send({user});
    }).catch(next);
};