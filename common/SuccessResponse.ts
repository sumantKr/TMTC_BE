import { StatusCodes, getReasonPhrase } from "http-status-codes";

interface ISuccessResponse {
  status: StatusCodes;
  message: string;
  data?: any;
  redirectUrl?: string;
}

const defaultSuccessResponse: ISuccessResponse = {
  status: StatusCodes.OK,
  message: getReasonPhrase(StatusCodes.OK),
  redirectUrl: undefined,
  data: undefined,
};

class SuccessResponse {
  status: StatusCodes;
  message: string;
  data?: any;
  redirectUrl?: string;
  constructor({
    status,
    message,
    redirectUrl,
    data,
  }: ISuccessResponse = defaultSuccessResponse) {
    this.redirectUrl = redirectUrl;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default SuccessResponse;
