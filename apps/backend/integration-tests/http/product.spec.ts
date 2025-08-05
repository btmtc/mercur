import { container } from '@medusajs/framework';
import { IProductModuleService } from '@medusajs/framework/types';
//import { IProductModuleService } from '@medusajs/framework/types'
//import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import {
  ContainerRegistrationKeys, //Modules
  Modules
} from '@medusajs/framework/utils';
import { medusaIntegrationTestRunner } from '@medusajs/test-utils';

import { MemberDTO } from '@mercurjs/framework';
import { SELLER_MODULE, SellerModuleService } from '@mercurjs/seller';
import { SHOP_MODULE, ShopModuleService } from '@mercurjs/shop';

import {
  CreateProductOptionType,
  VendorCreateProductType
} from '../../src/api/vendor/products/validators';
import seedMarketplaceData from '../../src/scripts/seed';

medusaIntegrationTestRunner({
  testSuite: ({ api }) => {
    describe('Products endpoints', () => {
      describe('POST /auth/seller/emailpass', () => {
        beforeEach(async () => {
          await seedMarketplaceData({ container, args: [] });
        });
        it('should create product', async () => {
          //const name = 'New shop'
          const dummySellerAdminEmail = 'seller01@dummy.com';
          const getTokenResponse = await api.post(`/auth/seller/emailpass`, {
            email: dummySellerAdminEmail,
            password: '123'
          });

          const token = getTokenResponse.data.token;

          console.log(token);

          const query = container.resolve(ContainerRegistrationKeys.QUERY);

          const { data: members } = await query.graph({
            entity: 'member',
            fields: ['*', 'seller.*'],
            filters: {
              email: dummySellerAdminEmail
            }
          });

          console.log('MEMBERS:', members);

          expect(members.length).toEqual(1);

          const member = members[0] as MemberDTO;

          const seller_id = member.seller?.id;

          const { data: sellers } = await query.graph({
            entity: 'seller',
            // to get linked records you need add to fields
            // 'shops.*'
            // NOTE that entity's name is shop but in fields it must be shopS
            // product -> products and so on
            fields: ['*', 'shops.*'],
            filters: {
              id: seller_id
            }
          });

          console.log('SELLER:', JSON.stringify(sellers, null, 4));
          const shop_id = sellers[0].shops[0].id;
          console.log('shop id:', shop_id);

          //-----------------
          const options: CreateProductOptionType[] = [
            {
              title: 'VARIANT',
              values: ['abc', 'de']
            }
          ];

          const body: VendorCreateProductType = {
            shop_id,
            title: 'test product',
            subtitle: ' z.string().optional()',
            description: 'z.string().optional()',
            is_giftcard: false,
            discountable: true,
            images: [
              { url: 'https://test.s3.us-east-2.amazonaws.com/occupancy.csv' }
            ],
            thumbnail: 'z.string().optional()',

            status: 'draft',
            external_id: 'ozon_id',

            options,

            weight: 1,
            length: 2,
            height: 3,
            width: 4,
            hs_code: 'z.string().optional()',
            mid_code: 'z.string().optional()',
            origin_country: 'Russia'
          };

          const createProductResponse = await api.post(
            `/vendor/products`,
            {
              ...body
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('product:', createProductResponse.data.product);

          const productModuleService: IProductModuleService = container.resolve(
            Modules.PRODUCT
          );

          const fetchedProduct = await productModuleService.retrieveProduct(
            createProductResponse.data.product.id as string
          );

          console.log('fetched product:', fetchedProduct);

          console.log('SUCCESS!!!!!!!!!!!!!!');

          const sellerService =
            container.resolve<SellerModuleService>(SELLER_MODULE);
        });
      });
    });
  }
});

jest.setTimeout(60 * 1000);
