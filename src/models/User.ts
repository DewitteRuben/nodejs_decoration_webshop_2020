import { Document, Model, model, Schema } from "mongoose";

export interface ILocationInformation {
  postalCode: string;
  city: string;
  country: string;
  street: string;
}

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  username: string;
  emailAddress: string;
  photoURL: string;
  phoneNumber: string;
  address: ILocationInformation;
  birthdate: Date;
}

export interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {}

const schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    username: String,
    emailAddress: String,
    photoURL: String,
    phoneNumber: String,
    birthdate: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    address: {
      street: String,
      postalCode: String,
      city: String,
      country: String
    }
  },
  { timestamps: true }
);

const User: IUserModel = model<IUserDocument, IUserModel>("User", schema);

export default User;
