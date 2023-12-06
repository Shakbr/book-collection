import sequelize from './config/sequelize';
import '../models/Book';

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({ force: false });
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};
