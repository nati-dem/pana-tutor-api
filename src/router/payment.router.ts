import express from 'express';
import _ from 'lodash';
import {AppError} from '../common/app-error';
import {ErrorCode, ErrorMessage} from "../../../pana-tutor-lib/enum/constants";
import { Inject } from 'typescript-ioc';
import {PaymentService} from "../service/payment.service";
import {TutorBookingService} from "../service/tutor-booking.service";
import {YenePayVerifyRequest, IPricingPackages, PricingPackages, PaymentInfoRequest} from "../../../pana-tutor-lib/model/tutor/tutor-booking.interface";
import { isSuccessHttpCode } from '../../../pana-tutor-lib/util/common-helper';
const asyncHandler = require('express-async-handler');
const router = express.Router();
const escape = require('escape-html');
const ypco = require('yenepaysdk');

export class PaymentRouter {

  @Inject
  private paymentService: PaymentService;
  @Inject
  private tutorBookingService: TutorBookingService;

  merchantId = process.env.YENE_PAY_CODE
  successUrl = process.env.YENE_PAY_SUCCESS_URL
  ipnUrlReturn = process.env.YENE_PAY_IPNUrl
  useSandbox = process.env.YENE_PAY_SANDBOX
  expiresAfter = 2880 // in minutes
  cancelUrlReturn = process.env.YENE_PAY_CANCEL_Url
  failureUrlReturn = process.env.YENE_PAY_FAILURE_URL
  pdtToken = process.env.YENE_PAY_PDT

  index = router.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
  });

  yenePayCheckoutExpress = router.post('/generate-payment-info', asyncHandler( async (req, res, next) => {
    const reqObj = req.body as PaymentInfoRequest;
    const userId = global.userId;
    console.log("## generatePaymentLinks reqObj:: ", reqObj);

    if( !reqObj.orderId || _.isEmpty(reqObj.courseName) || !reqObj.packageId ) {
      throw new AppError(400, ErrorMessage.INVALID_PARAM, ErrorCode.INVALID_PARAM, null);
    }
    const selectedPkg = _.find(PricingPackages, {id: reqObj.packageId}) as IPricingPackages;
    const itemName = reqObj.courseName
    const unitPrice = selectedPkg.price

    const merchantOrderId = reqObj.orderId; // "YOUR_UNIQUE_ID_FOR_THIS_ORDER";  //can also be set null
     // "NUMBER_OF_MINUTES_BEFORE_THE_ORDER_EXPIRES"; //setting null means it never expires
     const checkoutOptions = ypco.checkoutOptions(this.merchantId, merchantOrderId, ypco.checkoutType.Express,
      this.useSandbox, this.expiresAfter, this.successUrl, this.cancelUrlReturn, this.ipnUrlReturn, this.failureUrlReturn);
      const checkoutItem = {
        "ItemId": reqObj.orderId,
        "ItemName": itemName,
        "UnitPrice": unitPrice,
        "Quantity":1
      };
      const url = ypco.checkout.GetCheckoutUrlForExpress(checkoutOptions, checkoutItem);
      const resp = {
        yenePayUrl: url
      }
      res.status(200).end(JSON.stringify(resp));
  }));

  yenePayIPNDestination = router.post('/ypay/ipn', asyncHandler( async (req, res, next) => {
    const ipnModel = req.body;
    console.log("## yenePayIPNDestination ipnModel:: ", ipnModel);
    ypco.checkout.IsIPNAuthentic(ipnModel, process.env.YENE_PAY_SANDBOX).then((ipnStatus) => {
      // This means the payment is completed
      // You can now mark the order as "Paid" or "Completed" here and start the delivery process
      res.json({"IPN Status": ipnStatus});
    }) .catch((err) => {
      res.json({ "Error" : err });
    });
  }));

  yenePayVerify = router.post('/ypay-pdt/verify-and-finalize-booking', asyncHandler( async (req, res, next) => {
      const reqObj : YenePayVerifyRequest = req.body;
      console.log("## yenePayPayVerify reqObj:: ", reqObj);
      const userId = global.userId;
      const mappedReq = {
        "requestType": this.pdtToken,
        "pdtToken": this.pdtToken,
        "transactionId": reqObj.TransactionId,
        "merchantOrderId": reqObj.MerchantOrderId
      }
      const resp = await this.paymentService.ypayVerify(mappedReq)
      console.log("## yenePayPayVerify resp:: ", resp);
      if (!isSuccessHttpCode(resp.status) || !resp.data.includes("result=SUCCESS")) {
        throw new AppError(resp.status,resp.message,ErrorCode.YPAY_PDT_VERIFY_ERROR,JSON.stringify(resp.data));
      }
      this.tutorBookingService.activateBookingRequest(userId, reqObj.MerchantOrderId, reqObj.TotalAmount)
      res.status(200).end(JSON.stringify(resp));
    }));

  /*
  yenePaymentSuccessReturnUrl = router.get('/ypay/success', asyncHandler( async (req, res, next) => {
    const params = req.query;
    const pdtRequestModel = new ypco.pdtRequestModel(this.pdtToken, params.TransactionId, params.MerchantOrderId, this.useSandbox);
    console.log('success url called');
    ypco.checkout.RequestPDT(pdtRequestModel).then((pdtJson) => {
      if(pdtJson.Status === 'SUCCESS')
      {
        console.log("success url called - Paid");
        // This means the payment is completed.
        // You can extract more information of the transaction from the pdtResponse
        // You can now mark the order as "Paid" or "Completed" here and start the delivery process
      }
      res.status(200).end(JSON.stringify(pdtJson));
    }).catch((err) => {
      // This means the pdt request has failed.
      // possible reasons are
        // 1. the TransactionId is not valid
        // 2. the PDT_Key is incorrect

        res.json({ "Error" : err });
    });
  }));*/

}
