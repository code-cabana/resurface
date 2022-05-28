export const email = "hello@codecabana.com.au";
export const supportEmail = "support@codecabana.com.au";
export const website = "https://codecabana.com.au";
export const site = website.replace("https://", "");
export const defaultDescription =
  "Sleek code editor for Squarespace, Shopify, Wix + more!";
export const SWELL_STOREFRONT_ID = "codecabana";
export const SWELL_STOREFRONT_PUBLIC_KEY =
  "pk_TFORHblo8bbLmufbS7B7tQa8Vr0grpI3";
export const SWELL_PRODUCT_ID = "6274bc25623e4b0012e85773";
export const SWELL_PLAN_ID = "6274bc25623e4b0012e8577a";

// Routes
export const homePage = "https://resurface.codecabana.com.au";

export const accountPageRel = "/account";
export const accountPage = `${homePage}${accountPageRel}`;

export const resetPasswordPageRel = "/reset-password";
export const resetPasswordPage = `${homePage}${resetPasswordPageRel}`;

const resetPasswordKeyPageRel = "/reset-password/{reset_key}";
export const resetPasswordKeyPage = `${homePage}${resetPasswordKeyPageRel}`;

export const getPageRel = "/get";

// Webstore
const extensionId = "mcneombcjoaibfjnpodhhngnlhapiocl";
export const webstorePage = `https://chrome.google.com/webstore/detail/resurface/${extensionId}`;
export const getResurfaceLink = webstorePage; // TODO Uncomment when more than 1 browser is supported
