'use strict'
// Organization related API.

import { isAuthenticated } from '../../auth'

import models from '../../models'

const { Organization } = models.organization

export default (router) => router
  // show organizaiton profile information
  .get(
    '/organization/profile/:name',
    show_organization,
  )

  // edit organization profile
  .put(
    '/organization/profile/:name/edit',
    isAuthenticated(),
    edit_organization,
  )

/**
 * Show organization profile information
 * @param {*} ctx
 * @param {Generator} next
 */
const show_organization = async (ctx, next) => { }

/**
 * Edit organization profile
 * @param {*} ctx
 * @param {Generator} next
 */
const edit_organization = async (ctx, next) => { }
