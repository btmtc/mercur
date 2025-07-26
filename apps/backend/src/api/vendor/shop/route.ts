import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { SELLER_MODULE } from '@mercurjs/seller'
import { SHOP_MODULE } from '@mercurjs/shop'

//import { MedusaError } from '@medusajs/framework/utils'
import { fetchSellerByAuthActorId } from '../../../shared/infra/http/utils/seller'
import { createShopWorkflow } from '../../../workflows/shop/workflows/create-shop'
import { VendorCreateShopType } from './validators'

export const POST = async (
  req: AuthenticatedMedusaRequest<VendorCreateShopType>,
  res: MedusaResponse
) => {
  console.log('VAL:', req.validatedBody)
  console.log('BODY:', req.body)
  const { name } = req.validatedBody

  const { id: seller_id } = await fetchSellerByAuthActorId(
    req.auth_context.actor_id,
    req.scope
  )
  console.log('----------')
  console.log('seller_id:', seller_id)
  console.log('name:', name)
  console.log('----------')

  const result = await createShopWorkflow.run({
    input: {
      seller_id,
      shop: {
        name
      }
    }
  })
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  await link.create({
    [SELLER_MODULE]: {
      seller_id
    },
    [SHOP_MODULE]: {
      shop_id: result.result.id
    }
  })

  res.status(201).json(result.result)
}
