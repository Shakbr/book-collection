import { defaultPort } from '../sequelize';

describe('Sequelize', () => {
  let Sequelize: typeof import('sequelize');
  beforeEach(() => {
    jest.resetModules();
    Sequelize = require('sequelize');
  });
  it('should create an in-memory SQLite database for test environment', async () => {
    process.env.NODE_ENV = 'test';
    const sequelize = (await import('../sequelize')).default;

    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize.getDialect()).toBe('sqlite');
    expect(sequelize.getDatabaseName()).toBe(undefined);
  });

  it('should create a PostgreSQL database for non-test environment with default port number', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DB_DATABASE = 'test';
    const sequelize = (await import('../sequelize')).default;
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize.getDialect()).toBe('postgres');
    expect(sequelize.getDatabaseName()).toBe(process.env.DB_DATABASE);
    expect(sequelize.config.port).toBe(defaultPort);
  });

  it('should create a PostgreSQL database for non-test environment', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DB_DATABASE = 'test';
    process.env.DB_PORT = '5555';
    const sequelize = (await import('../sequelize')).default;
    expect(sequelize).toBeInstanceOf(Sequelize);
    expect(sequelize.getDialect()).toBe('postgres');
    expect(sequelize.getDatabaseName()).toBe(process.env.DB_DATABASE);
    expect(sequelize.config.port).toBe(5555);
  });
});
