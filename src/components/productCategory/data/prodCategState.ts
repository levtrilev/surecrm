import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import { prodCategQueryDao, prodCategsQueryDao } from "./prodCategDao";

export const newProdCategDefault: ProductCategoryType = 
{
  id: 0,
  name: '',
  section_id: tenantId,
  tenant_id: sectionId,
};

export const newProdCategState = atom({
  key: "newProdCategState",
  default: newProdCategDefault,
});

export const currentProdCategIdState = atomFamily({
  key: "currentProdCategIdState",
  default: 0,
});

export const currentProdCategState = atom({
  key: "currentProdCategState",
  default: {id: 0, name: ''},
});

export const openProdCategSelectorState = atom({
  key: "openProdCategSelectorState",
  default: false,
});

export const openEditModalProdCategState = atom({
  key: "openEditModalProdCategState",
  default: false,
});

export const prodCategsQuery = selector({
  key: "prodCategsQuery",
  get: async ({ get }) => {
    return prodCategsQueryDao();
  },
});

export const prodCategQuery = selectorFamily({
  key: "prodCategQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentProdCategIdState(editContext));
    if (id === 0) return newProdCategDefault;
    return prodCategQueryDao(id);
  },
});