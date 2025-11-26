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
  return res.send(notes);
});

router.post("/", async (req, res, next) => {
  const note = req.body;
  const newNote = await req.pool
    .query({
      text: "insert into notes (text, datetime, user_id) values ($1::text, $2::timestamp, $3::integer) returning *",
      values: [note.text, new Date().toISOString(), 1],
    })
    .then((response) => response.rows[0]);
  return res.send(newNote);
});

router.delete("/:note_id", async (req, res, next) => {
  await req.pool.query({
    text: "delete from notes where id = $1::integer",
    values: [req.params.note_id],
  });
  return res.sendStatus(200);
});

export default router;
