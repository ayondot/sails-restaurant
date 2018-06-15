/**
 * MealController
 *
 * @description :: Server-side logic for managing meals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
		Meal.create(req.body).then(createdMeal => {
			return ResponseService.json(200, res, 'Meal created successfully', createdMeal);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Meal, res);
		});
	},
	view: (req, res) => {
		Meal.findOne({ id: req.params.id, isDeleted: false }).populate('restaurant')
			.then(meal => {
				if (_.isEmpty(meal)) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal retrieved successfully', meal);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Meal, res);
			});

	},
	list: (req, res) => {
		Meal.find({ isDeleted: false }).then(meals => {
			return ResponseService.json(200, res, 'Meals retrieved successfully', meals);
		}).catch(err => {
			return ValidationService.jsonResolveError(err, Meal, res);
		});
	},
	update: (req, res) => {
		Meal.update({ id: req.params.id, isDeleted: false }, req.body)
			.then(updatedMeal => {
				if (!updatedMeal.length) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal updated successfully', updatedMeal[0]);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Meal, res);
			})
	},
	delete: (req, res) => {
		Meal.softDelete({ id: req.params.id, isDeleted: false })
			.then(deletedMeal => {
				if (!deletedMeal.length) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal deleted successfully', deletedMeal[0]);
			})
			.catch(err => {
				return ValidationService.jsonResolveError(err, Meal, res);
			});
	}
};