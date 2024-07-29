import { BaseTableAntd } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import useGlobalServices from "@/hooks/useGlobalServices";
import ChannelsFilterCanvas from "@/components/canvas/channelFilterCanvas";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import { Badge } from "react-bootstrap";
import DepartmentType from "@/interface/DepartmentType";
import { Fragment, useEffect, useState } from "react";
import CreateDepartmentType from "./createDepartmentType";
import { showToast } from "@/contexts/Toast";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm,  TablePaginationConfig } from "antd";

export default function DepartmentTypes(): JSX.Element {
  const [departmentTypes, setDepartmentTypes] = useState<Array<DepartmentType>>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const { toQueryString } = useGlobalServices();
  const [currentDepartmentType, setCurrentDepartmentType] = useState<DepartmentType>({
    name: "",
    label: "",
    has_outlet: false,
    self_managed: false,
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

  const departmentTypesColumns = [
    {
      title: "SL",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_text: any, _record: DepartmentType, index: number) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: DepartmentType, b: DepartmentType) => a.name.localeCompare(b.name)
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label"
    },
    {
      title: "Has Outlet",
      dataIndex: "has_outlet",
      key: "has_outlet",
      render: (has_outlet: number) =>
        has_outlet ? (
          <Badge
            bg="outline-success"
            className=" rounded-pill"
            style={{ width: "60px" }}
          >
            Yes
          </Badge>
        ) : (
          <Badge
            bg="outline-danger"
            className=" rounded-pill"
            style={{ width: "60px" }}
          >
            No
          </Badge>
        )
    },
    {
      title: "Self Managed",
      dataIndex: "self_managed",
      key: "self_managed",
      render: (self_managed: number) =>
        self_managed ? (
          <Badge
            bg="outline-success"
            className=" rounded-pill"
            style={{ width: "60px" }}
          >
            Yes
          </Badge>
        ) : (
          <Badge
            bg="outline-danger"
            className=" rounded-pill"
            style={{ width: "60px" }}
          >
            No
          </Badge>
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
      align: "center",
      render: (departmentType: DepartmentType) => (
        <div className="gap-2 fs-15">
          <BaseButton
            variant="info-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleOnEdit(departmentType)}
          >
            <i className="ri-edit-line"></i>
          </BaseButton>
          <Popconfirm
            title={`Delete ${departmentType.name}`}
            description="Are you sure to delete this Channel?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(departmentType)}
          >
            <BaseButton
              variant="danger-transparent"
              className="btn-icon btn-sm rounded-pill"
            >
              <i className="bi bi-trash"></i>
            </BaseButton>
          </Popconfirm>
        </div>
      )
    }
  ];

  const fetchDepartmentType = async (page: number, pageSize: number, filter: any = {}) => {
    setLoading(true);
    await axiosInstance
      .get(api("department-types"+ toQueryString(filter)+ "&page=" + page + "&per_page=" + pageSize))
      .then(response => {
        const { current_page, departmentTypes, total, per_page } = response.data;
        setDepartmentTypes(
          departmentTypes.map((departmentType: DepartmentType) => ({
            ...departmentType,
            key: departmentType.id
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
    fetchDepartmentType(pagination.current!, pagination.pageSize!);
  };

  const tableHeaders = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <BaseButton
          variant="outline-primary"
          size="sm"
          className="me-1 btn-wave"
          onClick={handleAddChannel}
        >
          Add Channel
        </BaseButton>
        <BaseButton
            variant="outline-primary"
            size="sm"
            className="me-1 btn-wave"
            onClick={() => setShowFilter(true)}
          >
            Filter
          </BaseButton>
      </div>
    );
  };

  const handleAddChannel = () => {
    setIsUpdate(false);
    setCurrentDepartmentType({ name: "", label: "", has_outlet: false, self_managed: false });
    setVisible(true);
  };

  const handleOnEdit = (departmentType: DepartmentType) => {
    setCurrentDepartmentType(departmentType);
    setIsUpdate(true);
    setVisible(true);
  };

  const handleCreatedDepartmentType = (departmentType: DepartmentType) => {
    setDepartmentTypes(prev => {
      return [{ ...departmentType, key: departmentType.id }, ...prev];
    });
  };

  const handleUpdatedDepartmentType = (departmentType: DepartmentType) => {
    setDepartmentTypes(prev => {
      return prev.map(r => {
        if (r.id === departmentType.id) {
          return { ...departmentType, key: departmentType.id };
        }
        return r;
      });
    });
  };
  const handleDelete = async (departmentTyp: DepartmentType) => {
    await axiosInstance.delete(api(`/department-types/${departmentTyp.id}`)).then(() => {
      departmentTypes.splice(
        departmentTypes.findIndex(r => r.id == departmentTyp.id),
        1
      );
      setDepartmentTypes([...departmentTypes]);
      showToast("success", "Delete Successfully");
    })
    .catch((error: any) => {
      if (error.response?.data) {
        showToast("error", error.response.data);
      }
    });
  };

  const handleFilterApply = (filters: any) => {
    setShowFilter(false);
    fetchDepartmentType(1, pagination.pageSize!, filters);
  };

  useEffect(() => {
    fetchDepartmentType(pagination.current!, pagination.pageSize!);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Channel"
        heading="Dashboard"
        headingHref="/dashboards"
        active="Channel"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={departmentTypes}
        columns={departmentTypesColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <CreateDepartmentType
        visible={visible}
        isUpdate={isUpdate}
        currentDepartmentType={currentDepartmentType}
        afterCreated={handleCreatedDepartmentType}
        afterUpdated={handleUpdatedDepartmentType}
        onClose={() => setVisible(false)}
      />
      <ChannelsFilterCanvas
        visible={showFilter}
        onSubmit={handleFilterApply}
        onClose={() => setShowFilter(false)}
      />
    </Fragment>
  );
}
