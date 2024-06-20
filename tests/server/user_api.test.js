require('module-alias/register');
const supertest = require('supertest'); // eslint-disable-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const { test, describe, after, beforeEach } = require('node:test');
const assert = require('assert');

const app = require('@root/server/index');

const api = supertest(app);

const User = require('@models/userModel');
const helper = require('./test_helper');

const testUser = {
  username: 'root',
  name: 'Superuser',
  password: 'sekret',
};

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    await api.post('/users').send(testUser);
  });

  test('create new user', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    const postResponse = await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(postResponse.body.username, newUser.username);
    assert.strictEqual(postResponse.body.name, newUser.name);

    await api.get('/users');

    const usersAtEnd = await helper.usersInDb();
    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  after(() => {
    mongoose.connection.close();
  });
});
