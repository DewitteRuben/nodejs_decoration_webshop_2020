import cors from "cors";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import apiSpec from "../openapi.json";
import * as ShopItemController from "./controllers/shopitem";
import * as UserController from "./controllers/user";

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }"
};

const router = Router();
router.use(cors());

router.post("/shopitem", ShopItemController.add);
router.get("/shopitem", ShopItemController.search);
router.get("/shopitem", ShopItemController.filter);
router.get("/shopitem", ShopItemController.all);
router.put("/shopitem", ShopItemController.update);
router.delete("/shopitem", ShopItemController.del);

router.get("/user", UserController.filter);
router.post("/user", UserController.add);
router.put("/user", UserController.update);

// Dev routes
if (process.env.NODE_ENV === "development") {
  router.use("/dev/api-docs", swaggerUi.serve);
  router.get("/dev/api-docs", swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
