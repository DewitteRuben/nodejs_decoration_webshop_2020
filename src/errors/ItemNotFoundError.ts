export default class ItemNotFoundError extends Error {
  public message: string = "The requested item was not found.";

  public status: number = 404;

  public type: string = "not-found";

  public itemId = "";

  constructor(id: string) {
    super();
    this.itemId = id;
  }
}
