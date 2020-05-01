export default class MissingParameterError extends Error {
  public message: string = "A parameter is missing from the request body.";

  public status: number = 400;

  public type: string = "Bad request";
}
