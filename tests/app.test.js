const app = require("../app.js");
const request = require("supertest");

// afterall()

describe("/users", () => {
  let createdUserId = ''
  test("posts a user", () => {
    const input = {
      first_name: "Test",
      last_name: "Six",
      email: "test6@test.com",
      birth_day: "06",
      birth_month: "06",
      birth_year: "1996",
      password: "test6_password",
      interests: ["gaming", "gardening", "cooking"],
    };
    return request(app)
      .post("/users")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        createdUserId = body.user_id
        expect(body).toEqual({
          _id: expect.any(String),
          user_id: expect.any(String),
          first_name: "Test",
          last_name: "Six",
          email: "test6@test.com",
          birth_day: "06",
          birth_month: "06",
          birth_year: "1996",
          hashed_password: expect.any(String),
          interests: ["gaming", "gardening", "cooking"],
          connections: [],
        });
      });
  });
  test("existing user returns an error", () => {
    const input = {
      first_name: "Test",
      last_name: "Six",
      email: "test6@test.com",
      birth_day: "06",
      birth_month: "06",
      birth_year: "1996",
      password: "test6_password",
      interests: ["gaming", "gardening", "cooking"],
    };
    return request(app)
      .post("/users")
      .send(input)
      .expect(409)
      .then((res) => {
        expect(res.text).toBe("User email already exists");
      });
  });
  test('should delete user by specified ID', () => {
    return request(app).delete(`/users/${createdUserId}`).expect(204);
  });
  test('should return error for non-existent user ID', () => {
    return request(app).delete(`/users/nonsense`).expect(404).then(({body}) => {
      expect(body.msg).toBe('User not found.')
    });
  });
  test("should return all users", () => {
    return request(app)
      .get("/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(2);
        body.users.map((user) => {
          expect(user._id).toEqual(expect.any(String));
          expect(user.user_id).toEqual(expect.any(String));
          expect(user.email).toEqual(expect.any(String));
          expect(user.hashed_password).toEqual(expect.any(String));
        });
      });
  });
});
