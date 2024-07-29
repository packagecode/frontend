import { BaseTableAntd } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import useGlobalServices from "@/hooks/useGlobalServices";
import DepartmentCategoriesFilterCanvas from "@/components/canvas/departmentCategoriesFilterCanvas";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import DepartmentCategory from "@/interface/DepartmentCategory";
import { Fragment, useEffect, useState } from "react";
import CreateDepartmentCategory from "./createDepartmentCategory";
import { showToast } from "@/contexts/Toast";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm,  TablePaginationConfig } from "antd";

export default function DepartmentCategories(): JSX.Element {
  const [departmentCategories, setDepartmentCategories] = useState<Array<DepartmentCategory>>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const { toQueryString } = useGlobalServices();
  const [currentDepartmentCategory, setCurrentDepartmentCategory] = useState<DepartmentCategory>({
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

  const departmentCategoriesColumns = [
    {
      title: "SL",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_text: any, _record: DepartmentCategory, index: number) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: DepartmentCategory, b: DepartmentCategory) => a.name.localeCompare(b.name)
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
      render: (departmentCategory: DepartmentCategory) => (
        <div className="gap-2 fs-15">
          <BaseButton
            variant="info-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleOnEdit(departmentCategory)}
          >
            <i className="ri-edit-line"></i>
          </BaseButton>
          <Popconfirm
            title={`Delete ${departmentCategory.name}`}
            description="Are you sure to delete this department category?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(departmentCategory)}
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

  const fetchDepartmentCategory = async (page: number, pageSize: number, filter: any = {}) => {
    setLoading(true);
    await axiosInstance
      .get(api("department-categories"+ toQueryString(filter)+ "&page=" + page + "&per_page=" + pageSize))
      .then(response => {
        const { current_page, departmentCategories, total, per_page } = response.data;
        setDepartmentCategories(
          departmentCategories.map((departmentCategory: DepartmentCategory) => ({
            ...departmentCategory,
            key: departmentCategory.id
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
    fetchDepartmentCategory(pagination.current!, pagination.pageSize!);
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
          Add Category
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
    setCurrentDepartmentCategory({ name: ""});
    setVisible(true);
  };

  const handleOnEdit = (departmentCategory: DepartmentCategory) => {
    setCurrentDepartmentCategory(departmentCategory);
    setIsUpdate(true);
    setVisible(true);
  };

  const handleCreatedDepartmentCategory = (departmentCategory: DepartmentCategory) => {
    setDepartmentCategories(prev => {
      return [{ ...departmentCategory, key: departmentCategory.id }, ...prev];
    });
  };

  const handleUpdatedDepartmentCategory = (departmentCategory: DepartmentCategory) => {
    setDepartmentCategories(prev => {
      return prev.map(r => {
        if (r.id === departmentCategory.id) {
          return { ...departmentCategory, key: departmentCategory.id };
        }
        return r;
      });
    });
  };
  const handleDelete = async (departmentCategory: DepartmentCategory) => {
    await axiosInstance.delete(api(`/department-categories/${departmentCategory.id}`)).then(() => {
      departmentCategories.splice(
        departmentCategories.findIndex(r => r.id == departmentCategory.id),
        1
      );
      setDepartmentCategories([...departmentCategories]);
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
    fetchDepartmentCategory(1, pagination.pageSize!, filters);
  };

  useEffect(() => {
    fetchDepartmentCategory(pagination.current!, pagination.pageSize!);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Categories"
        heading="Dashboard"
        headingHref="/dashboards"
        active="DepartmentCategories"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={departmentCategories}
        columns={departmentCategoriesColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <CreateDepartmentCategory
        visible={visible}
        isUpdate={isUpdate}
        currentDepartmentCategory={currentDepartmentCategory}
        afterCreated={handleCreatedDepartmentCategory}
        afterUpdated={handleUpdatedDepartmentCategory}
        onClose={() => setVisible(false)}
      />
      <DepartmentCategoriesFilterCanvas
        visible={showFilter}
        onSubmit={handleFilterApply}
        onClose={() => setShowFilter(false)}
      />
    </Fragment>
  );
}
