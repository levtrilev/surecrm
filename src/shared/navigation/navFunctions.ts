import { NavigateFunction } from "react-router-dom";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactsIcon from "@mui/icons-material/Contacts";
import DescriptionIcon from "@mui/icons-material/Description";
import DraftsIcon from "@mui/icons-material/Drafts";

export const settings_bak = ["Profile", "Account", "Dashboard", "Logout"];
export const settings = ["Users", "Tenants", "Sections", "Roles"];
export const pages = [
  "Products",
  "Customers",
  "Orders",
  "Customer categ",
  "Product categ",
  "Products_",
  "Customers_",
  "Orders_",
  "Posts",
];
export const navSvgIcons = [
  ProductionQuantityLimitsIcon,
  ContactsIcon,
  DraftsIcon,
  AccountCircleIcon,
  DescriptionIcon,
  InboxIcon,
  InboxIcon,
  MailIcon,
  AccountCircleIcon,
  DraftsIcon,
];

export const handleMenuItemClick = (
  navigate: NavigateFunction,
  event: React.MouseEvent<HTMLElement>,
  index: number
) => {
  switch (index) {
    case 0:
      navigate("/products", { replace: true });
      break;
    case 1:
      navigate("/customers", { replace: true });
      break;
    case 2:
      navigate("/orders", { replace: true });
      break;
    case 3:
      navigate("/customer_categs", { replace: true });
      break;
    case 4:
      navigate("/prod_categs", { replace: true });
      break;
    case 5:
      navigate("/_products", { replace: true });
      break;
    case 6:
      navigate("/_customers", { replace: true });
      break;
    case 7:
      navigate("/_orders", { replace: true });
      break;
    case 8:
      navigate("/posts", { replace: true });
      break;
    default:
      navigate("/", { replace: true });
  }
};
