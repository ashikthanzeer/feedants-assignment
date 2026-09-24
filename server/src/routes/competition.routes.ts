import { Router } from "express";

import {
  listCompetitions,
  getCompetition,
  registerCompetition,
} from "../controllers/competition.controller";

const router = Router();

router.get("/", listCompetitions);

router.get("/:id", getCompetition);

router.post("/:id/register", registerCompetition);

export default router;