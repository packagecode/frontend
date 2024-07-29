import { EncryptDataTypes } from "@/enums/EncryptDataTypes.tsx";
import { storageToDecrypt } from "@/hooks/useEncrypt.tsx";
import User from "@/interface/User.ts";
import img1 from "../assets/images/ecommerce/png/1.png";
import img10 from "../assets/images/ecommerce/png/10.png";
import img11 from "../assets/images/ecommerce/png/11.png";
import img12 from "../assets/images/ecommerce/png/12.png";
import img2 from "../assets/images/ecommerce/png/2.png";
import img3 from "../assets/images/ecommerce/png/3.png";
import img4 from "../assets/images/ecommerce/png/4.png";
import img5 from "../assets/images/ecommerce/png/5.png";
import img6 from "../assets/images/ecommerce/png/6.png";
import img7 from "../assets/images/ecommerce/png/7.png";
import img8 from "../assets/images/ecommerce/png/8.png";
import img9 from "../assets/images/ecommerce/png/9.png";
import { Maindata } from "../container/dashboards/ecommercedata";
import {
  ADD_TO_CART,
  PRODUCT,
  SET_SUBDOMAIN,
  THEME_CHANGER
} from "./actionType.tsx";

const STORAGE_SETTINGS = storageToDecrypt(EncryptDataTypes.SETTINGS_KEY);
const STORAGE_ALL_PERMISSION = storageToDecrypt(
  EncryptDataTypes.ALL_PERMISSIONS_KEY
);
const STORAGE_USER: User | null = storageToDecrypt(EncryptDataTypes.USER_KEY);

const STORAGE_USER_PERMISSION = storageToDecrypt(
  EncryptDataTypes.USER_PERMISSION_KEY
);
const STORAGE_USER_ROLES = storageToDecrypt(EncryptDataTypes.USER_ROLES_KEY);

export const initialState = {
  domain: "",
  lang: "en",
  dir: "ltr",
  dataThemeMode: "light",
  dataMenuStyles: "dark",
  dataNavLayout: "vertical",
  dataHeaderStyles: "light",
  dataVerticalStyle: "overlay",
  StylebodyBg: "107 64 64",
  StyleDarkBg: "93 50 50",
  toggled: "",
  dataNavStyle: "",
  horStyle: "",
  dataPageStyle: "regular",
  dataWidth: "fullwidth",
  dataMenuPosition: "fixed",
  dataHeaderPosition: "fixed",
  loader: "disable",
  iconOverlay: "",
  colorPrimaryRgb: "",
  bodyBg1: "",
  bodyBg2: "",
  darkBg: "",
  inputBorder: "",
  bgImg: "",
  iconText: "",
  body: {
    class: ""
  },
  ecommercedata: [
    {
      id: "1",
      preview: img1,
      title: "Dapzem & Co",
      description: "Branded hoodie ethnic style",
      oldpr: "$229",
      newpr: "$1,799",
      offerprice: "$229",
      quantity: 1,
      images: [{ img: img1 }, { img: img1 }, { img: img1 }]
    },
    {
      id: "2",
      preview: img2,
      title: "Denim Winjo",
      description: "Vintage pure leather Jacket",
      oldpr: "$599",
      newpr: "$2,499",
      offerprice: "$599",
      quantity: 2,
      images: [{ img: img2 }, { img: img2 }, { img: img2 }],
      ribbon: ""
    },
    {
      id: "3",
      preview: img3,
      title: "Jimmy Lolfiger",
      description: "Unisex jacket for men & women",
      oldpr: "$1,199",
      newpr: "$3,299",
      offerprice: "$1,199",
      quantity: 1,
      images: [{ img: img3 }, { img: img3 }, { img: img3 }],
      ribbon: ""
    },
    {
      id: "4",
      preview: img4,
      title: "Bluberry Co.In",
      description: "Full sleeve white hoodie",
      oldpr: "$349",
      newpr: "$1,299",
      offerprice: "$349",
      quantity: 1,
      images: [{ img: img4 }, { img: img4 }, { img: img4 }],
      ribbon: ""
    },
    {
      id: "5",
      preview: img5,
      title: "Aus Polo Assn",
      description: "Snow jacket with low pockets",
      oldpr: "$1,899",
      newpr: "$3,799",
      offerprice: "$1,899",
      quantity: 1,
      images: [{ img: img5 }, { img: img5 }, { img: img5 }]
    },
    {
      id: "6",
      preview: img6,
      title: "BMW",
      description: "Ethnic wear jackets form BMW",
      oldpr: "$1,499",
      newpr: "$2,499",
      offerprice: "$1,499",
      quantity: 1,
      images: [{ img: img6 }, { img: img6 }, { img: img6 }]
    },
    {
      id: "7",
      preview: img7,
      title: "Denim Corporation",
      description: "Flap pockets denim jackets for men",
      oldpr: "$299",
      newpr: "$399",
      offerprice: "$299",
      quantity: 1,
      images: [{ img: img7 }, { img: img7 }, { img: img7 }],
      ribbon: ""
    },
    {
      id: "8",
      preview: img8,
      title: "Pufa",
      description: "Ergonic designed full sleeve coat",
      oldpr: "$2,399",
      newpr: "$5,699",
      offerprice: "$2,399",
      quantity: 1,
      images: [{ img: img8 }, { img: img8 }, { img: img8 }],
      ribbon: ""
    },
    {
      id: "9",
      preview: img9,
      title: "Louie Phillippe",
      description: "Ergonic green colored full sleeve jacket",
      oldpr: "$1,899",
      newpr: "$3,299",
      offerprice: "$1,899",
      quantity: 1,
      images: [{ img: img9 }, { img: img9 }, { img: img9 }]
    },

    {
      id: "10",
      preview: img10,
      title: "Denim Corp",
      description: "beautiful brown colored snow jacket",
      oldpr: "$2,499",
      newpr: "$4,999",
      offerprice: "$499",
      quantity: 1,
      images: [{ img: img10 }, { img: img10 }, { img: img10 }]
    },

    {
      id: "11",
      preview: img11,
      title: "Garage & Co",
      description: "Full sleeve sweat shirt",
      oldpr: "$249",
      newpr: "$1,299",
      offerprice: "$249",
      quantity: 1,
      images: [{ img: img11 }, { img: img11 }, { img: img11 }]
    },
    {
      id: "12",
      preview: img12,
      title: "Blueberry & Co",
      description: "Light colored sweater form blueberry",
      oldpr: "$499",
      newpr: "$799",
      offerprice: "$499",
      quantity: 1,
      images: [{ img: img12 }, { img: img12 }, { img: img12 }]
    }
  ],
  apiEndPoint: import.meta.env.VITE_APP_API_ENDPOINT || "",
  cdnEndPoint:
    import.meta.env.VITE_APP_ASSET_URL || import.meta.env.VITE_APP_API_ENDPOINT,
  defaultDashboard: "dashboards",
  user: STORAGE_USER,
  roles: STORAGE_USER_ROLES,
  settings: STORAGE_SETTINGS,
  permissions: STORAGE_USER_PERMISSION,
  allPermissions: STORAGE_ALL_PERMISSION,
  isLoggedIn:
    (localStorage.getItem("isLogin") && STORAGE_USER && STORAGE_USER?.id) ||
    false
};

export default function reducer(state = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case THEME_CHANGER:
      state = payload;
      return state;

    case ADD_TO_CART:
      state.ecommercedata = Maindata.filter((idx: any) => {
        return idx.id == payload;
      });
      return state;

    case PRODUCT:
      state.ecommercedata = state.ecommercedata.filter((idx: any) => {
        return idx.id == payload;
      });
      return state;

    case SET_SUBDOMAIN:
      state.apiEndPoint = state.apiEndPoint.replace("variable", payload);
      state.domain = payload;
      return state;

    default:
      return state;
  }
}