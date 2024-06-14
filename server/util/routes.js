const { Router } = require('express');
const blogsRouter = require('@controllers/blogsController');
const usersRouter = require('@controllers/usersController');
const loginRouter = require('@controllers/loginController');

const router = Router();

router.use('/blogs', blogsRouter);
router.use('/users', usersRouter);
router.use('/login', loginRouter);


module.exports = router;