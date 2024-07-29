import { Tree } from "antd";
import { DataNode } from "antd/es/tree";
import { TreeNodeProps } from "antd/lib";
import React, { useEffect, useState } from "react";

interface Permission {
  label: string;
  id: string;
  children?: Permission[];
}

interface PermissionGroupProps {
  permission: [];
  checkedPermission?: string[];
  onCheckChange: (
    checked: string[],
    indeterminate: string[],
    node: TreeNodeProps
  ) => void;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({
  permission,
  checkedPermission = [],
  onCheckChange
}) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(checkedPermission);
  // Function to map permission data to include key dynamically
  const mapKeys: string[] = [];
  const mapPermissionData = (data: Permission[]): DataNode[] => {
    return data.map(item => {
      mapKeys.push(item.id);
      return {
        key: item.id,
        title: item.label,
        children: item.children ? mapPermissionData(item.children) : []
      };
    });
  };

  const mappedPermission = mapPermissionData(permission);
  const nodeCheckedKeys = checkedKeys.filter(key => mapKeys.includes(key));

  useEffect(() => {
    setCheckedKeys(checkedPermission);
  }, [checkedPermission]);

  const handleCheck = (checkKeys: any, info: any) => {
    onCheckChange(checkKeys, info.halfCheckedKeys, info.node);
  };

  return (
    <Tree
      checkable
      defaultExpandedKeys={[10000, 20000]}
      checkedKeys={nodeCheckedKeys}
      onCheck={handleCheck}
      treeData={mappedPermission}
    />
  );
};

export default PermissionGroup;
