import Modal from "@/components/modal/modal";
import Role from "@/interface/Role";
import { Checkbox, Col, Form, Input, Row } from "antd";

interface ViewRoleProps {
  visible?: boolean;
  currentRole?: Role;
  onClose?: () => void;
}
const ViewRole: React.FC<ViewRoleProps> = ({
  visible = false,
  currentRole = {} as Role,
  onClose = () => {}
}) => {
  return (
    <Modal
      title="View Role"
      show={visible}
      onCancel={onClose}
      width={880}
      body={
        <Form layout="vertical">
          <Row>
            <Col span={11} className="me-4">
              <Form.Item label="Name">
                <Input value={currentRole.name} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Label">
                <Input value={currentRole.label} disabled />
              </Form.Item>
            </Col>
            <Form.Item label="Permissions">
              {currentRole.permissions?.length === 0 && (
                <p className="text-danger">No permissions assigned</p>
              )}
              <Checkbox.Group
                value={currentRole.permissions?.map((p: any) => p.name)}
                disabled
              >
                <Row>
                  {currentRole.permissions?.map((permission: any) => (
                    <Col span={8} key={permission.id}>
                      <Checkbox value={permission.name}>
                        {permission.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Row>
        </Form>
      }
    />
  );
};

export default ViewRole;
