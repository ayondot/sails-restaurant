/**
 * Meal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      name: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string'
      },
      price: {
        type: 'string',
        required: true
      },
      restaurant: {
        model: 'restaurant'
      },
      orders: {
        collection: 'order',
        via: 'meals'
      },
      isDeleted: {
        type: 'boolean',
        defaultsTo: false
      },
    },
    softDelete: function(criteria){
      return this.update(criteria, { isDeleted : true });
    },
    validationMessages: {
      name: {
        required: 'Name of meal is required'
      },
      price: {
        required: 'Price of meal is required'
      }
    }
  };