const convict = require("convict");
convict.addFormat(require("convict-format-with-validator").ipaddress);
// Define a schema
var config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
  },
  db: {
    host: {
      doc: "Database host name/IP",
      format: String,
      default: "127.0.0.1",
      env: "DATABASE_HOST",
    },
    port: {
      doc: "Database port",
      format: String,
      default: "5432",
      env: "DATABASE_PORT",
    },
    name: {
      doc: "Database name",
      format: String,
      default: "database_development",
      env: "DATABASE_NAME",
    },
    username: {
      doc: "db user",
      format: String,
      default: "root",
      env: "DATABASE_USERNAME",
    },
    password: {
      doc: "db password",
      format: "*",
      default: null,
      env: "DATABASE_PASSWORD",
    },
  },
  jwt: {
    secret: {
      doc: "JWT Secret",
      format: String,
      default: "",
      env: "JWT_SECRET",
    },
  },
});

// Load environment dependent configuration
let env = config.get("env");
if (env === "development" || env === "test") {
  config.loadFile(__dirname + "/environments/" + env + ".json");
}

// Perform validation
config.validate({ allowed: "strict" });
module.exports = config;
