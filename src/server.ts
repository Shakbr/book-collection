import ExpressConfig from '.';
import { initializeDatabase } from './database/initializeDatabase';
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const app = ExpressConfig();
    await initializeDatabase();
    app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
  } catch (error) {
    console.error('Error starting the server', error);
    process.exit(1);
  }
};

startServer();
