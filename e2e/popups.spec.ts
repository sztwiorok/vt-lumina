import { test as base } from "@playwright/test";
import { expect } from "@playwright/test";
import withVisualTestPluginFixture from "@buddy-works/visual-tests-playwright";

const test = withVisualTestPluginFixture(base);

test.describe("newsletter popup (home)", () => {
  test("opens, shows its content and closes", async ({ page, visualTestPlugin }) => {
    await page.goto("/");

    await expect(page.getByTestId("newsletter-popup")).toHaveCount(0);

    await page.getByTestId("newsletter-open").click();

    const popup = page.getByTestId("newsletter-popup");
    await expect(popup).toBeVisible();
    await expect(page.getByTestId("newsletter-window")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ten percent off your first order" })
    ).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await visualTestPlugin.takeSnap(page, "home/newsletter-popup-open");

    await page.getByTestId("newsletter-close").click();
    await expect(popup).toHaveCount(0);
    await visualTestPlugin.takeSnap(page, "home/newsletter-popup-closed");
  });

  test("accepts an email address while open", async ({ page, visualTestPlugin }) => {
    await page.goto("/");
    await page.getByTestId("newsletter-open").click();

    await page.getByLabel("Email address").fill("ada@example.com");
    await expect(page.getByLabel("Email address")).toHaveValue("ada@example.com");
    await visualTestPlugin.takeSnap(page, "home/newsletter-popup-filled");

    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByTestId("newsletter-popup")).toBeVisible();

    await page.getByTestId("newsletter-close").click();
    await expect(page.getByTestId("newsletter-popup")).toHaveCount(0);
  });
});

test.describe("size guide popup (collection)", () => {
  test("opens, shows the measurement table and closes", async ({ page, visualTestPlugin }) => {
    await page.goto("/collection");

    await expect(page.getByTestId("size-guide-popup")).toHaveCount(0);

    await page.getByTestId("size-guide-open").click();

    const popup = page.getByTestId("size-guide-popup");
    await expect(popup).toBeVisible();
    await expect(page.getByTestId("size-guide-window")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Size guide" })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(6); // header + 5 sizes
    await expect(page.getByRole("cell", { name: "M", exact: true })).toBeVisible();
    await visualTestPlugin.takeSnap(page, "collection/size-guide-popup-open");

    await page.getByTestId("size-guide-close").click();
    await expect(popup).toHaveCount(0);
    await visualTestPlugin.takeSnap(page, "collection/size-guide-popup-closed");
  });

  test("closes with the Escape key", async ({ page, visualTestPlugin }) => {
    await page.goto("/collection");
    await page.getByTestId("size-guide-open").click();
    await expect(page.getByTestId("size-guide-popup")).toBeVisible();
    await visualTestPlugin.takeSnap(page, "collection/size-guide-popup-open");

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("size-guide-popup")).toHaveCount(0);
    await visualTestPlugin.takeSnap(page, "collection/size-guide-popup-escape-closed");
  });
});
