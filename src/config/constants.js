module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    CUSTOMER: 'customer'
  },
  
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
  },

  TICKET_STATUS: {
    ACTIVE: 'active',
    USED: 'used',
    CANCELLED: 'cancelled'
  },

  SEAT_STATUS: {
    AVAILABLE: 'available',
    HOLD: 'hold',
    BOOKED: 'booked'
  }
};
