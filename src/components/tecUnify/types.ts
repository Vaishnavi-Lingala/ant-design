import { FormItemProps, InputNumberProps, RadioProps, SelectProps } from "antd";
import { FormItemInputProps } from "antd/lib/form/FormItemInput";
import { ValidateMessages } from "rc-field-form/lib/interface";

export type Domains = string[];

export interface AppList {
  active: (MasterTemplate | ConfiguredTemplate)[];
  inactive: (MasterTemplate | ConfiguredTemplate)[];
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
  active: boolean
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
  render: JSX.Element
}

type FormItem = FormItemProps | FormItemInputProps |
  RadioProps | SelectProps | InputNumberProps | HeadingProps | CustomRenderProps;

export interface FormArgs {
  formTitle: string;
  validationMessages?: ValidateMessages;
  formItems: FormItem[];
}

export interface TimeoutOptions {
  FIFTEEN_MINUTES: string;
  FIVE_MINUTES: string;
  NINETY_MINUTES: string;
  ONE_TWENTY_MINUTES: string;
  SIXTY_MINUTES: string;
  TEN_MINUTES: string;
  THIRTY_MINUTES: string;
}

export interface FilterType {
  activity: string;
  search?: string;
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
