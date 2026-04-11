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
  {
    path: "/application-list",
    icon: FiUsers,
    name: "Application List",
  },
  {
    path: "/application-completed",
    icon: FiUsers,
    name: "Application Completed",
  },
];

export default sidebar;
