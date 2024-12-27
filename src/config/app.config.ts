import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  ELASTICSEARCH_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_URL: string;
  OPENAI_MODEL: string;
  PROMPT_INSTRUCTIONS: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ELASTICSEARCH_URL: joi.string().required(),
    OPENAI_API_KEY: joi.string().required(),
    OPENAI_URL: joi.string().required(),
    OPENAI_MODEL: joi.string().required(),
    PROMPT_INSTRUCTIONS: joi.string().required(),
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
  llm: {
    openaiApiKey: envVars.OPENAI_API_KEY,
    openaiUrl: envVars.OPENAI_URL,
    openaiModel: envVars.OPENAI_MODEL,
    prompt: envVars.PROMPT_INSTRUCTIONS,
  },
};
