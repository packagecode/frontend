export default interface DepartmentType {
  id?: number;
  key?: number;
  name: string;
  label: string;
  has_outlet: boolean;
  self_managed: boolean;
  created_at?: string;
  updated_at?: string;
}
