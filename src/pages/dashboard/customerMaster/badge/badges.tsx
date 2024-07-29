import { BaseTableAntd } from "@/components";
import BaseButton from "@/components/core/BaseButton";
import Pageheader from "@/components/pageheader/pageheader";
import useGlobalServices from "@/hooks/useGlobalServices";
import BadgesFilterCanvas from "@/components/canvas/badgesFilterCanvas";
import useAxiosInstance from "@/hooks/useAxiosInstance";
import useDateTimeFormat from "@/hooks/useDateTimeFormat";
import Badge from "@/interface/Badge";
import { Fragment, useEffect, useState } from "react";
import CreateBadge from "./createBadge";
import { showToast } from "@/contexts/Toast";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm,  TablePaginationConfig } from "antd";

export default function Badges(): JSX.Element {
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const { toQueryString } = useGlobalServices();
  const [currentBadge, setCurrentBadge] = useState<Badge>({
    name: "",
    mrp_discount: 0,
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

  const badgesColumns = [
    {
      title: "SL",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_text: any, _record: Badge, index: number) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Badge, b: Badge) => a.name.localeCompare(b.name)
    },
    {
      title: "MRP Discount(%)",
      dataIndex: "mrp_discount",
      key: "mrp_discount",
      sorter: (a: Badge, b: Badge) => a.mrp_discount - b.mrp_discount

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
      render: (badge: Badge) => (
        <div className="gap-2 fs-15">
          <BaseButton
            variant="info-transparent"
            className="btn-icon btn-sm rounded-pill me-2"
            onClick={() => handleOnEdit(badge)}
          >
            <i className="ri-edit-line"></i>
          </BaseButton>
          <Popconfirm
            title={`Delete ${badge.name}`}
            description="Are you sure to delete this badge?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDelete(badge)}
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

  const fetchBadge = async (page: number, pageSize: number, filter: any = {}) => {
    setLoading(true);
    await axiosInstance
      .get(api("badges"+ toQueryString(filter)+ "&page=" + page + "&per_page=" + pageSize))
      .then(response => {
        const { current_page, badges, total, per_page } = response.data;
        setBadges(
          badges.map((badge: Badge) => ({
            ...badge,
            key: badge.id
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
    fetchBadge(pagination.current!, pagination.pageSize!);
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
          Add Badge
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
    setCurrentBadge({ name: "", mrp_discount: 0 });
    setVisible(true);
  };

  const handleOnEdit = (badge: Badge) => {
    setCurrentBadge(badge);
    setIsUpdate(true);
    setVisible(true);
  };

  const handleCreatedBadge = (badge: Badge) => {
    setBadges(prev => {
      return [{ ...badge, key: badge.id }, ...prev];
    });
  };

  const handleUpdatedBadge = (badge: Badge) => {
    setBadges(prev => {
      return prev.map(r => {
        if (r.id === badge.id) {
          return { ...badge, key: badge.id };
        }
        return r;
      });
    });
  };
  const handleDelete = async (badge: Badge) => {
    await axiosInstance.delete(api(`/badges/${badge.id}`)).then(() => {
      badges.splice(
        badges.findIndex(r => r.id == badge.id),
        1
      );
      setBadges([...badges]);
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
    fetchBadge(1, pagination.pageSize!, filters);
  };

  useEffect(() => {
    fetchBadge(pagination.current!, pagination.pageSize!);
  }, []);

  return (
    <Fragment>
      <Pageheader
        title="Badges"
        heading="Dashboard"
        headingHref="/dashboards"
        active="Badges"
      />
      <BaseTableAntd
        title={tableHeaders}
        loading={loading}
        dataSource={badges}
        columns={badgesColumns}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <CreateBadge
        visible={visible}
        isUpdate={isUpdate}
        currentBadge={currentBadge}
        afterCreated={handleCreatedBadge}
        afterUpdated={handleUpdatedBadge}
        onClose={() => setVisible(false)}
      />
      <BadgesFilterCanvas
        visible={showFilter}
        onSubmit={handleFilterApply}
        onClose={() => setShowFilter(false)}
      />
    </Fragment>
  );
}
