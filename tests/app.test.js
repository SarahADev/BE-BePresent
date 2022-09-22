const app = require("../app.js");
const request = require("supertest");

let newUserId = "";
// beforeEach(() => {
//     const input = {
//       first_name: "Test4",
//       last_name: "Four",
//       email: "test4@test.com",
//       birth_day: "04",
//       birth_month: "04",
//       birth_year: "2004",
//       password: "password4",
//       interests: ["home-and-living"],
//     };
//     return request(app)
//       .post("/users")
//       .send(input)
//       .expect(201)
//       .then(({ body }) => {
//         newUserId = body.user_id;
//       });
// });

// afterEach(() => {
//   return request(app).delete(`/users/${newUserId}`).expect(204)
// });

describe("Bad path", () => {
  test("error 404 for bad path", () => {
    return request(app)
      .get("/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad path");
      });
  });
});

describe("GET /users/:userId", () => {
  test("should return the requested user", () => {
    const expected = {
      _id: '6329a3f23b9627a690c8483c',
      user_id: 'test1',
      first_name: 'Test',
      last_name: 'One',
      email: 'test1@test.com',
      birth_day: '01',
      birth_month: '01',
      birth_year: '2001',
      hashed_password: 'password1',
      interests: [ 'art-and-collectibles', 'toys-and-entertainment' ],
      connections: [],
      profiles: []
    };
    return request(app)
      .get("/users/test1")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("404 for id not found", () => {
    return request(app)
      .get("/users/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});

describe("POST /users", () => {
  let createdUserId = "";
  test("posts a user", () => {
    const input = {
      first_name: "Test2",
      last_name: "Two",
      email: "test2@test.com",
      birth_day: "02",
      birth_month: "02",
      birth_year: "2002",
      password: "password2",
      interests: ["jewelry-and-accessories", "art-and-collectibles"],
    };
    return request(app)
      .post("/users")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        createdUserId = body.user_id;
        expect(body).toEqual({
          _id: expect.any(String),
          user_id: expect.any(String),
          first_name: "Test2",
          last_name: "Two",
          email: "test2@test.com",
          birth_day: "02",
          birth_month: "02",
          birth_year: "2002",
          hashed_password: expect.any(String),
          interests: ["jewelry-and-accessories", "art-and-collectibles"],
          connections: [],
          profiles: [],
        });
      });
  });
  test("existing user returns an error", () => {
    const input = {
      first_name: "Test2",
      last_name: "Two",
      email: "test2@test.com",
      birth_day: "02",
      birth_month: "02",
      birth_year: "2002",
      password: "password2",
      interests: ["jewelry-and-accessories", "art-and-collectibles"],
    };
    return request(app)
      .post("/users")
      .send(input)
      .expect(409)
      .then((res) => {
        expect(res.text).toBe("User email already exists");
      });
  });
  test("should delete user by specified ID", () => {
    return request(app).delete(`/users/${createdUserId}`).expect(204);
  });
  test("should return error for non-existent user ID", () => {
    return request(app)
      .delete(`/users/nonsense`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found.");
      });
  });
});

describe("GET /users", () => {
  test("should return all users", () => {
    return request(app)
      .get("/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
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

describe("POST /users/login", () => {
  test("should return success if credentials match in database, returns user ID", () => {
    const input = {
      email: "test3@test.com",
      password: "password3",
    };
    return request(app)
      .post("/users/login")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.user_id).toBe("ed3b2ea5-adde-4ce9-b488-3bca618746ef");
        expect(body.first_name).toBe("Test3");
        expect(body.last_name).toBe("Three");
      });
  });
  test("should reject if password is incorrect", () => {
    const input = {
      email: "test3@test.com",
      password: "wrong_password",
    };
    return request(app)
      .post("/users/login")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid credentials");
      });
  });
  test("should reject if email is incorrect", () => {
    const input = {
      email: "wrong@test.com",
      password: "test3_password",
    };
    return request(app)
      .post("/users/login")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid credentials");
      });
  });
});

describe("PATCH /users/:userId", () => {
  test("should edit first name", () => {
    const input = {
      first_name: "NewName",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "NewName",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit last name", () => {
    const input = {
      last_name: "NewSurname",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "NewSurname",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit email", () => {
    const input = {
      email: "newEmail@test.com",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "newEmail@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit preferences", () => {
    const input = {
      interests: ["art-and-collectibles"],
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["art-and-collectibles"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit password", () => {
    const input = {
      password: "newPassword",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit birth_day", () => {
    const input = {
      birth_day: "05",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "05",
      birth_month: "04",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit birth_day", () => {
    const input = {
      birth_month: "05",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "05",
      birth_year: "2004",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    };
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test("should edit birth_year", () => {
    const input = {
      birth_year: "1994",
    };
    const expected = {
      _id: expect.any(String),
      user_id: expect.any(String),
      first_name: "Test4",
      last_name: "Four",
      email: "test4@test.com",
      birth_day: "04",
      birth_month: "04",
      birth_year: "1994",
      hashed_password: expect.any(String),
      interests: ["home-and-living"],
      connections: [],
      profiles: [],
    }
    return request(app)
      .patch(`/users/${newUserId}`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expected);
      });
  });
  test('error 404 for userId not found', () => {
    const input = {
      email: "ezio.auditore@creed.com",
    };
    return request(app)
      .patch("/users/banana")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found.");
      });
  });
});

describe('PATCH /users/:userId/connections', () => {
  test("should add connection", () => {
    const input = {
      connections: "test1@test.com"
    };
    const expected = {
      _id: expect.any(String),
      user_id: '5a65af09-3003-45a5-a6a4-0f97a2fbc231',
      first_name: 'Test5',
      last_name: 'Five',
      email: 'test5@test.com',
      birth_day: '05',
      birth_month: '05',
      birth_year: '2005',
      hashed_password: '$2b$10$qLtwRuGbBI9Dx75vARNFee9m.dEo5nq2wOaiK0clirOz6FLA2BbyO',
      interests: [ 'home-and-living' ],
      connections: ["test1"],
      profiles: [],
    };
    return request(app)
      .patch(`/users/5a65af09-3003-45a5-a6a4-0f97a2fbc231/connections`)
      .send(input)
      .expect(200)
      .then(({ body }) => {
        console.log(body.user)
        expect(body.user).toEqual(expected);
      });
  });
  test("error 400 for already a connection", () => {
    const input = {
      connections: "test1@test.com"
    };
    return request(app)
      .patch(`/users/5a65af09-3003-45a5-a6a4-0f97a2fbc231/connections`)
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You are already connected to that user!");
      });
  });
  test('error 404 for email not found', () => {
    const input = {
      connections: "bunchofrubbish@nonsense.com"
    };
    return request(app)
    .patch(`/users/5a65af09-3003-45a5-a6a4-0f97a2fbc231/connections`)
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found.");
      });
  });
});

describe('DELETE /users/:userId/connections', () => {
  test('should remove the specified user from connections', () => {
    const input = {
      connection_id: "test1"
    };
    return request(app)
    .delete("/users/5a65af09-3003-45a5-a6a4-0f97a2fbc231/connections")
      .send(input)
      .expect(204);
  });
  test('should return 404 for friend not found', () => {
    const input = {
      connection_id: "banana"
    };
    return request(app)
    .delete("/users/5a65af09-3003-45a5-a6a4-0f97a2fbc231/connections")
      .send(input)
      .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("This user is not on your friends list");
        });
  });
});

describe('PATCH /users/:userId/profiles', () => {
  test('should add profile', () => {
    const input = {
      name: "Example Profile",
      birth_day: "07",
      birth_month: "07",
      birth_year: "1997",
      interests: ["toys-and-entertainment", "art-and-collectibles"]
    };
    const expected =  {
      _id: expect.any(String),
      user_id: `ed3b2ea5-adde-4ce9-b488-3bca618746ef`,
      first_name: "Test3",
      last_name: "Three",
      email: "test3@test.com",
      birth_day: "03",
      birth_month: "03",
      birth_year: "2003",
      hashed_password: expect.any(String),
      interests: ["jewelry-and-accessories", "home-and-living"],
      connections: [],
      profiles: [{
        name: "Example Profile",
        birth_day: "07",
        birth_month: "07",
        birth_year: "1997",
        interests: ["toys-and-entertainment", "art-and-collectibles"]
      }],
  };
    return request(app)
      .patch(`/users/ed3b2ea5-adde-4ce9-b488-3bca618746ef/profiles`)
      .send(input)
      .expect(200)
        .then(({body}) => {
          expect(body.user).toEqual(expected)
        });
  });
  test('should return an error if a profile with that name already exists', () => {
    const input = {
      name: "Example Profile",
      birth_day: "07",
      birth_month: "07",
      birth_year: "1997",
      interests: ["toys-and-entertainment", "art-and-collectibles"]
    };
    return request(app)
      .patch(`/users/ed3b2ea5-adde-4ce9-b488-3bca618746ef/profiles`)
      .send(input)
      .expect(400)
        .then(({body}) => {
          expect(body.msg).toEqual("A profile with that name already exists")
        });
  });
  test('error 404 for userId not found', () => {
    return request(app)
      .patch('/users/banana/profiles')
      .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('User not found.');
        });
  });
});

describe('DELETE /users/:userId/profiles', () => {
  test('should delete a profile', () => {
    const input = {
      name: "Example Profile"
    };
    return request(app)
      .delete(`/users/ed3b2ea5-adde-4ce9-b488-3bca618746ef/profiles`)
      .send(input)
      .expect(204)
  });
});

describe.only('POST /users/products', () => {
  test("should get products", () => {
    const input = {
      categories: ['home-and-living'] 
    };
    return request(app)
      .post("/users/products")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        body.map((product) => {
          expect(product.hasOwnProperty('itemName')).toBe(true)
          expect(product.hasOwnProperty('itemLink')).toBe(true)
          expect(product.hasOwnProperty('itemImage')).toBe(true)
          expect(product.hasOwnProperty('itemPrice')).toBe(true)
          expect(product.hasOwnProperty('category')).toBe(true)
        })
      });
  }, 40000);
})

