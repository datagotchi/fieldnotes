import { Router } from "express";
const router = Router();

// TODO: add 'auth' like in Inspect to get the correct user_id
router.get("/", async (req, res, next) => {
  const notes = await req.pool
    .query({
      text: "select * from notes where user_id = $1::integer",
      values: [1],
    })
    .then((response) => response.rows);
  return res.json(notes);
});

router.post("/", async (req, res, next) => {
  const note = req.body;
  const newNote = await req.pool
    .query({
      text: "insert into notes (text, datetime, user_id) values ($1::text, $2::timestamp, $3::integer) returning *",
      values: [note.text, new Date().toISOString(), 1],
    })
    .then((response) => response.rows[0]);
  return res.json(newNote);
});

router.delete("/:note_id", async (req, res, next) => {
  await req.pool.query({
    text: "delete from notes where id = $1::integer",
    values: [req.params.note_id],
  });
  return res.sendStatus(204);
});

router.patch("/:note_id", async (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    if (req.params.note_id) {
      const changes = req.body;
      const keys = Object.keys(changes || {});
      if (keys.length === 0) {
        req.pool.release();
        return res.sendStatus(400);
      }

      // basic column name validation to avoid injection via keys
      const validKeys = keys.filter((k) => /^[a-z][a-z0-9_]*$/i.test(k));
      if (validKeys.length === 0) {
        req.pool.release();
        return res.sendStatus(400);
      }

      const set = validKeys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
      const values = validKeys.map((k) => changes[k]);
      values.push(Number(req.params.note_id));

      const note = await req.pool
        .query({
          text: `update notes set ${set} where id = $${values.length} returning *`,
          values,
        })
        .then((result) => result.rows[0]);
      if (note) {
        return res.json(note);
      }
    } else {
      req.pool.release();
      return res.sendStatus(400);
    }
  }
  req.pool.release();
  return res.sendStatus(404);
});

export default router;
