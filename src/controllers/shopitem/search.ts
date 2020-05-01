import { RequestHandler } from "express";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import ShopItem from "../../models/StoreItem";

const search: RequestHandler = async (req, res, next) => {
  const searchString = req.query.search;

  if (!searchString) {
    return next();
  }

  const query = ShopItem.find({ $text: { $search: searchString } });
  const maxPriceInCollection = await query.sort({ price: -1 }).limit(1);
  const minPriceInCollection = await query.sort({ price: +1 }).limit(1);
  const collectionPrice = {
    ...(minPriceInCollection[0]?.price && { minPrice: minPriceInCollection[0].price }),
    ...(maxPriceInCollection[0]?.price && { maxPrice: maxPriceInCollection[0].price })
  };

  const items = await query;

  return res.send({ items, ...collectionPrice });
};

export default handleErrorMiddleware(search);
