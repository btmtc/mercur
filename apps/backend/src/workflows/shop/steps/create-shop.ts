import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { CreateShopDTO, ShopDTO } from '@mercurjs/framework'
import { SHOP_MODULE, ShopModuleService } from '@mercurjs/shop'

export const createShopStep = createStep(
  'create-shop',
  async (input: CreateShopDTO, { container }) => {
    const service = container.resolve<ShopModuleService>(SHOP_MODULE)

    const shop: ShopDTO = await service.createShops({
      ...input
    })

    console.log('shop from step:', shop)

    return new StepResponse(shop, shop.id)
  },
  async (id: string, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<ShopModuleService>(SHOP_MODULE)

    await service.deleteShops([id])
  }
)
