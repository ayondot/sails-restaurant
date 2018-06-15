/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
		Order.create(req.body).then(createdOrder => {
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
                order.meals = req.body.meal ? order.meals.concat(req.body.meal) : order.meals;

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