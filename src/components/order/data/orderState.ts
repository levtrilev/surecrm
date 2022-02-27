import { atom, selector } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import { orderQueryDao, ordersFullQueryDao, ordersQueryDao } from "./orderDao";

export const newOrderDefault: OrderType = {
  id: 0,
  number: "",
  name: "",
  date: new Date("2022-01-01"),
  customer_id: 1,
  total_amount: 0,
  deleted: false,
  section_id: tenantId,
  tenant_id: sectionId,
};

export const newOrderState = atom({
  key: "newOrderState",
  default: newOrderDefault,
});

export const currentOrderIdState = atom({
  key: "currentOrderIdState",
  default: 0,
});

export const currentOrderCustomerIdState = atom({
  key: "currentOrderCustomerIdState",
  default: 0,
});

export const ordersQuery = selector({
  key: "ordersQuery",
  get: async ({ get }) => {
    return ordersQueryDao();
  },
});

export const orderQuery = selector({
  key: "orderQuery",
  get: async ({ get }) => {
    const id = get(currentOrderIdState);
    return orderQueryDao(id);
  },
});

export const ordersFullQuery = selector({
  key: "ordersFullQuery",
  get: async ({ get }) => {
    return ordersFullQueryDao();
  },
});