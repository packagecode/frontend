import { Button as BaseButton, BaseInput } from "@/components";
import BaseCanvas from "@/components/canvas/offcanvas";
import TerritoryLazyDropdown from "@/components/lazyDropdown/TerritoryLazydropdown";
import { useState } from "react";

interface ComponentProps {
  visible: boolean;
  onSubmit: (filter: any) => void;
  onClose: () => void;
}

const UsersInfoFilterCanvas: React.FC<ComponentProps> = ({
  visible = false,
  onSubmit,
  onClose
}) => {
  const [filter, setFilter] = useState({
    name: "",
    code: "",
    email: "",
    t: null
  });

  const handleFilterClose = () => {
    onClose();
  };

  const handleFilterInput = (e: any) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    onSubmit(filter);
    onClose();
  };

  const handleFilterReset = () => {
    setFilter({
      name: "",
      code: "",
      email: "",
      t: null
    });
  };

  return (
    <BaseCanvas
      show={visible}
      onHide={handleFilterClose}
      header={<h5>Users Filter</h5>}
      body={
        <div>
          <div className="mb-3">
            <BaseInput
              label="User Name"
              placeholder="e.g. Jone Doe"
              value={filter.name}
              name="name"
              onChange={handleFilterInput}
            />
          </div>
          <div className="mb-3">
            <BaseInput
              label="User Code"
              placeholder="e.g. CA001"
              value={filter.code}
              name="code"
              onChange={handleFilterInput}
            />
          </div>
          <div className="mb-3">
            <BaseInput
              label="User Email"
              placeholder="e.g. abc@gmail.com"
              value={filter.email}
              name="email"
              onChange={handleFilterInput}
            />
          </div>
          <div className="mb-3">
            <TerritoryLazyDropdown
              value={filter.t}
              onChange={(e: any) => {
                setFilter({ ...filter, t: e });
              }}
            />
          </div>
        </div>
      }
      footer={
        <>
          <BaseButton
            variant="outline-primary"
            size="sm"
            onClick={handleFilterApply}
            className="me-2 btn-wave"
          >
            Apply
          </BaseButton>
          <BaseButton
            variant="outline-danger"
            size="sm"
            onClick={handleFilterClose}
            className="btn-wave"
          >
            Close
          </BaseButton>
          <BaseButton
            variant="outline-warning"
            size="sm"
            onClick={handleFilterReset}
            className="float-end btn-wave"
          >
            Reset
          </BaseButton>
        </>
      }
    />
  );
};

export default UsersInfoFilterCanvas;
