/* Authorization not in middleware, because right now you cannot generically access objects in db
 or authorize before accessing objects, which store information needed to authorize*/

module.exports = function (objectId, res) {
  if (res.locals.token._id === objectId.toString() || res.locals.token.isAdmin)
    return true;
};
