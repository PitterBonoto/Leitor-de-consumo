import { Router } from "express";
import { listMeasures } from "../controllers/listController";

const router = Router();

router.get("/:customer_code/list", listMeasures);

export default router;
