import request from 'supertest';
import {afterAll, beforeAll, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {query} from '../../../src/database/db.js'
import {testServer} from "../../test.server.js";
import {UserService} from "../../../src/users/services/users.service.js";
import {RoleService} from "../../../src/roles/services/roles.service.js";

// Mock user admin
const user = {
  user: 'felipe',
  email: 'felipe@test.com',
  active: true,
  password: '$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa',
  roles: [{id: 1, role: 'ADMIN'}]
}

const user2 = {
  user: 'antonio',
  email: 'antonio@test.com',
  active: true,
  password: '$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa',
  roles: [{id: 2, role: 'USER'}]
}

// jest mock query function
jest.mock('../../../src/database/db.js', () => {
  return {
    query: jest.fn()
  }
});

beforeAll(async () => {
  await testServer.start();
});

afterAll(async () => {
  await testServer.close();
});

describe('Test on api/v1/user', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('GET /api/v1/user status 200', async () => {
    query
      .mockResolvedValueOnce({rows: [user]}) // login
      .mockResolvedValueOnce({rows: [user]})
      .mockResolvedValueOnce({rows: [user]})
      .mockResolvedValueOnce({rows: [{total_users: 1}]});

    // Login
    const {body: {token}} = await request(testServer.app)
      .post("/api/v1/user/login")
      .send({email: 'felipe@test.com', password: '123123'});

    // GET all users
    const {body: {users}} = await request(testServer.app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    delete user.password;

    expect(users).toEqual([user]);

  });

  test('GET /api/v1/user/:id status 200', async () => {
    query
      .mockResolvedValueOnce({rows: [user]}) // return user

    const {body} = await request(testServer.app)
      .get('/api/v1/user/1')
      .expect(200);

    expect(body).toEqual(user);
  });

  test('GET /api/v1/user/:id status 404', async () => {
    query
      .mockResolvedValueOnce({rows: []}) // return user

    const {body} = await request(testServer.app)
      .get('/api/v1/user/1')
      .expect(404);

    expect(body).toEqual({error: 'El usuario no existe'});
  });

  test('DELETE /api/v1/user/:id', async () => {

    query
      .mockResolvedValueOnce({rows: [user]}) // return user
      .mockResolvedValueOnce({rows: [user2]}) // delete user

    const userService = new UserService(new RoleService());
    const result = await userService.deleteUserById({userId: 2});

    expect(result).toEqual(user2);

  });

  test('POST /api/v1/user/login status 404', async () => {
    query.mockResolvedValueOnce({
      rows: []
    });

    const {body} = await request(testServer.app)
      .post("/api/v1/user/login")
      .send({email: 'test@test.com', password: '123123'})
      .expect(404);

    expect(body).toEqual({error: 'El usuario no existe o el email no es válido'});

  });

  test('POST /api/v1/user/login status 200', async () => {
    query.mockResolvedValueOnce({
      rows: [{
        user: 'felipe',
        email: 'felipe@test.com',
        active: true,
        password: '$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa'
      }]
    });

    const {body} = await request(testServer.app)
      .post("/api/v1/user/login")
      .send({email: 'felipe@test.com', password: '123123'})
      .expect(200);

    expect(body).toEqual({
      user: 'felipe',
      email: 'felipe@test.com',
      active: true,
      token: expect.any(String)
    });
  });

  test('POST /api/v1/user/register status 200', async () => {
    query
      .mockResolvedValueOnce({rows: [{enable_registration: true}]})
      .mockResolvedValueOnce({rows: [{rolesid: [1, 2, 3]}]})
      .mockResolvedValueOnce({rows: []})
      .mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'test',
          email: 'test@test.com',
          active: true
        }]
      })
      .mockResolvedValueOnce({
        rows: [{id: 3, role: 'USER'}]
      })
      .mockResolvedValueOnce({
        rows: [{id: 3, role: 'USER'}]
      });


    const {body} = await request(testServer.app)
      .post("/api/v1/user/register")
      .send({email: 'test@test.com', password: '123123', name: 'test'});

    expect(body).toEqual({
      id: 1,
      name: 'test',
      email: 'test@test.com',
      active: true,
      roles: [{id: 3, role: 'USER'}],
      token: expect.any(String)
    });

  });

});