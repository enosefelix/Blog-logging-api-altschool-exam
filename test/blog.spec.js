const request = require("supertest");
const { connect } = require("./database");
const app = require("../index");
const {blogModel} = require("../models/blog.model");
const testBlogs = require("./blog.test.data");
const {userModel} = require("../models/auth.model");

describe("Blog Route", () => {
  let conn;
  let token;

  beforeAll(async () => {
    conn = await connect();

    await userModel.create({
      "first_name": "john",
      "last_name": "doe",
      "email": "doe@example.com",
      "password": "Password1"
    });

    const signInResponse = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        "first_name": "john",
        "last_name": "doe",
        "email": "doe@example.com",
        "password": "Password1"
      });

    token = signInResponse.body.token;
  });

  beforeEach(async () => {
    for (const testBlog of testBlogs) {
      const newBlog = new blogModel({
        _id: testBlog._id,
        body: testBlog.body,
        title: testBlog.title,
        description: testBlog.description,
        tags: testBlog.tags,
        state: testBlog.state,
      });
      await newBlog.save();
    }
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should create blogs", async () => {

    const res = await request(app)
      .post(`/user/blogs/new`)
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send({
        "title": "Lorem",
        "description": "lorem ipsum dodlor",
        "tags": "#lorem",
        "author": "john doe",
        "body": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, autem saepe? Facere veritatis eaque dignissimos adipisci non. Voluptatem tenetur expedita eius odio suscipit. Quis, provident doloremque obcaecati odit accusamus architecto?",
        "timestamp": "8:55pm",
        "reading_time": "2min"
      });
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('blog')
    expect(res.body).toHaveProperty('user')

  });


  it("should return all blogs", async () => {

    const res = await request(app)
      .get("/blogs")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('blogs')

  });

  it("should return single blog", async () => {

    const blog = await blogModel.findOne();
    const res = await request(app)
      .get(`/blogs/${blog._id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.status).toBe(200);

  });

  it("should publish blog state", async () => {
    const blog = await blogModel.findOne();

    const res = await request(app)
      .patch(`/user/blogs/${blog._id}/edit`)
      .set("Accept", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send({
        state: "published",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('blog')

  });

  it("should update blog", async () => {

    const blog = await blogModel.findOne();
    const res = await request(app)
      .put(`/user/blogs/${blog._id}/edit`)
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`)
      .send({
          "title": "ipsum",
          "tags": "#ipsum",
          "description": "lo lo lorem",
          "body": "lorem ipsum, the default"
        });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('blog')

  });

  it("should delete blog", async () => {

    const blog = await blogModel.findOne();
    const res = await request(app)
      .delete(`/user/blogs/${blog._id}`)
      .set("content-type", "application/json")
      .set("Authorization", `bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message')

  });
});
