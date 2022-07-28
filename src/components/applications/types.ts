import { FormItemProps, InputNumberProps, RadioProps, SelectProps } from "antd";
import { ValidateMessages } from "rc-field-form/lib/interface";

// Type Predicate utility function
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#handbook-content
export function isPaginationType<T>(o: any): o is PaginationApiRes<T> {
  return 'next' in o;
}

// Type predicate to verify item passed is an array of type T 
// extending Array.isArray() a bit
export function isArray<T>(a: any | any[]): a is T[] {
  return Array.isArray(a);
}

export interface ConfiguredTemplate extends MasterTemplate {
  account_id: number,
  template_master_id: number
}

export interface MasterTemplate {
  id: number,
  uid: string,
  name: string,
  template_type: string,
  template: JSON,
  active: boolean,
  app_img_url: string
}

export interface ApiResError {
  errorCauses: string[];
  errorCode: string;
  errorSummary: string;
}

interface HeadingProps {
  label: string;
  type: 'heading';
}

interface CustomRenderProps {
  type: 'custom';
  render: JSX.Element;
  key: string;
}

export type FormItem = CustomRenderProps | FormItemProps | RadioProps | SelectProps | InputNumberProps | HeadingProps;

export interface FormArgs {
  formTitle: string;
  validationMessages?: ValidateMessages;
  formItems: FormItem[];
}

export interface FilterType {
  search: string;
  updated: boolean;
}

export interface PaginationApiRes<T> {
  items_on_page: number;
  items_per_page: number;
  next: string;
  page: number;
  previous: string;
  results: T[];
  total_items: number;
}

export interface User {
  account_id: string;
  uid: string;
  eula_accepted_date: string;
  idp_user_name: string;
  is_billing_contact: boolean;
  first_name: string;
  last_portal_login: string;
  status: string;
  user_dn: string;
  last_invite_accepted: string;
  is_portal_admin: boolean;
  last_invite_sent: string;
  upn: string;
  sourced_by: string;
  login_domain: string;
  last_login_ts: string;
  is_technical_contact: boolean;
  last_name: string;
  email: string;
  idp_user_id: string;
  is_shipping_contact: boolean;
  display_name: string;
  last_enroll_ts: string;
  sam: string;
  is_user_enrolled: boolean;
}

export interface Page {
  start: number;
  limit: number;
}
