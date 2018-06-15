/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
		Restaurant.create(req.body).then(createdRestaurant =>{
			return ResponseService.json(200, res, 'Restaurant created successfully', createdRestaurant);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Restaurant, res);
		});
	},
	view: (req, res) => {
		Restaurant.findOne({ id: req.params.id, isDeleted: false }).populate('meals').populate('reviews')
			.then(restaurant => {
				if (_.isEmpty(restaurant)) {
					return ResponseService.json(404, res, "Restaurant not found");
				}
				return ResponseService.json(200, res, 'Restaurant retrieved successfully', restaurant);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Restaurant, res);
			});

	},
	list: (req, res) => {
		let listQry = Restaurant.find({ isDeleted: false})
		const qryKeysArr = Object.keys(req.query);
		if (qryKeysArr.length === 1) {
			
			const mappings = {
				'eq': '=',
				'lt': '<',
				'lte': '<=',
				'gt': '>',
				'gte': '>='
			}
			
			const filterKey = mappings[qryKeysArr[0]];
			const filterVal = req.query[qryKeysArr[0]]
			listQry = listQry.where({ rating: { filterKey: filterVal }})
		}

		listQry.then(restaurants => {
			return ResponseService.json(200, res, 'Restaurants retrieved successfully', restaurants);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Restaurant, res);
		});
	},
	update: (req, res) => {
		Restaurant.update({ id: req.params.id, isDeleted: false }, req.body)
			.then(updatedRestaurant => {
				if (!updatedRestaurant.length) {
					return ResponseService.json(404, res, "Restaurant not found");
				}
				return ResponseService.json(200, res, 'Restaurant updated successfully', updatedRestaurant[0]);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Restaurant, res);
			})
	},
	delete: (req, res) => {
		Restaurant.softDelete({ id: req.params.id, isDeleted: false })
			.then(deletedRestaurant => {
				if (!deletedRestaurant.length) {
					return ResponseService.json(404, res, "Restaurant not found");
				}
				return ResponseService.json(200, res, 'Restaurant deleted successfully', deletedRestaurant[0]);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Restaurant, res);
			});
	}
};