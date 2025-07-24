import { model } from "@medusajs/framework/utils";

export const Shop = model.define("shop", {
  id: model.id({ prefix: "shop" }).primaryKey(),
  name: model.text().searchable(),
});
