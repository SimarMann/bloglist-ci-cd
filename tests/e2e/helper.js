const loginWith = async (page, username, password) => {
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#login-button');
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.fill('#title', title);
  await page.fill('#author', author);
  await page.fill('#url', url);
  await page.getByTestId('createButton').click();
  await page.getByRole('link', { name: title }).waitFor();
};

export { loginWith, createBlog };
