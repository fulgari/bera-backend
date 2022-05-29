import { rest } from "msw";

export const handlers = [
  // Handles a POST /login request
  rest.post("/login", (req, res, ctx) => {
    // 保存认证信息
    sessionStorage.setItem("is-authenticated", true);
    // 返回登录成功的信息
    return res(ctx.status(200));
  }),

  // Handles a GET /user request
  rest.get("/user", (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem("is-authenticated");
    if (!isAuthenticated) {
      return res(ctx.status(403), ctx.json({ errorMessage: "Not authorized" }));
    }
    return res(
      ctx.status(200),
      ctx.json({
        message: "success",
        username: "admin",
      })
    );
  }),
];
