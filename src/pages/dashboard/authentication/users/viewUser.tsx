import Modal from "@/components/modal/modal";
import Role from "@/interface/Role";
import User from "@/interface/User";
import { Checkbox, Col, Descriptions, Form, Row } from "antd";
import React from "react";
import { Badge } from "react-bootstrap";

interface ViewRoleProps {
  visible?: boolean;
  currentUser?: User;
  onClose?: () => void;
}

const ViewUser: React.FC<ViewRoleProps> = ({
  visible = false,
  currentUser = {} as User,
  onClose = () => {}
}) => {
  return (
    <Modal
      className="viewuser"
      title={currentUser.name}
      show={visible}
      onCancel={onClose}
      width={880}
      body={
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24}>
            <Descriptions size="small" bordered column={2}>
              <Descriptions.Item label="Code">
                {currentUser.code || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {currentUser.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Territory">
                {currentUser.territory?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currentUser.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  bg={currentUser.active ? "outline-success" : "outline-danger"}
                >
                  {currentUser.active ? "Active" : "Inactive"}
                </Badge>
              </Descriptions.Item>
              <Descriptions.Item label="Available On Report">
                <Badge
                  bg={
                    currentUser.is_report ? "outline-success" : "outline-danger"
                  }
                >
                  {currentUser.is_report ? "Yes" : "No"}
                </Badge>
              </Descriptions.Item>
              <Descriptions.Item label="App Version">
                {currentUser.app_version || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Last Time Login">
                {currentUser.last_time_login || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24}>
            <Form.Item label="Roles">
              {(!currentUser.roles || currentUser.roles.length === 0) && (
                <p className="text-danger" style={{ marginTop: "9px" }}>
                  No roles assigned
                </p>
              )}
              <Checkbox.Group
                className="w-100"
                value={currentUser.roles?.map((r: Role) => r.name)}
                disabled
              >
                <Row>
                  {currentUser.roles?.map((role: Role) => (
                    <Col sm={8} xs={24} key={role.id}>
                      <Checkbox value={role.name}>{role.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Permissions">
              {(!currentUser.permissions ||
                currentUser.permissions.length === 0) && (
                <p className="text-danger" style={{ marginTop: "9px" }}>
                  No permissions assigned
                </p>
              )}
              <Checkbox.Group
                className="w-100"
                value={currentUser.permissions?.map((p: any) => p.name)}
                disabled
              >
                <Row>
                  {currentUser.permissions?.map((permission: any) => (
                    <Col sm={8} xs={24} key={permission.id}>
                      <Checkbox value={permission.name}>
                        {permission.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      }
    />
  );
};

export default ViewUser;
