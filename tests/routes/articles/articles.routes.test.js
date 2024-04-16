import request from 'supertest';
import {afterAll, beforeAll, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {query} from '../../../src/database/db.js'
import {testServer} from "../../test.server.js";

// Mock user admin
const user = {
  user: 'felipe',
  email: 'felipe@test.com',
  active: true,
  password: '$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa',
  roles: [{id: 1, role: 'ADMIN'}]
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

describe('Test on api/v1/article', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('GET api/v1/article status 200', async () => {

    query
      .mockResolvedValueOnce({rows: [{ id: 1 }, { id: 2 }]})
      .mockResolvedValueOnce({rows: [{ total_articles: 2}]});

    const {body} = await request(testServer.app)
      .get('/api/v1/article')
      .expect(200);

    const { articles } = body;

    expect(body.total).toEqual(2)
    expect(articles).toHaveLength(2);
    expect(articles).toEqual([{ id: 1 }, { id: 2 }]);

  });

  test('GET api/v1/article/:id status 200', async () => {
    query.mockResolvedValueOnce({rows: [{ id: 1 }]});

    const {body} = await request(testServer.app)
      .get('/api/v1/article/1')
      .expect(200);

    expect(body).toEqual({ id: 1 });
  });

  test('DELETE api/v1/article/:id status 200', async () => {
    const article = { id: 1, author: {id: 1} };
    user.password = '$2b$10$12HQGrt8GM0BmJut/I8.QuWRVKySK1HxJtJH3CeBxc.fFysQ7ReYa';

    query
      .mockResolvedValueOnce({rows: [user]}) // login
      .mockResolvedValueOnce({rows: [user]})
      .mockResolvedValueOnce({rows: [article]})
      .mockResolvedValueOnce({rows: [article]});

    // Login
    const {body: { token }} = await request(testServer.app)
      .post("/api/v1/user/login")
      .send({email: 'felipe@test.com', password: '123123'})
      .expect(200);

    const {body} = await request(testServer.app)
      .delete('/api/v1/article/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body).toEqual(article);
  });

  test('DELETE api/v1/article/:id unauthorized code 401', async () => {

    const { body} = await request(testServer.app)
      .delete('/api/v1/article/1')
      .expect(401);

    expect(body).toEqual({ error: 'No token provided' });

  });
});