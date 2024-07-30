import avatar from "@/assets/images/faces/avatar.png";
import { BaseTableAntd, BaseTooltip } from "@/components";
import UsersFilterCanvas from "@/components/canvas/usersFilterCanvas";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import { showToast } from "@/contexts/Toast";
import { Permission as PermissionEnums } from "@/enums/Permission";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import useGlobalServices from "@/hooks/useGlobalServices";
import Role from "@/interface/Role";
import User from "@/interface/User";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Divider, Popconfirm, TablePaginationConfig } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import {
  Badge,
  ButtonGroup,
  DropdownButton,
  DropdownItem
} from "react-bootstrap";
import { useSelector } from "react-redux";
import CreateBulkUsers from "./createBulkUsers";
import CreateUser from "./createUser";
import ViewUser from "./viewUser";

const users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [viewUser, setViewUser] = useState<boolean>(false);
  const [createBulkUsers, setCreateBulkUsers] = useState<boolean>(false);
  const formatDateTime = useDateTimeFormat();
  const { axiosInstance, api, cdn } = useAxiosInstance();
  const authUser = useSelector((state: any) => state.user);
  const { toQueryString, downloadFile, hasPermission } = useGlobalServices();
  const [selectedData, setSelectedData] = useState({
    allSelected: false,
    selectedRows: [] as React.Key[]
  });
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    total: 0,
    position: ["bottomCenter"],
    showTotal: (total: number, range: [number, number]) => {
      return `Showing ${range[0]} to ${range[1]} of ${total} entries`;
    }
  });
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState<any>({});

  const usersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
      render: (name: string) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <div className="avatar avatar-sm me-2 avatar-rounded">
                <img src={`${cdn()}${avatar}`} alt="img" />
              </div>
              <b style={{ marginLeft: "1rem" }}>{name}</b>
            </div>
          </>
        );
      }
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "Territory",
      dataIndex: "territory",
      key: "territory",
      render: (territory: any) => territory?.name
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: number, record: User) => (
        <Popconfirm
          title="Change Status?"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          okText={active ? "Inactive" : "Active"}
          okButtonProps={{ className: "btn-success-transparent" }}
          okType={active ? "danger" : "default"}
          onConfirm={() => changeStatus(record)}
        >
          <Badge
            bg={active ? "outline-success" : "outline-danger"}
            className=" rounded-pill"
            style={{ width: "60px", cursor: "pointer" }}
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </Popconfirm>
      )
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
      render: (user: User) => (
        <div className="hstack gap-2 fs-15">
          {user &&
            user.is_owner !== 1 &&
            user.id !== authUser?.id &&
            hasPermission(PermissionEnums.UPDATE_USER) && (
              <Popconfirm
                title={`Reset Device?`}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                okText="Yes"
                okType={"danger"}
                cancelText="No"
                onConfirm={handleResetDevice(user)}
              >
                <BaseButton
                  variant="danger-transparent"
                  className="btn-icon btn-sm rounded-pill"
                >
                  <i className="bi bi-recycle"></i>
                </BaseButton>
              </Popconfirm>
            )}

          <BaseTooltip content="View" className="tooltip-success">
            <BaseButton
              variant="success-transparent"
              className="btn-icon btn-sm rounded-pill"
              onClick={() => {
                setCurrentUser(user);
                setViewUser(true);
              }}
            >
              <i className="bi bi-eye"></i>
            </BaseButton>
          </BaseTooltip>
          {hasPermission(PermissionEnums.UPDATE_USER) && (
            <BaseTooltip content="Edit" className="tooltip-info">
              <BaseButton
                variant="info-transparent"
                className="btn-icon btn-sm rounded-pill"
                onClick={() => handleOnEdit(user)}
              >
                <i className="ri-edit-line"></i>
              </BaseButton>
            </BaseTooltip>
          )}

          {/* {user && user.is_owner !== 1 && user.id !== authUser?.id && (
            <Popconfirm
              title={`Delete user?`}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              okText="Yes"
              okType={"danger"}
              cancelText="No"
              onConfirm={handleOnDelete(user)}
            >
              <BaseButton
                variant="danger-transparent"
                className="btn-icon btn-sm rounded-pill"
              >
                <i className="ri-delete-bin-line"></i>
              </BaseButton>
            </Popconfirm>
          )} */}
        </div>
      )
    }
  ];

  const fetchUsers = async (
    page: number,
    pageSize: number,
    filter: any = {}
  ) => {
    setLoading(true);
    await axiosInstance
      .get(
        api(
          "users" +
            toQueryString(filter) +
            "&page=" +
            page +
            "&per_page=" +
            pageSize
        )
      )
      .then(response => {
        const { current_page, users, total, per_page } = response.data;
        setUsers(
          users.map((user: User) => ({
            ...user,
            key: user.id
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

  const handleOnEdit = (user: User) => {
    setCurrentUser(user);
    setIsUpdate(true);
    setVisible(true);
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    allSelected: boolean
  ) => {
    setSelectedData({
      allSelected: allSelected,
      selectedRows: newSelectedRowKeys
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchUsers(pagination.current!, pagination.pageSize!);
  };

  const handleResetDevice = (user: User) => async () => {
    await axiosInstance
      .patch(api("users/" + user.id + "/reset-device"))
      .then(() => {
        const index = users.findIndex((u: User) => u.id == user.id);
        (users as User[])[index].device_id = null;
        setUsers([...users]);
        showToast("success", "Device reset successfully");
      });
  };

  const tableHeaders = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {hasPermission(PermissionEnums.CREATE_USER) && (
            <ButtonGroup>
              <DropdownButton
                title={
                  <span>
                    <i className="bi bi-plus"></i> Add User
                  </span>
                }
                variant="outline-primary"
                size="sm"
              >
                <DropdownItem onClick={() => setVisible(true)}>
                  Add User
                </DropdownItem>
                <DropdownItem onClick={() => setCreateBulkUsers(true)}>
                  Bulk Users
                </DropdownItem>
                <Divider style={{ margin: "0" }} />
                <DropdownItem onClick={downloadBulkFormat}>
                  Download Bulk format
                </DropdownItem>
              </DropdownButton>
            </ButtonGroup>
          )}
        </div>
        <div>
          <BaseButton
            variant="outline-primary"
            size="sm"
            className="me-1 btn-wave"
            loading={downloading}
            onClick={downloadUsers}
          >
            <i className="bi bi-download"></i> Download
          </BaseButton>
          <BaseButton
            variant="outline-primary"
            size="sm"
            className="me-1 btn-wave"
            onClick={() => setShowFilter(true)}
          >
            <i className="bi bi-funnel"></i> Filter
          </BaseButton>
        </div>
      </div>
    );
  };

  const handleFilterApply = (filters: any) => {
    setShowFilter(false);
    setFilterData(filters);
    fetchUsers(1, pagination.pageSize!, filters);
  };

  const handleAfterCreated = (user: User) => {
    setUsers(prev => {
      const newUsers = [{ ...user, key: user.id }, ...prev];
      // Only keep the latest pageSize number of users
      return newUsers.slice(0, pagination.pageSize);
    });
    setPagination(prev => {
      return { ...prev, total: (prev.total ?? 0) + 1 };
    });
  };

  const handleAfterUpdated = (user: User) => {
    setUsers(prev => {
      return prev.map(u => {
        if (u.id === user.id) {
          return { ...user, key: user.id };
        }
        return u;
      });
    });
    setVisible(false);
  };

  const changeStatus = async (user: User) => {
    await axiosInstance.patch(api(`/users/${user.id}/status`)).then(() => {
      setUsers((prev: any) => {
        return prev.map((u: User) => {
          if (u.id === user.id) {
            return { ...user, key: user.id, active: !user.active };
          }
          return u;
        });
      });
      showToast("success", "Changed Successful");
    });
  };

  const handleUserRoleUpdate = (roles: Role[]) => {
    setUsers((prev: User[]) =>
      prev.map(u =>
        isUpdate && u.id === currentUser?.id ? { ...u, roles } : u
      )
    );
  };

  const downloadBulkFormat = async () => {
    const download = downloadFile(api("/bulk-users-sample"));
    const success = await download();
    if (!success) {
      showToast("error", "Unable to download.");
    }
  };

  const downloadUsers = async () => {
    setDownloading(true);

    const filter = {
      ...filterData,
      ...(selectedData.allSelected && { all: true })
    };

    const download = downloadFile(
      api(`/user-bulk-download${toQueryString(filter)}&download`)
    );
    const success = await download();
    if (!success) {
      showToast("error", "Unable to download.");
    }
    setDownloading(false);
  };

  // const handleOnDelete = (user: User) => async () => {
  //   await axiosInstance.delete(api(`/users/${user.id}`)).then(() => {
  //     setUsers(prev => prev.filter(u => u.id !== user.id));
  //     showToast("success", "User deleted successfully");
  //   });
  // };

  useEffect(() => {
    fetchUsers(pagination.current!, pagination.pageSize!);
    console.log("users selected", selectedData);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Users"
        heading="Dashboard"
        headingHref="/dashboards"
        active="Users"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={users}
        columns={usersColumns}
        pagination={pagination}
        onChange={handleTableChange}
        selectionRow={true}
        onSelectedRowsChange={onSelectChange}
      />
      <UsersFilterCanvas
        visible={showFilter}
        onSubmit={handleFilterApply}
        onClose={() => setShowFilter(false)}
      />
      <CreateUser
        visible={visible}
        currentUser={currentUser}
        isUpdate={isUpdate}
        afterCreated={handleAfterCreated}
        afterUpdated={handleAfterUpdated}
        onRoleUpdate={handleUserRoleUpdate}
        onClose={() => {
          setVisible(false);
          setIsUpdate(false);
        }}
      />
      <ViewUser
        visible={viewUser}
        currentUser={currentUser}
        onClose={() => setViewUser(false)}
      />
      <CreateBulkUsers
        visible={createBulkUsers}
        fetchUsers={() => fetchUsers(pagination.current!, pagination.pageSize!)}
        onClose={() => setCreateBulkUsers(false)}
      />
    </Fragment>
  );
};

export default users;
