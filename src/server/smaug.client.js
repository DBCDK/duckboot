/**
 * @file
 * Implementing Smaug
 */

import config from '../config';
import {promiseRequest} from './request.util';

let TOKEN = null;
const TOKENS = {};

/**
 * Returns the current set TOKEN.access_token.
 * If the current set token is invalid a new one will be requested and returned.
 *
 * @return {string}
 */
export async function getToken(agencyId = '') {
  if (tokenIsValid(agencyId)) {
    return TOKENS[agencyId].access_token;
  }

  await setToken(agencyId);
  return TOKENS[agencyId].access_token;
}

/**
 * Requests a new token from smaug and sets TOKEN upon sucess
 */
export async function setToken(agencyId) {
  const token = await getNewTokenFromSmaug(agencyId);
  if (token.error) {
    console.error('Error while retrieving token from Smaug', {response: token});
  }
  else {
    token.expires = Date.now() + (token.expires_in * 1000) - 100000;
    console.info('Smaug token was set', {token});
    TOKENS[agencyId] = token;
  }
}

/**
 * Validated the current set TOKEN is valid.
 *
 * @return {boolean}
 */
function tokenIsValid(agencyId) {

  if (!TOKENS[agencyId]) {
    return false;
  }

  if (!TOKENS[agencyId].access_token) {
    return false;
  }

  if (Date.now() >= TOKENS[agencyId].expires) {
    return false;
  }

  return true;
}

/**
 * Requests a new token from Smaug and return the response
 *
 * @return {*}
 */
function getNewTokenFromSmaug(agencyId = '') {
  const req = {
    url: `${config.AUTH_URI}/oauth/token`,
    form: {
      grant_type: 'password',
      username: `@${agencyId}`,
      password: `@${agencyId}`
    },
    auth: {
      user: config.OP_CLIENT,
      pass: config.OP_SECRET
    }
  };
  return promiseRequest('post', req).then((smaugResp) => {
    try {
      return JSON.parse(smaugResp.body);
    }
    catch (e) {
      console.error('Could not parse response from Smaug', {response: smaugResp.body});
      throw new Error('Could not parse response from Smaug');
    }
  });
}
