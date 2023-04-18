const loanController = require("../controllers/loanController");
const express = require("express");

const loanRouter = express.Router();

const auth = require("../middleware/auth");

loanRouter
  .route("/retrieve-acc-num")
  .post(auth.verifyToken, loanController.retrieveAccountNumber);

loanRouter.route("/loan").post(auth.verifyToken, loanController.loanRequest);
loanRouter
  .route("/loan-payment")
  .post(auth.verifyToken, loanController.loanPayment);

loanRouter
  .route("/check-payment/:id")
  .get(auth.verifyToken, loanController.checkPaymentDeadline);

module.exports = loanRouter;
