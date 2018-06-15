/**
 * MealController
 *
 * @description :: Server-side logic for managing meals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
		const tryin = {name: "fufu", price: 10};
		Meal.create(tryin).then(function (createdMeal) {
			return ResponseService.json(200, res, 'Meal created successfully', createdMeal);
		}).catch(function (err) {
			return ValidationService.jsonResolveError(err, Meal, res);
		});
	},
	view: function (req, res) {
		Meal.findOne({ id: req.params.id, isDeleted: false })
			.then(function (meal) {
				if (_.isEmpty(meal)) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal retrieved successfully', Meal);
			})
			.catch(function (err) {
				return ValidationService.jsonResolveError(err, Meal, res);
			});

	},
	list: function (req, res) {
		Meal.find({ isDeleted: false }).then(function (meals) {
			return ResponseService.json(200, res, 'Meals retrieved successfully', meals);
		}).catch(function (err) {
			return ValidationService.jsonResolveError(err, Meal, res);
		});
	},
	update: function (req, res) {
		Meal.update({ id: req.params.id, isDeleted: false }, req.body)
			.then(function (updatedMeal) {
				if (!updatedMeal.length) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal updated successfully', updatedMeal[0]);
			})
			.catch(function (err) {
				return ValidationService.jsonResolveError(err, Meal, res);
			})
	},
	delete: function (req, res) {
		Meal.softDelete({ id: req.params.id, isDeleted: false })
			.then(function (deletedMeal) {
				if (!deletedMeal.length) {
					return ResponseService.json(404, res, "Meal not found");
				}
				return ResponseService.json(200, res, 'Meal deleted successfully', deletedMeal[0]);
			})
			.catch(function (err) {
				return ValidationService.jsonResolveError(err, Meal, res);
			});
	}
};