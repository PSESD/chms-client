'use strict';
import jQuery from 'jquery';
import JsonApi from 'devour-client'

import {BaseModel} from '../models/base';
import {MeModel} from '../models/me';

window['MeModel'] = MeModel;

var API_BASE_URL = '/api/hub';

module.exports = function (api) {
  const jsonApi = new JsonApi({apiUrl: API_BASE_URL});
  let storeRequestMiddleware = {
    name: 'store-request',
    res: (payload) => {
      payload.res.data.meta._req = payload.req;
      return payload;
    }
  }
  jsonApi.insertMiddlewareBefore('response', storeRequestMiddleware);

  let responseMiddleware = {
    name: 'modelize',
    res: (payload) => {
      let req = payload.meta._req;
      delete payload.meta._req;
      let modelName = req.model.capitalizeFirstLetter() + 'Model';
      let model = null;
      if (global[modelName] !== undefined) {
        model = new global[modelName];
      } else {
        console.log(['no model', modelName, global]);
        model = new BaseModel;
      }
      console.log(['payload!', modelName, payload, req]);
      payload = jQuery.extend(model, payload);
      return payload;
    }
  }
  jsonApi.insertMiddlewareAfter('response', responseMiddleware);

  let userDefinition = {
    first_name: '',
    last_name: '',
    email: '',
    title: '',
    ssn: '',
    instructor_qualifications: '',
    birth_date: '',
    employee_id: ''
  };

  jsonApi.define('user', userDefinition);

  jsonApi.define('me', userDefinition, {
    collectionPath: 'users'
  });

  jsonApi.define('postal_address', {
    object_id: '',
    name: '',
    address_1: '',
    address_2: '',
    city: '',
    subnational_division: '',
    postal_code: '',
    country: ''
  });

  jsonApi.define('phone_number', {
    object_id: '',
    type: '',
    phone_number: ''
  });

  jsonApi.define('organization', {
    name: '',
    url: ''
  });

  jsonApi.define('role', {
    system_id: '',
    name: '',
    context: ''
  });

  jsonApi.define('sponsor_hub', {
    name: '',
    base_url: ''
  });

  jsonApi.define('sponsor', {
    name: '',
    slug: '',
    sponsor_hub_id: '',
    organization_id: '',
    class_number_prefix: ''
  });

  jsonApi.define('class_reference', {
    sponsor_id: '',
    name: ''
  });

  jsonApi.define('clock_hour_record', {
    user_id: '',
    class_reference_id: '',
    hours_attended: 0,
    is_user_entered: 0,
    paid_at: null,
    expires_at: null,
    updated_at: null,
    created_at: null
  });

  jsonApi.define('payment_transaction', {
    clock_hour_record_id: '',
    user_id: '',
    ammount: 0,
    type: '',
    completed: 0
  });
  return jsonApi;
};
