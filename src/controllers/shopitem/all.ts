import { RequestHandler } from "express";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import StoreItem from "../../models/StoreItem";

const all: RequestHandler = async (req, res) => {
  const items = await StoreItem.find();
  res.send(items);
};

export default handleErrorMiddleware(all);
