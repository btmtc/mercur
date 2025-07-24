//import { createRemoteLinkStep } from '@medusajs/medusa/core-flows'
import { WorkflowResponse, createWorkflow } from '@medusajs/workflows-sdk'

import { CreateShopDTO } from '@mercurjs/framework'

//import { SELLER_MODULE } from '@mercurjs/seller'
// import { ShopModuleService } from '@mercurjs/shop'
import { createShopStep } from '../steps/create-shop'

type CreateShopWorkflowInput = {
  shop: CreateShopDTO
  seller_id: string
}

export const createShopWorkflow = createWorkflow(
  'create-shop',
  function (input: CreateShopWorkflowInput) {
    //const { seller_id } = input

    const createdShop = createShopStep(input.shop)

    // createRemoteLinkStep([
    //   {
    //     [SELLER_MODULE]: {
    //       seller_id
    //     },
    //     ShopModuleService: {
    //       shop_id: createdShop.id
    //     }
    //   }
    // ])

    return new WorkflowResponse(createdShop)
  }
)
