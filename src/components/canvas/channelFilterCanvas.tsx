import { BaseInput } from "@/components";
import BaseCanvas from "@/components/canvas/offcanvas";
import { useState } from "react";
import BaseButton from "../core/BaseButton";

interface ComponentProps {
  visible: boolean;
  onSubmit: (filter: any) => void;
  onClose: () => void;
}

const ChannelFilterCanvas: React.FC<ComponentProps> = ({
  visible = false,
  onSubmit,
  onClose
}) => {
  const [filter, setFilter] = useState({
    name: "",
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
    });
  };

  return (
    <BaseCanvas
      show={visible}
      onHide={handleFilterClose}
      header={<h5>Channel Filter</h5>}
      body={
        <div>
          <div className="mb-3">
            <BaseInput
              label="Channel Name"
              placeholder="e.g. ABC Channel"
              value={filter.name}
              name="name"
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

export default ChannelFilterCanvas;
