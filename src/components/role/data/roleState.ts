import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { tenantId } from "../../../shared/appConsts";
import { roleUsersFullQueryDao, roleUsersQueryDao, roleQueryDao, rolesFullQueryDao, rolesQueryDao } from "./roleDao";

export const newRoleDefault: RoleType = {
  id: 0,
  name: "",
  blocked: false,
  description: "",
  tenant_id: tenantId,
};

export const newRoleUsersDefault: RoleUsersType = {
  id: 0,
  role_id: 0,
  user_id: 0,
  tenant_id: tenantId,
};

export const newRoleState = atom({
  key: "newRoleState",
  default: newRoleDefault,
});

export const rolesQuery = selector({
  key: "rolesQuery",
  get: async ({ get }) => {
    return rolesQueryDao();
  },
});

export const rolesFullQuery = selector({
  key: "rolesFullQuery",
  get: async ({ get }): Promise<RoleFullType[]> => {
    return rolesFullQueryDao();
  },
});

export const currentRoleIdState = atomFamily({
  key: "currentRoleIdState",
  default: 0,
});

export const roleQuery = selectorFamily({
  key: "roleQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentRoleIdState(editContext));
    return roleQueryDao(id);
  },
});

export const roleUsersQuery = selectorFamily({
  key: "roleUsersQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentRoleIdState(editContext));
    return roleUsersQueryDao(id);
  },
});

export const roleUsersFullQuery = selectorFamily({
  key: "roleUsersFullQuery",
  get: (editContext: string) => async ({ get }) => {
    const id = get(currentRoleIdState(editContext));
    return roleUsersFullQueryDao(id);
  },  
});

