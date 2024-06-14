const blogsRouter = require('express').Router()
const Blog = require('@models/blogModel')
const User = require('@models/userModel')
const ObjectId = require('mongoose').Types.ObjectId
const middleware = require('@middleware/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
    comments: []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user._id.toString() ) {
    const deletedBlog = await Blog.findByIdAndDelete(blog.id)
    const update = { $pull: { blogs: new ObjectId(deletedBlog.id) } }
    await User.findOneAndUpdate(user._id, update)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'invalid user' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { user , title, author, url, likes, comments } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { user , title, author, url, likes, comments }, { new: true })

  response.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blogId = request.params.id

  const { comment } = request.body

  await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment } })

  response.status(201).json({ message: 'Comment added successfully!' })
})

module.exports = blogsRouter