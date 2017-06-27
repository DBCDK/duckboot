import {promiseRequest} from '../utils/request.util';
import {getRecommender} from '../utils/recommender.util';


export default async function call(service, query, body) {
  const recommender = getRecommender(service);
  if (recommender) {
    try {
      return await promiseRequest({
        method: recommender.method || 'post',
        url: recommender.url,
        query: query,
        body: body
      });

    }
    catch (e) {
      return {
        status: 500,
        body: e.body
      }
    }
  }
  else {
    return {status: 404};
  }
}
