import convict from 'convict';

const config = convict({
  env: {
    default: 'development',
    env: 'NODE_ENV',
    doc: 'The application environment',
    format: ['production', 'development', 'test']
  },
  port: {
    arg: 'port',
    default: 3300,
    doc: 'The port to bind',
    env: 'APP_PORT',
    format: 'port'
  },
  baseUrl: {
    default: "https://osaro-igbinovia-lendsqr-be-test.vercel.app", 
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
      default: 'nexapay',
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
  },
  jwt: {
    expiry: {
      default: 7200,
      doc: 'JWT expiry in seconds',
      env: 'JWT_EXPIRY_IN_SECONDS',
      nullable: true,
      format: Number
    },
    privateKey: {
      default: "./src/config/keys/oauth-private.key",
      doc: 'OAuth private key',
      env: 'OAUTH_PRIVATE_KEY',
      nullable: false,
      format: String
    },
    publicKey: {
      default: "./src/config/keys/oauth-public.key",
      doc: 'OAuth public key',
      env: 'OAUTH_PUBLIC_KEY',
      nullable: false,
      format: String
    }
  },
});

export default config;
