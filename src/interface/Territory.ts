import TerritoryType from './TerritoryType';
import User from './User';

export default interface Territory {
  id?: number;
  name: string;
  code: string;
  territory_type_id: number | null;
  org_id?: number;
  parent_id: number | null;
  parent?: Territory|null;
  managed_by: number | null;
  managers?: User[];
  manager_name?: string | null;
  territory_type?: TerritoryType;
}
