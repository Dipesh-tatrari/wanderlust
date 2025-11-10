//this is the error file for the manual errors 

class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;