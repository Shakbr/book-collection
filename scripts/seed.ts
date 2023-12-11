import sequelize from '../src/database/config/sequelize';
import { Book } from './../src/models/Book';
import { User } from './../src/models/User';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();

    // Delete existing records
    await Book.destroy({ truncate: true, cascade: true, restartIdentity: true });
    await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

    console.log('Existing records deleted.');

    // Create an admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin_user@example.com',
      password: '123456789',
      role: 'admin',
    });

    // Create a regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'regular_user@example.com',
      password: '123456789',
    });

    // Create sample books
    await Book.create({
      title: 'Book 1',
      content: ['Page 1', 'Page 2'],
      author: 'Author 1',
      lastReadPage: 1,
      userId: adminUser.id,
    });
    await Book.create({
      title: 'Book 2',
      content: ['Page 1', 'Page 2', 'Page 3'],
      author: 'Author 2',
      lastReadPage: 1,
      userId: adminUser.id,
    });
    await Book.create({
      title: 'Book 3',
      content: ['Page 1', 'Page 2', 'Page 3', 'Page 4'],
      author: 'Author 1',
      lastReadPage: 3,
      userId: adminUser.id,
    });
    await Book.create({
      title: 'Book 4',
      content: ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5'],
      author: 'Author 3',
      lastReadPage: 4,
      userId: regularUser.id,
    });
    await Book.create({
      title: 'Book 5',
      content: ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6'],
      author: 'Author 5',
      lastReadPage: 5,
      userId: regularUser.id,
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
