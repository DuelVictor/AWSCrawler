class Response {
    isSuccess;
    statusCode;
    statusText;
    message;
    data;

    constructor(isSuccess, statusCode, statusText, message = '') {
        this.isSuccess = isSuccess;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.message = message;
    }
}

export class SuccessfulResponse extends Response {
    constructor(isSuccess, statusCode, statusText, message, data) {
        super(isSuccess, statusCode, statusText, message);
        this.data = data;
    }
}

export class ErrorResponse extends Response {
    constructor(isSuccess, statusCode, statusText, message) {
        super(isSuccess, statusCode, statusText, message);
    }
}