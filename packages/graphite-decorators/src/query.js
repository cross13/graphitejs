import pluralize from 'pluralize';
import { get } from 'lodash';

const query = function(params) {
  return (target, key, descriptor) => {
    const singularKey = pluralize(key, 1);

    switch (typeof params) {
    case 'string':
      target.Query = `${target.Query || ''} \n ${key}(${params})(_id: String, skip: Int, limit: Int, sort: String): [${singularKey[0].toUpperCase() + singularKey.slice(1)}],`;
      break;
    case 'object':
      const fields = get(params, 'fields', undefined);
      const parseFields = fields ? `(${fields})` : '';
      target.Query = `${target.Query || ''} \n ${key}${parseFields}(_id: String, skip: Int, limit: Int, sort: String): [${get(params, 'responseType', '')}],`;
      break;
    default:
      target.Query = `${target.Query || ''} \n ${key}(_id: String, skip: Int, limit: Int, sort: String): [${singularKey[0].toUpperCase() + singularKey.slice(1)}],`;
    }

    target.Resolvers = Object.assign({}, target.Resolvers);
    target.Resolvers.Query = Object.assign({}, target.Resolvers.Query);
    target.Resolvers.Query[key] = async function() {
      try {
        const isAllow = get(target[key], 'allow', function() { return true; });
        if (isAllow.bind(target)(...arguments)) {
          return await descriptor.value.bind(target)(...arguments);
        }

        return null;
      } catch (error) {
        throw new Error('Decorators query failed. \n' + error);
      }
    };
  };
};

export default query;
