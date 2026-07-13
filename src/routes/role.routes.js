const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/', authenticate, authorize(PERMISSIONS.MANAGE_ROLES), roleController.getAllRoles);
router.get('/:id', authenticate, authorize(PERMISSIONS.MANAGE_ROLES), roleController.getRoleById);
router.post('/', authenticate, authorize(PERMISSIONS.MANAGE_ROLES), roleController.createRole);

module.exports = router;
