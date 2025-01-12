import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// Create OAuth 1.0a instance
const oauth = new OAuth({
  consumer: {
    key: process.env.X_API_KEY as string,
    secret: process.env.X_API_SECRET as string,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString: string, key: string) {
    return crypto
      .createHmac('sha1', key)
      .update(baseString)
      .digest('base64');
  },
});

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: 'https://api.x.com/1.1',
});

// Add request interceptor to sign requests
axiosInstance.interceptors.request.use((config) => {
  const auth = {
    key: process.env.X_ACCESS_TOKEN as string,
    secret: process.env.X_ACCESS_TOKEN_SECRET as string,
  };

  const requestData = {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase() || 'GET',
  };
  const authHeader = oauth.toHeader(oauth.authorize(requestData, auth));
  config.headers = new axios.AxiosHeaders({
    ...config.headers,
    ...authHeader
  });

  return config;
});
