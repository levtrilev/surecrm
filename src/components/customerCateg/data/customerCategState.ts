import { atom, selector } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import { customerCategQueryDao, customerCategsQueryDao } from "./customerCategDao";


export const newCustomerCategDefault: CustomerCategoryType = 
{
  id: 0,
  name: '',
  section_id: tenantId,
  tenant_id: sectionId,
};
export const newCustomerCategState = atom({
  key: "newCustomerCategState",
  default: newCustomerCategDefault,
});

export const currentCustomerCategIdState = atom({
  key: "currentCustomerCategIdState",
  default: 0,
});

export const openCustomerCategSelectorState = atom({
  key: "openCustomerCategSelectorState",
  default: false,
});

export const openEditModalCustomerCategState = atom({
  key: "openEditModalCustomerCategState",
  default: false,
});

export const customerCategsQuery = selector({
  key: "customersCategsQuery",
  get: async ({ get }) => {

    return customerCategsQueryDao();
  },
});

export const customerCategQuery = selector({
  key: "customerCategQuery",
  get: async ({ get }) => {
    const id = get(currentCustomerCategIdState);
    if (id === 0) return newCustomerCategDefault;
    return customerCategQueryDao(id);
  },
});
