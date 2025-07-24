import { MedusaService } from "@medusajs/framework/utils";

import { Shop } from "./models";

class ShopModuleService extends MedusaService({
  Shop,
}) {}

export default ShopModuleService;
