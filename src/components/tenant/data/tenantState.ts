import { atom, atomFamily, selector, selectorFamily } from "recoil";
// import { sectionId, tenantId } from "../../../shared/appConsts";
import { tenantQueryDao, tenantsQueryDao } from "./tenantDao";

export const newTenantDefault: TenantType = 
{
  id: 0,
  name: '',
  blocked: false,
};
export const newTenantState = atom({
  key: "newTenantState",
  default: newTenantDefault,
});

export const openTenantSelectorState = atom({
  key: "openTenantSelectorState",
  default: false,
});

export const openEditModalTenantState = atom({
  key: "openEditModalTenantState",
  default: false,
});

export const tenantsQuery = selector({
  key: "tenantsQuery",
  get: async ({ get }) => {

    return tenantsQueryDao();
  },
});

export const currentTenantIdState = atomFamily({
  key: "currentTenantIdState",
  default: 0,
});

export const tenantQuery = selectorFamily({
  key: "tenantQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentTenantIdState(editContext));
    if (id === 0) return newTenantDefault;
    return tenantQueryDao(id);
  },
});
