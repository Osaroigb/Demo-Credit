import assert from 'assert';
import { knex } from 'knex';
import app from '../../src/app';
import request from 'supertest';
import { Model } from 'objection';
import knexConfig from '../../knexfile';
import { describe, test } from '@jest/globals';
import { db } from "../../src/database/database";

const testDB = knex(knexConfig["test"]);

describe('User Signing Up', () => {

  beforeAll(async () => {
    Model.knex(testDB);
  });

  afterAll(() => {
    db.destroy();
    testDB.destroy();
  });
  
  test('should successfully signup user', async () => {
    const payload = {
      firstName: "Test",
      lastName: "User",
      email: "john@gmail.com",
      password: "Password123_",
      phoneNumber: "09084138757"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(200)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid first name', async () => {
    const payload = {
      firstName: 1235,
      lastName: "User",
      email: "john@gmail.com",
      password: "Password123_",
      phoneNumber: "09084138757"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid last name', async () => {
    const payload = {
      firstName: "Test",
      lastName: false,
      email: "john@gmail.com",
      password: "Password123_",
      phoneNumber: "09084138757"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid email', async () => {
    const payload = {
      firstName: "Test",
      lastName: "User",
      email: "johncom",
      password: "Password123_",
      phoneNumber: "09084138757"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid/weak password', async () => {
    const payload = {
      firstName: "Test",
      lastName: "User",
      email: "john@gmail.com",
      password: "pass",
      phoneNumber: "09084138757"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });

  test('should handle invalid phone number', async () => {
    const payload = {
      firstName: "Test",
      lastName: "User",
      email: "john@gmail.com",
      password: "Password123_",
      phoneNumber: "09084assewe"
    };
  
    await request(app)
      .post('/v1/auth/signup')
      .send(payload)
      .expect(400)
      .expect((res: any) => {
        assert(res.body.hasOwnProperty('success'));
        assert(res.body.hasOwnProperty('message'));
        assert(res.body.hasOwnProperty('data'));
    });
  });
});
