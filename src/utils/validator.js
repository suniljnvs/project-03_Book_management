let isValidData = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

let isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

let isValidName = (/^[a-zA-Z ]*$/);

let isValidEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

let isValidPhone = /^\d{10}$/;

let isValidISBN = (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/);

let isValidReleasedAt = /((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/;

let isValidObjectId = /^[0-9a-fA-F]{24}$/;


module.exports = { isValidData, isValidRequestBody, isValidEmail, isValidPhone, isValidISBN, isValidReleasedAt,isValidObjectId, isValidName }