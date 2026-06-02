const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const {
  addComment,
  getComments,
  deleteComment,
} = require('../controllers/commentController');
const {
  createTaskValidator,
  updateTaskValidator,
  createCommentValidator,
} = require('../validators/taskValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Task CRUD
router
  .route('/')
  .post(createTaskValidator, validate, createTask)
  .get(getTasks);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTaskValidator, validate, updateTask)
  .delete(deleteTask);

// Comments on tasks
router.post('/:id/comments', createCommentValidator, validate, addComment);
router.get('/:id/comments', getComments);

// Delete comment (separate route since comment ID is used, not task ID)
router.delete('/comments/:id', deleteComment);

module.exports = router;
