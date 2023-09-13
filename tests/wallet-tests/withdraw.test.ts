import assert from 'assert';
import { knex } from 'knex';
import app from '../../src/app';
import request from 'supertest';
import { Model } from 'objection';
import knexConfig from '../../knexfile';
import { describe, test } from '@jest/globals';
import { db } from "../../src/database/database";

const testDB = knex(knexConfig["test"]);

describe('User Withdraw Funds', () => {
  let login: any;

  beforeAll(async () => {
    Model.knex(testDB);
    login = await loginUser();
  });

  afterAll(() => {
    db.destroy();
    testDB.destroy();
  });
  
  test('should successfully withdraw funds', async () => {
    const payload = {
      type: 'withdraw',
      amount: 100,
    };
  
    await request(app)
      .post('/v1/wallet/withdraw')
      .send(payload)
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(200)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle wrong transaction type', async () => {
    const payload = {
      type: 'transfer',
      amount: 100,
    };
  
    await request(app)
      .post('/v1/wallet/withdraw')
      .send(payload)
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid transaction amount', async () => {
    const payload = {
      type: 'withdraw',
      amount: -100,
    };
  
    await request(app)
      .post('/v1/wallet/withdraw')
      .send(payload)
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid bearer token', async () => {
    const payload = {
      type: 'withdraw',
      amount: 100,
    };
  
    await request(app)
      .post('/v1/wallet/withdraw')
      .send(payload)
      .set('Authorization', 'Bearer sa90asankaaas')
      .expect(401)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle insufficient balance to withdraw', async () => {
    const payload = {
      type: 'withdraw',
      amount: 1000,
    };
  
    await request(app)
      .post('/v1/wallet/withdraw')
      .send(payload)
      .set('Authorization', `Bearer ${login.bearerToken}`)
      .expect(422)
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
