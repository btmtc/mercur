import { validateAndTransformBody } from '@medusajs/framework'
import { MiddlewareRoute } from '@medusajs/medusa'

import { VendorCreateSHop } from './validators'

export const vendorShopMiddlewares: MiddlewareRoute[] = [
  {
    method: ['POST'],
    matcher: '/vendor/shop',
    middlewares: [validateAndTransformBody(VendorCreateSHop)]
  }
]
