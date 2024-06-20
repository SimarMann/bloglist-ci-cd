require('module-alias/register');
const supertest = require('supertest'); // eslint-disable-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const { test, describe, after, beforeEach } = require('node:test');
const assert = require('assert');

const app = require('@root/server/index');

const api = supertest(app);

const Blog = require('@models/blogModel');
const User = require('@models/userModel');
const helper = require('./test_helper');

const testUser = {
  username: 'root',
  name: 'Superuser',
  password: 'sekret',
};

let token;

/**
 *  Blogs API test suite
 */
describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);

    await api.post('/users').send(testUser);

    const response = await api.post('/login').send(testUser);

    token = response.body.token;
  });

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('blogs are returned with id property', async () => {
    const response = await api.get('/blogs');
    response.body.forEach((blog) => {
      assert(blog.id);
    });
  });

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com/test',
      likes: 5,
    };

    const postResponse = await api
      .post('/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(postResponse.body.title, newBlog.title);
    assert.strictEqual(postResponse.body.author, newBlog.author);
    assert.strictEqual(postResponse.body.url, newBlog.url);
    assert.strictEqual(postResponse.body.likes, newBlog.likes);

    await api.get('/blogs');

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((blog) => blog.title);

    assert(titles.includes('Test Blog'));
  });

  test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com/test',
    };

    const postResponse = await api
      .post('/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(postResponse.body.likes, 0);
  });

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://test.com/test',
      likes: 5,
    };

    await api
      .post('/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('a valid blog is not added without a token', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 5,
    };

    await api.post('/blogs').send(newBlog).expect(401);
  });

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5,
    };

    await api
      .post('/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('a blog can be deleted', async () => {
    const blogToDelete = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com/test',
      likes: 5,
    };

    const response = await api
      .post('/blogs')
      .send(blogToDelete)
      .set('Authorization', `Bearer ${token}`);

    const { id } = response.body;

    const blogsAtStart = await helper.blogsInDb();

    await api
      .delete(`/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    assert(!titles.includes(blogToDelete.title));
  });

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlog = {
      title: 'Fitness Blog',
      author: 'Trainer',
      url: 'https://iamafitnessblog.com/',
      likes: 3,
    };

    await api.put(`/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.title, newBlog.title);
    assert.strictEqual(updatedBlog.author, newBlog.author);
    assert.strictEqual(updatedBlog.url, newBlog.url);
    assert.strictEqual(updatedBlog.likes, newBlog.likes);
  });
});

/**
 *  Users API test suite
 */
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
  test('user is not added if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('expected `username` to be unique'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test('user is not added if username is missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('username or password missing'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test('user is not added if password is missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'allen',
      name: 'secondUser',
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('username or password missing'));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test('user is not added if username is not atleast 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'he',
      name: 'secondUser',
      password: 'laz0e',
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(
      result.body.error.includes(
        'Both username and password must be at least 3 characters long',
      ),
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test('user is not added if password is not atleast 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'hellas',
      name: 'secondUser',
      password: 'la',
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(
      result.body.error.includes(
        'Both username and password must be at least 3 characters long',
      ),
    );
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  after(() => {
    mongoose.connection.close();
  });
});
