export type App = Config & Template;

export interface AppList {
  active: App[];
  inactive: App[];
}

export interface FilterType {
  activity: string;
  search: string;
  updated: boolean;
}

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
  creadted_ts: Date; // Date object?
  update_ts: Date;
  logo: string; // byte array?
  deleted: boolean;
  mfa: number;
  display: boolean;
  name: string;
  name_ex: string;
  path: string;
};

export interface Config {
  min2tray: boolean;
  tab_name: string;
  signalR_command: string;
  tap_out_activity: string;
  rfid_reader: string;
  tecverify_url: string;
  sequence_launch_flag: boolean;
  pic_path: string;
  tap_seq: string;
  browser_session_flag: boolean;
  tenant_url: string;
  install_token: string;
  memo: string;
  remember_me_flag: boolean;
  kiosk: boolean;
  ocr_words: string;
  ocr_PageSegmentationMode: string;
  config_deleted: boolean;
  xref_id: number;
  udf: string;
  ocr_EngineMode: string;
  ocr_TesseractVersion: string;
  theme: string;
  xref_deleted: boolean;
  signalR_user: string;
  app_idle_time: number;
  ocr_path: string;
  active: boolean;
  delay_loop: number;
  template_id: number;
  auto_launch_flag: boolean;
  signalR_end_point: string;
  ad_intergrated: boolean;
  config_id: number;
  min_browser: boolean;
  ocr_fast: string;
  tap_seq_name: string;
  pipe_name: string;
  signalR_reg_code: string;
  debug: boolean;
  account_id: number;
  signalR_hub: string;
}

export interface PaginationApiRes {
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

export interface Page {
  current: number;
  limit: number;
}

export function isUser(item: any): item is User {
  return(item as User).email !== undefined;
}

export function isApp(item: any): item is App {
  return (
    ((item as App).config_id !== undefined) &&
    ((item as App).xref_id !== undefined)
  );
}
