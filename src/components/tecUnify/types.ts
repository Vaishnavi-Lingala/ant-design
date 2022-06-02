export interface Template {
  id: number;
  app_id: string;
  display_name: string;
  template_type: number;
  url: string;
  wait_time: number;
  retry_count: number;
  window_title: string;
  check_window: string;
  operator_value: number;
  app_type: number;
  launch_required: boolean;
  desktop_args: string;
  single_instance: boolean;
  browserapp: string;
  substr: string;
  startidx: number;
  endidx: number;
  udf: string;
  creadted_ts: string; // Date object?
  update_ts: string;
  logo: string; // byte array?
  deleted: boolean;
  mfa: number;
  display: boolean;
  name: string;
  name_ex: string;
  path: string;
};

export interface ApiResponse {
  items_on_page: number;
  items_per_page: number;
  next: string;
  page: number;
  previous: string;
  results: User[];
  total_items: number;
}

export interface User {
  account_id: string;
  display_name: string;
  email: string;
  eula_accepted_date: string;
  first_name: string;
  idp_user_id: string;
  is_billing_contact: boolean;
  is_portal_admin: boolean;
  is_shipping_contact: boolean;
  is_techincal_contact: boolean;
  last_invite_accepted: string;
  last_invite_sent: string;
  last_name: string;
  last_portal_login: string;
  login_domain: string;
  login_user_name: string;
  sam: string;
  sourced_by: string;
  status: string;
  uid: string;
  upn: string;
  user_name: string;
}
