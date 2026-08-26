sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "zbidmatrixapp/Helpers/previewHelper",
    "zbidmatrixapp/Helpers/contentFetchHelper",
    "zbidmatrixapp/Helpers/tabContentHelper",
    "zbidmatrixapp/Helpers/contentRenderHelper",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], (Controller, previewHelper, contentFetchHelper, tabContentHelper, contentRenderHelper, MessageToast, BusyIndicator) => {
    "use strict";
    return Controller.extend("zbidmatrixapp.controller.z_main_view", {
        workbook: null,
        zoomLevel: 1,
        onInit() {
            this.loadTemplate();
        },

        loadTemplate() {
            const msgStrip = this.byId("msgStrip");
            const busyIndicator = this.byId("busyIndicator");
            const excelHTML = this.byId("_IDGenHTML");
            const downloadBtn = this.byId("downloadBtn");
            const docusignBtn = this.byId("docusignBtn");

            // Reset state
            msgStrip.setVisible(false);
            excelHTML.setVisible(false);
            downloadBtn.setEnabled(false);
            docusignBtn.setEnabled(false);

            // Clear previous excel data immediately
            const table = document.getElementById("excelTable");
            if (table) table.innerHTML = "";
            const tabBar = document.getElementById("sheetTabBar");
            if (tabBar) tabBar.innerHTML = "";

            busyIndicator.setVisible(true);

            contentFetchHelper.fetchBase64()
                .then((base64) => {
                    busyIndicator.setVisible(false);
                    const renderDelegate = {
                        onAfterRendering: () => {
                            excelHTML.removeEventDelegate(renderDelegate);
                            previewHelper.previewTemplate(this, base64);
                            downloadBtn.setEnabled(true);
                            docusignBtn.setEnabled(true);
                        }
                    };
                    excelHTML.addEventDelegate(renderDelegate);
                    excelHTML.setVisible(true);
                })
                .catch((err) => {
                    busyIndicator.setVisible(false);
                    downloadBtn.setEnabled(false);
                    docusignBtn.setEnabled(false);
                    msgStrip.setText("The Excel template could not be loaded. Please try again.");
                    msgStrip.setType("Error");
                    msgStrip.setVisible(true);
                });
        },

        onDownload()
        {
            BusyIndicator.show(0);
            contentFetchHelper.fetchBase64()
                .then((base64) => {
                    const byteCharacters = atob(base64);
                    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "BER - Bid Exception Report_template.xlsx";
                    a.click();
                    URL.revokeObjectURL(url);
                    BusyIndicator.hide();
                })
                .catch(() => {
                    BusyIndicator.hide();
                    const msgStrip = this.byId("msgStrip");
                    msgStrip.setText("Download failed. Please try again.");
                    msgStrip.setType("Error");
                    msgStrip.setVisible(true);
                });
        },
        onSendToDocusign :function()
        {
            MessageToast.show("Send to Docusign successfully(test)");
        },

        fetchBase64Data()
        {
            return contentFetchHelper.fetchBase64();
        },

        buildSingleTabView(sheetName)
        {
            tabContentHelper.buildSingleTab(this, sheetName);
        },

        renderSheetContent(sheetName)
        {
            contentRenderHelper.renderSheet(this, sheetName);
        }
    });
});
