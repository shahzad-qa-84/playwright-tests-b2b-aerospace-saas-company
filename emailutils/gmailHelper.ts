import { expect } from "@playwright/test";
import * as cheerio from "cheerio";
import { get_messages } from "gmail-tester";
import { resolve } from "path";

export const mailHelper = {
  async messageChecker(fromEmail: string, toEmail: string, subject: string) {
    const email = await get_messages(resolve(__dirname, "credentials.json"), resolve(__dirname, "token.json"), {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      include_body: true,
      after: new Date(Date.now() - (1000 * 60) / 2),
    });
    return email;
  },

  async readEmail(page: any, senderEmail: string, receiverEmail: string, subject: string): Promise<string> {
    let emails = await mailHelper.messageChecker(senderEmail, receiverEmail, subject);
    console.debug("emails size: " + emails.length);
    const startTime = Date.now();
    while (emails.length === 0 && Date.now() - startTime < 1800000) {
      console.debug(`Polling mail From: ${senderEmail}, and To: ${receiverEmail} with subject: ${subject}`);
      await page.waitForTimeout(5000);
      emails = await mailHelper.messageChecker(senderEmail, receiverEmail, subject);
    }
    expect(emails.length).toBeGreaterThanOrEqual(1); //ensure new mail arrived
    expect(emails[0].subject).toContain(subject); //assert subject
    return emails[0].body?.html || "";
  },

  async getLoginLink(html: any) {
    const $ = cheerio.load(html);
    const link = $('a:contains("Log in")');
    return link.attr("href");
  },

  async getConfirmLink(html: any) {
    const $ = cheerio.load(html);
    const link = $('a:contains("Confirm email")');
    return link.attr("href");
  },
};
