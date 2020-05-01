import { RequestHandler } from "express";
import MissingParameterError from "../../errors/MissingParameterError";
import MissingTokenError from "../../errors/MissingTokenError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import StoreItem, { Images, IShopItem } from "../../models/StoreItem";
import admin from "../../services/firebase";
import { parseResizedImages } from "../../utils/string";

const add: RequestHandler = async (req, res) => {
  const {
    category,
    subCategory,
    itemCategory,
    specificCategory,
    name,
    description,
    price,
    condition,
    images
  } = req.body;

  const { token } = req;

  if (!token) {
    throw new MissingTokenError();
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  if (
    !category ||
    !subCategory ||
    !itemCategory ||
    !specificCategory ||
    !name ||
    !description ||
    !price ||
    !condition ||
    !images
  ) {
    throw new MissingParameterError();
  }

  const createdShopItem: IShopItem = {
    userId,
    category,
    subCategory,
    itemCategory,
    specificCategory,
    name,
    description,
    price,
    condition,
    images: parseResizedImages(images) as Images[]
  };

  const storeItem = new StoreItem(createdShopItem);
  await storeItem.save();

  res.send({
    message: "Saved",
    storeItem: storeItem.toJSON()
  });
};

export default handleErrorMiddleware(add);
