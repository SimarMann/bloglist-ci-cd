import { useNavigate } from "react-router-dom";
import { useLikeBlog, useRemoveBlog, useCommentBlog } from "Utilities/queries/BlogsQuery";
import { useUserValue } from "Utilities/contexts/UserContext";

function Blog({ blog }) {
  const user = useUserValue();
  const likeMutation = useLikeBlog();
  const removeMutation = useRemoveBlog();
  const commentMutation = useCommentBlog();
  const navigate = useNavigate();

  const handleLike = (likeBlog) => {
    const likedBlog = {
      ...likeBlog,
      likes: likeBlog.likes + 1,
      user: likeBlog.user.id,
    };
    likeMutation.mutate(likedBlog);
  };

  const handleRemove = (removeBlog) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm(
      `Are you sure you want to remove ${removeBlog.title} by ${removeBlog.author}?`,
    );
    if (ok) {
      removeMutation.mutate(removeBlog);
      navigate("/");
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    /* eslint-disable-next-line no-param-reassign */
    event.target.comment.value = "";
    const blogComment = {
      id: blog.id,
      comment,
    };
    commentMutation.mutate(blogComment);
  };
  return (
    <>
      <div>
        <h1>{blog.title}</h1>
        <a href={blog.url}> {blog.url}</a>
        <div>
          {blog.likes} likes
          <button type="button" onClick={() => handleLike(blog)}>
            like
          </button>
        </div>
        <div>added by {blog.user && blog.user.name}</div>
        {user && blog.user.username === user.username && (
          <button type="button" onClick={() => handleRemove(blog)}>
            delete
          </button>
        )}
      </div>
      <div>
        <h3>comments</h3>
        <form onSubmit={handleComment}>
          <input
            id="comment"
            name="comment"
            placeholder="add new comment here"
          />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Blog;
