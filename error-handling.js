exports.customErrors = ((err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({msg: err.msg});
    };
});