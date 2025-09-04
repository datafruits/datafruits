import JSONSerializer from '@ember-data/serializer/json';

export default class UserSignupSerializer extends JSONSerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // Transform the custom API response format to JSON API format
    const transformedPayload = {
      data: payload.user_signups.map((signup, index) => ({
        id: `${signup.month}`,
        type: 'user-signup',
        attributes: {
          month: signup.month,
          'month-name': signup.month_name,
          count: signup.count
        }
      }))
    };

    return super.normalizeResponse(store, primaryModelClass, transformedPayload, id, requestType);
  }
}