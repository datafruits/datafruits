/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;
  API_HOST: string;
  CHAT_SOCKET_URL: string;
  ICECAST_HOST: string;
  headTags: any;
  STREAM_NAME: string;
  STREAM_HOST: string;
};

export default config;
