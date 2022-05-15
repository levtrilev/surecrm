import { atom } from "recoil";
// import { sectionId, tenantId } from "../../shared/appConsts";
// import { custCategQueryDao, custCategsQueryDao } from "./customerCategDao";

export const emailPassDefault: EmailPassType = {
  email: "",
  pass: "",
};
export const emailPassState = atom({
  key: "emailPassState",
  default: emailPassDefault,
});
export const tokenState = atom({
  key: "tokenState",
  default: "",
});

export const userSectionTenantDefault: UserSectionTenantType = {
  user_id: 5,
  user_name: "web_anon",
  section_id: 3,
  section_name: "web_anon",
  tenant_id: 3,
  tenant_name: "web_anon",
};

export const userSectionTenantState = atom({
  key: "userSectionTenantState",
  default: userSectionTenantDefault,
});