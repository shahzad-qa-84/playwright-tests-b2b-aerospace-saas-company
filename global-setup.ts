import { chromium, Page } from "@playwright/test";
import fs from "fs";

const DEV_USER_EMAIL = "testing+dev@b2bSaas.ai";
const STAGING_USER_EMAIL = "testing@b2bSaas.ai";
const PROD_USER_EMAIL = "testing+prod@b2bSaas.ai";
const VERCEL_USER_EMAIL = "testing+features@b2bSaas.ai";
const ORG_SLUG = "b2bSaas-testing";
const STORAGE_STATE_PATH = "storageState.json";

enum TargetEnv {
  Local = "Local",
  Dev = "Dev",
  Staging = "Staging",
  Prod = "Prod",
  Vercel = "Vercel",
}

const isLocalTarget = (url: string) => url.includes("localhost");
const isAngusTarget = (url: string) => url.includes("veggiesaurus.net");
const isDevTarget = (url: string) => url.includes("dev");
const isStagingTarget = (url: string) => url.includes("staging");
const isProdTarget = (url: string) => url.includes("b2bSaas.ai");
const isVercelTarget = (url: string) => url.includes(".vercel.app");

const getTargetEnv = (url: string = "", targetLocalhost?: boolean): TargetEnv | undefined => {
  if (isLocalTarget(url) || targetLocalhost) {
    return TargetEnv.Local;
  } else if (isDevTarget(url)) {
    return TargetEnv.Dev;
  } else if (isStagingTarget(url)) {
    return TargetEnv.Staging;
  } else if (isProdTarget(url)) {
    return TargetEnv.Prod;
  } else if (isVercelTarget(url)) {
    return TargetEnv.Vercel;
  }
};

const isValidTokenDomain = (targetEnv: TargetEnv, tokenTargetEnv: TargetEnv) => {
  switch (targetEnv) {
    case TargetEnv.Local:
      return tokenTargetEnv === TargetEnv.Local;
    case TargetEnv.Staging:
      return tokenTargetEnv === TargetEnv.Staging;
    case TargetEnv.Prod:
      return tokenTargetEnv === TargetEnv.Prod;
    default:
      return tokenTargetEnv === TargetEnv.Dev;
  }
};

interface ITargetEnvData {
  targetUrl: string;
  userEmail: string;
  userPassword: string;
  orgSlug: string;
}

const envDataMap: Record<TargetEnv, ITargetEnvData> = {
  [TargetEnv.Local]: {
    targetUrl: "http://localhost:3023/",
    orgSlug: ORG_SLUG,
    userEmail: DEV_USER_EMAIL,
    userPassword: USER_PASSWORD,
  },
  [TargetEnv.Dev]: {
    targetUrl: "https://app.dev.com/",
    orgSlug: ORG_SLUG,
    userEmail: DEV_USER_EMAIL,
    userPassword: USER_PASSWORD,
  },
  [TargetEnv.Staging]: {
    targetUrl: "https://app.staging.com/",
    orgSlug: ORG_SLUG,
    userEmail: STAGING_USER_EMAIL,
    userPassword: USER_PASSWORD,
  },
  [TargetEnv.Prod]: {
    targetUrl: "https://app.b2bSaas.ai/",
    orgSlug: ORG_SLUG,
    userEmail: PROD_USER_EMAIL,
    userPassword: USER_PASSWORD,
  },
  [TargetEnv.Vercel]: {
    targetUrl: "" /* this will come from the BASE_URL env var */,
    orgSlug: ORG_SLUG,
    userEmail: VERCEL_USER_EMAIL,
    userPassword: USER_PASSWORD,
  },
};

const addQueryParamToUrl = (url: string) => {
  return `${url}?domain=${ORG_SLUG}`;
};

const getEnvData = (targetEnv: TargetEnv, enforcedUrl?: string): ITargetEnvData => {
  const envData = envDataMap[targetEnv];
  const targetUrl = enforcedUrl || envData.targetUrl;
  return { ...envData, targetUrl: addQueryParamToUrl(targetUrl) };
};

function generateStorageState(targetEnv: TargetEnv, enforcedUrl?: string) {
  if (!process.env.E2E_CACHED_SESSION_TOKEN) {
    return false;
  }

  const envData = getEnvData(targetEnv, enforcedUrl);
  const sameSite = targetEnv === TargetEnv.Vercel ? "None" : "Strict";
  // override for vercel tests
  const urlObj = new URL(targetEnv === TargetEnv.Vercel ? "https://app.dev.com" : envData.targetUrl);
  const domain = urlObj.hostname;
  const wildcardDomain = urlObj.hostname.replace("app", "");

  const baseState = {
    cookies: [
      {
        name: "session_token",
        value: process.env.E2E_CACHED_SESSION_TOKEN,
        domain: wildcardDomain,
        path: "/auth",
        // Way in the future
        expires: 2038146978.0,
        httpOnly: true,
        secure: true,
        sameSite,
      },

      {
        name: "org_slug",
        value: envData.orgSlug,
        domain: domain,
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ],
  };

  fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify(baseState));
  return true;
}

async function signInWithEmailAndPassword(page: Page, targetEnvData: ITargetEnvData) {
  console.debug("Signing in with email and password");
  const { orgSlug, userEmail, userPassword } = targetEnvData;
  await page.getByRole("button", { name: "Sign in with password", exact: true }).click();

  const txtBxSlug = page.getByTestId("slug-input");
  await txtBxSlug.click();
  await txtBxSlug.fill(orgSlug);

  const txtBxEmail = page.getByPlaceholder("Email");
  await txtBxEmail.click();
  await txtBxEmail.fill(userEmail);

  const txtBxPassword = page.getByPlaceholder("Password");
  await txtBxPassword.click();
  await txtBxPassword.fill(userPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await page.waitForTimeout(5000);
  console.debug("Successfully signed in, the tests will start shortly");
}

function hasValidStorageState(targetEnv: TargetEnv): boolean {
  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    return false;
  }

  const storageState = JSON.parse(fs.readFileSync(STORAGE_STATE_PATH, "utf8"));
  const sessionToken = storageState.cookies.find((cookie: any) => cookie.name === "session_token");

  if (!sessionToken?.expires) {
    console.debug("Session token does not have an expiration date, need to sign in again");
    return false;
  }

  const todayUnixTimestamp = Date.now() / 1000;

  if (sessionToken.expires < todayUnixTimestamp) {
    console.debug("Session token has expired, need to sign in again");
    return false;
  }

  const tokenTargetEnv = getTargetEnv(sessionToken.domain);

  if (!tokenTargetEnv || !isValidTokenDomain(targetEnv, tokenTargetEnv)) {
    console.debug("Session token exists for a different environment, need to sign in again");
    console.debug("targetEnv:", targetEnv);
    console.debug("tokenTargetEnv:", tokenTargetEnv);
    return false;
  }

  return true;
}

async function globalSetup() {
  const baseUrl = process.env.BASE_URL;
  const targetLocalhost = process.env.TARGET_LOCALHOST;
  const targetEnv = getTargetEnv(baseUrl, !!targetLocalhost);

  if (!targetEnv) {
    throw new Error("Not supported url");
  }

  const enforcedUrl = targetEnv === TargetEnv.Vercel ? baseUrl : undefined;
  const targetEnvData = getEnvData(targetEnv, enforcedUrl);
  console.debug("Target URL:", targetEnvData.targetUrl);
  console.debug("Org slug:", targetEnvData.orgSlug);
  console.debug("User email:", targetEnvData.userEmail);

  if (hasValidStorageState(targetEnv)) {
    console.debug("Storage state already exists, skipping sign in");
    const state = fs.readFileSync(STORAGE_STATE_PATH, "utf8");
    console.debug("Storage state:", JSON.parse(state));
    return;
  }

  if (generateStorageState(targetEnv, enforcedUrl)) {
    console.debug("Generated storage state, skipping sign in");
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(targetEnvData.targetUrl);

  await signInWithEmailAndPassword(page, targetEnvData);

  await page.context().storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}

export default globalSetup;
