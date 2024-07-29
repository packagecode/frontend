import CreateRole from "@/pages/dashboard/authentication/roles/createRole";
import React from "react";
import { Fragment } from "react/jsx-runtime";
import LazyDropdown, { LazyDropdownProps } from "./lazyDropdown";

interface RoleLazyDropdownProps
  extends Omit<LazyDropdownProps, "endPoint" | "placeholder" | "resourceKey"> {
  endPoint?: string;
  resourceKey?: string;
  placeholder?: string;
}

const RoleLazyDropdown: React.FC<RoleLazyDropdownProps> = ({
  itemText = "name",
  itemSubText = "",
  itemValue = "id",
  endPoint = "roles",
  resourceKey = "roles",
  searchableKey = "name",
  landlord = false,
  addButton = false,
  apiVersion = 1,
  placeholder = "Select Roles",
  label = "Role",
  name = "role",
  id,
  value,
  onClear,
  onChange,
  onRemoveTag,
  onClick,
  multiple = false,
  maxTagCount,
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
        {({ visible, afterCreated, onClose }) => (
          <CreateRole
            visible={visible}
            afterCreated={afterCreated}
            onClose={onClose}
          />
        )}
      </LazyDropdown>
    </Fragment>
  );
};

export default React.memo(RoleLazyDropdown);
