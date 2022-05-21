const reviewModel = require("../models/reviewModels");
const bookModel = require("../models/bookModels");

const { isValidRequestBody, isValidData, isValidObjectId } = require("../utils/validator");

const bookReview = async function (req, res) {
    try {

        const bookId = req.params.bookId
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "No data provided" });
        }

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }

        if (!isValidObjectId.test(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" })
        }

        let findBookId = await bookModel.findById({ _id: bookId })
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "No book found with this id" })
        }

        if (findBookId.isDeleted==true) {
            return res.status(400).send({ status: false, message: "Book is already deleted" })
        }

        let { rating, reviewedBy } = requestBody

        requestBody.bookId = bookId

        if (!isValidData(reviewedBy)) {
            requestBody.reviewedBy = "Guest"
        }

        if (!isValidData(rating)) {
            return res.status(400).send({ status: false, msg: "Please provied  the rating  " })
        }
        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, msg: "Rating Should be minimum 1 and maximum 5" });
        }

        requestBody.reviewedAt = new Date()

        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, }, { $inc: { reviews: +1 } }, { new: true })

        const reviewCreation = await reviewModel.create(requestBody);

        res.status(201).send({ status: true, message: "sucessfully created", data: {reviewsData: reviewCreation, updatedBook }})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const reviewUpdate = async function (req, res) {
    try {
        let { bookId, reviewId } = req.params;

        let requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "No data provided" });
        }

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }

        if (!isValidObjectId.test(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" });
        }

        let findBookId = await bookModel.findById({ _id: bookId })
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "No book found with this id" });
        }

        if (findBookId.isDeleted==true) {
            return res.status(400).send({ status: false, message: "Book is already deleted" })
        }

        if (!reviewId) {
            return res.status(400).send({ status: false, message: "reviewId is required in path params" })
        }
        if (!isValidObjectId.test(reviewId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid review Id" });
        }

        let findReviewId = await reviewModel.findById({ _id: reviewId });
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "No review data found with this id" });
        }

        if (findReviewId.isDeleted==true) {
            return res.status(400).send({ status: false, message: "Review is already deleted" })
        }

        let { review, rating, reviewedBy } = requestBody;

        if (!isValidData(rating)) {
            return res.status(400).send({ status: false, msg: "Please provied the rating" })
        }
        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, msg: "Rating Should be minimum 1 and maximum 5" });
        }

        if (!isValidData(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "Please provide the reviewer's name" })
        }

        if (!isValidData(review)) {
            return res.status(400).send({ status: false, msg: "Please provied the review" })
        }

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { ...requestBody } }, { new: true });

        res.status(200).send({ status: true, message: "Review Updated Successfully", data: findBookId,updatedReview });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const reviewDelete = async function (req, res) {
    try {
        let { bookId, reviewId } = req.params;

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }
        if (!isValidObjectId.test(bookId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid book Id" });
        }

        let findBookId = await bookModel.findById({ _id: bookId, isDeleted: false })
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "No book found with this id" });
        }

        if (findBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "book is already deleted" })
        }
        
        if (!reviewId) {
            return res.status(400).send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidObjectId.test(reviewId)) {
            return res.status(400).send({ status: false, message: "Please enter the valid review Id" });
        }

        let findReviewId = await reviewModel.findById({ _id: reviewId, isDeleted: false });
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "No review data found with this id" });
        }

        if (findReviewId.isDeleted == true){
            return res.status(400).send({ status: false, message: "Review Data is already deleted" })
        }

        const deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })
        const bookReviewUpdated = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })

        res.status(200).send({ status: true, message: "Review Deleted Successfully", data: bookReviewUpdated,deleteReview });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { bookReview, reviewUpdate, reviewDelete }