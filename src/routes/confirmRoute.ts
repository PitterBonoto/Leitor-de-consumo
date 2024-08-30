import { Router } from "express";
import { confirmMeasure } from "../controllers/confirmController";

const router = Router();

router.patch("/confirm", confirmMeasure);

export default router;
