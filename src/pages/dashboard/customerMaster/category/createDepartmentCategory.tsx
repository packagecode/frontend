import { BaseInput, BaseModal } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import DepartmentCategory from "@/interface/DepartmentCategory";
import { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

interface CreateDepartmentCategoryProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentDepartmentCategory?: DepartmentCategory;
  afterCreated?: (departmentCategory: DepartmentCategory) => void;
  afterUpdated?: (departmentCategory: DepartmentCategory) => void;
  onClose?: () => void;
}

const CreateDepartmentCategory: React.FC<CreateDepartmentCategoryProps> = ({
  visible = false,
  isUpdate = false,
  currentDepartmentCategory = {} as DepartmentCategory,
  afterCreated = () => {},
  afterUpdated = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [departmentCategoryFeedback, setDepartmentCategoryFeedback] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
  });
  const { name } = formData;
  const [modalTitle, setModalTitle] = useState<string>("Add New Category");

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    onClose();
    setDepartmentCategoryFeedback("");
    setValidated(false);
    setFormData({ name: ""});
  };

  const submitForm = async (url: string, method: "post" | "patch") => {
    setLoading(true);

    await axiosInstance[method](api(url), {
      name,
    })
      .then(response => {
        const { departmentCategory } = response.data;
        if (isUpdate) {
          afterUpdated({ ...departmentCategory, key: departmentCategory.id });
          showToast("success", "Successfully Updated");
        } else {
          afterCreated({ ...departmentCategory, key: departmentCategory.id });
          showToast("success", "Successfully Created");
        }
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setDepartmentCategoryFeedback(error.response.data.errors.name[0]);
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
      setDepartmentCategoryFeedback("Please enter a channel name");
      setValidated(true);
      return;
    }

    const url = isUpdate ? `/department-categories/${currentDepartmentCategory.id}` : "/department-categories";
    const method = isUpdate ? "patch" : "post";

    await submitForm(url, method);
  };

  useEffect(() => {
    if (visible) {
      if (isUpdate && currentDepartmentCategory) {
        setFormData({
          name: currentDepartmentCategory.name,
        });
        setModalTitle("Update Category");
      } else {
        setFormData({ name: "" });
        setModalTitle("Add New Category");
      }
    }
  }, [visible, isUpdate, currentDepartmentCategory]);

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
                  placeholder="e.g. Whole Sale, Pharmacy, Supershop"
                  required
                  feedback={departmentCategoryFeedback}
                  isInvalid={!!departmentCategoryFeedback}
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

export default CreateDepartmentCategory;
