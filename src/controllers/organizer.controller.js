const organizerService = require('../services/organizer.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

class OrganizerController {
  getAllOrganizers = asyncHandler(async (req, res) => {
    const organizers = await organizerService.getAllOrganizers();
    return successResponse(res, 200, 'Organizers fetched successfully', organizers);
  });

  getOrganizerById = asyncHandler(async (req, res) => {
    const organizer = await organizerService.getOrganizerById(req.params.id);
    return successResponse(res, 200, 'Organizer fetched successfully', organizer);
  });

  createOrganizer = asyncHandler(async (req, res) => {
    const organizer = await organizerService.createOrganizer(req.body);
    return successResponse(res, 201, 'Organizer profile created successfully', organizer);
  });

  updateOrganizer = asyncHandler(async (req, res) => {
    const organizer = await organizerService.updateOrganizer(req.params.id, req.body);
    return successResponse(res, 200, 'Organizer profile updated successfully', organizer);
  });

  approveOrganizer = asyncHandler(async (req, res) => {
    const organizer = await organizerService.approveOrganizer(req.params.id);
    return successResponse(res, 200, 'Organizer approved successfully', organizer);
  });

  suspendOrganizer = asyncHandler(async (req, res) => {
    const organizer = await organizerService.suspendOrganizer(req.params.id);
    return successResponse(res, 200, 'Organizer suspended successfully', organizer);
  });
}

module.exports = new OrganizerController();
