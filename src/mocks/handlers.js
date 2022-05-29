import { rest } from "msw";

/**
 * msw 用于模拟 api 的数据，用于 node 端测试
 */

export const handlers = [
  // Handles a POST /login request
  rest.post("http://localhost:9001/login", (req, res, ctx) => {
    // 保存认证信息
    sessionStorage.setItem("is-authenticated", true);
    // 返回登录成功的信息
    return res(ctx.status(200));
  }),

  // Handles a GET /user request
  rest.get("http://localhost:9001/user", (req, res, ctx) => {
    // const isAuthenticated = sessionStorage.getItem("is-authenticated"); // 没有 sessionStorage
    // if (!isAuthenticated) {
    //   return res(ctx.status(403), ctx.json({ errorMessage: "Not authorized" }));
    // }
    return res(
      ctx.status(200),
      ctx.json({
        message: "success",
        username: "admin",
      })
    );
  }),
];
