const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../config/permissions');

router.get('/sales', authenticate, authorize(PERMISSIONS.VIEW_REPORTS), reportController.getSalesReport);

module.exports = router;
