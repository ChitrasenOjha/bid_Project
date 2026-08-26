sap.ui.define([], () => {
    "use strict";
    return {
        async fetchBase64() {
            const res = await fetch(
                "/odata/v4/api-service-consumption/getTemplateFile()",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            const data = await res.json();
            const base64 = data.value ?? data;
            if (!base64) {
                throw new Error("Empty response");
            }
            return base64;
        }
    };
});
