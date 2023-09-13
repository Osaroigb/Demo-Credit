import assert from 'assert';
import { knex } from 'knex';
import app from '../../src/app';
import request from 'supertest';
import { Model } from 'objection';
import knexConfig from '../../knexfile';
import { describe, test } from '@jest/globals';
import { db } from "../../src/database/database";

const testDB = knex(knexConfig["test"]);

describe('Get Wallet Balance', () => {
  let login: any;

  beforeAll(async () => {
    Model.knex(testDB);
    login = await loginUser();
  });

  afterAll(() => {
    db.destroy();
    testDB.destroy();
  });
  
  test('should successfully get wallet balance', async () => {
  
    await request(app)
      .get('/v1/wallet/balance/1')
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(200)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid wallet ID', async () => {
  
    await request(app)
      .get('/v1/wallet/balance/10')
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(404)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle valid wallet but unauthorized access', async () => {
  
    await request(app)
      .get('/v1/wallet/balance/2')
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(401)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid bearer token', async () => {
  
    await request(app)
      .get('/v1/wallet/balance/1')
      .set('Authorization', 'Bearer sa90asankaaas')
      .expect(401)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  const loginUser = async () => {
    const data = {
      email: 'test@gmail.com',
      password: 'Testing123_',
    };
    
    const res = await request(app).post('/v1/auth/login').send(data);
    return { bearerToken: res.body.data.auth.token };
  };
});
