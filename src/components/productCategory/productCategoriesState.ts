import { atom, selector } from "recoil";
import { DOMAIN, sectionId, tenantId } from "../../shared/appConsts";

const newProdCategDefault: ProductCategoryType = 
{
  id: 0,
  name: '',
  section_id: tenantId,
  tenant_id: sectionId,
};
// export const newProdCategState = atom({
//   key: "newProdCategState",
//   default: newProdCategDefault,
// });

export const currentProdCategIdState = atom({
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

export const prodCategsQuery = selector({
  key: "prodCategsQuery",
  get: async ({ get }) => {

    const response = await fetch(
      `${DOMAIN}/product_categories`
    );
    const categories = await response.json();
    if (response.status !== 200) {
      console.log(`Bad HTTP request status ${response.status}`);
    }
    return categories;
  },
});

export const prodCategQuery = selector({
  key: "prodCategQuery",
  get: async ({ get }) => {
    const id = get(currentProdCategIdState);
    if (id === 0) return newProdCategDefault;
    const response = await fetch(
      `${DOMAIN}/product_categories?id=eq.${id}`
    );
    const product_category = await response.json();
    if (response.status !== 200) {
      console.log(`Bad HTTP request status ${response.status}`);
    }
    if (product_category.length === 1) {
      return product_category[0];
    } else {
      console.log('if (product_category.length === 1)', 'false');
      return null;
    }
  },
});