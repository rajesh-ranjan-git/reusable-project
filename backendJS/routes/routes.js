import express from "express";

import { controller } from "../controllers/controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/route1", controller);
router.post("/route2", controller);
router.put("/route3", controller);
router.patch("/route4", controller);
router.delete("/route5", controller);

router.get("/route1", auth, controller);
router.post("/route2", auth, controller);
router.put("/route3", auth, controller);
router.patch("/route4", auth, controller);
router.delete("/route5", auth, controller);

router.get("/route1/:param", auth, controller);
router.post("/route2/:param", auth, controller);
router.put("/route3/:param", auth, controller);
router.patch("/route4/:param", auth, controller);
router.delete("/route5/:param", auth, controller);

export default router;
