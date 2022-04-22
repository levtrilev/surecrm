import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import { orderProductsFullQueryDao, orderProductsQueryDao, orderQueryDao, ordersFullQueryDao, ordersQueryDao } from "./orderDao";

export const newOrderDefault: OrderType = {
  id: 0,
  number: "",
  name: "",
  date: new Date("2022-01-01"),
  customer_id: 0,
  total_amount: 0,
  deleted: false,
  description: "",
  section_id: tenantId,
  tenant_id: sectionId,
};

export const newOrderProductsDefault: OrderProductsType = {
  id: 0,
  order_id: 0,
  product_id: 0,
  quantity: 0,
  item_price: 0,
  line_price_total: 0,
  discount_percent: 0,
  line_total: 0,
  line_total_vat: 0,
  weight: 0,
  volume: 0,
  section_id: tenantId,
  tenant_id: sectionId,
};

export const newOrderState = atom({
  key: "newOrderState",
  default: newOrderDefault,
});

export const newOrderProductsState = atom({
  key: "newOrderProductsState",
  default: newOrderProductsDefault,
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

export const orderProductsQuery = selectorFamily({
  key: "orderProductsQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentOrderIdState(editContext));
    return orderProductsQueryDao(id);
  },
});

const orderProductsFullQueryEdit = atomFamily({
  key: 'orderProductsFullQueryAtom',
  default: [] as any[],
});

export const orderProductsFullQuery = selectorFamily({
  key: "orderProductsFullQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentOrderIdState(editContext));
    return orderProductsFullQueryDao(id);
  },  
});
// export const orderProductsFullQueryEdit = selectorFamily({
//   key: "orderProductsFullQueryEdit",
//   get: (editContext: string) => ({ get }) => get(orderProductsFullQuery(editContext)),
//   set: (editContext: string) => ({ set }, newValue) => set(orderProductsFullQueryAtom(editContext), newValue),
// });
