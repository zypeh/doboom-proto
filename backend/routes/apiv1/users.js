'use strict'
// User related API.

import { isAuthenticated } from '../../auth'

import models from '../../models'

const { User } = models.user

export default (router) => router
  // show user information
  .get(
    '/user/:name',
    show_user,
  )

  // edit users their own profile
  .put(
    '/user/profile/edit',
    isAuthenticated(),
    edit_profile,
  )

/**
 * Show user information.
 * @param {*} ctx
 * @param {Generator} next
 */
const show_user = async (ctx, next) => {
  try {
    const { username } = ctx.params

    const result = await User.findOne({
      where: { username: username }
    })

    ctx.status = 200
    ctx.body = { success: true, result: result }

  } catch (e) {
    ctx.throw(500, err)
  }
}

/**
 * Edit users their own profile
 * @param {*} ctx
 * @param {Generator} next
 */
const edit_profile = async (ctx, next) => {
  try {

    const result = await User.update({

    })
    ctx.status = 200
    ctx.body = { success: true }

  } catch (err){
    ctx.throw(500, err)
  }
}
