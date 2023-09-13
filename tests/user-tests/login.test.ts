import assert from 'assert';
import { knex } from 'knex';
import app from '../../src/app';
import request from 'supertest';
import { Model } from 'objection';
import knexConfig from '../../knexfile';
import { describe, test } from '@jest/globals';
import { db } from "../../src/database/database";

const testDB = knex(knexConfig["test"]);

describe('User Logging In', () => {

  beforeAll(async () => {
    Model.knex(testDB);
  });

  afterAll(() => {
    db.destroy();
    testDB.destroy();
  });
  
  test('should successfully login user', async () => {
    const payload = {
      email: 'test@gmail.com',
      password: 'Testing123_',
    };
  
    await request(app)
      .post('/v1/auth/login')
      .send(payload)
      .expect(200)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid email', async () => {
    const payload = {
      email: 'testgmailco',
      password: 'Testing123_',
    };
  
    await request(app)
      .post('/v1/auth/login')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle wrong email', async () => {
    const payload = {
      email: 'johndoe@gmail.com',
      password: 'Testing123_',
    };
  
    await request(app)
      .post('/v1/auth/login')
      .send(payload)
      .expect(401)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid/weak password', async () => {
    const payload = {
      "email": "test@gmail.com",
      "password": "test",
    };
  
    await request(app)
      .post('/v1/auth/login')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle wrong password', async () => {
    const payload = {
      "email": "test@gmail.com",
      "password": "test9230d9",
    };
  
    await request(app)
      .post('/v1/auth/login')
      .send(payload)
      .expect(401)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });
});
