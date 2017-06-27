import superagent from 'superagent';
import request from 'request';

/**
 * Wrap requests in a promise.
 *
 * @param {string} method
 * @param {object} props
 * @returns {Promise}
 */
export function promiseRequest(method, props) {

  return new Promise((resolve, reject) => {
    request[method](props, (err, response) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(response);
      }
    });
  });
}

/**
 * Wrap superagent requests in a promise.
 *
 * @param {object} props
 * @returns {Promise}
 */
export function promiseSuperRequest({method, url, query = {}, body = {}}) {
  return new Promise((resolve, reject) => {
    superagent[method](url)
      .query(query)
      .send(body)
      .end((err, response) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(response);
        }
      });
  });
}
