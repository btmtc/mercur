import { model } from "@medusajs/framework/utils";

import { Seller } from "./seller";

export const Shop = model.define("shop", {
  id: model.id({ prefix: "shop" }).primaryKey(),
  name: model.text().searchable(),
  slug: model.text().unique(),
  seller: model.belongsTo(() => Seller, { mappedBy: "shops" }),
});
