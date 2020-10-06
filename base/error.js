'use strict';

const handleError = (err, req, res, next) => {
    const { statusCode = 400, message = 'Bad request.', code = null, status = 'error' } = err;
    res.status(statusCode).json({
        statusCode,
        message,
        code,
        status,
    });
};

class CustomError extends Error {
    constructor(statusCode, message, code, status) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        this.status = status;
    }
}

module.exports = {
    CustomError,
    handleError,
};
