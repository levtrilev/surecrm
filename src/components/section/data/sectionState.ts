import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { tenantId } from "../../../shared/appConsts";
import { sectionQueryDao, sectionsFullQueryDao, sectionsQueryDao } from "./sectionDao";

export const newSectionDefault: SectionType = 
{
  id: 0,
  name: '',
  blocked: false,
  tenant_id: tenantId,
};
export const newSectionState = atom({
  key: "newSectionState",
  default: newSectionDefault,
});

export const openSectionSelectorState = atom({
  key: "openSectionSelectorState",
  default: false,
});

export const openEditModalSectionState = atom({
  key: "openEditModalSectionState",
  default: false,
});

export const sectionsQuery = selector({
  key: "sectionsQuery",
  get: async ({ get }) => {
    return sectionsQueryDao();
  },
});

export const currentSectionIdState = atomFamily({
  key: "currentSectionIdState",
  default: 0,
});

export const sectionsFullQuery = selector({
  key: "sectionsFullQuery",
  get: async ({ get }): Promise<SectionFullType[]> => {
    return sectionsFullQueryDao();
  },
});

export const sectionQuery = selectorFamily({
  key: "sectionQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentSectionIdState(editContext));
    if (id === 0) return newSectionDefault;
    return sectionQueryDao(id);
  },
});
