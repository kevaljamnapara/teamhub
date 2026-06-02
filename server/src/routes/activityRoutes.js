const express = require('express');
const router = express.Router();
const {
  getActivities,
  getProjectActivities,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getActivities);
router.get('/project/:projectId', getProjectActivities);

module.exports = router;
