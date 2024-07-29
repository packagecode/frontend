import { BaseInput, BaseModal } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import DepartmentType from "@/interface/DepartmentType";
import { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

interface CreateDepartmentTypeProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentDepartmentType?: DepartmentType;
  afterCreated?: (department_type: DepartmentType) => void;
  afterUpdated?: (department_type: DepartmentType) => void;
  onClose?: () => void;
}

const CreateDepartmentType: React.FC<CreateDepartmentTypeProps> = ({
  visible = false,
  isUpdate = false,
  currentDepartmentType = {} as DepartmentType,
  afterCreated = () => {},
  afterUpdated = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [department_typeFeedback, setDepartmentTypeFeedback] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    channel_type: "",
    has_outlet: false,
    self_managed: false,
  });
  const { name, label, has_outlet, self_managed, channel_type } = formData;
  const [modalTitle, setModalTitle] = useState<string>("Add New Channel");

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    setFormData({ ...formData, [name]: type === 'radio' ? value : value });
  };

  const handleModalClose = () => {
    onClose();
    setDepartmentTypeFeedback("");
    setValidated(false);
    setFormData({ name: "", label: "", has_outlet: false, self_managed: false, channel_type: "" });
  };

  const submitForm = async (url: string, method: "post" | "patch") => {
    setLoading(true);

    await axiosInstance[method](api(url), {
      name,
      label,
      has_outlet: channel_type === "has_outlet",
      self_managed: channel_type === "self_managed"
    })
      .then(response => {
        const { departmentType } = response.data;
        if (isUpdate) {
          afterUpdated({ ...departmentType, key: departmentType.id });
          showToast("success", "Successfully Updated");
        } else {
          afterCreated({ ...departmentType, key: departmentType.id });
          showToast("success", "Successfully Created");
        }
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setDepartmentTypeFeedback(error.response.data.errors.name[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if ((event.currentTarget as HTMLFormElement).checkValidity() === false) {
      setDepartmentTypeFeedback("Please enter a channel name");
      setValidated(true);
      return;
    }

    const url = isUpdate ? `/department-types/${currentDepartmentType.id}` : "/department-types";
    const method = isUpdate ? "patch" : "post";

    await submitForm(url, method);
  };

  useEffect(() => {
    if (visible) {
      if (isUpdate && currentDepartmentType) {
        setFormData({
          name: currentDepartmentType.name,
          label: currentDepartmentType.label,
          has_outlet: currentDepartmentType.has_outlet,
          self_managed: currentDepartmentType.self_managed,
          channel_type: currentDepartmentType.has_outlet
            ? "has_outlet"
            : currentDepartmentType.self_managed
            ? "self_managed"
            : "",
        });
        setModalTitle("Update Channel");
      } else {
        setFormData({ name: "", label: "", has_outlet: false, self_managed: false, channel_type: "" });
        setModalTitle("Add New Channel");
      }
    }
  }, [visible, isUpdate, currentDepartmentType]);

  return (
    <Fragment>
      <BaseModal
        title={modalTitle}
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
                  placeholder="e.g. Depo, Distributor, Dealer"
                  required
                  feedback={department_typeFeedback}
                  isInvalid={!!department_typeFeedback}
                  onChange={changeHandler}
                />
              </Col>
              <Col xl={12} className="mt-0">
                <BaseInput
                  label="Label"
                  name="label"
                  value={label}
                  placeholder="e.g. Some description"
                  required
                  onChange={changeHandler}
                />
              </Col>
              <Col xl={12} className="mt-2">
                <Form.Check
                  className="form-check-md d-flex align-items-center"
                  type="radio"
                  id="radio-is-outlet"
                  name="channel_type"
                  value="has_outlet"
                  checked={channel_type === "has_outlet"}
                  disabled={(isUpdate && (has_outlet || self_managed))}
                  onChange={changeHandler}
                  label="Outlet"
                />
                <p className="ml-5 text-muted fs-12 op-9">
                  If you mark this Channel as "Outlet", any department you create with this type, will be treated as "Outlet"
                </p>
              </Col>
              <Col xl={12} className="mt-0">
                <Form.Check
                  className="form-check-md d-flex align-items-center"
                  type="radio"
                  id="radio-self-managed"
                  name="channel_type"
                  value="self_managed"
                  checked={channel_type === "self_managed"}
                  disabled={(isUpdate && (has_outlet || self_managed))}
                  onChange={changeHandler}
                  label="Self Managed"
                />
                <p className="mb-2 ml-6 text-muted fs-12 op-9">
                  These types of departments are typically depos, godowns and low level warehouses. Will be ignored from sales transactions.
                </p>
              </Col>
              {!(isUpdate && (has_outlet || self_managed)) ? (
                <Col xl={12} className="mt-0">
                  <p className="mb-2 ml-6 text-danger fs-12 op-5">N.B. Type cannot be changed once selected.</p>
                </Col>
              ) : null}
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
    </Fragment>
  );
};

export default CreateDepartmentType;
