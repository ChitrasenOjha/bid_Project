sap.ui.define([
    "sap/m/MessageToast"
], (MessageToast) => {
    "use strict";
    return {
        async previewTemplate(oController)
        {
            const oStrip = oController.byId("msgStrip");
            if (oStrip) oStrip.setVisible(false);

            try
            {
                const sBase64 = await oController.fetchBase64Data();
                oController.workbook = XLSX.read(sBase64, {
                    type: 'base64',
                    cellStyles: true,
                    cellFormula: true,
                    cellDates: true,
                    sheetStubs: true
                });
                const sheetName = "1. MPBC";
                if (!oController.workbook.Sheets[sheetName])
                {
                    throw new Error("Sheet not found");
                }
                oController.buildSingleTabView(sheetName);
                oController.renderSheetContent(sheetName);
                document.getElementById("excelPreviewWrapper").style.display = "block";
                MessageToast.show("Template loaded successfully!");
            }
            catch (err)
            {
                console.error(err);
                if (oStrip) {
                    oStrip.setText("Failed: " + err.message);
                    oStrip.setType("Error");
                    oStrip.setVisible(true);
                }
            }
        }
    };
});