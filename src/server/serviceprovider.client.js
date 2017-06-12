/**
 * @file
 * Description...
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import * as Smaug from '../smaug/smaug.client';
import {log} from 'dbc-node-logger';

/**
 * Get work for id of type.
 *
 * @param id
 * @param type
 * @returns {*}
 */
export async function getWorkForId(id, type) {
  try {
    if (type === 'error') {
      return {error: 'invalid_id'};
    }
    const fields = ['dcTitleFull', 'creator', 'identifierISBN', 'typeBibDKType', 'pid', 'coverUrlFull', 'identifier', 'acIdentifier'];
    let result;
    if (type === 'pid') {
      result = await getWork({params: {pids: [id], fields}});
    }
    else if (type === 'isbn') {
      result = await search({params: {q: `(${id})`, fields}});
    }
    else {
      result = await search({params: {q: `(rec.id=${id})`, fields}});
    }

    console.log(result);
    if (!result.error && result.length) {
      const {dcTitleFull, creator, identifierISBN, typeBibDKType, coverUrlFull, pid} = result[0];
      return {
        title: dcTitleFull && dcTitleFull.join(', '),
        creator: creator && creator.join(', '),
        isbn: identifierISBN && identifierISBN.join(', '),
        matType: typeBibDKType && typeBibDKType.join(', '),
        image: coverUrlFull && coverUrlFull.shift() || null,
        pid: pid.join(', ')
      };
    }
  }
  catch (e) {
    log.error('cannot get work from openplatform', e);
  }

  return {error: 'no_work_for_id'};
}

export async function getWork({params}) {
  return await makeRequestToServiceProvider(params, 'work');
}

export async function search({params}) {
  return await makeRequestToServiceProvider(params, 'search');
}

async function makeRequestToServiceProvider(params, endpoint) {
  const token = await Smaug.getToken();
  const qs = Object.assign(params, {access_token: token});

  const req = {
    url: `${CONFIG.openplatform.serviceprovider.uri}/${endpoint}`,
    qs: qs
  };

  const response = await promiseRequest('post', req);
  try {
    const result = JSON.parse(response.body);

    if (result.statusCode !== 200) {
      log.error('An error occurred while retrieveing data from openplatform', {result});
      throw new Error('Invalid response from openplatform', result);
    }
    if (result.data && result.data.length && Object.keys(result.data[0]).length) {
      return result.data;
    }

    return [];
  }
  catch (e) {
    log.error('Error while parsing response from openplatform', {error: e.message, stack: e.stack});
    return {error: 'Error while parsing response from openplatform'};
  }
}
