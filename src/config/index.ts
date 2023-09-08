import convict from 'convict';

const config = convict({
  env: {
    default: 'development',
    env: 'NODE_ENV',
    doc: 'The application environment',
    format: ['production', 'development', 'staging', 'test']
  },
  port: {
    arg: 'port',
    default: 3300,
    doc: 'The port to bind',
    env: 'APP_PORT',
    format: 'port'
  },
  baseUrl: {
    default: "https://osaro-igbinovia-lendsqr-be-test.<cloud-platform-domain>", 
    doc: 'App base url',
    env: 'APP_BASE_URL',
    nullable: false,
    format: String
  },
  showLogs: {
    arg: 'show-app-logs',
    default: true,
    doc: 'To determine whether to show application logs',
    env: 'SHOW_APP_LOGS',
    nullable: true,
    format: Boolean
  },
  mysqlDatabase: {
    host: {
      default: 'localhost',
      doc: 'Mysql database host name/IP',
      env: 'MYSQL_DATABASE_HOST',
      format: '*'
    },
    port: {
      default: 3306,
      doc: 'Mysql database server port',
      env: 'MYSQL_DATABASE_PORT',
      format: 'port'
    },
    name: {
      default: 'democredit',
      doc: 'Mysql database name',
      env: 'MYSQL_DATABASE_NAME',
      nullable: false,
      format: String
    },
    username: {
      default: 'root',
      doc: 'Mysql database username',
      env: 'MYSQL_DATABASE_USERNAME',
      nullable: false,
      format: String
    },
    password: {
      default: 'root',
      doc: 'Mysql database password',
      env: 'MYSQL_DATABASE_PASSWORD',
      nullable: true,
      sensitive: true,
      format: String
    },
    showLogs: {
      default: true,
      doc: 'To determine whether to show mysql database logs',
      env: 'MYSQL_DATABASE_SHOW_LOGS',
      format: Boolean
    },
    dialect: {
      default: "mysql",
    }
  }
});

// Perform validation
config.validate({ allowed: 'strict' });
export default config;
