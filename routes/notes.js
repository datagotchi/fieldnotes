import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/auth.js";

router.get("/", authenticateUser, async (req, res, next) => {
  const notes = await req.pool
    .query({
      text: "select * from notes where user_id = $1::integer",
      values: [req.user.id],
    })
    .then((response) => response.rows);
  await Promise.all(
    notes.map((n) =>
      req.pool
        .query({
          text: "select * from field_values where note_id = $1::integer",
          values: [n.id],
        })
        .then((result) => {
          n.field_values = result.rows;
        })
    )
  );
  return res.json(notes);
});

router.post("/", authenticateUser, async (req, res, next) => {
  const note = req.body;
  const newNote = await req.pool
    .query({
      text: "insert into notes (text, datetime, user_id) values ($1::text, $2::timestamp, $3::integer) returning *",
      values: [note.text, new Date().toISOString(), req.user.id],
    })
    .then((response) => response.rows[0]);
  return res.json(newNote);
});

router.delete("/:note_id", authenticateUser, async (req, res, next) => {
  await req.pool.query({
    text: "delete from notes where id = $1::integer",
    values: [req.params.note_id],
  });
  return res.sendStatus(204);
});

router.patch("/:note_id", authenticateUser, async (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    const changes = req.body;
    const keys = Object.keys(changes || {});
    if (keys.length === 0) {
      return res.sendStatus(400);
    }

    // basic column name validation to avoid injection
    const validKeys = keys.filter((k) => /^[a-z][a-z0-9_]*$/i.test(k));
    if (validKeys.length === 0) {
      return res.sendStatus(400);
    }
    let note = {};

    // update the notes table with some keys
    const updateKeys = keys.filter((k) => k !== "field_values");
    const set = updateKeys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
    const values = updateKeys.map((k) => changes[k]);
    if (set && values.length > 0) {
      values.push(Number(req.params.note_id));
      const updatedNote = await req.pool
        .query({
          text: `update notes set ${set} where id = $${values.length} returning *`,
          values,
        })
        .then((result) => result.rows[0]);
      note = updatedNote;
    }

    if (changes.field_values && changes.field_values.length === 1) {
      const newFieldValue = changes.field_values[0];
      const newField = await req.pool
        .query({
          text: `insert into field_values (field_id, note_id, value) values ($1::integer, $2::integer, $3::text)
          on conflict (field_id, note_id) do update set value = $3::text
          returning *`,
          values: [
            newFieldValue.field_id,
            req.params.note_id,
            newFieldValue.field_value,
          ],
        })
        .then((result) => result.rows[0]);
      note.field_values = [newField];
    }

    return res.json(note);
  }
  return res.sendStatus(400);
});

export default router;
