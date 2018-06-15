/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


function getDistance(options) {
    const distance = require("google-distance");
     return new Promise((resolve, reject) => {
        distance.get(options, 
            function(err, data) {
              if (err) return reject(err);
              return resolve(data);
          });
        
     })
 }

module.exports = {
	create: (req, res) => { 
        var eta = '';
        Restaurant.findOne({ id: req.body.restaurant, isDeleted: false }).populate('meals')
        .then(restaurant => {
            const mealsArr = req.body.meals.split(',');
            let price = 0;
            restaurant.meals.forEach(meal => {
                mealsArr.forEach(orderMeal => {
                    if (orderMeal == meal.id) {
                        price += +meal.price;
                    }
                })
            })
            
            console.log(restaurant.location);
            req.body.price = price;
            return [Order.create(req.body), getDistance({
                origin: restaurant.location.lat + "," + restaurant.location.long,
                destination: req.body.location.lat + "," + req.body.location.long,
                mode: 'bicycling'
              })]
        }).spread((createdOrder, data) => {
            createdOrder.eta = data.duration;
			return ResponseService.json(200, res, 'Order created successfully', createdOrder);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Order, res);
		});
	},
	view: (req, res) => {
		Order.findOne({ id: req.params.id, isDeleted: false }).populate('meals')
            .then(order => {
                if (_.isEmpty(order)) {
                    return ResponseService.json(404, res, "Order not found");
                }
                return ResponseService.json(200, res, 'Order retrieved successfully', order);
            }).catch(err => {
                return ValidationService.jsonResolveError(err, Order, res);
            });

	},
	list: (req, res) => {
		Order.find({ isDeleted: false }).then(orders => {
			return ResponseService.json(200, res, 'Orders retrieved successfully', orders);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Order, res);
		});
	},
	update:(req, res) => {
		Order.findOne({ id: req.params.id, isDeleted: false })
            .then(order => {
                if (_.isEmpty(order)) {
                    return ResponseService.json(404, res, "Order not found");
                }

                //marshall request params
                order.location = req.body.location;
                order.address = req.body.address;
                // order.meals = req.body.meal ? order.meals.concat(req.body.meal) : order.meals;

                return Order.update({ id: order.id }, order);
            }).then(updatedOrder => {
                return ResponseService.json(200, res, 'Order updated successfully', updatedOrder[0]);
            }).catch(err => {
                return ValidationService.jsonResolveError(err, Order, res);
            })
	},
	delete:(req, res) => {
		Order.softDelete({ id: req.params.id, isDeleted: false })
            .then(deletedOrder => {
                if (!deletedOrder.length) {
                    return ResponseService.json(404, res, "Order not found");
                }
                return ResponseService.json(200, res, 'Order deleted successfully', deletedOrder[0]);
            })
            .catch(err => {
                return ValidationService.jsonResolveError(err, Order, res);
            });
	}
};