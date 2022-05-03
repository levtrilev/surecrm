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
  section_id: sectionId,
  tenant_id: tenantId,
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
  section_id: sectionId,
  tenant_id: tenantId,
};

export const newOrderState = atom({
  key: "newOrderState",
  default: newOrderDefault,
});

// export const orderProductsLinesState = atomFamily({
//   key: "newOrderProductsState",
//   default: [] as OrderProductsFullType[],
// });

export const ordersQuery = selector({
  key: "ordersQuery",
  get: async ({ get }) => {
    return ordersQueryDao();
  },
});

export const ordersFullQuery = selector({
  key: "ordersFullQuery",
  get: async ({ get }): Promise<OrderFullType[]> => {
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

export const isModifiedOrderProductsState = atomFamily({
  key: "isModifiedOrderProductsState",
  default: false,
});

export const orderProductsQuery = selectorFamily({
  key: "orderProductsQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentOrderIdState(editContext));
    return orderProductsQueryDao(id);
  },
});

export const orderProductsFullQuery = selectorFamily({
  key: "orderProductsFullQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentOrderIdState(editContext));
    return orderProductsFullQueryDao(id);
  },  
});

