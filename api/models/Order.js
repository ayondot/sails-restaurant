/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      meals: {
        collection: 'meal',
        via: 'orders'
      },
      price: {
        type: 'string'
      },
      location: {
        type: 'json'
      },
      restaurant: {
        model: 'restaurant'
      },
      address: {
        type: 'string'
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
      address: {
        required: 'Address of customer is required to place order'
      }
    }
  };