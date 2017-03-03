# 让前后端沟通
后端的router负责航管各类来自前端的请求，然后通过后端进一步把前端发来的资料进行处理
##后端的Router
利用社交媒体注册的路由router <前端向后端的请求连接 **http://localhost/api/v1/** >

`POST` *=>* `/auth/register` 使用Email注册
`GET` *=>* `/auth/refresh` 更新JWT token
`POST` *=>* `/auth/email` 使用Email登入
`GET` *=>* `/auth/facebook` 使用Facebook登入/注册
`GET` *=>* `/auth/facebook/callback` Facebook注册或登入成功后返回JWT token
`GET` *=>* `/auth/twitter` 如以上所示
`GET` *=>* `/auth/twitter/callback` 如以上所示
`GET` *=>* `/auth/google` 如以上所示
`GET` *=>* `/auth/google/callbackk` 如以上所示
