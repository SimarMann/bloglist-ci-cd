import { useRef } from 'react';
import { Routes, Route, Navigate, useMatch, Link } from 'react-router-dom';
import { Container, Toolbar, Button, AppBar } from '@mui/material';
import { useUserValue } from 'Utilities/contexts/UserContext';
import { useGetAllBlogs } from 'Utilities/queries/BlogsQuery';

import BlogList from 'Components/BlogList';
import Blog from 'Components/Blog';
import Login from 'Components/Login';
import Logout from 'Components/Logout';
import BlogForm from 'Components/BlogForm';
import Notification from 'Components/Notification';
import Togglable from 'Components/Togglable';
import Users from 'Components/Users';
import User from 'Components/User';

function Home({ blogs }) {
  const blogFormRef = useRef();

  const toggleVisibility = () => {
    blogFormRef.current.toggleVisibility();
  };

  return (
    <>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm onCreate={toggleVisibility} />
      </Togglable>
      <BlogList blogs={blogs} />
    </>
  );
}

function Navigation({ user }) {
  return user ? (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          <Logout />
        </Toolbar>
      </AppBar>
      <div>
        <h2>blog app</h2>
      </div>
    </>
  ) : (
    ''
  );
}

function App() {
  const user = useUserValue();

  const { data: result, isLoading, isError } = useGetAllBlogs();
  const match = useMatch('/blogs/:id');

  if (isLoading) {
    return <div>loading data...</div>;
  }
  if (isError) {
    return <div>blog service not available due to problems in server</div>;
  }

  const byLikes = (a, b) => b.likes - a.likes;
  const blogs = [...result].sort(byLikes);
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  return (
    <Container>
      <Navigation user={user} />
      <div>
        <Notification />
      </div>
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <Login />}
        />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />
        <Route
          path="/"
          element={
            user ? <Home blogs={blogs} /> : <Navigate replace to="/login" />
          }
        />
      </Routes>
    </Container>
  );
}

export default App;
