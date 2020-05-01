import { RequestHandler } from "express";
import handleErrorMiddleware from "../../middleware/handle-error-middleware";
import User from "../../models/User";
import admin from "../../services/firebase";

const filter: RequestHandler = async (req, res) => {
  const { token } = req;
  const { id: requestedUserId } = req.query;

  if (token) {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    if ((userId && !requestedUserId) || requestedUserId === userId) {
      const user = await User.findOne({ userId });
      return res.send(user);
    }
  }

  const strippedUser = await User.findOne({ userId: requestedUserId }, { username: 1, photoURL: 1, gender: 1 });

  return res.send(strippedUser);
};

export default handleErrorMiddleware(filter);
