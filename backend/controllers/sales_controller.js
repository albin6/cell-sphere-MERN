import AsyncHandler from "express-async-handler";
import SalesReport from "../models/salesModel.js";
import pdfkit from "pdfkit";
import ExcelJS from "exceljs";

const getSalesReportData = async (startDate, endDate, period) => {
  let dateFilter = {};

  if (period === "custom" && startDate && endDate) {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);
    dateFilter = { orderDate: { $gte: new Date(start), $lte: new Date(end) } };
    console.log("Custom date range filter:", dateFilter);
  }

  if (period === "daily") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(),
      },
    };
  } else if (period === "weekly") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        $lt: new Date(),
      },
    };
  } else if (period === "monthly") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        $lt: new Date(),
      },
    };
  }

  return await SalesReport.find(dateFilter);
};

export const get_sales_report = AsyncHandler(async (req, res) => {
  console.log(req.query);
  const { startDate = null, endDate = null, period = "daily" } = req.query;

  console.log(
    "Query Parameters - startDate:",
    startDate,
    "endDate:",
    endDate,
    "period:",
    period
  );

  let dateFilter = {};

  if (period === "custom" && startDate && endDate) {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    dateFilter = { orderDate: { $gte: new Date(start), $lte: new Date(end) } };
    console.log("Custom date range filter:", dateFilter);
  }

  if (period === "daily") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(),
      },
    };
  } else if (period === "weekly") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        $lt: new Date(),
      },
    };
  } else if (period === "monthly") {
    dateFilter = {
      orderDate: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        $lt: new Date(),
      },
    };
  }

  console.log(dateFilter);

  const reports = await SalesReport.find(dateFilter)
    .populate("product")
    .populate("customer");

  const totalSalesCount = reports.length;
  const totalOrderAmount = reports.reduce(
    (acc, report) => acc + report.finalAmount,
    0
  );
  const totalDiscount = reports.reduce(
    (acc, report) => acc + report.discount + report.couponDeduction,
    0
  );

  res.status(200).json({
    reports,
    totalSalesCount,
    totalOrderAmount,
    totalDiscount,
  });
});

export const download_sales_report_pdf = AsyncHandler(async (req, res) => {
  const { startDate, endDate, period } = req.query;
  const reports = await getSalesReportData(startDate, endDate, period);

  const pdfDoc = new pdfkit();
  res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
  pdfDoc.pipe(res);

  pdfDoc.fontSize(20).text("Sales Report", { align: "center" }).moveDown(2);

  reports.forEach((report, index) => {
    pdfDoc.fontSize(12);
    pdfDoc.text(
      `==================================================================`
    );
    pdfDoc.text(`Report ${index + 1}:`);

    pdfDoc.text(
      `==================================================================`
    );
    pdfDoc.text(`Order ID: ${report.orderId}`);
    report.product.forEach((p) => {
      pdfDoc.text(
        "------------------------------------------------------------------"
      );
      pdfDoc.text(`Product Name: ${p.productName}`);
      pdfDoc.text(`Quantity: ${p.quantity}`);
      pdfDoc.text(`Unit Price: RS. ${p.unitPrice.toFixed(2)}`);
      pdfDoc.text(`Total Price: RS. ${p.totalPrice.toFixed(2)}`);
      pdfDoc.text(`Discount: RS. ${p.discount.toFixed(2)}`);
      pdfDoc.text(`Coupon Deduction: RS. ${p.couponDeduction.toFixed(2)}`);
    });
    pdfDoc.text(
      "------------------------------------------------------------------"
    );
    pdfDoc.text(`Final Amount: RS. ${report.finalAmount.toFixed(2)}`);
    pdfDoc.text(
      `Order Date: ${new Date(report.orderDate).toLocaleDateString()}`
    );
    pdfDoc.text(`Customer ID: ${report.customer}`);
    pdfDoc.text(`Customer Name: ${report.customer_name}`);
    pdfDoc.text(`Payment Method: ${report.paymentMethod}`);
    pdfDoc.text(`Delivery Status: ${report.deliveryStatus}`);
    pdfDoc.text(
      `==================================================================`
    );

    pdfDoc.moveDown();
  });

  pdfDoc.end();
});

export const download_sales_report_xl = AsyncHandler(async (req, res) => {
  const { startDate, endDate, period } = req.query;
  const reports = await getSalesReportData(startDate, endDate, period);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  worksheet.columns = [
    { header: "Order ID", key: "orderId", width: 15 },
    { header: "Product Name", key: "productName", width: 25 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "Unit Price", key: "unitPrice", width: 15 },
    { header: "Total Price", key: "totalPrice", width: 15 },
    { header: "Discount", key: "discount", width: 15 },
    { header: "Coupon Deduction", key: "couponDeduction", width: 15 },
    { header: "Final Amount", key: "finalAmount", width: 15 },
    { header: "Order Date", key: "orderDate", width: 20 },
    { header: "Customer", key: "customer", width: 20 },
    { header: "Customer Name", key: "customer_name", width: 20 },
    { header: "Payment Method", key: "paymentMethod", width: 20 },
    { header: "Delivery Status", key: "deliveryStatus", width: 15 },
  ];

  reports.forEach((report) => {
    const products = report.product.map((p) => ({
      productName: p.productName,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      totalPrice: p.totalPrice,
      discount: p.discount,
      couponDeduction: p.couponDeduction,
    }));
    products.forEach((product) => {
      worksheet.addRow({
        orderId: report.orderId,
        productName: product.productName,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.totalPrice,
        discount: product.discount,
        couponDeduction: product.couponDeduction,
        finalAmount: report.finalAmount,
        orderDate: report.orderDate.toLocaleDateString(),
        customer: report.customer,
        customer_name: report.customer_name,
        paymentMethod: report.paymentMethod,
        deliveryStatus: report.deliveryStatus,
      });
    });
  });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales_report.xlsx"
  );
  await workbook.xlsx.write(res);
  res.end();
});

// ========================================================================
