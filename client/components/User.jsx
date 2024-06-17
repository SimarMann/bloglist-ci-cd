import { useLocation } from 'react-router-dom';

function User() {
  const location = useLocation();
  const user = location.state;

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default User;
