var validator = require('sails-validation-messages');

module.exports = {
    jsonResolveError: function (err, Model, res) {
        console.log(err);
        var response = {
            response : {
                message: 'Validation error has occured',
            }
        };
        if (err.invalidAttributes) {
            err.invalidAttributes = validator(Model, err.invalidAttributes);
            response.response.message = 'Validation error has occured';
            response.response.errors = err.invalidAttributes;
            return res.send(400, response);
        } else {
            var indexError = JSON.parse(JSON.stringify(err));
            if ((indexError.status == 500) && (indexError.raw.code == 11000)){
                if (indexError.raw.err.indexOf('@') !== -1) {
                    response.response.errors = {email: [{rule: "unique", message: "The email has already been registered"}]};
                } else if (indexError.raw.err.indexOf('subdomain') !== -1){
                    response.response.errors = {subdomain: [{rule: "unique", message: "The subdomain has been registered"}]};
                } else {
                    response.response.error = "The record has already been registered";
                }
                return res.send(400, response);
            }
        }
        return res.negotiate(err);
    },
    uniquenessError: function (fieldName, Model, res) {
        var response = {
            "response": {
                "message": "Validation error has occured",
                "errors": {}
            }
        };
        var message = Model.validationMessages[fieldName].unique;
        response.response.errors[fieldName] = [{
            "rule": "unique",
            "message": message
        }];
        return res.send(400, response);
    }
};
