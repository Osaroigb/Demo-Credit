import assert from 'assert';
import { knex } from 'knex';
import app from '../../src/app';
import request from 'supertest';
import { Model } from 'objection';
import knexConfig from '../../knexfile';
import { describe, test } from '@jest/globals';
// import { logger } from '../../src/utils/logger';

const testDB = knex(knexConfig["test"]);

describe('User Deposit Funds', () => {

  beforeAll(() => {
    Model.knex(testDB);
  });

  afterAll(() => {
    testDB.destroy();
  });
  
  test('should successfully deposit funds', async () => {
    const payload = {
      type: 'deposit',
      amount: 100,
    };
  
    const login = await loginUser();

    await request(app)
      .post('/v1/wallet/deposit')
      .send(payload)
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(200)
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
