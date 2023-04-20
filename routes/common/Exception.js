class ApiException extends Error {
    constructor(response,errorCode, httpCode = 400) {
      super();
      this.errorCode = errorCode;
      this.status = httpCode;
      response.status(200).json({error : errorCode});
    }
}
  
module.exports = ApiException;
