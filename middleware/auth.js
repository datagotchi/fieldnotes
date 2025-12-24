import { compare } from "bcryptjs";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const email = req.headers["x-email"];
  if (token && email) {
    const user = await req.pool
      .query({
        text: "select * from users where email = $1::text",
        values: [email],
      })
      .then((result) => result.rows[0]);

    if (user) {
      try {
        const foundToken = await req.pool
          .query({
            text: "select * from sessions where user_id = (select id from users where email = $1::text) and token = $2::text",
            values: [email, token],
          })
          .then((result) => result.rows[0]?.token);
        if (foundToken) {
          req.user = user;
          return next(); // Proceed to the main route handler [2]
        }
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Server error during authentication" });
      }
    }

    return res.status(401).json({ error: "Invalid token" });
  }
  return res.status(401).json({ error: "No Authentication or email header" });
};

export default authenticateUser;
