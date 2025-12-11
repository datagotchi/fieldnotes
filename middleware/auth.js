import { compare } from "bcrypt";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    const user = await req.pool
      .query({
        text: "select * from users where email = $1::text and token = $2::text",
      })
      .then((result) => result.rows[0]);

    if (user) {
      try {
        const match = await compare(req.body.password, storedUserHash);

        if (match) {
          req.user = user;
          return next(); // Proceed to the main route handler [2]
        } else {
          // Passwords don't match
          return res
            .status(401)
            .send("Authentication failed: Incorrect password");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error during authentication");
      }
    }

    return res.status(401).send("Invalid token");
  }
  return res.status(401).send("No Authentication header");
};

export default authenticateUser;
