import { EnvConfig } from '../utils';

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(config: EnvConfig) {
    this.envConfig = config;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get sessionKey(): string {
    return this.envConfig.SESSION_KEY;
  }

  get emailChannel(): string {
    return this.envConfig.EMAIL_CHANNEL;
  }

  get smtpUrl(): string {
    return this.envConfig.SMTP_URL;
  }

  get sendgridFromAddress(): string {
    return this.envConfig.SENDGRID_FROM_ADDRESS;
  }

  get frontendUrl(): string {
    return this.envConfig.FRONTEND_URL;
  }

  get supportEmail(): string {
    return this.envConfig.SUPPORT_EMAIL;
  }

  get contactUsUrl(): string {
    return `${this.frontendUrl}/static-pages/contact-us`;
  }

  get validPeriodInHour(): number {
    return this.envConfig.VALID_PERIOD_IN_HOUR;
  }

  get apmServiceName(): string {
    return this.envConfig.APM_SERVICE_NAME;
  }

  get apmServerUrl(): string {
    return this.envConfig.APM_SERVER_URL;
  }

  get apmTraceParent(): string {
    return this.envConfig.ELASTIC_APM_TRACEPARENT;
  }

  get devEnvironments(): string[] {
    return this.envConfig.DEV_ENVIRONMENTS;
  }

  get isDevMode(): boolean {
    return this.devEnvironments.indexOf(this.nodeEnv) >= 0;
  }

  get smtpHost(): string {
    return this.envConfig.SMTP_HOST;
  }

  get smtpPort(): number {
    return this.envConfig.SMTP_PORT;
  }

  get smtpUser(): string {
    return this.envConfig.SMTP_USER;
  }

  get smtpPassword(): string {
    return this.envConfig.SMTP_PASSWORD;
  }

  get logoUrl(): string {
    return this.envConfig.LOGO_URL;
  }

  get backendUrl(): string {
    return this.envConfig.BACKEND_URL;
  }

  get checkOnboardingSig(): boolean {
    return this.envConfig.CHECK_ONBOARDING_SIG;
  }

  get termsConditionUrl(): string {
    return `${this.frontendUrl}/TermsAndConditions`;
  }

  get contactUsEmail() {
    return this.envConfig.CONTACTUS_EMAIL;
  }

  get privacyPolicyUrl(): string {
    return `${this.frontendUrl}/PrivacyPolicy`;
  }

  get disableBlockchain(): boolean {
    return this.envConfig.DISABLE_BLOCKCHAIN;
  }

  get masterkey(): string {
    return this.envConfig.MASTER_KEY;
  }

  get appId(): string {
    return this.envConfig.APP_ID;
  }

  get apiKey(): string {
    return this.envConfig.API_KEY;
  }
}
