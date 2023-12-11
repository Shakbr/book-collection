import sequelize from './config/sequelize';
import '../models/Book';
import '../models/User';

export const initializeDatabase = async (sync: boolean = false) => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({ force: sync });
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Unable to connect to the database: Please run "docker-compose up -d"');
    process.exit(1);
  }
};
