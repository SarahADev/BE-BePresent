const app = require("../app.js");
const request = require("supertest");

// afterall()

describe('Bad path', () => {
  test('error 404 for bad path', () => {
    return request(app)
      .get('/banana')
      .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('bad path');
        });
  });
});

describe('GET /users/:userId', () => {
    test('should return the requested user', () => {
        const expected = {
            "_id": "6318669c04419aa5230cacaf",
            "user_id": "test1",
            "first_name": "test",
            "last_name": "test",
            "email": "test@test.com",
            "birth_day": "28",
            "birth_month": "06",
            "birth_year": "1991",
            "hashed_password": "12345asdfg",
            "interests": ["gaming", "board-games", "squash"],
            "connections": ["test2"],
            "profiles": [""]
        }
        return request(app)
            .get("/users/test1")
            .expect(200)
            .then(({body}) => {
                expect(body.user).toEqual(expected);
            });
    });
    test('404 for id not found', () => {
      return request(app)
        .get("/users/banana")
        .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe("user not found");
          });
    });
});

describe("POST /users", () => {
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
          profiles: []
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
});

describe("GET /users", () => {
    test("should return all users", () => {
      return request(app)
        .get("/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(3);
          body.users.map((user) => {
            expect(user._id).toEqual(expect.any(String));
            expect(user.user_id).toEqual(expect.any(String));
            expect(user.first_name).toEqual(expect.any(String));
            expect(user.last_name).toEqual(expect.any(String));
            expect(user.email).toEqual(expect.any(String));
            expect(user.birth_day).toEqual(expect.any(String));
            expect(user.birth_month).toEqual(expect.any(String));
            expect(user.birth_year).toEqual(expect.any(String));
            expect(user.hashed_password).toEqual(expect.any(String));
            expect(user.interests).toEqual(expect.any(Array));
            expect(user.connections).toEqual(expect.any(Array));
            expect(user.profiles).toEqual(expect.any(Array));
          });
        });
    });
});


describe('POST /users/login', () => {
  test('should return success if credentials match in database, returns user ID', () => {
    const input = {
      email: 'test3@test.com',
      password: 'test3_password'
    }
    return request(app)
    .post('/users/login')
    .send(input)
    .expect(201)
    .then(({body}) => {
      expect(body).toEqual({ user_id: 'e49f6e7c-03ce-41af-b26f-5f555cb31c25' })
    })
  });
  test('should reject if password is incorrect', () => {
    const input = {
      email: 'test3@test.com',
      password: 'wrong_password'
    }
    return request(app)
    .post('/users/login')
    .send(input)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid credentials")
    })
  });
  test('should reject if email is incorrect', () => {
    const input = {
      email: 'wrong@test.com',
      password: 'test3_password'
    }
    return request(app)
    .post('/users/login')
    .send(input)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid credentials")
    })
  });
});