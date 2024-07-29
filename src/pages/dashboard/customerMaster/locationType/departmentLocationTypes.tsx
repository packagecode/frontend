import { BaseTableAntd } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import useGlobalServices from "@/hooks/useGlobalServices";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import DepartmentLocationType from "@/interface/DepartmentLocationType";
import { Fragment, useEffect, useState } from "react";
import CreateDepartmentLocationType from "./CreateDepartmentLocationType";
import { showToast } from "@/contexts/Toast";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm,  TablePaginationConfig } from "antd";

export default function DepartmentLocationTypes(): JSX.Element {
  const [departmentLocationTypes, setDepartmentLocationTypes] = useState<Array<DepartmentLocationType>>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toQueryString } = useGlobalServices();
  const [currentDepartmentLocationType, setCurrentDepartmentLocationType] = useState<DepartmentLocationType>({
    name: ""
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

  const departmentLocationTypesColumns = [
    {
      title: "SL",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_text: any, _record: DepartmentLocationType, index: number) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: DepartmentLocationType, b: DepartmentLocationType) => a.name.localeCompare(b.name)
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
      render: (departmentLocationType: DepartmentLocationType) => (
        <div className="gap-2 fs-15">
          <BaseButton
            variant="info-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleOnEdit(departmentLocationType)}
          >
            <i className="ri-edit-line"></i>
          </BaseButton>
          <Popconfirm
            title={`Delete ${departmentLocationType.name}`}
            description="Are you sure to delete this department location type?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(departmentLocationType)}
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

  const fetchDepartmentLocationType = async (page: number, pageSize: number, filter: any = {}) => {
    setLoading(true);
    await axiosInstance
      .get(api("department-location-types"+ toQueryString(filter)+ "&page=" + page + "&per_page=" + pageSize))
      .then(response => {
        const { current_page, departmentLocationTypes, total, per_page } = response.data;
        setDepartmentLocationTypes(
          departmentLocationTypes.map((departmentLocationType: DepartmentLocationType) => ({
            ...departmentLocationType,
            key: departmentLocationType.id
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
    fetchDepartmentLocationType(pagination.current!, pagination.pageSize!);
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
          Add Location Type
        </BaseButton>
      </div>
    );
  };

  const handleAddChannel = () => {
    setIsUpdate(false);
    setCurrentDepartmentLocationType({ name: "" });
    setVisible(true);
  };

  const handleOnEdit = (departmentLocationType: DepartmentLocationType) => {
    setCurrentDepartmentLocationType(departmentLocationType);
    setIsUpdate(true);
    setVisible(true);
  };

  const handleCreatedDepartmentLocationType = (departmentLocationType: DepartmentLocationType) => {
    setDepartmentLocationTypes(prev => {
      return [{ ...departmentLocationType, key: departmentLocationType.id }, ...prev];
    });
  };

  const handleUpdatedDepartmentLocationType = (departmentLocationType: DepartmentLocationType) => {
    setDepartmentLocationTypes(prev => {
      return prev.map(r => {
        if (r.id === departmentLocationType.id) {
          return { ...departmentLocationType, key: departmentLocationType.id };
        }
        return r;
      });
    });
  };
  const handleDelete = async (departmentLocation: DepartmentLocationType) => {
    await axiosInstance.delete(api(`/department-location-types/${departmentLocation.id}`)).then(() => {
      departmentLocationTypes.splice(
        departmentLocationTypes.findIndex(r => r.id == departmentLocation.id),
        1
      );
      setDepartmentLocationTypes([...departmentLocationTypes]);
      showToast("success", "Delete Successfully");
    })
    .catch((error: any) => {
      if (error.response?.data) {
        showToast("error", error.response.data);
      }
    });
  };
  useEffect(() => {
    fetchDepartmentLocationType(pagination.current!, pagination.pageSize!);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Location Types"
        heading="Dashboard"
        headingHref="/dashboards"
        active="DepartmentLocationTypes"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={departmentLocationTypes}
        columns={departmentLocationTypesColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <CreateDepartmentLocationType
        visible={visible}
        isUpdate={isUpdate}
        currentDepartmentLocationType={currentDepartmentLocationType}
        afterCreated={handleCreatedDepartmentLocationType}
        afterUpdated={handleUpdatedDepartmentLocationType}
        onClose={() => setVisible(false)}
      />
    </Fragment>
  );
}
