import { BaseInput, BaseModal } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import DepartmentLocationType from "@/interface/DepartmentLocationType";
import { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

interface CreateDepartmentLocationTypeProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentDepartmentLocationType?: DepartmentLocationType;
  afterCreated?: (departmentLocationType: DepartmentLocationType) => void;
  afterUpdated?: (departmentLocationType: DepartmentLocationType) => void;
  onClose?: () => void;
}

const CreateDepartmentLocationType: React.FC<CreateDepartmentLocationTypeProps> = ({
  visible = false,
  isUpdate = false,
  currentDepartmentLocationType = {} as DepartmentLocationType,
  afterCreated = () => {},
  afterUpdated = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [departmentLocationTypeFeedback, setDepartmentLocationTypeFeedback] = useState<string>("");
  const [formData, setFormData] = useState({
    name: ""
    });
  const { name } = formData;
  const [modalTitle, setModalTitle] = useState<string>("Add New Location Type");

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    onClose();
    setDepartmentLocationTypeFeedback("");
    setValidated(false);
    setFormData({ name: ""});
  };

  const submitForm = async (url: string, method: "post" | "patch") => {
    setLoading(true);

    await axiosInstance[method](api(url), {
      name
    })
      .then(response => {
        const { departmentLocationType } = response.data;
        if (isUpdate) {
          afterUpdated({ ...departmentLocationType, key: departmentLocationType.id });
          showToast("success", "Successfully Updated");
        } else {
          afterCreated({ ...departmentLocationType, key: departmentLocationType.id });
          showToast("success", "Successfully Created");
        }
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setDepartmentLocationTypeFeedback(error.response.data.errors.name[0]);
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
      setDepartmentLocationTypeFeedback("Please enter a location type name");
      setValidated(true);
      return;
    }

    const url = isUpdate ? `/department-location-types/${currentDepartmentLocationType.id}` : "/department-location-types";
    const method = isUpdate ? "patch" : "post";

    await submitForm(url, method);
  };

  useEffect(() => {
    if (visible) {
      if (isUpdate && currentDepartmentLocationType) {
        setFormData({
          name: currentDepartmentLocationType.name,
        });
        setModalTitle("Update Location Type");
      } else {
        setFormData({ name: "" });
        setModalTitle("Add New Location Type");
      }
    }
  }, [visible, isUpdate, currentDepartmentLocationType]);

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
                  placeholder="e.g. Urban, Rural, City"
                  required
                  feedback={departmentLocationTypeFeedback}
                  isInvalid={!!departmentLocationTypeFeedback}
                  onChange={changeHandler}
                />
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
    </Fragment>
  );
};

export default CreateDepartmentLocationType;
