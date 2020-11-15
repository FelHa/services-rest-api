module.exports = function(req, res, next){
    if(!req.token.isAdmin) return res.status(403).send('Access forbidden.');
    next();
}