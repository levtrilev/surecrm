import { atom } from "recoil";
// import { sectionId, tenantId } from "../../shared/appConsts";
// import { custCategQueryDao, custCategsQueryDao } from "./customerCategDao";

export const emailPassDefault: EmailPassType = 
{
  email: '',
  pass: '',
};
export const emailPassState = atom({
  key: "emailPassState",
  default: emailPassDefault,
});
export const tokenState = atom({
    key: "tokenState",
    default: '',
  });