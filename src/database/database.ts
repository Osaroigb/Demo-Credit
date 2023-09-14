import knex from "knex";
import knexConfig from "../../knexfile";

const environment = process.env.NODE_ENV || "production";
export const db = knex(knexConfig[environment]);
