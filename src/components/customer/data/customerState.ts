import { atom, selector } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import {
  // customerFullQueryDao,
  customerQueryDao,
  customersFullQueryDao,
  customersQueryDao,
} from "./customerDao";

export const newCustomerDefault: CustomerType = {
  id: 0,
  name: "",
  blocked: false,
  category_id: 0,
  section_id: tenantId,
  tenant_id: sectionId,
};

export const newCustomerState = atom({
  key: "newCustomerState",
  default: newCustomerDefault,
});

export const currentCustomerIdState = atom({
  key: "currentCustomerIdState",
  default: 0,
});

export const openCustomerSelectorState = atom({
  key: "openCustomerSelectorlState",
  default: false,
});

export const customersQuery = selector({
  key: "customersQuery",
  get: async ({ get }) => {
    return customersQueryDao();
  },
});

export const customerQuery = selector({
  key: "customerQuery",
  get: async ({ get }) => {
    const id = get(currentCustomerIdState);
    if (id === 0) return newCustomerDefault;
    return customerQueryDao(id);
  },
});

export const customersFullQuery = selector({
  key: "customersFullQuery",
  get: async ({ get }) => {
    return customersFullQueryDao();
  },
});

// export const customerFullQuery = selector({
//   key: "customerFullQuery",
//   get: async ({ get }) => {
//     const id = get(currentCustomerIdState);
//     return customerFullQueryDao(id);
//   },
// });
