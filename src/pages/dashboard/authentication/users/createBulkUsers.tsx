import { BaseTooltip } from "@/components";
import FileUpload from "@/components/FileUpload/FileUpload";
import BaseButton from "@/components/core/BaseButton";
import Modal from "@/components/modal/modal";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Tour, TourProps } from "antd";
import { Fragment, useState } from "react";
import { Form } from "react-bootstrap";

const steps: TourProps["steps"] = [
  {
    title: "Step 1",
    description: "Select a CSV file to import users.",
    nextButtonProps: { className: "btn-success-transparent" },
    target: () => document.getElementById("fileUploader") as HTMLElement
  },
  {
    title: "Step 2",
    description: "Click the import button to import users.",
    nextButtonProps: { className: "btn-success-transparent" },
    target: () => document.getElementById("importBtn") as HTMLElement
  }
];

interface CreateBulkUsersProps {
  visible?: boolean;
  onClose?: () => void;
  fetchUsers?: () => void;
}

const CreateBulkUsers: React.FC<CreateBulkUsersProps> = ({
  visible = false,
  onClose = () => {},
  fetchUsers = () => {}
}) => {
  const [feedback, setFeedback] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { axiosInstance, api } = useAxiosInstance();
  const [files, setFiles] = useState<File[]>([]);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      setFeedback("Please select a csv file before importing");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append(`users`, files[0]);
    try {
      const response = await axiosInstance.post(api("/import-users"), form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      showToast("success", response.data.message);
      handleOnClose();
      fetchUsers();
    } catch (err: any) {
      const { errors } = err.response?.data || {};
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setFiles([]);
    setFeedback("");
    onClose();
    setLoading(false);
    setFiles([]);
    setErrors({});
  };

  const handleUploadedFiles = async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    if (uploadedFiles.length > 0) setFeedback("");
  };

  return (
    <Fragment>
      <Modal
        title={
          <>
            Add Bulk Users
            <BaseTooltip content="Tour" className="tooltip-primary">
              <BaseButton
                variant="outline-primary"
                size="sm"
                className="ms-1"
                onClick={() => setIsTourOpen(true)}
              >
                <i className="bi bi-info-circle"></i>
              </BaseButton>
            </BaseTooltip>
          </>
        }
        show={visible}
        onCancel={handleOnClose}
        footer={null}
        body={
          <>
            <Form onSubmit={handleSubmit}>
              <FileUpload
                id="fileUploader"
                label="Select a CSV file"
                files={files}
                accept="text/csv"
                feedback={feedback}
                onUploadedFiles={handleUploadedFiles}
              />
              <div className="mt-4" />
              <BaseButton
                id="importBtn"
                variant="outline-success"
                size="sm"
                className="me-1 btn-wave"
                type="submit"
                loading={loading}
              >
                Import
              </BaseButton>
              <BaseButton
                variant="outline-danger"
                type="button"
                size="sm"
                onClick={handleOnClose}
              >
                Close
              </BaseButton>
            </Form>
            {errors && (
              <div className="mt-2">
                <ul>
                  {Object.entries(errors).map((value: any, key: any) => (
                    <li className="text-danger" key={key}>
                      {value[1] ?? value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        }
      />

      <Tour
        open={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={steps}
      />
    </Fragment>
  );
};

export default CreateBulkUsers;
