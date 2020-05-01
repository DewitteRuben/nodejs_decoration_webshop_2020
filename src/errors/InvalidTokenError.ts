export default class InvalidTokenError extends Error {
  public message: string = "The token you provided was invalid.";

  public status: number = 401;

  public type: string = "unauthorized";
}
