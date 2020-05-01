import { RequestHandler } from "express";
import MissingParameterError from "../../errors/MissingParameterError";
import MissingTokenError from "../../errors/MissingTokenError";
import UnauthorizedRequestError from "../../errors/UnauthorizedRequestError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import StoreItem from "../../models/StoreItem";
import admin from "../../services/firebase";
import { parseResizedImages } from "../../utils/string";

const update: RequestHandler = async (req, res) => {
  const { id, type } = req.query;
  const { token } = req;

  if (!id) {
    throw new MissingParameterError();
  }

  if (type) {
    const action = { $inc: { wishlists: type === "incr" ? 1 : -1 } };
    const wishlistedItem = await StoreItem.findOneAndUpdate({ id }, action, { new: true });
    const wishlistResult = await wishlistedItem.save();
    return res.send({
      message: "Saved",
      storeItem: wishlistResult.toJSON()
    });
  }

  if (!token) {
    throw new MissingTokenError();
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  const item = await StoreItem.findOne({ id });

  if (item.userId !== userId) {
    throw new UnauthorizedRequestError();
  }

  const { images, ...other } = req.body;

  const updatedItem = await StoreItem.findOneAndUpdate(
    { id },
    { ...(images && { images: parseResizedImages(images) }), ...other },
    { new: true }
  );
  const result = await updatedItem.save();

  return res.send({
    message: "Saved",
    storeItem: result.toJSON()
  });
};

export default handleErrorMiddleware(update);
