import { RequestHandler } from "express";
import ItemNotFoundError from "../../errors/ItemNotFoundError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import ShopItem from "../../models/StoreItem";

const get: RequestHandler = async (req, res, next) => {
  const { category, subCategory, itemCategory, specificCategory, minPrice, maxPrice, id, userId, amount } = req.query;

  if (!Object.keys(req.query).length) {
    return next();
  }

  if (id) {
    const itemById = await ShopItem.findOne({ id }).select("-__v");
    if (!itemById) throw new ItemNotFoundError(id);
    return res.send(itemById);
  }

  const query: { [key: string]: string } = { category, subCategory, itemCategory, specificCategory, userId };

  // remove undefined values
  Object.keys(query).forEach((key: string) => query[key] === undefined && delete query[key]);

  // filter by min/max price if it was provided.
  const priceFilter = {
    price: { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) }
  };

  const itemsQuery = ShopItem.find({ ...query, ...((minPrice || maxPrice) && priceFilter) }).select("-__v");
  const items = await itemsQuery;

  if (amount) {
    return res.send({ amount: items.length });
  }

  const allItems = ShopItem.find({ ...query });
  const maxPriceInCollection = await allItems.sort({ price: -1 }).limit(1);
  const minPriceInCollection = await allItems.sort({ price: +1 }).limit(1);

  const collectionPrice = {
    ...(minPriceInCollection[0]?.price && { minPrice: minPriceInCollection[0].price }),
    ...(maxPriceInCollection[0]?.price && { maxPrice: maxPriceInCollection[0].price })
  };

  // (await ShopItem.find({})).forEach(async (val: IShopItem) => {
  //   await ShopItem.updateOne({ _id: val._id }, { $set: { id: shortid.generate() } }, { new: true });
  // });

  return res.send({ items, ...collectionPrice });
};

export default handleErrorMiddleware(get);
