// const fetch = require("node-fetch");
import fetch from "node-fetch";

test("Get all user", async () => {
  // Render components, perform requests, receive mocked responses.
  const response = await fetch("http://localhost:9001/user", { method: "GET" });
  const json = await response.json();
  expect(response.status).toBe(200);
  expect(json.username).toBe("admin");
});
