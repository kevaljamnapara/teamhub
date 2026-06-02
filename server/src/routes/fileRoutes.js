const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/fileController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
