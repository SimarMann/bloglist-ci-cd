import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BlogList from 'Components/BlogList';

const mockBlogs = [
  { id: 1, title: 'Blog 1', author: 'Author 1' },
  { id: 2, title: 'Blog 2', author: 'Author 2' },
  { id: 3, title: 'Blog 3', author: 'Author 3' },
];

test('renders without crashing', () => {
  const { container } = render(
    <Router>
      <BlogList blogs={[]} />
    </Router>,
  );
  expect(container).toBeInTheDocument();
});

test('renders correct number of blogs', () => {
  const { getAllByRole } = render(
    <Router>
      <BlogList blogs={mockBlogs} />
    </Router>,
  );
  const rows = getAllByRole('row');
  expect(rows.length).toBe(mockBlogs.length);
});

test('renders blog titles and authors correctly', () => {
  const { getByText } = render(
    <Router>
      <BlogList blogs={mockBlogs} />
    </Router>,
  );

  mockBlogs.forEach((blog) => {
    expect(getByText(blog.title)).toBeInTheDocument();
    expect(getByText(blog.author)).toBeInTheDocument();
  });
});

test('links point to correct paths', () => {
  const { getByText } = render(
    <Router>
      <BlogList blogs={mockBlogs} />
    </Router>,
  );

  mockBlogs.forEach((blog) => {
    const link = getByText(blog.title).closest('a');
    expect(link).toHaveAttribute('href', `/blogs/${blog.id}`);
  });
});
