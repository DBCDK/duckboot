import {promiseRequest} from './request.util';
import {getToken} from './smaug.client';

import config from '../config';

export const search = async (params) => {
  return await makeRequestToServiceProvider(params, 'search');
}

const makeRequestToServiceProvider = async function (params, endpoint) {
  const token = await getToken();
  console.log(token, params);
  const qs = Object.assign(params, {access_token: token});

  const req = {
    url: `${config.OP_URI}/${endpoint}`,
    qs: qs
  };

  const response = await promiseRequest('post', req);
  console.log(response);
  try {
    const result = JSON.parse(response.body);

    if (result.statusCode !== 200) {
      console.error('An error occurred while retrieveing data from openplatform', {result});
      throw new Error('Invalid response from openplatform', result);
    }
    return {statusCode: result.statusCode, data: result.data};
  }
  catch (e) {
    console.error('Error while parsing response from openplatform', {error: e.message, stack: e.stack});
    return {error: 'Error while parsing response from openplatform'};
  }
}
