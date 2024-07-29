import TaxonomyJson from "@/assets/json/Taxonomy.json";
import { EncryptDataTypes } from "@/enums/EncryptDataTypes";
import { Permission as PermissionEnums } from "@/enums/Permission";
import useSettingsActions from "@/hooks/useSettingsActions";
import Permission from "@/interface/Permission";
import Taxonomy from "@/interface/Taxonomy";
import useEncrypt from "./useEncrypt";

const useSokrioActions = () => {
  const { getTaxonomyStore } = useSettingsActions(); //updateSettings,
  const getTaxonomy = (label: any) => {
    let currentLabel: any = "";
    const taxonomy = getTaxonomyStore();
    let taxonomyArray: Taxonomy[] = [];
    if (taxonomy) {
      taxonomyArray =
        typeof taxonomy == "string" ? JSON.parse(taxonomy) : taxonomy;
    } else {
      taxonomyArray = TaxonomyJson;
    }
    taxonomyArray.forEach((taxonomy: any) => {
      if (Object.keys(taxonomy)[0] == label) {
        currentLabel = Object.values(taxonomy)[0];
      }
    });
    return currentLabel;
  };

  const permissionGroup = () => {
    const { decryptData } = useEncrypt();
    const allPermissionLocal = localStorage.getItem(
      EncryptDataTypes.ALL_PERMISSIONS_KEY
    );
    const allPermissionLists: Permission[] =
      allPermissionLocal === null
        ? []
        : JSON.parse(decryptData(allPermissionLocal));

    const permissionGroups = [
      [
        {
          label: "Web Application",
          id: 10000,
          children: [
            {
              label: "Dashboard",
              id: 10001,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name === PermissionEnums.DAILY_DATA_DASHBOARD ||
                  result.name === PermissionEnums.MISCELLANEOUS_DASHBOARD ||
                  result.name === PermissionEnums.SALES_GROWTH_DASHBOARD ||
                  result.name === PermissionEnums.OUTLET_ORDER_DASHBOARD ||
                  result.name === PermissionEnums.BASIC_REPORTING_DASHBOARD ||
                  result.name === PermissionEnums.OUTLET_HEAT_MAP_DASHBOARD ||
                  result.name === PermissionEnums.BRAND_REPORTING_DASHBOARD
                );
              })
            },
            {
              label: "Organization",
              id: 10002,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_TERRITORY_TYPE ||
                  result.name == PermissionEnums.VIEW_TERRITORY_TYPE ||
                  result.name === PermissionEnums.UPDATE_TERRITORY_TYPE ||
                  result.name === PermissionEnums.DELETE_TERRITORY_TYPE ||
                  result.name === PermissionEnums.CREATE_TERRITORY ||
                  result.name === PermissionEnums.VIEW_TERRITORY ||
                  result.name === PermissionEnums.UPDATE_TERRITORY ||
                  result.name === PermissionEnums.DELETE_TERRITORY ||
                  result.name === PermissionEnums.CREATE_CHANNEL ||
                  result.name === PermissionEnums.VIEW_CHANNEL ||
                  result.name === PermissionEnums.UPDATE_CHANNEL ||
                  result.name === PermissionEnums.DELETE_CHANNEL ||
                  result.name === PermissionEnums.CREATE_DEPARTMENT ||
                  result.name === PermissionEnums.VIEW_DEPARTMENT ||
                  result.name === PermissionEnums.UPDATE_DEPARTMENT ||
                  result.name === PermissionEnums.DELETE_DEPARTMENT
                );
              })
            },
            {
              label: "User",
              id: 10003,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_ROLE ||
                  result.name == PermissionEnums.VIEW_ROLE ||
                  result.name === PermissionEnums.UPDATE_ROLE ||
                  result.name === PermissionEnums.UPDATE_ROLE ||
                  result.name === PermissionEnums.DELETE_ROLE ||
                  result.name === PermissionEnums.CREATE_USER ||
                  result.name === PermissionEnums.VIEW_USER ||
                  result.name === PermissionEnums.UPDATE_USER ||
                  result.name === PermissionEnums.CREATE_TARGET ||
                  result.name === PermissionEnums.VIEW_TARGET ||
                  result.name === PermissionEnums.UPDATE_TARGET ||
                  result.name === PermissionEnums.DELETE_TARGET ||
                  result.name === PermissionEnums.CREATE_TRAVEL_ALLOWANCE ||
                  result.name === PermissionEnums.VIEW_TRAVEL_ALLOWANCE ||
                  result.name === PermissionEnums.APPROVE_TRAVEL_ALLOWANCE ||
                  result.name === PermissionEnums.DELETE_TRAVEL_ALLOWANCE
                );
              })
            },
            {
              label: "Payment",
              id: 10004,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_PAYMENT ||
                  result.name === PermissionEnums.CREATE_PAYMENT ||
                  result.name === PermissionEnums.APPROVE_PAYMENT ||
                  result.name === PermissionEnums.CREATE_ADVANCE_PAYMENT ||
                  result.name === PermissionEnums.VIEW_ADVANCE_PAYMENT ||
                  result.name === PermissionEnums.UPDATE_ADVANCE_PAYMENT ||
                  result.name === PermissionEnums.CREATE_DEPARTMENT_WALLET ||
                  result.name === PermissionEnums.UPDATE_DEPARTMENT_WALLET
                );
              })
            },
            {
              label: "Tracking",
              id: 10005,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_VISIT_PLAN ||
                  result.name == PermissionEnums.VIEW_VISIT_PLAN ||
                  result.name == PermissionEnums.UPDATE_VISIT_PLAN ||
                  result.name === PermissionEnums.DELETE_VISIT_PLAN ||
                  result.name === PermissionEnums.VIEW_PROPOSED_ROUTE_PLAN ||
                  result.name === PermissionEnums.APPROVE_PROPOSED_ROUTE_PLAN ||
                  result.name === PermissionEnums.VIEW_FIELD_FORCE ||
                  result.name === PermissionEnums.UPLOAD_BULK_ROUTE_PLAN ||
                  result.name === PermissionEnums.VIEW_MAP
                );
              })
            },
            {
              label: "Inspection",
              id: 10006,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_SURVEY ||
                  result.name == PermissionEnums.VIEW_SURVEY ||
                  result.name == PermissionEnums.UPDATE_SURVEY ||
                  result.name === PermissionEnums.ASSIGNED_USER_SURVEY ||
                  result.name === PermissionEnums.REPORT_SURVEY ||
                  result.name === PermissionEnums.DELETE_SURVEY ||
                  result.name == PermissionEnums.CREATE_ASSET ||
                  result.name == PermissionEnums.VIEW_ASSET ||
                  result.name === PermissionEnums.UPDATE_ASSET ||
                  result.name === PermissionEnums.DELETE_ASSET ||
                  result.name === PermissionEnums.CREATE_CAMPAIGN ||
                  result.name === PermissionEnums.VIEW_CAMPAIGN ||
                  result.name === PermissionEnums.UPDATE_CAMPAIGN ||
                  result.name === PermissionEnums.DELETE_CAMPAIGN ||
                  result.name === PermissionEnums.CREATE_OUTLET_ITEM ||
                  result.name === PermissionEnums.VIEW_OUTLET_ITEM ||
                  result.name === PermissionEnums.UPDATE_OUTLET_ITEM ||
                  result.name === PermissionEnums.DELETE_OUTLET_ITEM ||
                  result.name === PermissionEnums.VIEW_AUDIT ||
                  result.name === PermissionEnums.CREATE_QUESTION ||
                  result.name === PermissionEnums.VIEW_QUESTION ||
                  result.name === PermissionEnums.UPDATE_QUESTION ||
                  result.name === PermissionEnums.DELETE_QUESTION
                );
              })
            },
            {
              label: "Secondary " + getTaxonomy("order"),
              id: 10007,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_ORDER ||
                  result.name == PermissionEnums.APPROVE_ORDER ||
                  result.name == PermissionEnums.CREATE_REQUISITION ||
                  result.name === PermissionEnums.UPDATE_REQUISITION ||
                  result.name == PermissionEnums.VIEW_REQUISITION ||
                  result.name == PermissionEnums.APPROVE_REQUISITION ||
                  result.name === PermissionEnums.VIEW_SALES_RETURN ||
                  result.name === PermissionEnums.CREATE_INVOICE ||
                  result.name === PermissionEnums.VIEW_INVOICE ||
                  result.name === PermissionEnums.UPDATE_INVOICE ||
                  result.name === PermissionEnums.APPROVE_INVOICE ||
                  result.name === PermissionEnums.CREATE_READY_TO_DISPATCH ||
                  result.name === PermissionEnums.VIEW_READY_TO_DISPATCH ||
                  result.name === PermissionEnums.UPDATE_READY_TO_DISPATCH ||
                  result.name === PermissionEnums.APPROVE_READY_TO_DISPATCH ||
                  result.name === PermissionEnums.CREATE_READY_TO_DELIVERY ||
                  result.name === PermissionEnums.VIEW_READY_TO_DELIVERY ||
                  result.name === PermissionEnums.UPDATE_READY_TO_DELIVERY ||
                  result.name === PermissionEnums.APPROVE_READY_TO_DELIVERY ||
                  result.name === PermissionEnums.VIEW_DELIVERY ||
                  result.name ===
                    PermissionEnums.INVOICE_BULK_ACTION_FOR_DELIVERY
                );
              })
            },
            {
              label: "Primary " + getTaxonomy("order"),
              id: 10008,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_PRIMARY_ORDER ||
                  result.name == PermissionEnums.VIEW_PRIMARY_SALES_RETURN ||
                  result.name == PermissionEnums.VIEW_PRIMARY_INVOICE ||
                  result.name ===
                    PermissionEnums.VIEW_PRIMARY_READY_TO_DISPATCH ||
                  result.name ==
                    PermissionEnums.VIEW_PRIMARY_READY_TO_DELIVERY ||
                  result.name == PermissionEnums.VIEW_PRIMARY_DELIVERY
                );
              })
            },
            {
              label: "Inventory",
              id: 10009,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_PRODUCT_CATEGORY ||
                  result.name == PermissionEnums.VIEW_PRODUCT_CATEGORY ||
                  result.name == PermissionEnums.UPDATE_PRODUCT_CATEGORY ||
                  result.name === PermissionEnums.DELETE_PRODUCT_CATEGORY ||
                  result.name === PermissionEnums.CREATE_PRODUCT_BRAND ||
                  result.name === PermissionEnums.VIEW_PRODUCT_BRAND ||
                  result.name === PermissionEnums.UPDATE_PRODUCT_BRAND ||
                  result.name === PermissionEnums.DELETE_PRODUCT_BRAND ||
                  result.name === PermissionEnums.CREATE_PRODUCT ||
                  result.name === PermissionEnums.VIEW_PRODUCT ||
                  result.name === PermissionEnums.UPDATE_PRODUCT ||
                  result.name === PermissionEnums.DELETE_PRODUCT ||
                  result.name === PermissionEnums.CREATE_VARIANT_CATEGORY ||
                  result.name === PermissionEnums.VIEW_VARIANT_CATEGORY ||
                  result.name === PermissionEnums.UPDATE_VARIANT_CATEGORY ||
                  result.name === PermissionEnums.DELETE_VARIANT_CATEGORY ||
                  result.name === PermissionEnums.CREATE_UNIT_CATEGORY ||
                  result.name === PermissionEnums.VIEW_UNIT_CATEGORY ||
                  result.name === PermissionEnums.UPDATE_UNIT_CATEGORY ||
                  result.name === PermissionEnums.DELETE_UNIT_CATEGORY ||
                  result.name === PermissionEnums.CREATE_BATCH ||
                  result.name === PermissionEnums.VIEW_BATCH ||
                  result.name === PermissionEnums.UPDATE_BATCH ||
                  result.name === PermissionEnums.DELETE_BATCH ||
                  result.name === PermissionEnums.CREATE_PROMOTION ||
                  result.name === PermissionEnums.VIEW_PROMOTION ||
                  result.name === PermissionEnums.UPDATE_PROMOTION ||
                  result.name === PermissionEnums.DELETE_PROMOTION ||
                  result.name === PermissionEnums.CREATE_PRIORITY_PRODUCT ||
                  result.name === PermissionEnums.VIEW_PRIORITY_PRODUCT ||
                  result.name === PermissionEnums.UPDATE_PRIORITY_PRODUCT ||
                  result.name === PermissionEnums.PRIORITY_PRODUCT_STATUS ||
                  result.name === PermissionEnums.PRODUCT_PRICE_BULK_UPLOAD
                );
              })
            },
            {
              label: "Stock",
              id: 10010,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_STOCK ||
                  result.name == PermissionEnums.STOCK_DOWNLOAD ||
                  result.name == PermissionEnums.BULK_STOCK ||
                  result.name == PermissionEnums.ADD_SINGLE_STOCK_MANUALLY
                );
              })
            },
            {
              label: "Attendance",
              id: 10011,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_ATTENDANCE ||
                  result.name === PermissionEnums.CREATE_LEAVE ||
                  result.name === PermissionEnums.VIEW_LEAVE ||
                  result.name === PermissionEnums.APPROVE_LEAVE ||
                  result.name === PermissionEnums.DELETE_LEAVE
                );
              })
            },
            {
              label: "Setting",
              id: 10012,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.APPROVAL_SETTINGS ||
                  result.name === PermissionEnums.TAXONOMY_SETTINGS ||
                  result.name === PermissionEnums.SMS_SETTINGS ||
                  result.name === PermissionEnums.ATTENDANCE_SETTINGS ||
                  result.name === PermissionEnums.PRODUCT_SETTINGS ||
                  result.name === PermissionEnums.TRACKING_SETTING ||
                  result.name === PermissionEnums.UPDATE_SETTING
                );
              })
            },
            {
              label: "Report",
              id: 10013,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.VIEW_REPORT ||
                  result.name === PermissionEnums.SALES_REPORT ||
                  result.name === PermissionEnums.SALES_ORDER_REPORT ||
                  result.name === PermissionEnums.SR_WISE_SALES_REPORT ||
                  result.name === PermissionEnums.PRODUCT_WISE_SALES_REPORT ||
                  result.name === PermissionEnums.VISIT_TARGET_REPORT ||
                  result.name === PermissionEnums.TRACKING_REPORT ||
                  result.name === PermissionEnums.KPI_REPORT ||
                  result.name === PermissionEnums.PRODUCT_BASED_REPORT ||
                  result.name === PermissionEnums.HR_TRAVEL_ALLOWANCE_REPORT ||
                  result.name === PermissionEnums.HR_CHECKIN_REPORT ||
                  result.name === PermissionEnums.HR_TRACKING_REPORT ||
                  result.name === PermissionEnums.ACTIVE_USER_REPORT ||
                  result.name === PermissionEnums.DAILY_CALL_REPORT ||
                  result.name === PermissionEnums.PERFORMANCE_BOARD_REPORT ||
                  result.name === PermissionEnums.NOT_ORDERED_REPORT ||
                  result.name ===
                    PermissionEnums.TARGET_VS_ACHIEVEMENT_REPORT ||
                  result.name === PermissionEnums.PAYMENT_SUMMARY_REPORT ||
                  result.name === PermissionEnums.OUTLET_REPORT ||
                  result.name === PermissionEnums.ORDER_REJECTION_REPORT ||
                  result.name === PermissionEnums.BOUNCE_RATE_REPORT ||
                  result.name === PermissionEnums.ORDER_SUMMARY_REPORT ||
                  result.name === PermissionEnums.DELIVERY_SUMMARY_REPORT ||
                  result.name === PermissionEnums.ECO_REPORT ||
                  result.name === PermissionEnums.STOCK_SUMMARY_REPORT ||
                  result.name ===
                    PermissionEnums.CHECKIN_SUMMARY_DETAILS_REPORT ||
                  result.name === PermissionEnums.PRIORITY_PRODUCT_REPORT ||
                  result.name ===
                    PermissionEnums.PRODUCT_PRICE_HISTORY_REPORT ||
                  result.name === PermissionEnums.STOCK_HISTORY_REPORT ||
                  result.name ===
                    PermissionEnums.STOCK_SUMMARY_DETAILS_REPORT ||
                  result.name === PermissionEnums.VIEW_LOGIN_HISTORY_REPORT ||
                  result.name === PermissionEnums.VIEW_VISIT_COVERAGE_REPORT ||
                  result.name === PermissionEnums.HR_VISIT_REPORT ||
                  result.name === PermissionEnums.HR_DAY_IN_DAY_OUT_REPORT
                );
              })
            },
            {
              label: "Custom Report",
              id: 10014,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.CREATE_CUSTOME_REPORT ||
                  result.name === PermissionEnums.VIEW_CUSTOME_ORDER_REPORT ||
                  result.name === PermissionEnums.VIEW_CUSTOME_DELIVERY_REPORT
                );
              })
            },
            {
              label: "Supervisor Report",
              id: 10015,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.SUPERVISOR_REPORT ||
                  result.name === PermissionEnums.SUPERVISOR_CHECKIN_REPORT
                );
              })
            },
            {
              label: "Sms",
              id: 10016,
              children: allPermissionLists.filter(function (result: any) {
                return (
                  result.name == PermissionEnums.BULK_SMS ||
                  result.name === PermissionEnums.VIEW_MESSAGE ||
                  result.name === PermissionEnums.SMS_MARKETING_CAMPAIGN
                );
              })
            },
            {
              label: "Billing Info",
              id: 10017,
              children: allPermissionLists.filter(function (result: any) {
                return result.name == PermissionEnums.MANAGE_BILLING;
              })
            }
            // {
            //     label: 'Transaction',
            //     id: 10018,
            //     children: allPermissionLists.filter(function (result: any) {
            //         return result.name == PermissionEnums.VIEW_TRANSACTION_REPORT
            //     }),
            // }
          ]
        }
      ],
      [
        {
          id: 20000,
          label: "Mobile Application",
          children: allPermissionLists.filter(function (result: any) {
            return (
              result.name ==
                PermissionEnums.PROFILE_INFORMATION_CHANGE_MOBILE ||
              result.name == PermissionEnums.VIEW_OUTLET_MOBILE ||
              result.name == PermissionEnums.CHECKIN_MOBILE ||
              result.name == PermissionEnums.MAP_MOBILE ||
              result.name == PermissionEnums.CREATE_OUTLET_MOBILE ||
              result.name == PermissionEnums.UPDATE_OUTLET_MOBILE ||
              result.name == PermissionEnums.ORDER_MOBILE ||
              result.name == PermissionEnums.CREATE_ORDER_MOBILE ||
              result.name == PermissionEnums.VIEW_ORDER_MOBILE ||
              result.name == PermissionEnums.CREATE_SALES_RETURN_MOBILE ||
              result.name == PermissionEnums.PAYMENT_MOBILE ||
              result.name == PermissionEnums.INVOICE_MOBILE ||
              result.name == PermissionEnums.DELIVERY_MOBILE ||
              result.name == PermissionEnums.DELIVERY_LIST_MOBILE ||
              result.name == PermissionEnums.INSPECTION_MOBILE ||
              result.name == PermissionEnums.ROUTE_PLAN_MOBILE ||
              result.name == PermissionEnums.TRAVEL_ALLOWANCE_MOBILE ||
              result.name ==
                PermissionEnums.CREATE_PROPOSED_ROUTE_PLAN_MOBILE ||
              result.name ==
                PermissionEnums.UPDATE_PROPOSED_ROUTE_PLAN_MOBILE ||
              result.name == PermissionEnums.LEAVE_REQUEST_MOBILE ||
              result.name == PermissionEnums.ORDER_CUSTOM_DISCOUNT_MOBILE ||
              result.name == PermissionEnums.VIEW_STOCK ||
              result.name === PermissionEnums.VIEW_PRIORITY_PRODUCT ||
              result.name === PermissionEnums.DAILY_DATA_DASHBOARD ||
              result.name === PermissionEnums.KPI_REPORT ||
              result.name == PermissionEnums.VIEW_REPORT
            );
          })
        }
      ],
      [
        {
          id: 30000,
          label: "Supervisor Application",
          children: allPermissionLists.filter(function (result: any) {
            return (
              result.name == PermissionEnums.VIEW_OUTLET_MOBILE ||
              result.name == PermissionEnums.CHECKIN_MOBILE ||
              result.name == PermissionEnums.MAP_MOBILE ||
              result.name == PermissionEnums.VIEW_ORDER_MOBILE ||
              result.name == PermissionEnums.INVOICE_MOBILE ||
              result.name == PermissionEnums.DELIVERY_LIST_MOBILE ||
              result.name == PermissionEnums.ORDER_CUSTOM_DISCOUNT_MOBILE ||
              result.name === PermissionEnums.VIEW_PRIORITY_PRODUCT ||
              result.name == PermissionEnums.CREATE_PRIMARY_ORDER_MOBILE
            );
          })
        }
      ]
    ];

    // Function to filter children based on permissions
    function filterChildrenByPermissions(
      children: any,
      allowedPermissions: any
    ) {
      return children.filter((child: any) => {
        if (child.children) {
          child.children = filterChildrenByPermissions(
            child.children,
            allowedPermissions
          );
        }
        if (!Array.isArray(child.children)) {
          return child;
        }
        return (
          child.children.length > 0 || allowedPermissions.includes(child.label)
        );
      });
    }

    permissionGroups.forEach((permissionGroup: any, index: number) => {
      permissionGroup.forEach((permission: any) => {
        if (permission.children.length > 0) {
          permission.children = filterChildrenByPermissions(
            permission.children,
            [null]
          );
        } else {
          permissionGroup.splice(permissionGroup.indexOf(permission), 1); // Remove the permissionGroup if it has no children
        }
      });
      if (permissionGroup.length == 0) {
        permissionGroups.splice(index, 1); // Remove the permissionGroups if it has no children
      }
    });

    return permissionGroups;
  };

  return {
    getTaxonomy,
    permissionGroup
  };
};

export default useSokrioActions;
