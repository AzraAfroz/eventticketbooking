const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.MANAGE_ADMINS), adminController.getAdmins);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_ADMINS), adminController.createAdmin);

module.exports = router;
