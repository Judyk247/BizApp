const express = require('express');
const { getBusiness, updateBusiness, regenerateInviteCode } = require('../controllers/businessController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getBusiness);
router.put('/', authenticate, updateBusiness);
router.put('/invite-code', authenticate, authorize('admin'), regenerateInviteCode);

module.exports = router;
