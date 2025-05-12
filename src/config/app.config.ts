import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  ELASTICSEARCH_URL: string;
  ELASTICSEARCH_USERNAME: string;
  ELASTICSEARCH_PASSWORD: string;
  ELASTICSEARCH_TLS: boolean;
  WX_VERSION: string;
  WX_SERVICE_URL: string;
  WX_API_KEY: string;
  WX_PROJECT_ID: string;
  WX_EMBEDDINGS_MODEL: string;
  WX_MODEL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ELASTICSEARCH_URL: joi.string().required(),
    ELASTICSEARCH_USERNAME: joi.string().required(),
    ELASTICSEARCH_PASSWORD: joi.string().required(),
    ELASTICSEARCH_TLS: joi.boolean().required(),
    WX_VERSION: joi.string().required(),
    WX_SERVICE_URL: joi.string().required(),
    WX_API_KEY: joi.string().required(),
    WX_PROJECT_ID: joi.string().required(),
    WX_EMBEDDINGS_MODEL: joi.string().required(),
    WX_MODEL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  es: {
    url: envVars.ELASTICSEARCH_URL,
    username: envVars.ELASTICSEARCH_USERNAME,
    password: envVars.ELASTICSEARCH_PASSWORD,
    tls: envVars.ELASTICSEARCH_TLS,
  },
  llm: {
    version: envVars.WX_VERSION,
    serviceUrl: envVars.WX_SERVICE_URL,
    apiKey: envVars.WX_API_KEY,
    projectId: envVars.WX_PROJECT_ID,
    embeddingsModel: envVars.WX_EMBEDDINGS_MODEL,
    model: envVars.WX_MODEL,
  },
};
