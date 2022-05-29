import fetch from "node-fetch"; // 只能用 @2 的版本，@3 版本使用 ESM 引入，否则有报错: https://stackoverflow.com/a/69904225/8819898

/**
 * 使用 jest 的单元测试代码
 */

test("Get all user", async () => {
  // Render components, perform requests, receive mocked responses.
  const response = await fetch("http://localhost:9001/user", { method: "GET" });
  const json = await response.json();
  expect(response.status).toBe(200);
  expect(json.username).toBe("admin");
});
