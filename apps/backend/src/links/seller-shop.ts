import { defineLink } from '@medusajs/framework/utils'

import SellerModule from '@mercurjs/seller'
import ShopModule from '@mercurjs/shop'

export default defineLink(SellerModule.linkable.seller, {
  linkable: ShopModule.linkable.shop,
  isList: true
})
