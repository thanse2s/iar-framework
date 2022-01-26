/**
 * this express middleware checks if a user is authenticated;
 * otherwise the request gets intercepted and status 401 is returned
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorizationForAllRoles = (req, res, next) => {
    if(req.session.authenticated){ //check if session was marked as authenticated
        next(); //proceed with next middleware or handler
        return;
    }
    res.status(401).send(); //intercept request
}
/**
 * this express middleware checks if a user is authenticated or even has admin permissions;
 * otherwise the request gets intercepted and status 401 is returned
 * @param {string} requiredRole
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorizationByRole = (requiredRole) =>{
    return(req,res,next) =>{
        if(req.session.authenticated){
            if(requiredRole === req.session.user.role || req.session.user.isAdmin){
                next();
                return;
            }
        }
        res.status(401).send();
    }
}