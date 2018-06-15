/**
 * ReviewController
 *
 * @description :: Server-side logic for managing restaurant reviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
        Restaurant.findOne({ id:req.body.restaurant }).populate('reviews')
            .then(foundRestaurant => {
				const numPrevReviewers = foundRestaurant.reviews.length;
				const prevTotalRatings = foundRestaurant.rating * numPrevReviewers;
				
                return [Review.create(req.body), foundRestaurant, numPrevReviewers, prevTotalRatings] })
            .spread((createdReview, foundRestaurant, numPrevReviewers, prevTotalRatings) => {
				const newAgRating = (prevTotalRatings + +createdReview.rating)/(numPrevReviewers + 1);
				foundRestaurant.rating = newAgRating;
				foundRestaurant.reviews.push(createdReview.id);
				const restaurantUpdateQry = Restaurant.update({ id: foundRestaurant.id, isDeleted: false }, foundRestaurant);
				return [restaurantUpdateQry, createdReview]})
			.spread((updatedRestaurant, createdReview) => {
				return ResponseService.json(200, res, 'Review created successfully', createdReview)})
			.catch(err => {
			return ValidationService.jsonResolveError(err, Review, res);
		});
	},
	view: function(req, res){
		Review.findOne({ id: req.params.id, isDeleted: false })
				.then(function(review){
		            if (_.isEmpty(review)) {
                		return ResponseService.json(404, res, "Review not found");
            		}
					return ResponseService.json(200, res, 'Review retrieved successfully', review);
				})
				.catch(function(err){
					return ValidationService.jsonResolveError(err, Review, res);
				});

	},
	list: function(req, res){
		Review.find({ isDeleted: false }).then(function(reviews){
			return ResponseService.json(200, res, 'Reviews retrieved successfully', reviews);
		}).catch(function(err){
			return ValidationService.jsonResolveError(err, Review, res);
		});
	},
	update: function(req, res){
		Review.update({ id: req.params.id, isDeleted: false }, req.body)
				.then(function(updatedReview){
				    if (!updatedReview.length) {
                		return ResponseService.json(404, res, "Review not found");
           		 	}
					return ResponseService.json(200, res, 'Review updated successfully', updatedReview[0]);
				})
				.catch(function(err){
					return ValidationService.jsonResolveError(err, Review, res);
				})
	},
	delete: function(req, res){
		Review.softDelete({ id: req.params.id, isDeleted: false })
				.then(function(deletedReview){
					if (!deletedReview.length) {
                		return ResponseService.json(404, res, "Review not found");
            		}
					return ResponseService.json(200, res, 'Review deleted successfully', deletedReview[0]);
				})
				.catch(function(err){
					return ValidationService.jsonResolveError(err, Review, res);
				});
	}
};