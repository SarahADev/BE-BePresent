const { updateUser } = require("../models/updateUser");

exports.patchUser = (req, res, next) => {
  updateUser(req.params, req.body)
    .then((updatedUser) => {
      res.status(200).send({ user: updatedUser });
    })
    .catch(next);
};
