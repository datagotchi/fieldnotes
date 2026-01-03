/**
 * @jest-environment node
 */

import request from "supertest";
import express, { json } from "express";
import router from "./fields.js";

jest.mock("../middleware/auth.js", () => (req, res, next) => next());

describe("fields routes", () => {
  let app, pool;

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    };
    app = express();
    app.use(express.json());
    // Inject mock pool into req
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use("/", router);
    // Error handler for testing
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  describe("GET /fields", () => {
    it("should return 401 without authentication", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        error: "No Authentication or email header",
      });
    });
    it("should return 200 with valid authentication", async () => {
      console.log("Starting test for GET /fields with authentication");
      // FIXME: this post request is not working
      const res = await request(app)
        .get("/")
        .set("Authorization", "Bearer test-token")
        .set("x-email", "bob@datagotchi.net");
      console.log("Response received:", res.status, res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        fields: [],
      });
      console.log("Test completed");
    });
  });

  describe("POST /fields", () => {
    it("should return 401 without authentication", async () => {
      const res = await request(app)
        .post("/fields")
        .set("Content-Type", "application/json")
        .send({ name: "Test Field" });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        error: "No Authentication or email header",
      });
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app)
        .post("/fields")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer test-token")
        .set("x-email", "bob@datagotchi.net");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Name is required" });
    });

    it("should return 200 and create field with valid authentication and name", async () => {
      const res = await request(app)
        .post("/fields")
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer test-token")
        .set("x-email", "bob@datagotchi.net")
        .send({ name: "Test Field" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: "Test Field",
        user_id: expect.any(Number),
      });
    });
  });
});
