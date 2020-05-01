export default class UserAlreadyExistsError extends Error {
  public message: string = "The user already exists.";

  public status: number = 409;

  public type: string = "conflict";
}
