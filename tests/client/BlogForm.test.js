import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogFormContainer } from 'Components/BlogForm';

it('when blog is created, callback has correct data', async () => {
  const mockSubmit = jest.fn();
  const user = userEvent.setup();

  render(<BlogFormContainer onSubmit={mockSubmit} />);

  const blogToCreate = {
    author: 'Kalle Ilves',
    title: 'Testing is pretty easy',
    url: 'https://testing-library.com/docs/react-testing-library/intro/',
  };

  const authorInput = screen.getByPlaceholderText('author of the blog');
  await user.type(authorInput, blogToCreate.author);
  expect(authorInput).toHaveValue(blogToCreate.author);

  const titleInput = screen.getByPlaceholderText('title of the blog');
  await user.type(titleInput, blogToCreate.title);

  const urlInput = screen.getByPlaceholderText('url of the blog');
  await user.type(urlInput, blogToCreate.url);

  const createButton = screen.getByTestId('createButton');
  await fireEvent.submit(createButton);

  expect(mockSubmit.mock.calls).toHaveLength(1);
});
