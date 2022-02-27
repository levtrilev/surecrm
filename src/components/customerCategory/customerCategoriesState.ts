import { atom, selector } from "recoil";
import { DOMAIN, sectionId, tenantId } from "../../shared/appConsts";


const newCustomerCategDefault: CustomerCategoryType = 
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

export const customerCategsQuery = selector({
  key: "customersCategsQuery",
  get: async ({ get }) => {

    const response = await fetch(
      `${DOMAIN}/customer_categories`
    );
    const categories = await response.json();
    if (response.status !== 200) {
      console.log(`Bad HTTP request status ${response.status}`);
    }
    return categories;
  },
});

export const customerCategQuery = selector({
  key: "customerCategQuery",
  get: async ({ get }) => {
    const id = get(currentCustomerCategIdState);
    if (id === 0) return newCustomerCategDefault;

    const response = await fetch(
      `${DOMAIN}/customer_categories?id=eq.${id}`
    );
    const customer_category = await response.json();
    if (response.status !== 200) {
      console.log(`Bad HTTP request status ${response.status}`);
    }
    if (customer_category.length === 1) {
      return customer_category[0];
    } else {
      console.log('if (customer_category.length === 1)', 'false');
      return null;
    }
  },
});