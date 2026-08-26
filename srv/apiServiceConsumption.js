const cds = require('@sap/cds');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

module.exports = cds.service.impl(function () {
  this.on('getTemplateFile', async (req) => {
    try {
      const filePath = path.join(__dirname, 'template', 'BER - Bid Exception Report_template.xlsx');
      if (!fs.existsSync(filePath)) {
        return req.error(404, 'Template not found');
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      workbook.calcProperties.fullCalcOnLoad = true;

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('Error:', error.message);
      return req.error(500, error.message);
    }
  });
});
