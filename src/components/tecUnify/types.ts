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
