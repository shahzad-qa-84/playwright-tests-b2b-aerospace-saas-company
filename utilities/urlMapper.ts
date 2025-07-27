import { CONSTANTS } from "./constants";

export function getUserEmail(baseUrl: string): string | null {
  if (baseUrl.includes("dev")) {
    return CONSTANTS.ASTRONAUT_DOLPHINS.userEmail;
  } else if (baseUrl.includes("localhost")) {
    return CONSTANTS.LOCALHOST.userEmail;
  } else if (baseUrl.includes("staging")) {
    return CONSTANTS.PENGUIN_WARBEAR.userEmail;
  } else if (baseUrl.includes("b2bSaas.ai")) {
    return CONSTANTS.b2bSaas_AI.userEmail;
  } else if (baseUrl.includes(".vercel.app")) {
    return CONSTANTS.VERCEL.userEmail;
  } else {
    console.debug("Not supported url");
    return null;
  }
}
