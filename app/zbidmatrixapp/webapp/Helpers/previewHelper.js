sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], (MessageToast,BusyIndicator) => {
    "use strict";
    return {
        async previewTemplate(oController, sBase64)
        {
            BusyIndicator.show(0);
            const oStrip = oController.byId("msgStrip");
            if (oStrip) oStrip.setVisible(false);

            try
            {
                sBase64 = sBase64 || await oController.fetchBase64Data();
                oController.workbook = XLSX.read(sBase64, {
                    type: 'base64',
                    cellStyles: true,
                    cellFormula: true,
                    cellDates: true,
                    sheetStubs: true
                });
                const sheetName = "BER";
                if (!oController.workbook.Sheets[sheetName])
                {
                    throw new Error("Sheet not found");
                }
                oController.buildSingleTabView(sheetName);
                oController.renderSheetContent(sheetName);
                const previewWrapper = document.getElementById("excelPreviewWrapper");
                if (!previewWrapper) {
                    throw new Error("Excel preview is not ready");
                }
                previewWrapper.style.display = "block";
                BusyIndicator.hide();
                MessageToast.show("Template loaded successfully!");
            }
            catch (err)
            {
                BusyIndicator.hide();
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
