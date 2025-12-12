import { compare } from "bcryptjs";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const emailHeader = req.headers["x-email"];
  if (token && emailHeader) {
    const user = await req.pool
      .query({
        text: "select * from users where email = $1::text and token = $2::text",
        values: [emailHeader, token],
      })
      .then((result) => result.rows[0]);

    if (user) {
      try {
        req.user = user;
        return next(); // Proceed to the main route handler [2]
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error during authentication");
      }
    }

    return res.status(401).send("Invalid token");
  }
  return res.status(401).send("No Authentication or email header");
};

export default authenticateUser;
