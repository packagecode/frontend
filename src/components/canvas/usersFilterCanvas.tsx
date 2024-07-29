import { Button as BaseButton, BaseInput } from "@/components";
import BaseCanvas from "@/components/canvas/offcanvas";
import RoleLazyDropdown from "@/components/lazyDropdown/RoleLazydropdown";
import TerritoryLazyDropdown from "@/components/lazyDropdown/TerritoryLazydropdown";
import { Radio } from "antd";
import { useState } from "react";

interface ComponentProps {
  visible: boolean;
  onSubmit: (filter: any) => void;
  onClose: () => void;
}

const UsersFilterCanvas: React.FC<ComponentProps> = ({
  visible = false,
  onSubmit,
  onClose
}) => {
  const [filter, setFilter] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    role: null,
    t: null,
    active: null
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
      phone: "",
      role: null,
      t: null,
      active: null
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
            <BaseInput
              label="User Phone"
              placeholder="017000000"
              value={filter.phone}
              name="phone"
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
          <div className="mb-3">
            <RoleLazyDropdown
              value={filter.role}
              onChange={(e: any) => {
                setFilter({ ...filter, role: e });
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label me-3">User Status</label>
            <Radio.Group
              name="active"
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 }
              ]}
              value={filter.active}
              optionType="button"
              buttonStyle="solid"
              size="small"
              onChange={handleFilterInput}
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

export default UsersFilterCanvas;
