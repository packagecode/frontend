import React from "react";
import { Fragment } from "react/jsx-runtime";
import LazyDropdown, { LazyDropdownProps } from "./lazyDropdown";

interface TerritoryLazyDropdownProps
  extends Omit<LazyDropdownProps, "endPoint" | "placeholder" | "resourceKey"> {
  endPoint?: string;
  resourceKey?: string;
  placeholder?: string;
}

const TerritoryLazyDropdown: React.FC<TerritoryLazyDropdownProps> = ({
  itemText = "name",
  itemSubText = "",
  itemValue = "id",
  endPoint = "territories",
  resourceKey = "territories",
  searchableKey = "q",
  landlord = false,
  addButton = false,
  apiVersion = 1,
  placeholder = "Select Territory",
  label = "Territory",
  name = "territory_id",
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
  return (
    <Fragment>
      <LazyDropdown
        itemText={itemText}
        itemSubText={itemSubText}
        itemValue={itemValue}
        endPoint={endPoint}
        resourceKey={resourceKey}
        searchableKey={searchableKey}
        landlord={landlord}
        addButton={addButton}
        apiVersion={apiVersion}
        placeholder={placeholder}
        label={label}
        id={id}
        value={value}
        onClear={onClear}
        onChange={onChange}
        onRemoveTag={onRemoveTag}
        onClick={onClick}
        multiple={multiple}
        maxTagCount={maxTagCount}
        maxCount={maxCount}
        suffixIcon={suffixIcon}
        {...selectProps}
      >
        {/* { addButton && ({ visible, afterCreated, onClose }) => (
          <span>Create Element here</span>
        )} */}
      </LazyDropdown>
    </Fragment>
  );
};

export default React.memo(TerritoryLazyDropdown);
