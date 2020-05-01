import { RequestHandler } from "express";
import _ from "lodash";
import MissingTokenError from "../../errors/MissingTokenError";
import UserAlreadyExistsError from "../../errors/UserAlreadyExistsError";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import User, { IUser } from "../../models/User";
import admin from "../../services/firebase";

const add: RequestHandler = async (req, res) => {
  const { token } = req;

  if (!token) {
    throw new MissingTokenError();
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  const existingUser = await User.exists({ userId });

  if (existingUser) {
    throw new UserAlreadyExistsError();
  }

  const requestUser: Partial<IUser> = req.body;

  const cleanedUser = _.pickBy(requestUser, value => value !== undefined);

  const user = new User({ userId, ...cleanedUser });
  await user.save();

  res.send({
    message: "Saved",
    user: user.toJSON()
  });
};

export default handleErrorMiddleware(add);
