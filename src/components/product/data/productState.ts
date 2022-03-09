import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { sectionId, tenantId } from "../../../shared/appConsts";
import {
  // productFullQueryDao,
  productQueryDao,
  productsFullQueryDao,
  productsQueryDao,
} from "./productDao";

export const newProductDefault: ProductType = {
  name: "",
  id: 0,
  blocked: false,
  category_id: 0,
  tags: "",
  base_price: 0,
  vat: 0,
  section_id: tenantId,
  tenant_id: sectionId,
};
export const newProductState = atom({
  key: "newProductState",
  default: newProductDefault,
});

export const openProductSelectorState = atom({
  key: "openProductSelectorState",
  default: false,
});

export const productsQuery = selector({
  key: "productsQuery",
  get: async ({ get }) => {
    return productsQueryDao();
  },
});

export const productsFullQuery = selector({
  key: "productsFullQuery",
  get: async ({ get }) => {
    return productsFullQueryDao();
  },
});

export const productQuery = selectorFamily({
  key: "productQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentProductIdState(editContext));
    return productQueryDao(id);
  },
});

export const currentProductIdState = atomFamily({
  key: "currentProductIdState",
  default: 0,
});
