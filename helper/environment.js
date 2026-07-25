// dependencies

// module scaffolding
const environment = {};

environment.staging = {
  port: 3000,
  envName: "staging",
  secretkey: "hgogsoahtohaeroo",
};

environment.production = {
  port: 5000,
  envName: "production",
  secretkey: "hgogsoahtojvioai",
};

// determine which environment was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object

const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;

// export module

module.exports = environmentToExport;
