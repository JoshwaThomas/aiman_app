import Invoice from "@/pages/invoice";
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
} from "react-icons/fi";
import { IoIosPaper } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  // {
  //   icon: IoIosPaper,
  //   name: "Enquiry",
  //   path:'/pending',
  //   // onClick: () => useNavigate()("/pending"),
  //   routes: [
  //     {
  //       path: "/pending",
  //       name: "Pending",
  //     },
  //     {
  //       path: "/rejected",
  //       name: "Rejected",
  //     },
  //     {
  //       path: "/approved",
  //       name: "Approved",
  //     },
  //   ],
  // },

  // {
  //   icon: FiSlack,
  //   name: "Products",
  //   path: "/products",
  //   // routes: [
  //   //   {
  //   //     path: "/products",
  //   //     name: "Products",
  //   //   },
  //   //   // {
  //   //   //   path: "/categories",
  //   //   //   name: "Categories",
  //   //   // },
  //   //   // {
  //   //   //   path: "/attributes",
  //   //   //   name: "Attributes",
  //   //   // },
  //   //   // {
  //   //   //   path: "/coupons",
  //   //   //   name: "Coupons",
  //   //   // },
  //   // ],
  // },
  {
    path: "/application",
    icon: FiUsers,
    name: "Application Form",
  },
  {
    path: "/application-prev",
    icon: FiUsers,
    name: "Print Application",
  },
  // {
  //   path: "/invoice",
  //   icon: FiUsers,
  //   name: "Invoice",
  // },
  // {
  //   path: "/payment",
  //   icon: FiUsers,
  //   name: "Payment",
  // },
  // {
  //   path: "/renewal",
  //   icon: FiCompass,
  //   name: "Renewal",
  // },
  // {
  //   path: "/customers",
  //   icon: FiUsers,
  //   name: "Customers",
  // },
  // {
  //   path: "/orders",
  //   icon: FiCompass,
  //   name: "Orders",
  // },

  // {
  //   path: "/our-staff",
  //   icon: FiUser,
  //   name: "OurStaff",
  // },

  // {
  //   path: "/settings?settingTab=common-settings",
  //   icon: FiSettings,
  //   name: "Settings",
  // },
  // {
  //   icon: FiGlobe,
  //   name: "International",
  //   routes: [
  //     {
  //       path: "/languages",
  //       name: "Languages",
  //     },
  //     {
  //       path: "/currencies",
  //       name: "Currencies",
  //     },
  //   ],
  // },
  // {
  //   icon: FiTarget,
  //   name: "OnlineStore",
  //   routes: [
  //     {
  //       name: "ViewStore",
  //       path: "http://localhost:3000",
  //       outside: "store",
  //     },

  //     {
  //       path: "/store/customization",
  //       name: "StoreCustomization",
  //     },
  //     {
  //       path: "/store/store-settings",
  //       name: "StoreSettings",
  //     },
  //   ],
  // },

  // {
  //   icon: FiSlack,
  //   name: "Pages",
  //   routes: [
  //     // submenu

  //     {
  //       path: "/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/coming-soon",
  //       name: "Coming Soon",
  //     },
  //   ],
  // },
];

export default sidebar;
