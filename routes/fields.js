import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/auth.js";

router.get("/", authenticateUser, async (req, res, next) => {
  const fields = await req.pool
    .query("select * from fields")
    .then((result) => result.rows);
  return res.json(fields);
});

router.post("/", authenticateUser, async (req, res, next) => {
  const { name } = req.body;
  if (name) {
    const newField = await req.pool
      .query({
        text: "insert into fields (name) values ($1::text) returning *",
        values: [name],
      })
      .then((result) => result.rows[0]);

    return res.json(newField);
  } else {
    return res.sendStatus(400);
  }
});

export default router;
