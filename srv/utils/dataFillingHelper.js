//Header part 
function fillHeaderData(worksheet, headerData,)
{
    worksheet.getCell('D4').value = headerData.title || '';
    worksheet.getCell('D8').value = headerData.owner.name || '';
    worksheet.getCell('I9').value = headerData.regions[0].name || '';
    worksheet.getCell('D28').value = headerData.baselineSpend.currency || '';
}

//Suppliers part
function fillSupplierData(worksheet, suppliers)
{
    const supplierCols = ['G', 'K', 'O' , 'W','AA','AE','AI','AM','AQ','AU'];
    suppliers.forEach((item, index) => {
        if (index >= supplierCols.length)
        {
            return;
        }
        const col = supplierCols[index];
        const mainContact = item.mainContact || {};
        const organization = item.organization || {};
        const address = organization.address || {};
        worksheet.getCell(`${col}10`).value = organization.name || '';
        worksheet.getCell(`${col}13`).value = mainContact.name || '';
        worksheet.getCell(`${col}14`).value = address.phone || '';
        worksheet.getCell(`${col}15`).value = mainContact.emailAddress || '';
        worksheet.getCell(`${col}16`).value = item.invitationId || '';
        worksheet.getCell(`${col}19`).value = address.country || '';
        worksheet.getCell(`${col}22`).value = item.registrationStatus || '';
    });

}
module.exports = { fillHeaderData, fillSupplierData };