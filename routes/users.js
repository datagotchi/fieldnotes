import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("Invalid request: email and password are required.");
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  const token = await bcrypt.hash(email + Date.now(), 10);

  const user = await req.pool
    .query({
      text: "insert into users (email, password, token) values ($1::text, $2::text, $3::text) returning *",
      values: [email, hashedPassword, token],
    })
    .then((result) => result.rows[0]);

  console.log("*** user: ", user);

  // omit sending password
  return res.status(200).json({
    email: user.email,
    token: user.token,
  });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("Invalid request: email and password are required.");
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
      const user = await req.pool
        .query({
          text: "update users set token = $1::text where email = $2::text returning *",
          values: [token, email],
        })
        .then((result) => result.rows[0]);
      // omit sending password
      return res.status(200).json({
        email: user.email,
        token: user.token,
      });
    }
    return res.status(401).send("Invalid credentials.");
  }
  return res.status(404).send("Email adadress not found."); // TODO: combine this with other error(s) for more security
});

// TODO: router.get - authenticateUser
// TODO: router.patch - authenticateUser

export default router;
