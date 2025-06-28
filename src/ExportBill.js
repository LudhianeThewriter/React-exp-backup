import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Compatible assignment to avoid "default" warning
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.default?.vfs;

const GSTInvoicePDF = () => {
  const generatePDF = () => {
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  stack: [
                    {
                      text: "TAX INVOICE",
                      style: "title",
                      alignment: "center",
                      margin: [0, 0, 0, 10],
                    },

                    {
                      columns: [
                        {
                          width: "*",
                          stack: [
                            {
                              text: "IRN: bee5977281a2333fea21be8245b4613a7d8f8f",
                              fontSize: 9,
                            },
                            { text: "ACK No.: 122317997071061", fontSize: 9 },
                            { text: "ACK Date: 31-Aug-2023", fontSize: 9 },
                          ],
                        },
                        {
                          width: "*",
                          table: {
                            widths: ["*", "*"],
                            body: [
                              [
                                { text: "Invoice No", bold: true },
                                "FY23-24CAM259",
                              ],
                              [{ text: "Dated", bold: true }, "31-Aug-2023"],
                              [{ text: "Due Date", bold: true }, "07-Sep-2023"],
                              [{ text: "Supplier's Ref", bold: true }, ""],
                            ],
                          },
                          layout: "grid",
                        },
                      ],
                      margin: [0, 0, 0, 10],
                    },

                    {
                      columns: [
                        {
                          width: "*",
                          table: {
                            widths: ["*"],
                            body: [
                              [{ text: "Seller", bold: true }],
                              ["XYZ Pvt Ltd"],
                              ["Camp Pune, Maharashtra, Code: 27"],
                              ["GSTIN: 27AABBC1234C1Z5"],
                              ["E-Mail: info@xyz.com"],
                              ["Contact: 9876543210"],
                            ],
                          },
                          layout: "grid",
                        },
                        {
                          width: "*",
                          table: {
                            widths: ["*"],
                            body: [
                              [{ text: "Buyer", bold: true }],
                              ["ABC Enterprises"],
                              ["Kurla West, Mumbai, Maharashtra, Code: 27"],
                              ["GSTIN: 27AAACB1234D1Z6"],
                              ["Contact: 9876512340"],
                            ],
                          },
                          layout: "grid",
                        },
                      ],
                      columnGap: 10,
                      margin: [0, 0, 0, 10],
                    },

                    {
                      table: {
                        headerRows: 1,
                        widths: [30, "*", "*", 60, 40, "*"],
                        body: [
                          [
                            { text: "Sl No", bold: true },
                            { text: "Description of Services", bold: true },
                            { text: "HSN/SAC", bold: true },
                            { text: "Quantity/Area", bold: true },
                            { text: "Rate", bold: true },
                            { text: "Amount", bold: true },
                          ],
                          [
                            "1",
                            "CAM Charges - Aug 2023\nFrom 01-Aug-2023 to 31-Aug-2023",
                            "997221",
                            "24,188.913 Sq.ft.",
                            "39.85",
                            "₹963,928.20",
                          ],
                        ],
                      },
                      layout: "grid",
                      margin: [0, 0, 0, 10],
                    },

                    {
                      table: {
                        widths: ["*", "*", "*"],
                        body: [
                          [
                            { text: "HSN/SAC", bold: true },
                            { text: "CGST @9%", bold: true },
                            { text: "SGST @9%", bold: true },
                          ],
                          ["996743", "₹86,753.50", "₹86,753.50"],
                          [
                            { text: "TOTAL", bold: true },
                            { text: "₹86,753.50", bold: true },
                            { text: "₹86,753.50", bold: true },
                          ],
                        ],
                      },
                      layout: "grid",
                      margin: [0, 0, 0, 10],
                    },

                    {
                      text: "Total Amount: ₹1,137,435.20",
                      style: "total",
                    },
                    {
                      text: "Amount in Words: Indian Rupees Eleven Lakh Thirty Seven Thousand Four Hundred Thirty Five Only",
                      margin: [0, 5, 0, 10],
                      bold: true,
                    },

                    {
                      table: {
                        widths: ["*"],
                        body: [
                          [
                            {
                              stack: [
                                "1. Kindly issue Cheque / Draft favouring 'XYZ Pvt Ltd'",
                                "2. In case of Dishonoured cheque, Rs. 1000 penalty",
                                "3. 18% interest on delayed payments",
                                "4. RTGS/NEFT details available with company",
                              ],
                              fontSize: 9,
                            },
                          ],
                        ],
                      },
                      layout: "grid",
                      margin: [0, 0, 0, 10],
                    },

                    {
                      text: "This is a Computer Generated Invoice",
                      alignment: "center",
                      fontSize: 9,
                      italics: true,
                    },
                  ],
                },
              ],
            ],
          },
          layout: "grid", // This wraps the entire invoice with an outer border
        },
      ],
      styles: {
        title: { fontSize: 14, bold: true },
        total: { fontSize: 12, bold: true, alignment: "right" },
      },
    };

    pdfMake.createPdf(docDefinition).download("GST-Invoice.pdf");
  };

  return <button onClick={generatePDF}>Download Invoice</button>;
};

export default GSTInvoicePDF;
