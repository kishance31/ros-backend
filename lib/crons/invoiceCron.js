var CronJob = require('cron').CronJob;
const InvoiceModel = require('../model/invoiceModel');
const OrderModel = require('../model/orderModel');
const appUtils = require('../appUtils');

var job = new CronJob('0 */10 * * * *', async function () {
    console.log('You will see this message every 10 minute');
    let baseTime = 60 * 1000; //milli seconds
    const allOrders = await OrderModel.find({ isFirstTimePayment: true });
    let currentTimeStamp = Date.now();

    async function generateInvoice(order, termPercent) {
        const {
            employeeId,
            corporateId,
            orderId,
            recurringCost,
            totalOrderCost,
            orderDate,
            recurringPaymentPending
        } = order;

        let corporateInvoice = await InvoiceModel.findOne({ corporateId, currentTimeStamp }).exec();

        if (corporateInvoice) {
            corporateInvoice.employeeId.push(employeeId);
            corporateInvoice.orderId.push(orderId);
            corporateInvoice.orderDate.push(orderDate);
            if (termPercent) {
                corporateInvoice.recurringCost += parseFloat(((recurringCost * termPercent) / 100).toFixed(2));
            } else {
                corporateInvoice.recurringCost += recurringCost;
            }
            corporateInvoice.totalOrderCost += totalOrderCost;
            await corporateInvoice.save();
            await OrderModel.findOneAndUpdate({ orderId: orderId }, { $set: { recurringPaymentPending: recurringPaymentPending - 1 } });
        } else {
            let invoiceDetails = {
                isReccuring: true,
                invoiceNo: await appUtils.generateNumberNanoId(),
                invoiceDate: new Date(),
                paymentDone: false,
                employeeId: [employeeId],
                corporateId: corporateId,
                orderId: [orderId],
                orderDate: [orderDate],
                totalOrderCost,
                currentTimeStamp,
            }
            if (termPercent) {
                invoiceDetails.recurringCost = parseFloat(((recurringCost * termPercent) / 100).toFixed(2));
            } else {
                invoiceDetails.recurringCost = recurringCost;
            }
            let invoiceObj = new InvoiceModel(invoiceDetails)
            await InvoiceModel.create(invoiceObj);
        }
    }

    for (const order of allOrders) {
        if (order.recurringPaymentPending === order.recurringMonthsNo) {
            console.log("First reccuring");
            const diffTime = order.firstPaymentTerm * baseTime;
            if (Date.now() - new Date(order.orderDate).getTime() > diffTime) {
                console.log("firts reccuring payment");
                await generateInvoice(order);
                await OrderModel.findOneAndUpdate({ orderId: order.orderId }, { $set: { recurringPaymentPending: order.recurringPaymentPending - 1 } });
            }
        } else if (order.recurringPaymentPending && order.recurringPaymentPending < order.recurringMonthsNo) {
            console.log("more reccuring");
            await generateInvoice(order);
            await OrderModel.findOneAndUpdate({ orderId: order.orderId }, { $set: { recurringPaymentPending: order.recurringPaymentPending - 1 } });
        } else if (!order.recurringPaymentPending && order.pendingFirstYearTerm) {
            console.log("First term payment");
            await generateInvoice(order, order.firstYearCharge);
            await OrderModel.findOneAndUpdate({ orderId: order.orderId }, { $set: { pendingFirstYearTerm: order.pendingFirstYearTerm - 1 } });
        } else if (!order.recurringPaymentPending && !order.pendingFirstYearTerm && order.pendingSecondYearTerm) {
            console.log("second term payment");
            await generateInvoice(order, order.secondYearCharge);
            await OrderModel.findOneAndUpdate({ orderId: order.orderId }, { $set: { pendingSecondYearTerm: order.pendingSecondYearTerm - 1 } });
        }
    }

});


exports.startInvoiceCron = () => {
    // job.start();
};


// old logic

 // const invoices = await InvoiceModel.find({ recurringPaymentPending: { $gt: 0 } });
    // invoices.forEach(async (invoice) => {
    //     if (invoice.invoiceDetails.length === 1) {
    //         console.log("First reccuring");
    //         const diffTime = invoice.firstPaymentTerm * baseTime;
    //         if (Date.now() - new Date(invoice.firstInvoiceDate).getTime() > diffTime) {
    //             console.log("firts reccuring payment");
    //             const invoiceDetails = {
    //                 isReccuring: true,
    //                 invoiceNo: await appUtils.generateNumberNanoId(),
    //                 invoiceDate: new Date(),
    //                 paymentDone: false,
    //             }
    //             invoice.invoiceDetails.push(invoiceDetails);
    //             await OrderModel.findOneAndUpdate({orderId: invoice.orderId}, {$set: {recurringPaymentPending: invoice.recurringPaymentPending - 1}});
    //             invoice.recurringPaymentPending = invoice.recurringPaymentPending - 1;
    //             invoice.save();
    //         }
    //     }

    //     if (invoice.invoiceDetails.length > 1) {
    //         const lastInvoiceTime = new Date(invoice.invoiceDetails[invoice.invoiceDetails.length - 1].invoiceDate).getTime()
    //         if (Date.now() - lastInvoiceTime > baseTime) {
    //             console.log("more reccuring");
    //             const invoiceDetails = {
    //                 isReccuring: true,
    //                 invoiceNo: await appUtils.generateNumberNanoId(),
    //                 invoiceDate: new Date(),
    //                 paymentDone: false,
    //             }
    //             invoice.invoiceDetails.push(invoiceDetails);
    //             await OrderModel.findOneAndUpdate({orderId: invoice.orderId}, {$set: {recurringPaymentPending: invoice.recurringPaymentPending - 1}});
    //             invoice.recurringPaymentPending = invoice.recurringPaymentPending - 1;
    //             invoice.save();
    //         }
    //     }
    // })