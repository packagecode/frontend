import useAxiosInstance from "@/hooks/useAxiosInstance";
import { Select, Spin } from "antd";
import { SelectProps } from "antd/lib";
import debounce from "lodash.debounce";
import { DefaultOptionType } from "rc-select/lib/Select";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const { Option } = Select;

export interface LazyDropdownProps extends Omit<SelectProps, "children"> {
  children?:
    | React.ReactNode
    | ((props: {
        visible: boolean;
        afterCreated: (event: any) => void;
        onClose: () => void;
      }) => React.ReactNode);
  itemText?: string;
  itemSubText?: string;
  itemValue?: string;
  endPoint: string;
  resourceKey: string;
  searchableKey?: string;
  landlord?: boolean;
  addButton?: boolean;
  apiVersion?: number;
  placeholder?: string;
  name?: string;
  label?: string;
  id?: string;
  value: any | any[];
  onClear?: () => void;
  onChange?: (
    value: string | string[],
    option: DefaultOptionType | DefaultOptionType[]
  ) => void;
  onRemoveTag?: (value: string) => void;
  onClick?: (event: React.MouseEvent) => void;
  multiple?: boolean;
  maxTagCount?: "responsive" | number;
  maxCount?: number;
  suffixIcon?: React.ReactNode;
}

const LazyDropdown: React.FC<LazyDropdownProps> = ({
  children,
  itemText = "name",
  itemSubText = "",
  itemValue = "id",
  endPoint,
  resourceKey,
  searchableKey = "name",
  landlord = false,
  addButton = false,
  apiVersion = 1,
  placeholder,
  name,
  label,
  id,
  value,
  onClear,
  onChange,
  onRemoveTag,
  onClick,
  multiple = false,
  maxTagCount = "responsive",
  maxCount,
  suffixIcon,
  ...selectProps
}) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { axiosInstance, api, api2, api3, landLordApi } = useAxiosInstance();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = React.useState<boolean>(false);

  useEffect(() => {
    fetchData(page, query, "override");
  }, [query]);

  const fetchData = useCallback(
    async (page: number, searchQuery: string, addTo: string = "end") => {
      setLoading(true);
      let apiUrl = "";
      if (landlord) {
        apiUrl = landLordApi(
          `${endPoint}?page=${page}&per_page=15&${searchableKey}=${searchQuery}`
        );
      } else {
        apiUrl = api(
          `${endPoint}?page=${page}&per_page=15&${searchableKey}=${searchQuery}`
        );

        if (apiVersion === 2) {
          apiUrl = api2(
            `${endPoint}?page=${page}&per_page=15&${searchableKey}=${searchQuery}`
          );
        } else if (apiVersion === 3) {
          apiUrl = api3(
            `${endPoint}?page=${page}&per_page=15&${searchableKey}=${searchQuery}`
          );
        }
      }

      try {
        const { data } = await axiosInstance.get(apiUrl);

        if (addTo === "end") {
          setEntities(prev => [...prev, ...data[resourceKey]]);
        } else if (addTo === "start") {
          setEntities(prev => [...data[resourceKey], ...prev]);
        } else if (addTo === "override") {
          setEntities(data[resourceKey]);
        }

        setHasMore(data.current_page !== data.last_page);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    },
    [
      endPoint,
      searchableKey,
      apiVersion,
      resourceKey,
      axiosInstance,
      api,
      api2,
      api3
    ]
  );

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { target } = e;
    const divTarget = target as HTMLDivElement;
    if (
      divTarget.scrollTop + divTarget.offsetHeight === divTarget.scrollHeight &&
      hasMore &&
      !loading
    ) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage, query);
        return nextPage;
      });
    }
  };

  const resolveNesting = (accessor: any, entity: any) => {
    return accessor.split(".").reduce((acc: any, key: any) => acc[key], entity);
  };

  const debouncedRemoteMethod = useCallback(
    debounce((query: string) => {
      setEntities([]);
      setPage(1); // Reset page when search query changes
      setQuery(query);
    }, 300),
    []
  );

  const handleRemoteMethod = (query: string) => {
    debouncedRemoteMethod(query);
  };

  const handleBlur = () => {
    // Prevent resetting query on blur
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

  const handleChange = (value: any, selectedOptions: any) => {
    if (onChange) onChange(value, selectedOptions);
  };

  const handleRemoveTag = (value: any) => {
    if (onRemoveTag) onRemoveTag(value);
  };

  const handleClick = (event: any) => {
    if (onClick) onClick(event);
  };

  const handleAfterCreated = (event: any) => {
    setVisible(false);
    if (event) {
      setEntities(prev => [event, ...prev]);
    }
  };

  return (
    <Fragment>
      {label && (
        <Form.Label htmlFor={id || ""} className="form-label text-default">
          {label}
        </Form.Label>
      )}
      <Select
        id={id}
        className="w-100"
        value={value}
        placeholder={placeholder}
        onPopupScroll={handlePopupScroll}
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={() => true}
        showSearch
        onSearch={handleRemoteMethod}
        onBlur={handleBlur}
        optionLabelProp="label"
        onChange={handleChange}
        onClear={handleClear}
        onDeselect={handleRemoveTag}
        onClick={handleClick}
        mode={multiple ? "multiple" : undefined}
        allowClear={true}
        maxTagCount={maxTagCount}
        maxCount={maxCount}
        suffixIcon={suffixIcon}
        {...selectProps}
      >
        {addButton && (
          <Option value="0" disabled>
            <div onClick={() => setVisible(true)}>Create New</div>
          </Option>
        )}
        {entities.map((entity: any) => (
          <Option
            key={resolveNesting(itemValue, entity)}
            value={resolveNesting(itemValue, entity)}
            label={resolveNesting(itemText, entity)}
            item={entity}
          >
            {itemSubText
              ? `${resolveNesting(itemText, entity)} | ${resolveNesting(
                  itemSubText,
                  entity
                )}`
              : resolveNesting(itemText, entity)}
          </Option>
        ))}
      </Select>
      {typeof children === "function" &&
        children({
          visible: visible,
          afterCreated: handleAfterCreated,
          onClose: () => setVisible(false)
        })}
    </Fragment>
  );
};

export default React.memo(LazyDropdown);
