import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { tenantId, userLogin } from "../../../shared/appConsts";
import {
  userQueryDao,
  usersFullQueryDao,
  usersQueryDao,
} from "./userDao";

export const newUserDefault: UserType = {
  id: 0,
  name: "",
  blocked: false,
  user_login: userLogin,
  tenant_id: tenantId,
};

export const newUserState = atom({
  key: "newUserState",
  default: newUserDefault,
});

export const openUserSelectorState = atom({
  key: "openUserSelectorState",
  default: false,
});

export const openEditModalUserState = atom({
  key: "openEditModalUserState",
  default: false,
});

export const usersQuery = selector({
  key: "usersQuery",
  get: async ({ get }) => {
    return usersQueryDao();
  },
});


export const usersFullQuery = selector({
  key: "usersFullQuery",
  get: async ({ get }): Promise<UserFullType[]> => {
    return usersFullQueryDao();
  },
});

export const currentUserIdState = atomFamily({
  key: "currentUserIdState",
  default: 0,
});

export const currentUserTenantIdState = atomFamily({
  key: "currentUserTenantIdState",
  default: tenantId,
});

export const userQuery = selectorFamily({
  key: "userQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentUserIdState(editContext));
    if (id === 0) return newUserDefault;
    return userQueryDao(id);
  },
});