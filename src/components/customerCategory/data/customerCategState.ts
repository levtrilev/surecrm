import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import { custCategQueryDao, custCategsQueryDao } from "./customerCategDao";

export const newCustCategDefault: CustomerCategoryType = 
{
  id: 0,
  name: '',
  section_id: tenantId,
  tenant_id: sectionId,
};
export const newCustCategState = atom({
  key: "newCustCategState",
  default: newCustCategDefault,
});

export const openCustCategSelectorState = atom({
  key: "openCustCategSelectorState",
  default: false,
});

export const openEditModalCustCategState = atom({
  key: "openEditModalCustCategState",
  default: false,
});

export const custCategsQuery = selector({
  key: "custCategsQuery",
  get: async ({ get }) => {

    return custCategsQueryDao();
  },
});

export const currentCustCategIdState = atomFamily({
  key: "currentCustCategIdState",
  default: 0,
});

export const custCategQuery = selectorFamily({
  key: "custCategQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentCustCategIdState(editContext));
    if (id === 0) return newCustCategDefault;
    return custCategQueryDao(id);
  },
});
