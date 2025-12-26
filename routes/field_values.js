import { router } from "express";
const router = router();

import authenticateuser from "../middleware/auth.js";

router.post("/", authenticateuser, async (req, res) => {
  try {
    const { note_id, field_id, value } = req.body;
    const result = await req.pool.query({
      text: `insert into field_values (note_id, field_id, value) 
             values ($1, $2, $3)
             on conflict (note_id, field_id) do update set value = $3
             returning *`,
      values: [note_id, field_id, value],
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:note_id/:field_id",
  authenticateuser,
  async (req, res, next) => {
    try {
      const { note_id, field_id } = req.params;
      const { value } = req.body;
      const result = await req.pool.query({
        text: `update field_values set value = $3 
             where note_id = $1 and field_id = $2 
             returning *`,
        values: [note_id, field_id, value],
      });
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:note_id/:field_id", authenticateuser, async (req, res) => {
  try {
    const { note_id, field_id } = req.params;
    await req.pool.query({
      text: "delete from field_values where note_id = $1 and field_id = $2",
      values: [note_id, field_id],
    });
    res.sendstatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
