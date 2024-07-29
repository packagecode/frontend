export default interface Role {
  id?: number;
  key?: number;
  name: string;
  label: string;
  created_at?: string;
  updated_at?: string;
  permissions?: Array<string> | null;
}
