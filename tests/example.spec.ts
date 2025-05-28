import { test, expect } from "@playwright/test";

test("can login in test", async ({ page }) => {
  await page.route(
    "https://*.workos.com/user_management/authorize*",
    async (route) => {
      const response = await route.fetch();
      let body = await response.text();

      await route.fulfill({
        response,
        body,
        headers: {
          ...response.headers,
          Location: `https://auth.jedfoundation.org/user_management/authorize?response_type=code&client_id=${
            import.meta.env.VITE_WORKOS_CLIENT_ID
          }&redirect_uri=http%3A%2F%2Flocalhost%3A5173&provider=authkit`,
        },
      });
    }
  );
  await page.route(
    "https://*.workos.com/user_management/authenticate",
    async (route) => {
      await route.fulfill({
        json: {
          user: {
            object: "user",
            id: "user_123",
            email: "user@test.com",
            email_verified: true,
            first_name: "joe",
            last_name: "user",
            profile_picture_url: "https://workoscdn.com/images/v1/abc",
            created_at: "2024-08-05T20:44:44.191Z",
            updated_at: "2024-08-05T21:21:36.055Z",
            last_sign_in_at: "2025-05-28T16:27:08.725Z",
            external_id: null,
          },
          // fake token for testing purposes
          access_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.nmFvhfIqCmB8CIMHrIAun2kMNeJd9KTs4mT0nv2srqE",
          refresh_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.nmFvhfIqCmB8CIMHrIAun2kMNeJd9KTs4mT0nv2srqE",
          authentication_method: "Password",
        },
      });
    }
  );

  await page.goto("/");

  await expect(page.getByText("sign out")).toBeVisible();
});
