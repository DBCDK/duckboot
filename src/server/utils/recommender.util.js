import services from '../../../services.json';

export default function getRecommender(name) {
  const result = services.filter(service => service.proxy === name);
  if (result.length) {
    return result[0];
  }

  return null;
}
