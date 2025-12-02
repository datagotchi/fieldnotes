import { Router } from "express";
const router = Router();

router.get("/", async (req, res, next) => {
  const fields = await req.pool.query("select * from fields");
  return res.json(fields);
});

export default router;
