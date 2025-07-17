import { StatusCodes, getReasonPhrase } from "http-status-codes";

interface IErrorResponse {
  status: StatusCodes;
  message: string;
  redirectUrl?: string;
}

const defaultErrorResponse: IErrorResponse = {
  status: StatusCodes.INTERNAL_SERVER_ERROR,
  message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  redirectUrl: undefined,
};

class ErrorResponse extends Error {
  status: StatusCodes;
  redirectUrl?: string;
  constructor({
    status,
    message,
    redirectUrl,
  }: IErrorResponse = defaultErrorResponse) {
    super(message);
    this.redirectUrl = redirectUrl;
    this.status = status;
  }
}

export default ErrorResponse;
