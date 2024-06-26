import { loginWith, createBlog } from './helper';

const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Arto Hellas',
        username: 'hellas',
        password: 'secret',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown on front page', async ({ page }) => {
    const locator = page.getByText('log in to application');
    await expect(locator).toBeVisible();
    await expect(page.getByText('login')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');

      const successDiv = page.locator('.MuiAlert-colorSuccess');
      await expect(successDiv).toContainText('welcome!');
      await expect(successDiv).toHaveCSS('color', 'rgb(30, 70, 32)');

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong');

      const errorDiv = page.locator('.MuiAlert-colorError');
      await expect(errorDiv).toContainText('wrong username or password');
      await expect(errorDiv).toHaveCSS('color', 'rgb(95, 33, 32)');

      await expect(page.getByText('Matti Luukkainen logged in')).toBeHidden();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'You’re NOT gonna need it!',
        'Ron Jeffries',
        'https://ronjeffries.com/xprog/articles/practices/pracnotneed/',
      );
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
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'You’re NOT gonna need it!',
          'Ron Jeffries',
          'https://ronjeffries.com/xprog/articles/practices/pracnotneed/',
        );
      });

      test('the blog can be liked', async ({ page }) => {
        await page
          .getByRole('link', { name: 'You’re NOT gonna need it!' })
          .click();

        await expect(page.getByText('0 likes')).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('1 likes')).toBeVisible();

        const successDiv = page.locator('.MuiAlert-colorSuccess');
        await expect(successDiv).toContainText(
          "You liked 'You’re NOT gonna need it!' by 'Ron Jeffries",
        );
        await expect(successDiv).toHaveCSS('color', 'rgb(30, 70, 32)');
      });

      test('the blog can be deleted', async ({ page }) => {
        await page
          .getByRole('link', { name: 'You’re NOT gonna need it!' })
          .click();
        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'delete' }).click();

        const successDiv = page.locator('.MuiAlert-colorSuccess');
        await expect(successDiv).toContainText(
          "The blog 'You’re NOT gonna need it!' by 'Ron Jeffries was removed",
        );
        await expect(successDiv).toHaveCSS('color', 'rgb(30, 70, 32)');
        await expect(
          page.getByRole('link', { name: 'You’re NOT gonna need it!' }),
        ).toBeHidden();
      });

      test('only the user who added the blog sees the delete button', async ({
        page,
      }) => {
        await page.getByRole('button', { name: 'logout' }).click();
        await loginWith(page, 'hellas', 'secret');
        await page
          .getByRole('link', { name: 'You’re NOT gonna need it!' })
          .click();
        await expect(page.getByRole('button', { name: 'delete' })).toBeHidden();
      });
    });

    describe('and multiple blogs exist', () => {
      const blogs = [
        { title: 'blog1', author: 'author1', url: 'google.com' },
        { title: 'blog2', author: 'author2', url: 'google.com' },
        { title: 'blog3', author: 'author3', url: 'google.com' },
      ];
      beforeEach(async ({ page }) => {
        await createBlog(page, blogs[0].title, blogs[0].author, blogs[0].url);
        await createBlog(page, blogs[1].title, blogs[1].author, blogs[1].url);
        await createBlog(page, blogs[2].title, blogs[2].author, blogs[2].url);
      });
      test('the blogs are arranged in order of likes', async ({ page }) => {
        await page.getByRole('link', { name: 'blog2' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('1 likes')).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('2 likes')).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('3 likes')).toBeVisible();

        await page.goto('/');
        await page.getByRole('link', { name: 'blog3' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('1 likes')).toBeVisible();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('2 likes')).toBeVisible();

        await page.goto('/');
        await page.getByRole('link', { name: 'blog1' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('1 likes')).toBeVisible();

        await page.goto('/');
        await expect(page.getByText('blog2')).toBeVisible();

        const blogLinks = await page.locator('.blog a').allInnerTexts();
        const blogsOrder = blogLinks.map((link) => link.trim());

        expect(blogsOrder).toEqual([
          blogs[1].title,
          blogs[2].title,
          blogs[0].title,
        ]);
      });
    });
  });
});
