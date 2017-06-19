import {promiseRequest} from './request.util';
import {getToken} from './smaug.client';

import config from '../config';

export const search = async ({q}, {agencyId}) => {
  return await makeRequestToServiceProvider({q, agencyId}, 'search');
};


export const getImage = async (pids) => {
  const params = {
    pids: Array.isArray(pids) && pids || [pids],
    fields: ['coverUrlThumbnail']
  }

  return await makeRequestToServiceProvider(params, 'work');
};



const makeRequestToServiceProvider = async function (params, endpoint) {
  const token = await getToken(params.agencyId || '');
  delete params.agencyId;
  const qs = Object.assign(params, {access_token: token});

  const req = {
    url: `${config.OP_URI}/${endpoint}`,
    qs: qs
  };

  const response = await promiseRequest('post', req);
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
};