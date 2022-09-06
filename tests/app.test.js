const app = require('../app.js');
const request = require('supertest');

describe('GET /users', () => {
    test('should return all users', () => {
        return request(app).get('/users').expect(200)
            .then(({body}) => {
                expect(body.users.length).toBe(5);
                body.users.map((user) => {
                    expect(user._id).toEqual(expect.any(String));
                    expect(user.user_id).toEqual(expect.any(String));
                    expect(user.email).toEqual(expect.any(String));
                    expect(user.hashed_password).toEqual(expect.any(String));
                });
            });
    });
});