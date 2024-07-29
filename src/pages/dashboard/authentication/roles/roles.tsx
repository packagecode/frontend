import { Button as BaseButton, BaseTableAntd } from "@/components";
import Pageheader from "@/components/pageheader/pageheader";
// import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import Role from "@/interface/Role";
// import { QuestionCircleOutlined } from "@ant-design/icons";
import { /*Popconfirm, */ TablePaginationConfig } from "antd";
import { Fragment, useEffect, useState } from "react";
import CreateRole from "./createRole";
import ViewRole from "./viewRole";

export default function Roles(): JSX.Element {
  const [roles, setRoles] = useState<Array<Role>>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [viewRole, setViewRole] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>({
    name: "",
    label: ""
  });
  const formatDateTime = useDateTimeFormat();
  const { axiosInstance, api } = useAxiosInstance();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    total: 0,
    position: ["bottomCenter"],
    showTotal: (total: number, range: [number, number]) => {
      return `Showing ${range[0]} to ${range[1]} of ${total} entries`;
    }
  });

  const rolesColumns = [
    {
      title: "SI",
      key: "index",
      render: (_: Role, __: Role, index: number) => ++index
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name)
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: "110px",
      render: (created_at: any) => formatDateTime(created_at, "ll")
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (role: Role) => (
        <div className="gap-2 fs-15">
          <BaseButton
            variant="success-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleViewRole(role)}
          >
            <i className="bi bi-eye"></i>
          </BaseButton>
          <BaseButton
            variant="info-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleOnEdit(role)}
          >
            <i className="ri-edit-line"></i>
          </BaseButton>
          {/* <Popconfirm
            title={`Delete ${record.name}`}
            description="Are you sure to delete this role?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(record)}
          >
            <BaseButton
              variant="danger-transparent"
              className="btn-icon btn-sm rounded-pill"
            >
              <i className="bi bi-trash"></i>
            </BaseButton>
          </Popconfirm> */}
        </div>
      )
    }
  ];

  const fetchRoles = async (page: number, pageSize: number) => {
    setLoading(true);
    await axiosInstance
      .get(api("roles?page=" + page + "&per_page=" + pageSize))
      .then(response => {
        const { current_page, roles, total, per_page } = response.data;
        setRoles(
          roles.map((role: Role) => ({
            ...role,
            key: role.id
          }))
        );
        setPagination(prev => ({
          ...prev,
          current: current_page,
          pageSize: per_page,
          total: total
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchRoles(pagination.current!, pagination.pageSize!);
  };

  const tableHeaders = () => {
    return (
      <div className="">
        <BaseButton
          variant="outline-primary"
          size="sm"
          className="me-1 btn-wave"
          onClick={() => setVisible(true)}
        >
          <i className="bi bi-plus"></i> Add Role
        </BaseButton>
      </div>
    );
  };

  const handleViewRole = (role: Role) => {
    setCurrentRole(role);
    setViewRole(true);
  };

  const handleOnEdit = (role: Role) => {
    setCurrentRole(role);
    setIsUpdate(true);
    setVisible(true);
  };

  const handleCreatedRole = (role: Role) => {
    setRoles(prev => {
      const newRoles = [{ ...role, key: role.id }, ...prev];
      // Only keep the latest pageSize number of roles
      return newRoles.slice(0, pagination.pageSize);
    });
    setPagination(prev => {
      return { ...prev, total: (prev.total ?? 0) + 1 };
    });
  };

  const handleUpdatedRole = (role: Role) => {
    setRoles(prev => {
      return prev.map(r => {
        if (r.id === role.id) {
          return { ...role, key: role.id };
        }
        return r;
      });
    });
  };

  // const handleDelete = async (role: Role) => {
  //   await axiosInstance.delete(api(`/roles/${role.id}`)).then(() => {
  //     roles.splice(
  //       roles.findIndex(r => r.id == role.id),
  //       1
  //     );
  //     setRoles([...roles]);
  //     showToast("success", "Delete Successfully");
  //   });
  // };

  useEffect(() => {
    fetchRoles(pagination.current!, pagination.pageSize!);
  }, []);
  return (
    <Fragment>
      <Pageheader
        title="Roles"
        heading="Dashboard"
        headingHref="/dashboards"
        active="Roles"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={roles}
        columns={rolesColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <CreateRole
        visible={visible}
        isUpdate={isUpdate}
        currentRole={currentRole}
        afterCreated={handleCreatedRole}
        afterUpdated={handleUpdatedRole}
        onClose={() => setVisible(false)}
      />
      <ViewRole
        visible={viewRole}
        currentRole={currentRole}
        onClose={() => setViewRole(false)}
      />
    </Fragment>
  );
}
