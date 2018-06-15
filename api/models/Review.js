/**
 * Review.js
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
      review: {
        type: 'string',
        required: true
      },
      rating: {
        type: 'string',
        required: true
      },
      restaurant: {
        model: 'restaurant'
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
        required: 'Name of Reviewer is required'
      },
      review: {
        required: 'Review content is required'
      },
      rating: {
        required: 'Rating is required'
      }
    }
  };