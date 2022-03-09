import { atom, atomFamily, selector, selectorFamily } from "recoil";
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

export const ordersQuery = selector({
  key: "ordersQuery",
  get: async ({ get }) => {
    return ordersQueryDao();
  },
});

export const ordersFullQuery = selector({
  key: "ordersFullQuery",
  get: async ({ get }) => {
    return ordersFullQueryDao();
  },
});

export const currentOrderIdState = atomFamily({
  key: "currentOrderIdState",
  default: 0,
});

export const orderQuery = selectorFamily({
  key: "orderQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentOrderIdState(editContext));
    return orderQueryDao(id);
  },
});