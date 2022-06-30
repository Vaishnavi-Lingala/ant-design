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

export interface ControlName {
  x: number;
  deleted: boolean;
  line: string;
  action_type: number;
  wait_time: number;
  rect: string;
  flt: string;
  rect_name: string;
  action_name: string;
  wrdname: string;
  force: boolean;
  id: number;
  udf: string;
  ord: number;
  block: string;
  template_id: number;
  txvalue: string;
  para: string;
  txname: string;
  y: number;
}

export interface Template {
  file_path: string;
  operator_value: number;
  url: string;
  check_window: string;
  logo: string;
  deleted: boolean;
  path: string;
  retry_count: number;
  app_id: string;
  udf: string;
  display: boolean;
  single_instance: boolean;
  published_app_name: string;
  desktop_args: string;
  app_name: string;
  app_type_name: string;
  wait_time: number;
  template_type_name: string;
  template_type: number;
  display_name: string;
  app_type: number;
  id: number;
  launch_required: boolean;
  domain: string;
  window_title: string;
  browserapp: string;
  operator_value_name: string;
}

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
