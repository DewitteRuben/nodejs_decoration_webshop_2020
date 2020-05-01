export default class MissingTokenError extends Error {
  public message: string = "No token was not found in the 'authorization' header.";

  public status: number = 401;

  public type: string = "unauthorized";
}
