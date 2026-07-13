const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.MANAGE_PERMISSIONS), permissionController.getAllPermissions);

module.exports = router;
