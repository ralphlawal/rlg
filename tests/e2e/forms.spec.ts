import { expect, test } from "@playwright/test";

const MOCK = "http://localhost:3199";
const message = "We need a booking app for three clinics, with reminders and online payments.";

test.beforeEach(async ({ request }) => {
  await request.post(`${MOCK}/mode/ok`);
});

test("project enquiry: errors, then success with a reference", async ({ page, request }) => {
  await page.goto("/start");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  const summary = page.locator("#enquiry").getByRole("alert");
  await expect(summary).toBeFocused();
  await expect(summary).toContainText("Please enter your name.");
  await expect(summary).toContainText("Choose at least one option");

  await page.getByLabel("Your name").fill("Aoife Byrne");
  await page.getByLabel("Email address").fill("aoife@example.ie");
  await page.getByRole("checkbox", { name: "Mobile app" }).check();
  await expect(page.getByRole("group", { name: "Which platforms?" })).toBeVisible();
  await page.getByLabel("Tell us about the project").fill(message);
  await page.waitForTimeout(3100); // a person takes longer than the bot threshold
  await page.getByRole("button", { name: /send enquiry/i }).click();

  await expect(page).toHaveURL(/\/start\/received\?ref=RLG-\d{4}-[A-Z0-9]{4}&kind=project/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Thank you. We have your enquiry.");
  const sent = await (await request.get(`${MOCK}/last`)).json();
  expect(sent).toMatchObject({ name: "Aoife Byrne", email: "aoife@example.ie", services: "Mobile app", type: "Project enquiry" });
  expect(sent.message).toBe(message);
  expect(sent).not.toHaveProperty("website_url");
});

test("delivery failure keeps the message and offers email", async ({ page, request }) => {
  await request.post(`${MOCK}/mode/fail`);
  await page.goto("/start");
  await page.getByLabel("Your name").fill("Aoife");
  await page.getByLabel("Email address").fill("aoife@example.ie");
  await page.getByRole("checkbox", { name: "Website" }).check();
  await page.getByLabel("Tell us about the project").fill(message);
  await page.waitForTimeout(3100);
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.locator("#enquiry").getByRole("alert")).toContainText("wasn’t sent");
  await expect(page.getByLabel("Tell us about the project")).toHaveValue(message);
  const mail = page.getByRole("link", { name: "Send by email instead" });
  await expect(mail).toHaveAttribute("href", /^mailto:hello@ralphlawalgroup\.com\?subject=Project%20enquiry&body=.*booking%20app/);
});

test("service pages pre-select the service", async ({ page }) => {
  await page.goto("/start?service=ai-automation");
  await expect(page.getByRole("checkbox", { name: "AI or automation" })).toBeChecked();
});

test("Scope Sketch on the homepage carries into the enquiry", async ({ page }) => {
  await page.goto("/#sketch");
  const sketch = page.locator("#sketch");
  await sketch.getByRole("checkbox", { name: "iPhone" }).check();
  await sketch.getByRole("radio", { name: "Subscriptions" }).check();
  await expect(sketch.getByText(/in-app purchase/)).toBeVisible();
  await sketch.getByRole("link", { name: /send this with your enquiry/i }).click();
  await expect(page).toHaveURL(/\/start\?sketch=/);
  await expect(page.getByText("Your Scope Sketch is attached")).toBeVisible();
  await expect(page.locator("pre")).toContainText("in-app purchase");
});

test("discovery call request (booking not yet connected) promises nothing it can't do", async ({ page, request }) => {
  await page.goto("/start/call");
  await expect(page.getByText("Online booking is being set up")).toBeVisible();
  await page.getByLabel("Your name").fill("Seán Murphy");
  await page.getByLabel("Email address").fill("sean@example.ie");
  await page.getByLabel("When suits you?").fill("Tuesday or Thursday afternoon");
  await page.waitForTimeout(3100);
  await page.getByRole("button", { name: /request a call/i }).click();
  await expect(page).toHaveURL(/kind=call/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("agree a time");
  await expect(page.getByText(/confirmed/i)).toHaveCount(0);
  expect(await (await request.get(`${MOCK}/last`)).json()).toMatchObject({ type: "Discovery call request", preferred_times: "Tuesday or Thursday afternoon" });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the enquiry form still submits", async ({ page, request }) => {
    await page.goto("/start");
    await page.getByLabel("Your name").fill("Aoife");
    await page.getByLabel("Email address").fill("aoife@example.ie");
    await page.getByRole("checkbox", { name: "Website" }).check();
    await page.getByLabel("Tell us about the project").fill(message);
    await page.getByRole("button", { name: /send enquiry/i }).click();
    await expect(page).toHaveURL(/\/start\/received\?ref=RLG-/);
    expect((await (await request.get(`${MOCK}/last`)).json()).name).toBe("Aoife");
  });

  test("the full Scope Sketch draws on the server", async ({ page }) => {
    await page.goto("/start/sketch");
    await page.getByRole("checkbox", { name: "Android" }).check();
    await page.getByRole("radio", { name: "Sensitive (health, money, children, location)" }).check();
    await page.getByRole("button", { name: /draw my sketch/i }).click();
    await expect(page.getByText(/impact assessment/)).toBeVisible();
    await expect(page.getByRole("link", { name: /send this with your enquiry/i })).toHaveAttribute("href", /\/start\?sketch=/);
  });
});

test("theme choice persists without a flash", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Dark theme" }).first().click({ force: true }).catch(async () => {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Dark theme" }).click();
  });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const themeBeforeHydration: string[] = [];
  page.on("console", (m) => themeBeforeHydration.push(m.text()));
  await page.addInitScript(() => {
    document.addEventListener("readystatechange", () => console.log("theme:" + document.documentElement.dataset.theme), { once: true });
  });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(themeBeforeHydration.find((t) => t.startsWith("theme:"))).toBe("theme:dark");
});

test("Blueprint mode opens, reports real figures and closes with Escape", async ({ page, isMobile }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "View the drawing" });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  const panel = page.getByRole("region", { name: "How this page is built" });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(isMobile ? "4 columns" : "12 columns");
  await expect(panel).toContainText("with 1 h1");
  await expect(page.locator("html")).toHaveAttribute("data-drawing", "");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(toggle).toBeFocused();
});
