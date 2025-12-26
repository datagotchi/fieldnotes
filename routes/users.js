import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";

import authenticateUser from "../middleware/auth.js";

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res
        .status(400)
        .json({ error: "Invalid request: email and password are required." });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const token = await bcrypt.hash(email + Date.now(), 10);

    const user = await req.pool
      .query({
        text: "insert into users (email, password) values ($1::text, $2::text) returning *",
        values: [email, hashedPassword],
      })
      .then((result) => result.rows[0]);

    req.pool
      .query({
        text: `insert into sessions (user_id, token) values (
            (select id from users where email = $1::text), $2::text) 
            on conflict (user_id, token) do nothing
            returning *`,
        values: [],
      })
      .then((result) => {
        user.token = result.rows[0].token;
      });

    // omit sending password
    return res.status(200).json({
      email: user.email,
      token: user.token,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res
        .status(400)
        .json({ error: "Invalid request: email and password are required." });
    }

    const user = await req.pool
      .query({
        text: "select * from users where email = $1::text",
        values: [email],
      })
      .then((result) => result.rows[0]);

    if (user) {
      if (await bcrypt.compare(password.trim(), user.password)) {
        const token = await bcrypt.hash(email + Date.now(), 10);
        await req.pool
          .query({
            text: `insert into sessions (user_id, token) values (
            (select id from users where email = $1::text), $2::text) 
            on conflict (user_id, token) do update set token = excluded.token
            returning *`,
            values: [email, token],
          })
          .then((result) => {
            user.token = result.rows[0].token;
          });
        // omit sending password
        return res.status(200).json({
          email: user.email,
          token: user.token,
        });
      }
      return res.status(401).json({ error: "Invalid credentials." });
    }
    return res.status(404).json({ error: "Email adadress not found." }); // TODO: combine this with other error(s) for more security
  } catch (err) {
    next(err);
  }
});

router.delete("/logout/:email", authenticateUser, async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    await req.pool.query({
      text: "delete from sessions where user_id = (select id from users where email = $1::text) and token = $2::text",
      values: [email, token],
    });
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
