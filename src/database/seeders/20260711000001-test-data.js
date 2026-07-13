'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // 1. Seed Venue
    await queryInterface.bulkInsert('venues', [{
      id: 1,
      name: 'Grand Arena',
      address: '123 Stadium Way',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zip_code: '90001',
      capacity: 500,
      created_at: now,
      updated_at: now
    }]);

    // 2. Fetch role IDs
    const [roles] = await queryInterface.sequelize.query("SELECT id, name FROM roles WHERE name IN ('organizer', 'super_admin');");
    const roleMap = {};
    roles.forEach(r => {
      roleMap[r.name] = r.id;
    });

    if (!roleMap['organizer'] || !roleMap['super_admin']) {
      throw new Error('Required roles not found in database. Make sure initial-rbac has run.');
    }

    const organizerRoleId = roleMap['organizer'];
    const superAdminRoleId = roleMap['super_admin'];

    // 3. Seed Users (password: password123)
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Test Organizer User',
        email: 'organizer@example.com',
        password: hashedPassword,
        role_id: organizerRoleId,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        name: 'Test Super Admin User',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role_id: superAdminRoleId,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    // 4. Seed Organizer Profile
    await queryInterface.bulkInsert('organizers', [{
      id: 1,
      user_id: 1,
      company_name: 'Stadium Events Inc.',
      contact_email: 'organizer@example.com',
      contact_phone: '123-456-7890',
      website: 'https://stadiumevents.example.com',
      address: '123 Stadium Way',
      created_at: now,
      updated_at: now
    }]);

    // 5. Seed Event
    await queryInterface.bulkInsert('events', [{
      id: 1,
      title: 'Rock Concert 2026',
      description: 'Live rock music event',
      event_date: new Date('2026-10-15T20:00:00Z'),
      venue_id: 1,
      organizer_id: 1,
      status: 'published',
      created_at: now,
      updated_at: now
    }]);

    // 6. Seed Seat Category
    await queryInterface.bulkInsert('seat_categories', [{
      id: 1,
      event_id: 1,
      name: 'General Admission',
      price: 50.00,
      capacity: 50,
      created_at: now,
      updated_at: now
    }]);

    // 7. Seed 20 seats (so IDs 12 & 13 exist and are available for Postman's booking request)
    const seatsData = [];
    for (let i = 1; i <= 20; i++) {
      seatsData.push({
        id: i,
        seat_category_id: 1,
        seat_number: `GA-${i}`,
        status: 'available',
        created_at: now,
        updated_at: now
      });
    }
    await queryInterface.bulkInsert('seats', seatsData);

    // Sync sequences so auto-increment works correctly for future API creations
    await queryInterface.sequelize.query("SELECT setval('venues_id_seq', COALESCE((SELECT MAX(id) FROM venues), 1));");
    await queryInterface.sequelize.query("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));");
    await queryInterface.sequelize.query("SELECT setval('organizers_id_seq', COALESCE((SELECT MAX(id) FROM organizers), 1));");
    await queryInterface.sequelize.query("SELECT setval('events_id_seq', COALESCE((SELECT MAX(id) FROM events), 1));");
    await queryInterface.sequelize.query("SELECT setval('seat_categories_id_seq', COALESCE((SELECT MAX(id) FROM seat_categories), 1));");
    await queryInterface.sequelize.query("SELECT setval('seats_id_seq', COALESCE((SELECT MAX(id) FROM seats), 1));");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('seats', null, {});
    await queryInterface.bulkDelete('seat_categories', null, {});
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('organizers', null, {});
    await queryInterface.bulkDelete('users', { email: ['organizer@example.com', 'superadmin@example.com'] }, {});
    await queryInterface.bulkDelete('venues', null, {});
  }
};
