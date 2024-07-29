import { BaseModal } from "@/components";
import PermissionGroup from "@/components/permission/PermissionGroup";
import { EncryptDataTypes } from "@/enums/EncryptDataTypes";
import useEncrypt from "@/hooks/useEncrypt";
import useSokrioActions from "@/hooks/useSokrioActions";
import Permission from "@/interface/Permission";
import { Card, Col } from "react-bootstrap";

interface PermissionModalProps {
  visible?: boolean;
  isUpdate?: boolean;
  isForSetupWizard?: boolean;
  checkedPermission?: string[];
  onCheckedPermission?: (checkedPermission: string[]) => void;
  onUpdatePermission?: (updatePermission: any) => void;
  onClose?: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible = false,
  isUpdate = false,
  isForSetupWizard = false,
  checkedPermission = [],
  onCheckedPermission = () => {},
  onUpdatePermission = () => {},
  onClose = () => {}
}) => {
  const { permissionGroup } = useSokrioActions();
  const { decryptData } = useEncrypt();
  const isValueInRootSeries = (value: number): boolean => {
    return [10000, 20000, 30000].some(
      start => value >= start && value < start + 10000
    );
  };

  const addPermission = (permissionIds: any[]) => {
    const newCheckedPermission = Array.from(
      new Set([...checkedPermission, ...permissionIds])
    );
    onCheckedPermission(newCheckedPermission);
    if (isUpdate && !isForSetupWizard) {
      const allNewPermissions: any[] = [];
      permissionIds.forEach(permissionId => {
        allNewPermissions.push({
          key: permissionId,
          uncheck: false,
          checked: true
        });
      });

      onUpdatePermission(allNewPermissions);
    }
  };

  const removePermissions = (permissionsToRemove: string[]) => {
    const newCheckedPermission = checkedPermission.filter(
      permission => !permissionsToRemove.includes(permission)
    );
    onCheckedPermission(newCheckedPermission);
    if (isUpdate && !isForSetupWizard) {
      const allRemovePermissions: any[] = [];
      permissionsToRemove.forEach(permissionId => {
        allRemovePermissions.push({
          key: permissionId,
          uncheck: true,
          checked: false
        });
      });

      onUpdatePermission(allRemovePermissions);
    }
  };

  const getDependentPermission = (
    permissionFor: string,
    allPermissionArray: Permission[]
  ): string | null => {
    const dependentPermission = allPermissionArray.find(permission => {
      const permissionLabel = permission.label.split(" ");
      const permissionType = permissionLabel[0];
      const permissionName = permissionLabel.slice(1).join(" ");

      return (
        (permissionType === "View" && permissionName === permissionFor) ||
        (permission.label === "Update Setting" &&
          permissionFor === "Settings") ||
        (permission.name === "createLeave" && permissionFor === "createLeave")
      );
    });

    //@ts-expect-error - TS2532: Object is possibly 'null'.
    return dependentPermission ? dependentPermission.id : null;
  };

  const handleCheckChange = (
    checked: string[],
    indeterminate: string[],
    node: any
  ) => {
    const localPermissions = localStorage.getItem(
      EncryptDataTypes.ALL_PERMISSIONS_KEY
    );
    const allPermissionArray: Permission[] = JSON.parse(
      localPermissions ? decryptData(localPermissions) : "[]"
    );

    if (indeterminate && checked && !node.checked) {
      const newPermissions = checked.filter(
        (check: any) =>
          !checkedPermission.includes(check) && !isValueInRootSeries(check)
      );
      const allNewPermissions: string[] = [];
      newPermissions.forEach(permissionId => {
        let dependentPerId: string | null = null;
        allNewPermissions.push(permissionId);
        if (node.children.length === 0) {
          const permissionFor = node.title.split(" ").slice(1).join(" ");
          if (
            ["Create", "Update", "Delete"].includes(node.title.split(" ")[0]) ||
            permissionFor === "Settings"
          ) {
            const dependentPermission = getDependentPermission(
              permissionFor,
              allPermissionArray
            );
            if (
              dependentPermission &&
              !checkedPermission.includes(dependentPermission)
            ) {
              dependentPerId = dependentPermission;
            }
          }
        }
        if (dependentPerId) {
          allNewPermissions.push(dependentPerId);
        }
      });
      addPermission(Array.from(new Set(allNewPermissions)));
    } else if (node.checked) {
      const permissionsToRemove = [];
      if (node.children.length > 0) {
        node.children.forEach((child: any) => {
          if (checkedPermission.includes(child.key)) {
            permissionsToRemove.push(child.key);
          }
        });
      } else {
        if (checkedPermission.includes(node.key)) {
          permissionsToRemove.push(node.key);
        }
      }
      removePermissions(permissionsToRemove);
    }
  };

  return (
    <BaseModal
      title={isUpdate ? "Update Permission" : "Add New Permission"}
      show={visible}
      onCancel={onClose}
      footer={null}
      width={780}
      body={
        <div className="row gy-3">
          {permissionGroup().map((permission: any, index: number) => (
            <Col sm={6} className="mt-0" key={index}>
              <Card className="custom-card">
                <Card.Body>
                  <PermissionGroup
                    permission={permission}
                    checkedPermission={checkedPermission}
                    onCheckChange={handleCheckChange}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      }
    />
  );
};

export default PermissionModal;
