var CronJob = require('cron').CronJob;
const InvoiceModel = require('../model/invoiceModel');
const OrderModel = require('../model/orderModel');
const appUtils = require('../appUtils');

var job = new CronJob('0 */1 * * * *', async function () {
    console.log('You will see this message every minute');
    let baseTime = 60 * 1000; //milli seconds

    const invoices = await InvoiceModel.find({ recurringPaymentPending: { $gt: 0 } });
    invoices.forEach(async (invoice) => {
        if (invoice.invoiceDetails.length === 1) {
            console.log("First reccuring");
            const diffTime = invoice.firstPaymentTerm * baseTime;
            if (Date.now() - new Date(invoice.firstInvoiceDate).getTime() > diffTime) {
                console.log("firts reccuring payment");
                const invoiceDetails = {
                    isReccuring: true,
                    invoiceNo: await appUtils.generateNumberNanoId(),
                    invoiceDate: new Date(),
                    paymentDone: false,
                }
                invoice.invoiceDetails.push(invoiceDetails);
                invoice.recurringPaymentPending = invoice.recurringPaymentPending - 1;
                OrderModel.findOneAndUpdate({orderId: invoice.orderId}, {$set: {recurringPaymentPending: invoice.recurringPaymentPending}});
                invoice.save();
            }
        }

        if (invoice.invoiceDetails.length > 1) {
            const lastInvoiceTime = new Date(invoice.invoiceDetails[invoice.invoiceDetails.length - 1].invoiceDate).getTime()
            if (Date.now() - lastInvoiceTime > baseTime) {
                console.log("more reccuring");
                const invoiceDetails = {
                    isReccuring: true,
                    invoiceNo: await appUtils.generateNumberNanoId(),
                    invoiceDate: new Date(),
                    paymentDone: false,
                }
                invoice.invoiceDetails.push(invoiceDetails);
                invoice.recurringPaymentPending = invoice.recurringPaymentPending - 1;
                OrderModel.findOneAndUpdate({orderId: invoice.orderId}, {$set: {recurringPaymentPending: invoice.recurringPaymentPending}});
                invoice.save();
                order.save();
            }
        }
    })


});


exports.startInvoiceCron = () => {
    // job.start();
};