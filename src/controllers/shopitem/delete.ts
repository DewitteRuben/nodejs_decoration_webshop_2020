import { RequestHandler } from "express";
import MissingParameterError from "../../errors/MissingParameterError";
import MissingTokenError from "../../errors/MissingTokenError";
import UnauthorizedRequestError from "../../errors/UnauthorizedRequestError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import ShopItem from "../../models/StoreItem";
import admin from "../../services/firebase";

const deleteItem: RequestHandler = async (req, res) => {
  const { id } = req.query;
  const { token } = req;

  if (!token) {
    throw new MissingTokenError();
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  if (!id) {
    throw new MissingParameterError();
  }

  const item = await ShopItem.findOne({ id });

  if (item.userId !== userId) {
    throw new UnauthorizedRequestError();
  }

  const deletedItem = await ShopItem.findOneAndDelete({ id });

  res.send({
    message: "Deleted",
    item: deletedItem.toJSON()
  });
};

export default handleErrorMiddleware(deleteItem);
