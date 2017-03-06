# 如何和第三方平台验证，登陆

我们的平台主要使用 `JWT` (JsonWebToken) 来做验证。因此无论是任何平台的登录都会经过我们的 server 注册一个 JWT 代码给客户，每个 API 的 HTTP header 都会加上我们这个 JWT token 以作为身份验证。

## 如何和第三方平台验证

第三方通常都是使用 Oauth2.0 安全验证。需要在前端登录第三方登录得到 social token，然后把 social token 传给后端，然后后端把这个 social token 传给第三方，得到我们的要的资料。

1. 弹出一个视窗登录。
2. 得到 `code`，把 `code` 通过 HTTP `POST` 传给后端
3. 后端得到 `code` 做处理，登录，注册用户。
4. assign 一个 JWT 给前端用户。

## 对于 JWT
前端应该把 JWT 存放在 `localStorage` 里，方便 `service-worker`  获得。

登出的时候就把 JWT token 从我们的 `localStorage` 移除。
