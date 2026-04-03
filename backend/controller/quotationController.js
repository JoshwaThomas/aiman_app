const Enquiry = require("../models/Enquiry");
const Customer = require("../models/Customer");
const Quotation = require("../models/quotation");
const Product = require("../models/Product");
const Invoice = require("../models/invoice");
const Payment = require("../models/Payment")

const addQuotation = async (req, res) => {
  try {
    const body = req.body;
    const date = new Date();
    const products = body.products;

    console.log('Data:', body);
    console.log('products:', products);

    // const foundProducts = await Product.find({ productId: { $in: products.map(p => p.type) } });
    // console.log('foundProducts:', foundProducts);

    if (body.email) {
      const cus = await Customer.findOne({ email: body.email });
      console.log('Customer:', cus);

      const createQuotation = async (customer) => {
        const newQuotation = new Quotation({
          cus_Id: customer.cus_Id,
          com_name: customer.com_name,
          email: body.email,
          mobile: body.mobile,
          city: body.city,
          // product: foundProducts.map((item) => {
          //   const matchingProduct = products.find((p) => p.type === item.productId);
          //   console.log('Matching Product:', matchingProduct);

          //   return {
          //     categoryId: item.category,
          //     productId: item.productId,
          //     category: item.category,
          //     type: item.type,
          //     quantity: matchingProduct ? matchingProduct.quantity : 0, // Use quantity from the request
          //   };
          // }),
          product: products.map(item => ({
            categoryId: item.category,
            // productId: item.productId,
            // category: item.category,
            type: item.type,
            quantity: item.quantity,
            price: item.price,
            remark: item.remark
          })),
          date: date,
          netAmount: body.netAmount,
          discount: body.discount,
          tax: body.tax,
          totalAmount: body.totalAmount,
        });

        const savedData = await newQuotation.save();
        console.log('Quotation saved successfully.');
        return savedData
      };
      let savedData;
      if (cus && cus.email === body.email) {
        savedData = await createQuotation(cus);
      } else {
        const newCustomer = new Customer({
          com_name: body.company_name,
          email: body.email,
          con_person: body.con_person,
          mobile: body.mobile,
          alter_mobile: body.alter_mobile,
          city: body.city,
          date: date,
        });

        await newCustomer.save();
        console.log('New customer created:', newCustomer);

        savedData = await createQuotation(newCustomer);
      }

      res.status(200).json({ message: 'Quotation added successfully', savedData });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getQuotationbyId = async (req, res) => {
  const { id } = req.params;
  // console.log('id', id)
  try {
    const data = await Quotation.findOne({ _id: id })
    console.log('find Data', data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getInvoicebyId = async (req, res) => {
  const { id } = req.params;
  console.log('invoice id', id)
  try {
    const data = await Invoice.findOne({ _id: id })
    console.log('find Data', data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const deleteQuotationbyId = async (req, res) => {
  const { id } = req.params;
  try {
    await Quotation.deleteOne({ _id: id });
    res.status(200).json({ message: 'Quotation Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const deleteInvoicebyId = async (req, res) => {
  console.log("Delete path executed");
  const { id } = req.params;
  try {
    console.log("Delete ID:", id);
    const invoice = await Invoice.findOne({ _id: id });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const payData = await Payment.find({ i_Id: invoice.i_Id });
    console.log("Invoice i_Id:", invoice.i_Id);
    console.log("PayData:", payData);

    await Invoice.deleteOne({ _id: id });

    if (payData && payData.length > 0) {
      await Payment.deleteMany({ i_Id: invoice.i_Id });
      return res.status(200).json({ message: 'Invoice and Payments Deleted' });
    }
    return res.status(200).json({ message: 'Invoice Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateQuotation = async (req, res) => {
  const { id } = req.params;
  console.log("updateQuotation: ", req.body);
  try {
    const quot = await Quotation.findOne({ _id: id });
    console.log("quot", quot);

    if (!quot) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const updatedQuotationData = {
      cus_name: req.body.company_name || quot.cus_name,
      cus_Id: quot.cus_Id,
      email: req.body.email || quot.email,
      mobile: req.body.mobile || quot.mobile,
      city: req.body.city || quot.city,
      product: req.body.products.map(item => ({
        categoryId: item.category,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        remark: item.remark,
      })),
      netAmount: req.body.netAmount || quot.netAmount,
      discount: req.body.discount || quot.discount,
      tax: req.body.tax || quot.tax,
      totalPrice: req.body.totalAmount || quot.totalPrice,
      date: new Date(),
    };

    await Quotation.updateOne({ _id: id }, { $set: updatedQuotationData });

    if (req.body.moveIn === '1') {
      console.log("Creating invoice for customer ID:", quot.cus_Id);

      const invoiceData = {
        cus_Id: quot.cus_Id,
        cus_name: req.body.cus_name,
        email: quot.email,
        mobile: quot.mobile,
        city: quot.city,
        rec_amt: quot.rec_amt,
        bal: quot.bal_amt,
        mop: quot.mop,
        product: req.body.products.map(item => ({
          categoryId: item.category,
          type: item.type,
          quantity: item.quantity,
          price: item.price,
          remark: item.remark,
        })),
        netAmount: req.body.netAmount,
        tax: req.body.tax,
        discount: req.body.discount,
        totalPrice: req.body.totalAmount,
        date: new Date(),
        nextdue: req.body.nextdue || new Date(),
        paytype: req.body.paytype,
        acc: req.body.acc,
        remark: req.body.remark || "",
        img: req.body.img || "",
      };

      const newInvoice = new Invoice(invoiceData);
      await newInvoice.save();

      return res.status(200).json({ message: 'Quotation updated and invoice created successfully' });
    }

    return res.status(200).json({ message: 'Quotation updated successfully' });

  } catch (error) {
    console.error("Error updating quotation: ", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addInvoice = async (req, res) => {
  try {
    const body = req.body;
    const date = new Date();
    const products = body.products;

    console.log('Data:', body);
    console.log('products:', products);

    // const foundProducts = await Product.find({ productId: { $in: products.map(p => p.type) } });
    // console.log('foundProducts:', foundProducts);

    if (body.email) {
      const cus = await Customer.findOne({ email: body.email });
      console.log('Customer:', cus);

      const createInvoice = async (customer) => {
        const newInvoice = new Invoice({
          cus_Id: customer.cus_Id,
          com_name: customer.com_name,
          email: body.email,
          mobile: body.mobile,
          city: body.city,
          rec_amt: body.rec_amt,
          bal: body.bal,
          mop: body.mop,
          remark: body.remark,
          paytype: body.paytype,
          nextdue: body.nextdue,
          // product: foundProducts.map((item) => {
          //   const matchingProduct = products.find((p) => p.type === item.productId);
          //   console.log('Matching Product:', matchingProduct);

          //   return {
          //     categoryId: item.category,
          //     productId: item.productId,
          //     category: item.category,
          //     type: item.type,
          //     quantity: matchingProduct ? matchingProduct.quantity : 0, // Use quantity from the request
          //   };
          // }),
          product: products.map(item => ({
            categoryId: item.category,
            // productId: item.productId,
            // category: item.category,
            type: item.type,
            quantity: item.quantity,
            price: item.price,
            regdate: item.regdate,
            enddate: item.enddate,
            period: item.period,
            remark: item.remark,
            reremark: item.reremark,
          })),
          date: date,
          netAmount: body.netAmount,
          discount: body.discount,
          tax: body.tax,
          totalPrice: body.totalAmount,
          acc: body.acc,

        });

        const savedData = await newInvoice.save();

        const newPayment = new Payment({
          cus_Id: customer.cus_Id,
          i_Id: savedData.i_Id,
          com_name: customer.com_name,
          mobile: body.mobile,
          rec_amt: body.rec_amt,
          bal: body.bal,
          dop: date,
          mop: body.mop,
          nextdue: body.nextdue,
          totalPrice: body.totalAmount,
        });

        const payData = await newPayment.save();
        return ({ savedData, payData })
      };
      let savedData;
      let payData
      if (cus && cus.email === body.email) {
        savedData = await createInvoice(cus);
      } else {
        const newCustomer = new Customer({
          com_name: body.company_name,
          email: body.email,
          con_person: body.con_person,
          mobile: body.mobile,
          alter_mobile: body.alter_mobile,
          city: body.city,
          date: date,
        });

        await newCustomer.save();

        console.log('New customer created:', newCustomer);

        savedData = await createInvoice(newCustomer);
      }

      res.status(200).json({ message: 'Invoice added successfully', savedData, payData });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getAllQuotation = async (req, res) => {
  try {
    const quotations = await Quotation.find();
    // console.log("quotations : ", quotations)
    res.send(quotations);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

const getAllInvoice = async (req, res) => {
  // console.log("Invoice path execute")
  try {
    const invoice = await Invoice.find();
    console.log("Invoice", invoice)
    res.send(invoice);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

const getPaymentData = async (req, res) => {
  console.log("Payment path executed");
  try {
    const invoice = await Invoice.find();
    console.log("Invoice-payment", invoice);
    const pay = await Payment.find();
    console.log("Payment", pay);

    res.status(200).send({
      payments: pay,
      invoices: invoice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getReciptbyinvocId = async (req, res) => {
  const { id } = req.params;
  console.log("id for recipet", id)

}

const getPaymentDataid = async (req, res) => {
  console.log('execute the path')
  const {id} = req.params;
  console.log("payment id", id)
  try{
    const pay = await Payment.findOne({_id: id})
    if(pay){
      console.log(pay.i_Id)
      const paydata = await Payment.find({i_Id: pay.i_Id})
      res.json(paydata)
    }
  }catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  addQuotation,
  getAllQuotation,
  addInvoice,
  getAllInvoice,
  updateQuotation,
  getQuotationbyId,
  deleteQuotationbyId,
  getPaymentData,
  getInvoicebyId,
  getReciptbyinvocId,
  deleteInvoicebyId,
  getPaymentDataid, 
};
