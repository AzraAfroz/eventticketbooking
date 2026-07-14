const bookingRepository = require('../repositories/booking.repository');
const ApiError = require('../utils/ApiError');
const { Booking, BookingSeat, Seat, SeatCategory, Ticket, Event, sequelize } = require('../models');
const { BOOKING_STATUS, SEAT_STATUS, TICKET_STATUS } = require('../config/constants');
const { generateTicketNumber } = require('../utils/ticketNumber');
const { generateQRCode } = require('../utils/qrGenerator');

class BookingService {
  async createBooking(userId, bookingData) {
    const { eventId, seats: seatIds } = bookingData;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    // Verify seats belong to this event and are available
    const seats = await Seat.findAll({
      where: { id: seatIds },
      include: [{
        model: SeatCategory,
        as: 'category',
        where: { eventId }
      }]
    });

    if (seats.length !== seatIds.length) {
      throw ApiError.badRequest('Some seats are invalid or belong to a different event');
    }

    const unavailableSeats = seats.filter(s => s.status !== SEAT_STATUS.AVAILABLE && s.status !== SEAT_STATUS.HOLD);
    if (unavailableSeats.length > 0) {
      throw ApiError.badRequest('Some seats are already booked or reserved');
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const seat of seats) {
      totalAmount += parseFloat(seat.category.price);
    }

    const transaction = await sequelize.transaction();

    try {
      // 1. Create booking
      const booking = await Booking.create({
        userId,
        eventId,
        totalAmount,
        status: BOOKING_STATUS.PENDING
      }, { transaction });

      // 2. Link seats and update status
      const bookingSeats = seatIds.map(seatId => ({
        bookingId: booking.id,
        seatId
      }));
      await BookingSeat.bulkCreate(bookingSeats, { transaction });

      // Update seat statuses to booked
      await Seat.update(
        { status: SEAT_STATUS.BOOKED },
        { where: { id: seatIds }, transaction }
      );

      // 3. Generate tickets
      for (const seat of seats) {
        const ticketNumber = generateTicketNumber();
        const qrCodeData = {
          ticketNumber,
          eventId,
          seatNumber: seat.seatNumber,
          userId
        };
        const qrCode = await generateQRCode(qrCodeData);

        await Ticket.create({
          bookingId: booking.id,
          seatId: seat.id,
          ticketNumber,
          qrCode,
          status: TICKET_STATUS.ACTIVE
        }, { transaction });
      }

      await transaction.commit();

      // Return the completed booking with event, seats, and tickets loaded
      return await bookingRepository.findById(booking.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getBookingById(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }
    return booking;
  }

  async cancelBooking(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return booking;
    }

    const transaction = await sequelize.transaction();

    try {
      // Update booking status
      booking.status = BOOKING_STATUS.CANCELLED;
      await booking.save({ transaction });

      // Update seat status back to available
      const seatIds = booking.seats.map(s => s.id);
      await Seat.update(
        { status: SEAT_STATUS.AVAILABLE },
        { where: { id: seatIds }, transaction }
      );

      // Update tickets status to cancelled
      await Ticket.update(
        { status: TICKET_STATUS.CANCELLED },
        { where: { bookingId: booking.id }, transaction }
      );

      await transaction.commit();

      return await bookingRepository.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async expireUnpaidBookings() {
    const { Op } = require('sequelize');
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const expiredBookings = await Booking.findAll({
      where: {
        status: BOOKING_STATUS.PENDING,
        createdAt: {
          [Op.lt]: tenMinutesAgo
        }
      },
      include: [{ model: Seat, as: 'seats' }]
    });

    if (expiredBookings.length === 0) {
      return;
    }

    for (const booking of expiredBookings) {
      const transaction = await sequelize.transaction();
      try {
        booking.status = BOOKING_STATUS.EXPIRED;
        await booking.save({ transaction });

        const seatIds = booking.seats.map(s => s.id);
        if (seatIds.length > 0) {
          await Seat.update(
            { status: SEAT_STATUS.AVAILABLE },
            { where: { id: seatIds }, transaction }
          );
        }

        await Ticket.update(
          { status: TICKET_STATUS.CANCELLED },
          { where: { bookingId: booking.id }, transaction }
        );

        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        console.error(`Failed to expire booking ${booking.id}:`, err);
      }
    }
  }
}

module.exports = new BookingService();
