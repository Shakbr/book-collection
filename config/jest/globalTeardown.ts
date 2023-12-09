import sequelize from '../../src/database/config/sequelize';

export default async () => {
  await sequelize.close();
};
