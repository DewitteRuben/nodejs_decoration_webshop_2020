import { Document, Model, model, Schema } from "mongoose";
import shortid from "../utils/shortid";

export interface Images {
  small: string;
  regular: string;
  full: string;
  thumb: string;
  [key: string]: string;
}

export interface IShopItem {
  userId: string;
  category: string;
  subCategory: string;
  itemCategory: string;
  specificCategory: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  images: Images[];
}

export interface IShopItemDocument extends IShopItem, Document {}

interface IShopItemModel extends Model<IShopItemDocument> {}

const schema = new Schema(
  {
    userId: { type: String, required: true },
    id: { type: String, unique: true, required: true, default: shortid.generate },
    wishlists: { type: Number, default: 0 },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    itemCategory: { type: String, required: true },
    specificCategory: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: String, required: true, enum: ["new", "like-new", "good", "poor", "fair"] },
    images: [
      {
        small: { type: String },
        regular: { type: String },
        full: { type: String },
        thumb: { type: String }
      }
    ]
  },
  { timestamps: true }
);

schema.index({ "$**": "text" });

const ShopItem: IShopItemModel = model<IShopItemDocument, IShopItemModel>("ShopItem", schema);

export default ShopItem;
