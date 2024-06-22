/* eslint-disable no-param-reassign */
import { Button, TextField } from '@mui/material';
import { useAddBlog } from 'Utilities/queries/BlogsQuery';

export function BlogFormContainer({ onSubmit }) {
  return (
    <div>
      <h4>Create a new blog</h4>
      <form onSubmit={onSubmit} aria-label="form">
        <div>
          <TextField
            label="title"
            id="title"
            name="title"
            placeholder="title of the blog"
          />
        </div>
        <div>
          <TextField
            label="author"
            id="author"
            name="author"
            placeholder="author of the blog"
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            name="url"
            placeholder="url of the blog"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-testid="createButton"
        >
          create
        </Button>
      </form>
    </div>
  );
}

function BlogForm({ onCreate }) {
  const blogMutation = useAddBlog();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    event.target.title.value = '';
    event.target.author.value = '';
    event.target.url.value = '';
    blogMutation.mutate({ title, author, url });
    onCreate();
  };

  return <BlogFormContainer onSubmit={handleSubmit} />;
}

export default BlogForm;
