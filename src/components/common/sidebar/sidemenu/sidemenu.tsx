export const MENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      {
        icon: <i className="side-menu__icon bx bx-home"></i>,
        type: "sub",
        Name: "",
        active: false,
        selected: false,
        title: "Dashboards",
        badge: "",
        badgetxt: "",
        class: "badge bg-warning-transparent ms-2",
        children: [
          {
            path: `${import.meta.env.BASE_URL}dashboards`,
            type: "link",
            active: false,
            selected: false,
            title: "DMS"
          }
        ]
      }
    ]
  },

  {
    menutitle: "WEB APPS",
    Items: [
      {

        title: "Authentication",
        icon: <i className="bx bx-fingerprint side-menu__icon"></i>,
        type: "sub",
        selected: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}roles`,
            title: "Roles",
            type: "link",
            active: false,
            selected: false
          },
          {
            path: `${import.meta.env.BASE_URL}users`,
            title: "Users",
            type: "link",
            active: false,
            selected: false
          },
          {
            path: `${import.meta.env.BASE_URL}users-app-info`,
            title: "Users App Info",
            type: "link",
            active: false,
            selected: false
          }
        ]
      },
      {

        title: "Customer Master",
        icon: <i className="las la-store side-menu__icon"></i>,
        type: "sub",
        selected: false,
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}department/channel`,
            title: "Channel",
            type: "link",
            active: false,
            selected: false
          },
          {
            path: `${import.meta.env.BASE_URL}department/badges`,
            title: "Badge",
            type: "link",
            active: false,
            selected: false
          },
          {
            path: `${import.meta.env.BASE_URL}department/category`,
            title: "Category",
            type: "link",
            active: false,
            selected: false
          },
          {
            path: `${import.meta.env.BASE_URL}department/location-type`,
            title: "Location Type",
            type: "link",
            active: false,
            selected: false
          }
        ]
      }
    ]
  }
];
