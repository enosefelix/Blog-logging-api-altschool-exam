const { connect } = require("./database");
const request = require("supertest");
const app = require("../index");
const { userModel } = require("../models/auth.model");

describe("User: POST /signup", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const user = {
      "first_name": "john",
      "last_name": "doe",
      "email": "doe@example.com",
      "password": "Password1"
    };
    const res = await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('first_name', 'john')
    expect(res.body.user).toHaveProperty('last_name', 'doe')
    expect(res.body.user).toHaveProperty('email', 'doe@example.com')
  });
});

describe("User: POST /login", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should login a user", async () => {
    const data = {
      "first_name": "john",
      "last_name": "doe",
      "email": "doe@example.com",
      "password": "Password1"
    };
    const user = await userModel.create(data)
    const res = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send( data )
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  });
});
