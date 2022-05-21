const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");

const { isValidData, isValidRequestBody, isValidEmail, isValidPhone, isValidName } = require("../utils/validator");


const createUser = async function (req, res) {
    try {
        let requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "No data provided" });
        }

        let { title, name, phone, email, password, address } = requestBody;

        if (!isValidData(title)) {
            return res.status(400).send({ status: false, message: "Title is required." });
        }

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") {
            return res.status(400).send({ status: false, message: "title should be  Mr, Mrs, Miss" });
        }

        if (!isValidData(name)) {
            return res.status(400).send({ status: false, message: "Name is required." });
        }
        if (!isValidName.test(name)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Name" })
        }

        if (!isValidData(phone)) {
            return res.status(400).send({ status: false, message: "Phone is required." });
        }

        if (!isValidPhone.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter a valid phone number" });
        }

        let duplicatePhone = await userModel.findOne({ phone });
        if (duplicatePhone) {
            return res.status(400).send({ status: false, msg: "Phone number already exist" });
        }

        if (!isValidData(email)) {
            return res.status(400).send({ status: false, message: "Email is required." });
        }

        if (!isValidEmail.test(email)) {
            return res.status(400).send({ status: false, message: "Please enter valid a email " });
        }

        let duplicateEmail = await userModel.findOne({ email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "Email already exist" });
        }

        if (!isValidData(password)) {
            return res.status(400).send({ status: false, message: "Password is required." });
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, msg: "Password Should be minimum 8 characters and maximum 15 characters", });
        }
        if (address) {
            if (typeof address === "object") {
                if (!Object.keys(address).length > 0) {
                    return res.status(400).send({ status: false, message: "Please Enter Your Address" });
                }
            }
        }

        let createData = await userModel.create(requestBody);
        res.status(201).send({ status: true, message: "User data created successfully", data: createData, });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const { email, password } = requestBody;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "No data provided" });
        }

        if (!isValidData(email)) {
            return res.status(400).send({ status: false, message: "Email is required." });
        }

        if (!isValidData(password)) {
            return res.status(400).send({ status: false, message: "Password is required." });
        }

        const matchUser = await userModel.findOne({ email, password });
        if (!matchUser) {
            return res.status(404).send({ status: false, message: " Email/Password is Not Matched" });
        }

        const token = jwt.sign(
            {
                userId: matchUser._id.toString(),
                Project: "Book Management",
                batch: "Uranium",
                iat: new Date().getTime() / 1000
                //give you time in miliseconds. But time in jwt token exp is in seconds, therefore we have to divide result by 1000.
                //(iat)Issued At- the time at which the JWT was issued.
            },
            "Project-03_group-28",
            {
                expiresIn: "1200sec",
            });

        res.setHeader("x-user-key", token)
        return res.status(200).send({ status: true, message: "User Logged in successfully", data: token, });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createUser, loginUser };