import { RequestHandler } from "express";
import _ from "lodash";
import ItemNotFoundError from "../../errors/ItemNotFoundError";
import MissingTokenError from "../../errors/MissingTokenError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import User, { IUser } from "../../models/User";
import admin from "../../services/firebase";

const update: RequestHandler = async (req, res) => {
  const { token } = req;

  if (!token) {
    throw new MissingTokenError();
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;
  const user = await User.findOne({ userId });
  if (!user) {
    throw new ItemNotFoundError(userId);
  }

  const requestUser: Partial<IUser> = req.body;

  // eslint-disable-next-line prefer-const
  let { photoURL, ...rest } = requestUser;
  if (Array.isArray(photoURL)) {
    [photoURL] = photoURL;
  }

  const cleanedUser = _.pickBy({ photoURL, ...rest }, value => value !== undefined);

  // update firebase credentials as well
  const { username, phoneNumber } = requestUser;

  const firebaseUserCreds = { phoneNumber, displayName: username, photoURL };
  const cleanedFirebaseUserCreds = _.pickBy(firebaseUserCreds, value => value !== undefined);
  await admin.auth().updateUser(userId, cleanedFirebaseUserCreds);

  const updatedUser = _.merge(user.toObject(), cleanedUser);
  await user.set(updatedUser).save();

  res.send({
    message: "Saved",
    user: user.toJSON()
  });
};

export default handleErrorMiddleware(update);
