const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });

    await page.goto('http://localhost:3003');
  });

  test('Login form is shown on front page', async ({ page }) => {
    const locator = await page.getByText('log in to application');
    await expect(locator).toBeVisible();
    await expect(page.getByText('login')).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await page.fill('#username', 'mluukkai');
    await page.fill('#password', 'salainen');
    await page.click('#login-button');

    await expect(page.getByText('welcome!')).toBeVisible();
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
  });
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('#username', 'mluukkai');
      await page.fill('#password', 'salainen');
      await page.click('#login-button');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click();
      await page.fill('#title', 'You’re NOT gonna need it!');
      await page.fill('#author', 'Ron Jeffries');
      await page.fill(
        '#url',
        'https://ronjeffries.com/xprog/articles/practices/pracnotneed/',
      );
      await page.getByTestId('createButton').click();
      await expect(
        page.getByText(
          'a new blog You’re NOT gonna need it! by Ron Jeffries added',
        ),
      ).toBeVisible();
      const blogTitle = await page.getByText('You’re NOT gonna need it!').all();
      await expect(blogTitle[1]).toBeVisible();
      const blogAuthor = await page.getByText('Ron Jeffries').all();
      await expect(blogAuthor[1]).toBeVisible();
    });
  });
});
