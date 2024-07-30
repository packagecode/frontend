import avatar from "@/assets/images/faces/avatar.png";
import { BaseTableAntd } from "@/components";
import UsersInfoFilterCanvas from "@/components/canvas/usersAppInfoCanvas";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import { showToast } from "@/contexts/Toast";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import useGlobalServices from "@/hooks/useGlobalServices";
import User from "@/interface/User";
import { TablePaginationConfig } from "antd";
import { Fragment, useEffect, useState } from "react";

const userAppInfo = () => {
  const [entities, setEntities] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const { axiosInstance, api, cdn } = useAxiosInstance();
  const { toQueryString, downloadFile } = useGlobalServices();
  const formatDateTime = useDateTimeFormat();
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

  const fetchEntities = async (page: number, pageSize: number) => {
    setLoading(true);
    await axiosInstance
      .get(
        api(
          "users" +
            toQueryString(filterData) +
            "&page=" +
            page +
            "&per_page=" +
            pageSize
        )
      )
      .then(response => {
        const { current_page, users, total, per_page } = response.data;
        setEntities(
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

  const tableHeaders = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div></div>
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

  const tableColumns = [
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
      title: "App Version",
      dataIndex: "app_version",
      key: "app_version",
      sorter: (a: User, b: User) =>
        (a.app_version ?? "").localeCompare(b.app_version ?? ""),
      render: (app_version: string) => {
        app_version ? app_version : "Not Yet";
      }
    },
    {
      title: "App Install Place",
      dataIndex: "app_install_place",
      key: "app_install_place"
    },
    {
      title: "Last Time Login",
      dataIndex: "last_time_login",
      key: "last_time_login",
      render: (last_time_login: string) =>
        formatDateTime(last_time_login, "lll")
    },
    {
      title: "Territory",
      dataIndex: "territory",
      key: "territory",
      sorter: (a: User, b: User) =>
        (a.territory?.name ?? "").localeCompare(b.territory?.name ?? ""),
      render: (territory: any) => territory?.name
    }
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchEntities(pagination.current!, pagination.pageSize!);
  };

  const downloadUsers = async () => {
    setDownloading(true);

    const download = downloadFile(
      api(`/user-app-info-download${toQueryString(filterData)}&download`)
    );
    const success = await download();
    if (!success) {
      showToast("error", "Unable to download.");
    }
    setDownloading(false);
  };

  const handleFilterApply = (filters: any) => {
    setShowFilter(false);
    setFilterData(filters);
    fetchEntities(1, pagination.pageSize!);
  };

  useEffect(() => {
    fetchEntities(pagination.current!, pagination.pageSize!);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Users App Info"
        heading="Dashboard"
        headingHref="/dashboards"
        active="Users App Info"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={entities}
        columns={tableColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <UsersInfoFilterCanvas
        visible={showFilter}
        onSubmit={handleFilterApply}
        onClose={() => setShowFilter(false)}
      />
    </Fragment>
  );
};

export default userAppInfo;
