import { ShopDTO } from "./common";
export type CreateShopDTO = Omit<ShopDTO, "id">;
