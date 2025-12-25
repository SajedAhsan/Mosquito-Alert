const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

/**
 * Database Seeder for Admin Accounts
 * Creates pre-defined admin users
 */

const adminData = [
  {
    name: 'Admin User',
    email: 'admin@mosquitoalert.com',
    password: 'admin123456',
  },
  {
    name: 'Super Admin',
    email: 'superadmin@mosquitoalert.com',
    password: 'superadmin123',
  },
];

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    // Clear existing admins
    await Admin.deleteMany();
    console.log('🗑️  Existing admins removed');

    // Hash passwords and create admins
    for (let admin of adminData) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
    }

    await Admin.insertMany(adminData);
    console.log('✅ Admin users seeded successfully');
    console.log('\n📋 Admin Credentials:');
    adminData.forEach((admin, index) => {
      console.log(`\n${index + 1}. Email: ${admin.email}`);
      console.log(`   Password: ${adminData[index].password === admin.password ? '[hashed]' : adminData[index].password}`);
    });
    console.log('\n⚠️  Change these credentials in production!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedAdmins();
