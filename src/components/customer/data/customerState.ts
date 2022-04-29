import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import {
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

export const openCustomerSelectorState = atom({
  key: "openCustomerSelectorlState",
  default: false,
});

export const openEditModalCustomerState = atom({
  key: "openEditModalCustomerState",
  default: false,
});

export const customersQuery = selector({
  key: "customersQuery",
  get: async ({ get }) => {
    return customersQueryDao();
  },
});


export const customersFullQuery = selector({
  key: "customersFullQuery",
  get: async ({ get }): Promise<CustomerFullType[]> => {
    return customersFullQueryDao();
  },
});

export const currentCustomerIdState = atomFamily({
  key: "currentCustomerIdState",
  default: 0,
});

export const customerQuery = selectorFamily({
  key: "customerQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentCustomerIdState(editContext));
    if (id === 0) return newCustomerDefault;
    return customerQueryDao(id);
  },
});