import Role from "./Role";
import Territory from "./Territory";

export default interface User {
  id: number;
  name: string;
  code: string;
  email: string;
  email_verified_at: string;
  phone: string;
  address: string;
  active: number;
  is_owner: number;
  gender: string;
  territory_id: number;
  created_at: string;
  updated_at: string;
  territory: Territory | null;
  roles: Role[] | null;
  device_id: string | null;
  permissions: Array<string> | null;
  managed_territory: number | null;
  propic_url: string | null;
  is_report: boolean;
  last_time_login?: string;
  app_version?: string;
}
