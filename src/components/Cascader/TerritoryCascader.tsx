import useAxiosInstance from "@/hooks/useAxiosInstance";
import { RootState } from "@/redux/store";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Cascader, CascaderProps } from "antd";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { FormLabel, FormText } from "react-bootstrap";
import { useSelector } from "react-redux";

interface TerritoryCascaderDropdownProps
  extends Omit<CascaderProps, "multiple"> {
  endPoint?: string;
  name?: string;
  label?: React.ReactNode;
  childrenCount?: boolean;
  onlySelected?: boolean;
  value?: any;
  multiple?: boolean;
  feedback?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
}

const TerritoryCascader: React.FC<TerritoryCascaderDropdownProps> = ({
  endPoint = "territories",
  name = "territory_id",
  label = "Territory",
  placeholder = "Select Territory",
  feedback,
  expandTrigger = "click",
  multiple = false,
  childrenCount = true,
  onlySelected = true,
  value,
  onChange,
  ...restProps
}) => {
  const user = useSelector((state: RootState) => state.user);
  const cascaderRef = useRef<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const { axiosInstance, api } = useAxiosInstance();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    if (value) {
      setSelectedOptions(value);
    }
  }, [value]);
  const loadRootOptions = useCallback(
    async (parentId: string) => {
      try {
        const response = await axiosInstance.get(
          api(`${endPoint}?parent_id=${parentId}`)
        );
        const territories = response.data.territories;

        setOptions(
          territories.map((territory: any) => ({
            label: territory.name,
            value: territory.id,
            isLeaf: !territory.children_count,
            children_count: territory.children_count
          }))
        );
      } catch (error) {
        console.error("Failed to load root territories:", error);
      }
    },
    [axiosInstance, api, endPoint]
  );

  const lazyLoad = useCallback(
    async (selectedOptions: any) => {
      if (!selectedOptions.length) {
        return;
      }

      const targetOption = selectedOptions[selectedOptions.length - 1];
      if (!targetOption) {
        return;
      }

      const parentId = targetOption.value;

      try {
        const response = await axiosInstance.get(
          api(`${endPoint}?parent_id=${parentId}`)
        );
        const territories = response.data.territories;

        targetOption.children = territories.map((territory: any) => ({
          label: territory.name,
          value: territory.id,
          isLeaf: !territory.children_count,
          children_count: territory.children_count
        }));

        setOptions([...options]);
      } catch (error) {
        console.error("Failed to load child territories:", error);
      }
    },
    [axiosInstance, api, endPoint, options]
  );

  useEffect(() => {
    let parentId: string = "";
    if (user && user.territory && user.territory.parent_id) {
      parentId = user.territory.parent_id.toString();
    }
    if (initialLoad) {
      loadRootOptions(parentId);
      setInitialLoad(false);
    }
  }, [user, loadRootOptions, initialLoad]);

  const handleChange = (value: any) => {
    setSelectedOptions(value);
    if (onChange) {
      onChange(
        onlySelected
          ? Array.isArray(value)
            ? value[value.length - 1]
            : undefined
          : value
      );
    }
    // if (!multiple && cascaderRef.current) {
    //   // cascaderRef.current.blur();
    // }
  };

  const displayRender = (label: string[], selectedOptions?: any[]) => {
    return onlySelected || !multiple
      ? label[label.length - 1]
      : label.map((option, index) => {
          const currentOption = selectedOptions?.[index];
          if (currentOption && childrenCount && !currentOption.isLeaf) {
            return (
              <span key={option}>
                {option} ({currentOption.children_count})
                {index < label.length - 1 && " "}
                {index < label.length - 1 && <ArrowRightOutlined />}
              </span>
            );
          }
          return (
            <span key={option}>
              {option}
              {index < label.length - 1 && " "}
              {index < label.length - 1 && <ArrowRightOutlined />}
            </span>
          );
        });
  };

  const optionRender = (option: any) => {
    return (
      <>
        <span>{option.label}</span>
        {childrenCount && !option.isLeaf && (
          <span style={{ float: "right" }}> ({option.children_count})</span>
        )}
      </>
    );
  };

  const cascaderProps: CascaderProps = {
    placeholder,
    expandTrigger,
    maxTagCount: "responsive",
    options,
    displayRender,
    changeOnSelect: true,
    style: { width: "100%" },
    ...restProps
  };

  if (options.length > 0) cascaderProps.optionRender = optionRender;

  return (
    <Fragment>
      {label && (
        <FormLabel
          htmlFor={restProps.id || ""}
          className="form-label text-default"
        >
          {label}
        </FormLabel>
      )}
      <Cascader
        ref={cascaderRef}
        value={selectedOptions}
        loadData={lazyLoad}
        onChange={handleChange}
        multiple={multiple as any}
        {...cascaderProps}
      />
      {feedback && <FormText className="text-danger">{feedback}</FormText>}
    </Fragment>
  );
};

export default React.memo(TerritoryCascader);
