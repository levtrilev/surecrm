type PostsType = PostType[] | null;
  
interface Action {
  type: string;
  payload: PostType[] | null;
}

interface PostType {
  title: string;
  userId: number;
  body: string;
  id: number;
}

interface ProductType {
  id: number;
  name: string;
  blocked: boolean;
  category_id: number;
  tags: string;
  base_price: number;
  vat: number;
  description: string;
  section_id: number;
  tenant_id: number;
}

interface ProductFullType {
  id: number;
  name: string;
  blocked: boolean;
  category_id: number;
  tags: string;
  base_price: number;
  vat: number;
  description: string;
  section_id: number;
  tenant_id: number;
  product_categories: ProductCategoryType;
}

interface ProductCategoryType {
  id: number;
  name: string;
  section_id: number;
  tenant_id: number;
}

interface OrderType {
  id: number;
  name: string;
  number: string;
  date: Date;
  customer_id: number;
  total_amount: number;
  deleted: boolean;
  description: string;
  section_id: number;
  tenant_id: number;
}

interface OrderFullType {
  id: number;
  name: string;
  number: string;
  date: Date;
  customer_id: number;
  total_amount: number;
  deleted: boolean;
  description: string;
  section_id: number;
  tenant_id: number;
  customers: CustomerType;
}

interface OrderProductsType {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  item_price: number;
  line_price_total: number;
  discount_percent: number;
  line_total: number;
  line_total_vat: number;
  weight: number;
  volume: number;
  section_id: number;
  tenant_id: number;
}

interface OrderProductsFullType {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  item_price: number;
  line_price_total: number;
  discount_percent: number;
  line_total: number;
  line_total_vat: number;
  weight: number;
  volume: number;
  section_id: number;
  tenant_id: number;
  products: ProductType;
}

interface CustomerType {
  id: number;
  name: string;
  blocked: boolean;
  category_id: number;
  section_id: number;
  tenant_id: number;
}

interface CustomerFullType {
  id: number;
  name: string;
  blocked: boolean;
  category_id: number;
  section_id: number;
  tenant_id: number;
  customer_categories: CustomerCategoryType;
}

interface CustomerCategoryType {
  id: number;
  name: string;
  section_id: number;
  tenant_id: number;
}

type counter_one = number;
type counter_two = number;
type counter_three = number | null;

interface DocDataType { 
  id: number;
  lastName: string; 
  firstName: string;
  age: number;
}

type HandleOpenModal = () => void;
type SetOpenModal = (boolean) => void;