import Joi from '@hapi/joi';

export interface EnvConfig {
    [key: string]: any;
}

const envConfig = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    TYPEORM_DRIVER: process.env.TYPEORM_DRIVER,
    TYPEORM_HOST: process.env.TYPEORM_HOST,
    TYPEORM_PORT: process.env.TYPEORM_PORT,
    TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
    TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD,
    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
    TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE,
    TYPEORM_LOGGING: process.env.TYPEORM_LOGGING,
    WHITELIST: process.env.WHITELIST,
    SESSION_KEY: process.env.SESSION_KEY,
    EMAIL_CHANNEL: process.env.EMAIL_CHANNEL,
    SMTP_URL: process.env.SMTP_URL,
    SENDGRID_FROM_ADDRESS: process.env.SENDGRID_FROM_ADDRESS,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    VALID_PERIOD_IN_HOUR: process.env.VALID_PERIOD_IN_HOUR,
    APM_SERVICE_NAME: process.env.APM_SERVICE_NAME,
    APM_SERVER_URL: process.env.APM_SERVER_URL,
    ELASTIC_APM_TRACEPARENT: process.env.ELASTIC_APM_TRACEPARENT,
    DEV_ENVIRONMENTS: ['local', 'test'],
    TRANSACTION_NAME: 'Transaction-Name',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    LOGO_URL: process.env.LOGO_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    CHECK_ONBOARDING_SIG: process.env.CHECK_ONBOARDING_SIG,
    CONTACTUS_EMAIL: process.env.CONTACTUS_EMAIL,
    DISABLE_BLOCKCHAIN: process.env.DISABLE_BLOCKCHAIN,
    MASTER_KEY: process.env.MASTER_KEY,
    APP_ID: process.env.APP_ID,
    API_KEY: process.env.API_KEY,
};

const envVarsSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid(['development', 'qa', 'production', 'test', 'local'])
        .default('local'),
    PORT: Joi.number().default(3000),
    TYPEORM_DRIVER: Joi.string().default('postgres'),
    TYPEORM_HOST: Joi.string().default('postgresql-hoanghong.alwaysdata.net'),
    TYPEORM_PORT: Joi.number().default(5432),
    TYPEORM_USERNAME: Joi.string().default('hoanghong'),
    TYPEORM_PASSWORD: Joi.string().default('Hong1996@1996'),
    TYPEORM_DATABASE: Joi.string().default('hoanghong_fsel_manage'),
    TYPEORM_SYNCHRONIZE: Joi.boolean().default(false),
    TYPEORM_LOGGING: Joi.boolean().default(false),
    WHITELIST: Joi.string().default('https://freedom.epic-med.link'),
    SESSION_KEY: Joi.string().default('cbd3f46c2644ba8e4a7e12ec81c38e48fe6daa8f6ad2d7ffc3466e9b1282a8317649bcbed5e69951c3253998ba571959ab0de9e5dce8445c64859c1cd2e97531'),
    EMAIL_CHANNEL: Joi.string().default('smtp'),
    SMTP_URL: Joi.string().default('smtp://mailhog:1025'),
    SENDGRID_FROM_ADDRESS: Joi.string().default('no-reply@freedom.epic-med.link'),
    FRONTEND_URL: Joi.string().default('https://freedom.epic-med.link'),
    SUPPORT_EMAIL: Joi.string().default('no-reply@freedom.epic-med.link'),
    AWS_ACCESS_KEY_ID: Joi.string().default('AKIAI45VQK4MBLSTVNSQ'),
    AWS_SECRET_ACCESS_KEY: Joi.string().default('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'),
    AWS_REGION: Joi.string().default('ap-southeast-1'),
    S3_BUCKET_NAME: Joi.string().default('irissafer'),
    VALID_PERIOD_IN_HOUR: Joi.number().default(1),
    APM_SERVICE_NAME: Joi.string().default('questionnaire-backend-dev'),
    APM_SERVER_URL: Joi.string().default('http://elastic-apm-monochart.elastic.svc.cluster.local:8200'),
    ELASTIC_APM_TRACEPARENT: Joi.string().default('elastic-apm-traceparent'),
    DEV_ENVIRONMENTS: Joi.array(),
    TRANSACTION_NAME: Joi.string(),
    SMTP_HOST: Joi.string().default('smtp.gmail.com'),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().default('hong260196@gmail.com'),
    SMTP_PASSWORD: Joi.string().default('aznrvxvhzkzfbdss'),
    LOGO_URL: Joi.string().default('https://freedom.epic-med.link/assets/img/logo.png'),
    BACKEND_URL: Joi.string().default('https://freedom.epic-med.link/api'),
    CHECK_ONBOARDING_SIG: Joi.boolean().default(false),
    CONTACTUS_EMAIL: Joi.string().default('mailto:freedom.epic.med@gmail.com'),
    DISABLE_BLOCKCHAIN: Joi.boolean().default(false),
    MASTER_KEY: Joi.string().default('dac86b78f2d6cc4d561788c3fa44bd8c'),
    APP_ID: Joi.string().default('de5ed588-d9cf-4024-ab5e-6f9115e4c261'),
    API_KEY: Joi.string().default('YzIzMTQ5NzUtZWM4Ni00NmY0LTk4M2UtN2FmMmU4OGMzMDA5'),
});
export const validateInput = (): EnvConfig => {
    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
        throw new Error(`ERRORMESSAGE.CONFIG_VALIDATION_ERROR|` + error.message);
    }
    return validatedEnvConfig;
};
