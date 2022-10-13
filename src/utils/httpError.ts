export class HttpError extends Error {
  constructor(
    status: number,
    message: string,
    type = 'UNKNOWN_ERROR',
    data: object = {}
  ) {
    super();
    this.status = status;
    this.message = message;
    this.type = type;
    this.data = data;
  }
  status: number;
  message: string;
  type: string;
  data: object;
}
