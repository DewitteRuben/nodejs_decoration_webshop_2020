export default class UnauthorizedRequestError extends Error {
  public message: string = "You are not authorized to make this change.";

  public status: number = 401;

  public type: string = "unauthorized";
}
