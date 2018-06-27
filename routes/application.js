var router = require('express').Router();

router.IsAuthenticated = function(req, res, next){
    if(req.IsAuthenticated()){
        next();
    } else {
        next(new Error(401));
    }
}

router.destroyession = function(req, res, next) {
    req.logOut();
    req.session.destroy();
    res.redirect("/")
}







module.exports = router