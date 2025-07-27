import { request } from "playwright-core";

export const apiHelper = {
  async prepareRequest() {
    const baseUrl = process.env.BASE_URL || "";
    const apiUrl = process.env.API_URL || "";
    const devApiKey = "organization-test-f47dd126-dcd0-4f8c-a66b-4b14f9f43f15|9193ef3c-2a60-478d-bed0-c340a4b67a13";
    let endpoint = "";
    let apiKey = "";

    if (apiUrl) {
      endpoint = apiUrl;
      apiKey = process.env.API_KEY || devApiKey;
    } else if (!baseUrl) {
      console.debug("Not supported url");
    } else if (baseUrl.includes("dev") || baseUrl.includes(".vercel.app") || baseUrl.includes("localhost")) {
      endpoint = `https://api.dev.com/`;
      apiKey = "organization-test-afc0d2a9-d65c-4585-8194-10422778fcf0|d9b2a676-607b-4ba0-9e60-df8384f7609b";
    } else if (baseUrl.includes("staging")) {
      endpoint = `https://api.staging.com`;
      apiKey = "organization-test-c194428a-6d92-4416-89c8-99efa65fdc88|436448ed-981d-448c-9f1e-1b6907baa46c";
    } else if (baseUrl.includes("b2bSaas.ai")) {
      endpoint = `https://api.b2bSaas.ai/`;
      apiKey = "organization-live-dd94ad37-7f1e-42f5-ab11-cbb85e52b59a|e7c4e763-5685-4c1f-ade6-ef06f0d8a55c";
    } else {
      console.debug("Not supported url");
    }

    return await request.newContext({
      baseURL: endpoint,
      extraHTTPHeaders: {
        Accept: "application/json",
        "x-api-key": `${apiKey}`,
      },
    });
  },

  async getAPIEndpoint(): Promise<string> {
    const baseUrl = process.env.BASE_URL || "";
    const apiUrl = process.env.API_URL || "";
    let endpoint = "";

    if (apiUrl) {
      endpoint = apiUrl;
    } else if (!baseUrl) {
      console.debug("Not supported url");
    } else if (baseUrl.includes("dev") || baseUrl.includes(".vercel.app") || baseUrl.includes("localhost")) {
      endpoint = `https://api.dev.com`;
    } else if (baseUrl.includes("staging")) {
      endpoint = `https://api.staging.com`;
    } else if (baseUrl.includes("b2bSaas.ai")) {
      endpoint = `https://api.b2bSaas.ai`;
    } else {
      console.debug("Not supported url");
    }
    return endpoint;
  },
};
