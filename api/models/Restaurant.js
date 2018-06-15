/**
 * Restaurant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    commercialName: {
      type: 'string',
      required: true
    },
    legalName: {
      type: 'string',
      required: true
    },
    commercialEmail: {
      type: 'string',
      unique: true,
      required: true,
      email: true
    },
    address: {
      type: 'string',
      required: true
    },
    location: {
      type: 'json'
    },
    adminNumber: {
      type: 'string',
      required: true,
      unique: true
    },
    logo: {
      type: 'string'
    },
    rating: {
      type: 'string',
      defaultsTo: 0
    },
    meals: {
      collection: 'meal',
      via: 'restaurant'
    },
    reviews: {
      collection: 'review',
      via: 'restaurant'
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
    commercialName: {
      required: 'Commercial name is required'
    },
    legalName: {
      required: 'Legal name is required'
    },
    commercialEmail: {
      required: 'Commercial email is required',
      email: 'Email should be of the form yourname@example.com',
      unique: 'Email is already registered'
    },
    address: {
      required: 'Address is required'
    },
    adminNumber: {
      required: 'Admin phone number is required',
      unique: 'Phone number is already registered'
    }
  }
};