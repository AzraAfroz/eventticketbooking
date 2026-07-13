/**
 * Defines and applies associations between Sequelize models
 * @param {object} db - Object containing loaded Sequelize models
 */
const applyAssociations = (db) => {
  const {
    User,
    Role,
    Permission,
    RolePermission,
    Organizer,
    Venue,
    Event,
    SeatCategory,
    Seat,
    Booking,
    BookingSeat,
    Ticket,
    AuditLog
  } = db;

  // 1. User & Role
  if (User && Role) {
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  }

  // 2. Role & Permission (Many-to-Many through RolePermission)
  if (Role && Permission && RolePermission) {
    Role.belongsToMany(Permission, {
      through: RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions'
    });
    Permission.belongsToMany(Role, {
      through: RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles'
    });
  }

  // 3. User & Organizer
  if (User && Organizer) {
    Organizer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasOne(Organizer, { foreignKey: 'userId', as: 'organizer' });
  }

  // 4. Venue & Event
  if (Venue && Event) {
    Event.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
    Venue.hasMany(Event, { foreignKey: 'venueId', as: 'events' });
  }

  // 5. Organizer & Event
  if (Organizer && Event) {
    Event.belongsTo(Organizer, { foreignKey: 'organizerId', as: 'organizer' });
    Organizer.hasMany(Event, { foreignKey: 'organizerId', as: 'events' });
  }

  // 6. Event & SeatCategory
  if (Event && SeatCategory) {
    SeatCategory.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
    Event.hasMany(SeatCategory, { foreignKey: 'eventId', as: 'seatCategories' });
  }

  // 7. SeatCategory & Seat
  if (SeatCategory && Seat) {
    Seat.belongsTo(SeatCategory, { foreignKey: 'seatCategoryId', as: 'category' });
    SeatCategory.hasMany(Seat, { foreignKey: 'seatCategoryId', as: 'seats' });
  }

  // 8. User & Booking
  if (User && Booking) {
    Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
  }

  // 9. Event & Booking
  if (Event && Booking) {
    Booking.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
    Event.hasMany(Booking, { foreignKey: 'eventId', as: 'bookings' });
  }

  // 10. Booking & Seat (Many-to-Many through BookingSeat)
  if (Booking && Seat && BookingSeat) {
    Booking.belongsToMany(Seat, {
      through: BookingSeat,
      foreignKey: 'bookingId',
      otherKey: 'seatId',
      as: 'seats'
    });
    Seat.belongsToMany(Booking, {
      through: BookingSeat,
      foreignKey: 'seatId',
      otherKey: 'bookingId',
      as: 'bookings'
    });
  }

  // 11. Booking & Ticket
  if (Booking && Ticket) {
    Ticket.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
    Booking.hasMany(Ticket, { foreignKey: 'bookingId', as: 'tickets' });
  }

  // 12. Seat & Ticket
  if (Seat && Ticket) {
    Ticket.belongsTo(Seat, { foreignKey: 'seatId', as: 'seat' });
    Seat.hasOne(Ticket, { foreignKey: 'seatId', as: 'ticket' });
  }

  // 13. User & AuditLog
  if (User && AuditLog) {
    AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
  }
};

module.exports = applyAssociations;
