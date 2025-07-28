import { container } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
//import { Modules } from '@medusajs/framework/utils'
import { medusaIntegrationTestRunner } from '@medusajs/test-utils'

//import { SHOP_MODULE, ShopModuleService } from '@mercurjs/shop'
import seedMarketplaceData from '../../src/scripts/seed'

medusaIntegrationTestRunner({
  testSuite: ({ api }) => {
    describe('Custom endpoints', () => {
      describe('POST /auth/seller/emailpass', () => {
        beforeEach(async () => {
          await seedMarketplaceData({ container, args: [] })
        })
        it('should create shop and link it to seller', async () => {
          const name = 'New shop'
          const dummySellerAdminEmail = 'seller01@dummy.com'
          const getTokenResponse = await api.post(`/auth/seller/emailpass`, {
            email: dummySellerAdminEmail,
            password: '123'
          })

          const token = getTokenResponse.data.token

          const createShopResponse = await api.post(
            `/vendor/shop`,
            {
              name
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          const shop = createShopResponse.data

          expect(shop.name).toEqual(name)

          const query = container.resolve(ContainerRegistrationKeys.QUERY)

          const { data: members } = await query.graph({
            entity: 'member',
            fields: ['*'],
            filters: {
              email: dummySellerAdminEmail
            }
          })

          const shopWithSeller = await query.graph({
            entity: 'shop',
            fields: ['*', 'seller.*'],
            filters: {
              id: shop.id
            }
          })
          console.log(123)
          expect(shopWithSeller.data[0].seller.id).toEqual(members[0].seller_id)
        })
      })
    })
  }
})

jest.setTimeout(60 * 1000)
