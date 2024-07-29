import { Button as BaseButton, BaseInput, BaseModal } from "@/components";
import BasePassword from "@/components/core/BasePassword";
import RoleLazydropdown from "@/components/lazyDropdown/RoleLazydropdown";
import TerritoryLazydropdown from "@/components/lazyDropdown/TerritoryLazydropdown";
import PermissionModal from "@/components/permission/permissionModal";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import Role from "@/interface/Role";
import User from "@/interface/User";
import { Fragment, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface CreateUserProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentUser?: User;
  afterCreated?: (user: User) => void;
  afterUpdated?: (user: User) => void;
  onRoleUpdate?: (roles: Role[]) => void;
  onClose?: () => void;
}

const initialFormData = {
  name: "",
  code: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
  address: "",
  gender: "",
  territory_id: [] as number[] | number,
  active: true,
  is_report: false
};

const genderArray = [
  {
    label: "m",
    value: "Male"
  },
  {
    label: "f",
    value: "Female"
  },
  {
    label: "o",
    value: "Others"
  }
];

const CreateUser: React.FC<CreateUserProps> = ({
  visible = false,
  isUpdate = false,
  currentUser = {} as User,
  afterCreated = () => {},
  afterUpdated = () => {},
  onRoleUpdate = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePermission, setVisiblePermission] = useState<boolean>(false);
  const [checkedPermission, setCheckedPermission] = useState<string[]>([]);
  const [roles, setRoles] = useState<number[]>([]);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [feedback, setFeedback] = useState({
    email: "",
    password: "",
    phone: ""
  });
  const [formData, setFormData] = useState(initialFormData);
  const [tempRoles, setTempRoles] = useState<Role[]>([]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "active" || e.target.name === "is_report") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    onClose();
    setFeedback({ email: "", password: "", phone: "" });
    setValidated(false);
    setCheckedPermission([]);
    setFormData(initialFormData);
    setRoles([]);
    if (isUpdate && onRoleUpdate) {
      onRoleUpdate(tempRoles);
      setTempRoles([]);
    }
  };

  const handleModalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if ((event.currentTarget as HTMLFormElement).checkValidity() === false) {
      const newFeedback: { [key: string]: string } = { ...feedback };
      if (!formData.email) newFeedback.email = "Please provide a valid email";
      if (!formData.password)
        newFeedback.password = "Please provide a password";
      setFeedback({ ...feedback, ...newFeedback });
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      if (isUpdate) {
        await handleUpdateUsers();
      } else {
        const response = await axiosInstance.post(api("/users"), formData);
        const userId = response.data.user.id;

        await Promise.all([
          ...checkedPermission.map((permission: any) =>
            axiosInstance.post(api(`/users/${userId}/permissions`), {
              permission_id: permission
            })
          ),
          ...roles.map((role: number) =>
            axiosInstance.post(api(`/users/${userId}/roles`), { role_id: role })
          )
        ]);

        const responseUser = await axiosInstance.get(api(`/users/${userId}`));
        afterCreated(responseUser.data.user);
        showToast("success", "Successfully Created");
        handleModalClose();
      }
    } catch (error: any) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsers = async () => {
    const inputs: { [key: string]: any } = { ...formData };
    if (!inputs.password) {
      ["password", "password_confirmation"].forEach(key => delete inputs[key]);
    }

    try {
      const response = await axiosInstance.put(
        api(`/users/${currentUser.id}`),
        inputs
      );
      const { user } = response.data;
      afterUpdated({ ...user, key: user.id });
      showToast("success", "Successfully Updated");
      handleModalClose();
    } catch (error: any) {
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error: any) => {
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors;
      const newFeedback: { [key: string]: string } = { ...feedback };
      Object.keys(errorMessages).forEach((key: string) => {
        newFeedback[key] = errorMessages[key][0];
      });
      setFeedback({ ...feedback, ...newFeedback });
    }
  };

  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (
      (name === "password" &&
        formData.password_confirmation &&
        e.target.value === formData.password_confirmation) ||
      (name === "password_confirmation" &&
        formData.password &&
        e.target.value === formData.password)
    ) {
      setFeedback({
        ...feedback,
        password: ""
      });
    } else {
      setFeedback({
        ...feedback,
        password: "Password does not match"
      });
    }
  };

  const handleFormReset = () => {
    setFeedback({ email: "", password: "", phone: "" });
    setValidated(false);
    setCheckedPermission([]);
    setFormData(initialFormData);
    setRoles([]);
  };

  const handleCheckedPermission = (checkedPermission: string[]) => {
    setCheckedPermission(checkedPermission);
  };

  const handleUpdatePermission = (updatePermission: any[]) => {
    if (isUpdate) {
      updatePermission.forEach(async permission => {
        if (permission.uncheck) {
          await axiosInstance.delete(
            api(`/users/${currentUser.id}/permissions/${permission.key}`)
          );
        } else if (permission.checked) {
          await axiosInstance.post(
            api(`/users/${currentUser.id}/permissions`),
            { permission_id: permission.key }
          );
        }
      });
    }
  };

  const handleAddedRole = async (newRoles: any, options: any) => {
    if (isUpdate) {
      const newRole = newRoles.find((item: any) => !roles.includes(item));

      if (newRole) {
        await axiosInstance.post(api(`/users/${currentUser.id}/roles`), {
          role_id: newRole
        });

        const selectedOption = options.find(
          (option: any) => option.value === newRole
        );
        if (selectedOption) {
          setTempRoles(prev => [...prev, selectedOption.item]);
        }
      }
    }
    setRoles(newRoles);
  };

  const handleRemoveRole = async (remove: any) => {
    if (isUpdate) {
      await axiosInstance.delete(
        api(`/users/${currentUser.id}/roles/${remove}`)
      );
      tempRoles.splice(
        tempRoles.findIndex((r: Role) => r.id == remove),
        1
      );
      setTempRoles(tempRoles);
    }
  };

  useEffect(() => {
    if (isUpdate && currentUser) {
      const roles: any = currentUser.roles?.map((role: Role) => role?.id);
      const permissions: any = currentUser.permissions?.map(
        (permission: any) => permission.id
      );

      setFormData({
        ...currentUser,
        password: "",
        password_confirmation: "",
        active: !!currentUser.active
      });
      setCheckedPermission(permissions);
      setRoles(roles);
      setTempRoles(currentUser?.roles ?? []);
    }
  }, [currentUser, isUpdate]);

  return (
    <Fragment>
      <BaseModal
        title={isUpdate ? "Update User" : "Create User"}
        width="lg"
        show={visible}
        onCancel={handleModalClose}
        footer={null}
        body={
          <div className="gy-3">
            <Form noValidate validated={validated} onSubmit={handleModalSubmit}>
              <Row>
                <Col xl={6} className="mt-0">
                  <BaseInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    placeholder="e.g. John Doe"
                    required
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BaseInput
                    label="Code"
                    name="code"
                    value={formData.code}
                    placeholder="e.g. JHND"
                    required
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BaseInput
                    label="Email"
                    name="email"
                    value={formData.email}
                    placeholder="e.g. john@email.com"
                    required
                    feedback={feedback.email}
                    isInvalid={!!feedback.email}
                    autoComplete="username"
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BasePassword
                    name="password"
                    suffix
                    required={!isUpdate}
                    value={formData.password ?? ""}
                    feedback={feedback.password}
                    isInvalid={!!feedback.password}
                    autoComplete="new-password"
                    onChange={changeHandler}
                    onInput={checkPassword}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BasePassword
                    label="Confirm Password"
                    name="password_confirmation"
                    suffix
                    value={formData.password_confirmation ?? ""}
                    required={!isUpdate}
                    autoComplete="new-password"
                    onChange={changeHandler}
                    onInput={checkPassword}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BaseInput
                    label="Phone No (Optional)"
                    name="phone"
                    value={formData.phone}
                    placeholder="e.g. 1234567890"
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <BaseInput
                    label="Address (Optional)"
                    name="address"
                    value={formData.address}
                    placeholder="e.g. 1234 Main St"
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <Form.Label htmlFor="" className="form-label text-default">
                    Gender (Optional)
                  </Form.Label>
                  <Form.Select
                    name="gender"
                    defaultValue={formData.gender}
                    onChange={(e: any) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {genderArray.map((label, value) => {
                      return (
                        <option key={value} value={label.label}>
                          {label.value}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                <Col xl={6} className="mt-0">
                  <TerritoryLazydropdown
                    label="Territory"
                    name="territory_id"
                    value={formData.territory_id}
                    onChange={(e: any) =>
                      setFormData({ ...formData, territory_id: e })
                    }
                  />
                </Col>
                <Col xl={6} className="mt-0">
                  <RoleLazydropdown
                    label="Roles (Optional)"
                    name="roles"
                    multiple
                    value={roles}
                    onChange={handleAddedRole}
                    onRemoveTag={handleRemoveRole}
                  />
                </Col>
                <Col xl={6} className="mt-3">
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    label="Active"
                    name="active"
                    checked={formData.active ? true : false}
                    onChange={changeHandler}
                  />
                  <Form.Check
                    type="switch"
                    id="report-switch"
                    label="Available on Report"
                    name="is_report"
                    checked={formData.is_report ? true : false}
                    onChange={changeHandler}
                  />
                </Col>
                <Col xl={6} className="d-grid mt-3">
                  <Form.Label
                    htmlFor="permission"
                    className="form-label text-default"
                  >
                    Permission (Optional)
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
                  {!isUpdate && (
                    <BaseButton
                      variant="outline-warning"
                      type="button"
                      size="sm"
                      className="float-end btn-wave"
                      onClick={handleFormReset}
                    >
                      Reset
                    </BaseButton>
                  )}
                </Col>
              </Row>
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

export default CreateUser;
