const express = require('express');
const { uploadChanges } = require('../controllers/syncController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, uploadChanges);

module.exports = router;
