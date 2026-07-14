const seatRepository = require('../repositories/seat.repository');
const ApiError = require('../utils/ApiError');
const { SEAT_STATUS } = require('../config/constants');

function getRowLabel(index) {
  let label = '';
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

class SeatService {
  async getSeatsByEvent(eventId) {
    return await seatRepository.findByEventId(eventId);
  }

  async bulkGenerateSeats(seatCategoryId, rows, columns) {
    const { Seat, SeatCategory } = require('../models');
    
    const category = await SeatCategory.findByPk(seatCategoryId);
    if (!category) {
      throw ApiError.notFound('Seat category not found');
    }

    let rowLabels = [];
    if (typeof rows === 'number') {
      for (let i = 0; i < rows; i++) {
        rowLabels.push(getRowLabel(i));
      }
    } else if (Array.isArray(rows)) {
      rowLabels = rows;
    } else {
      throw ApiError.badRequest('Rows must be an array of row labels or an integer representing the number of rows.');
    }

    const allCategories = await SeatCategory.findAll({ where: { eventId: category.eventId } });
    const categoryIds = allCategories.map(c => c.id).filter(id => id !== seatCategoryId);

    const existingSeats = await Seat.findAll({ where: { seatCategoryId: categoryIds } });
    const existingNumbers = new Set(existingSeats.map(s => s.seatNumber.toUpperCase()));

    for (const row of rowLabels) {
      for (let col = 1; col <= columns; col++) {
        const seatNumber = `${row}-${col}`;
        if (existingNumbers.has(seatNumber.toUpperCase())) {
          throw ApiError.badRequest(`Duplicate seat number "${seatNumber}" already exists for this event.`);
        }
      }
    }

    await Seat.destroy({ where: { seatCategoryId } });

    const seatsToCreate = [];
    for (const row of rowLabels) {
      for (let col = 1; col <= columns; col++) {
        seatsToCreate.push({
          seatCategoryId,
          seatNumber: `${row}-${col}`,
          status: SEAT_STATUS.AVAILABLE
        });
      }
    }

    await Seat.bulkCreate(seatsToCreate);

    return await Seat.findAll({ where: { seatCategoryId } });
  }

  async reserveSeat(seatId) {
    const { Seat } = require('../models');
    const seat = await Seat.findByPk(seatId);
    if (!seat) {
      throw ApiError.notFound('Seat not found');
    }
    if (seat.status !== SEAT_STATUS.AVAILABLE) {
      throw ApiError.badRequest(`Seat is not available for reservation. Current status: ${seat.status}`);
    }
    seat.status = SEAT_STATUS.HOLD;
    await seat.save();
    return seat;
  }

  async disableSeat(seatId) {
    const { Seat } = require('../models');
    const seat = await Seat.findByPk(seatId);
    if (!seat) {
      throw ApiError.notFound('Seat not found');
    }
    if (seat.status === SEAT_STATUS.BOOKED) {
      throw ApiError.badRequest('Cannot disable an already booked seat.');
    }
    seat.status = SEAT_STATUS.BLOCKED;
    await seat.save();
    return seat;
  }

  async enableSeat(seatId) {
    const { Seat } = require('../models');
    const seat = await Seat.findByPk(seatId);
    if (!seat) {
      throw ApiError.notFound('Seat not found');
    }
    if (seat.status !== SEAT_STATUS.BLOCKED) {
      throw ApiError.badRequest(`Seat is not blocked. Current status: ${seat.status}`);
    }
    seat.status = SEAT_STATUS.AVAILABLE;
    await seat.save();
    return seat;
  }
}

module.exports = new SeatService();
