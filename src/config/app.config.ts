import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  ELASTICSEARCH_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ELASTICSEARCH_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  elasticsearch: {
    url: envVars.ELASTICSEARCH_URL,
  },
};
