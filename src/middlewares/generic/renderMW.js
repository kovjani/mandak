/**
 * Render the given page (with EJS)
 */

module.exports = function(objectrepository, viewName) {
    return function(req, res, next) {
        res.render(viewName, objectrepository);
        return next();
    };
};
