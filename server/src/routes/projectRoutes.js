const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
  removeMemberValidator,
} = require('../validators/projectValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .post(createProjectValidator, validate, createProject)
  .get(getProjects);

router
  .route('/:id')
  .get(getProjectById)
  .put(updateProjectValidator, validate, updateProject)
  .delete(deleteProject);

// Member management
router.post('/:id/members', addMemberValidator, validate, addMember);
router.delete('/:id/members/:userId', removeMemberValidator, validate, removeMember);

module.exports = router;
