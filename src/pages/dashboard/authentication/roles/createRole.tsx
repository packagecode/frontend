import { Button as BaseButton, BaseInput, BaseModal } from "@/components";
import PermissionModal from "@/components/permission/permissionModal";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import Role from "@/interface/Role";
import { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

interface CreateRoleProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentRole?: Role;
  afterCreated?: (role: Role) => void;
  afterUpdated?: (role: Role) => void;
  onClose?: () => void;
}

const CreateRole: React.FC<CreateRoleProps> = ({
  visible = false,
  isUpdate = false,
  currentRole = {} as Role,
  afterCreated = () => {},
  afterUpdated = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePermission, setVisiblePermission] = useState<boolean>(false);
  const [checkedPermission, setCheckedPermission] = useState<string[]>([]);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [roleFeedback, setRoleFeedback] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    label: ""
  });
  const { name, label } = formData;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    onClose();
    setRoleFeedback("");
    setValidated(false);
    setCheckedPermission([]);
    setFormData({ name: "", label: "" });
  };

  const handleModalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if ((event.currentTarget as HTMLFormElement).checkValidity() === false) {
      setRoleFeedback("Please enter a role name");
      setValidated(true);
      return;
    }

    setLoading(true);

    if (isUpdate) {
      return handleUpdateRole();
    }

    await axiosInstance
      .post(api("/roles"), {
        name,
        label,
        permissions: checkedPermission
      })
      .then(response => {
        const { role } = response.data;
        afterCreated({ ...role, key: role.id });
        showToast("success", "Successfully Created");
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setRoleFeedback(error.response.data.errors.name[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateRole = async () => {
    await axiosInstance
      .put(api(`/roles/${currentRole.id}`), {
        name,
        label
      })
      .then(response => {
        const { role } = response.data;
        afterUpdated({ ...role, key: role.id });
        showToast("success", "Successfully Updated");
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setRoleFeedback(error.response.data.errors.name[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCheckedPermission = (checkedPermission: string[]) => {
    setCheckedPermission(checkedPermission);
  };

  const handleUpdatePermission = (updatePermission: any[]) => {
    if (isUpdate) {
      updatePermission.forEach(async permission => {
        if (permission.uncheck) {
          await axiosInstance.delete(
            api(`/roles/${currentRole.id}/permissions/${permission.key}`)
          );
        } else if (permission.checked) {
          await axiosInstance.post(
            api(`/roles/${currentRole.id}/permissions`),
            {
              permission_id: permission.key
            }
          );
        }
      });
    }
  };

  useEffect(() => {
    if (isUpdate && currentRole) {
      setFormData({
        name: currentRole.name,
        label: currentRole.label
      });
      const permissionIds =
        currentRole.permissions?.map((permission: any) => permission.id) || [];
      setCheckedPermission(permissionIds);
    }
  }, [currentRole, isUpdate]);

  return (
    <Fragment>
      <BaseModal
        title={isUpdate ? "Update Role" : "Create Role"}
        show={visible}
        onCancel={handleModalClose}
        footer={null}
        body={
          <div className="row gy-3">
            <Form noValidate validated={validated} onSubmit={handleModalSubmit}>
              <Col xl={12} className="mt-0">
                <BaseInput
                  label="Name"
                  name="name"
                  value={name}
                  placeholder="admin"
                  required
                  feedback={roleFeedback}
                  isInvalid={!!roleFeedback}
                  onChange={changeHandler}
                />
              </Col>
              <Col xl={12} className="mt-0">
                <BaseInput
                  label="Label"
                  name="label"
                  value={label}
                  placeholder="Administrator"
                  required
                  onChange={changeHandler}
                />
              </Col>
              <Col xl={12} className="d-grid mt-0">
                <Form.Label
                  htmlFor="permission"
                  className="form-label text-default"
                >
                  Permission
                  <span className="float-end text-warning">
                    {checkedPermission.length > 0 &&
                      `${checkedPermission.length} permissions selected`}
                  </span>
                </Form.Label>
                <BaseButton
                  type="button"
                  variant="secondary"
                  className="label-btn"
                  size="sm"
                  id="permission"
                  onClick={() => setVisiblePermission(true)}
                >
                  <i className="ri-settings-4-line label-btn-icon me-2"></i>
                  Permission
                </BaseButton>
              </Col>
              <Col xl={12} className="mt-4">
                <BaseButton
                  type="submit"
                  variant="outline-success"
                  size="sm"
                  className="me-1 btn-wave"
                  loading={loading}
                >
                  {isUpdate ? "Update" : "Save"}
                </BaseButton>
                <BaseButton
                  variant="outline-danger"
                  type="button"
                  size="sm"
                  onClick={handleModalClose}
                >
                  Close
                </BaseButton>
              </Col>
            </Form>
          </div>
        }
      />
      <PermissionModal
        visible={visiblePermission}
        isUpdate={isUpdate}
        onClose={() => setVisiblePermission(false)}
        checkedPermission={checkedPermission}
        onCheckedPermission={handleCheckedPermission}
        onUpdatePermission={handleUpdatePermission}
      />
    </Fragment>
  );
};

export default CreateRole;
