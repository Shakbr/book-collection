import { config } from 'dotenv';
config();

import app from './app';
import { initializeDatabase } from './database/initializeDatabase';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    const server = app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
    return server;
  } catch (error) {
    console.error('Error starting the server', error);
    process.exit(1);
  }
};

startServer();
