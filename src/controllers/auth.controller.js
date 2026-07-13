const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    return successResponse(res, 201, 'User registered successfully', user);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, 200, 'User logged in successfully', result);
  });
}

module.exports = new AuthController();
