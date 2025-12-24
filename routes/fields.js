import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/auth.js";

router.get("/", authenticateUser, async (req, res, next) => {
  const fields = await req.pool
    .query(
      `select 
        f.id, 
        f.name, 
        count(fv.id) as use_count
      from fields f
      left join field_values fv on f.id = fv.field_id
      group by f.id, f.name
      order by use_count desc, f.name asc`
    )
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
