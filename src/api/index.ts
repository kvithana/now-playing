import { logError } from '../util/loggers';

const REFRESH_TOKEN_ENDPOINT = '/api/refresh-token';
const AUTHORISE_CODE_ENDPOINT = '/api/authorise-code';
const REDIRECT_ENDPOINT = '/api/redirect';

interface RefreshTokenResponse {
  access_token: string;
  expires_in: string;
  scope: string;
  token_type: string;
}

interface AuthoriseCodeResponse {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse | null> => {
  try {
    const res = await fetch(`${REFRESH_TOKEN_ENDPOINT}?refreshToken=${refreshToken}`);
    const resData = await res.json();
    return resData as RefreshTokenResponse;
  } catch (err) {
    logError('with refreshing access token -', err);
    return null;
  }
};

export const authoriseUserCode = async (authCode: string): Promise<AuthoriseCodeResponse> => {
  try {
    const res = await fetch(`${AUTHORISE_CODE_ENDPOINT}?authCode=${authCode}`);
    const resData = await res.json();
    return resData as AuthoriseCodeResponse;
  } catch (err) {
    logError('with authorising user code -', err);
    throw err;
  }
};

export const getLoginRedirect = async (): Promise<string> => {
  try {
    const res = await fetch(`${REDIRECT_ENDPOINT}`);
    const resData = await res.json();
    return resData.url;
  } catch (err) {
    logError('with getting redirect url -', err);
    throw err;
  }
};
