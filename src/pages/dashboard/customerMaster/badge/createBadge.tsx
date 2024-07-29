import { BaseInput, BaseModal } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import Badge from "@/interface/Badge";
import { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

interface CreateBadgeProps {
  visible?: boolean;
  isUpdate?: boolean;
  currentBadge?: Badge;
  afterCreated?: (badge: Badge) => void;
  afterUpdated?: (badge: Badge) => void;
  onClose?: () => void;
}

const CreateBadge: React.FC<CreateBadgeProps> = ({
  visible = false,
  isUpdate = false,
  currentBadge = {} as Badge,
  afterCreated = () => {},
  afterUpdated = () => {},
  onClose = () => {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [badgeFeedback, setBadgeFeedback] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    mrp_discount : 0
  });
  const { name, mrp_discount } = formData;
  const [modalTitle, setModalTitle] = useState<string>("Add New Badge");

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    onClose();
    setBadgeFeedback("");
    setValidated(false);
    setFormData({ name: "", mrp_discount: 0});
  };

  const submitForm = async (url: string, method: "post" | "patch") => {
    setLoading(true);

    await axiosInstance[method](api(url), {
      name,
      mrp_discount,
    })
      .then(response => {
        const { badge } = response.data;
        if (isUpdate) {
          afterUpdated({ ...badge, key: badge.id });
          showToast("success", "Successfully Updated");
        } else {
          afterCreated({ ...badge, key: badge.id });
          showToast("success", "Successfully Created");
        }
        handleModalClose();
      })
      .catch((error: any) => {
        if (error.response?.data?.errors?.name?.[0]) {
          setBadgeFeedback(error.response.data.errors.name[0]);
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
      setBadgeFeedback("Please enter a channel name");
      setValidated(true);
      return;
    }

    const url = isUpdate ? `/badges/${currentBadge.id}` : "/badges";
    const method = isUpdate ? "patch" : "post";

    await submitForm(url, method);
  };

  useEffect(() => {
    if (visible) {
      if (isUpdate && currentBadge) {
        setFormData({
          name: currentBadge.name,
          mrp_discount: currentBadge.mrp_discount,
        });
        setModalTitle("Update Badge");
      } else {
        setFormData({ name: "", mrp_discount: 0 });
        setModalTitle("Add New Badge");
      }
    }
  }, [visible, isUpdate, currentBadge]);

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
                  placeholder="e.g. Silver, Gold, Platinum"
                  required
                  feedback={badgeFeedback}
                  isInvalid={!!badgeFeedback}
                  onChange={changeHandler}
                />
              </Col>
              <Col xl={12} className="mt-0">
                <BaseInput
                  label="MRP Discount (%)"
                  name="mrp_discount"
                  value={mrp_discount}
                  placeholder="0"
                  required
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

export default CreateBadge;
