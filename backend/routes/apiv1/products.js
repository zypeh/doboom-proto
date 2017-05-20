'use strict'
// Product related API.

import { isAuthenticated } from '../../auth'

import models from '../../models'

const { Product } = models.product

export default (router) => router
  // show product profile information
  .get(
    '/p/:organization/:name',
    show_product,
  )

  // edit product profile
  .put(
    '/p/:organization/:name/edit',
    isAuthenticated(),
    edit_product,
  )

/**
 * Show product profile information
 * @param {*} ctx
 * @param {Generator} next
 */
const show_product = async (ctx, next) => { }

/**
 * Edit product profile
 * @param {*} ctx
 * @param {Generator} next
 */
const edit_product = async (ctx, next) => { }
