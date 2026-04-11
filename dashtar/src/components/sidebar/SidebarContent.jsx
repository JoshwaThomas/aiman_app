import React, { useContext, useState } from "react";
import { NavLink, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button, WindmillContext } from "@windmill/react-ui";
import { IoLogOutOutline } from "react-icons/io5";

//internal import
// import sidebar from "@/routes/sidebar";
// // import SidebarSubMenu from "SidebarSubMenu";
// import logoDark from "@/assets/img/logo/logo-dark.png";
// // import logoLight from "@/assets/img/logo/logo-light.png";
// import { AdminContext } from "@/context/AdminContext";
// import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";

//internal import
import sidebar from "@/routes/sidebar";
// import SidebarSubMenu from "SidebarSubMenu";
import logoDark from "@/assets/img/logo/logo-dark.png";
// import logoLight from "@/assets/img/logo/logo-light.png";
import { AdminContext } from "@/context/AdminContext";
import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { dispatch, state } = useContext(AdminContext);
  const allowedMenus = state?.adminInfo?.menus || [];
  console.log('dispatch', state)
  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
  };

  // const handleOffChange = (value) => {
  //   const updatedAdminInfo = { ...state.adminInfo, off: value };
  //   dispatch({ type: "USER_LOGIN", payload: updatedAdminInfo });
  //   Cookies.set("adminInfo", JSON.stringify(updatedAdminInfo));
  // };


  return (
    <div className="py-4 text-gray-500 dark:text-gray-400 font-popi">
      <a className=" text-gray-900 dark:text-gray-200 sticky bg-white top-0" href="/dashboard">
         {mode === "dark" ? (
           // <img src={logoLight} alt="kachabazar" width="135" className="pl-6" />
           <img src={logoDark} alt="kachabazar" width="135" className="px-3 w-full" />
         ) : (
           // <img src={logoDark} alt="kachabazar" width="135" className="pl-6" />
           <img src={logoDark} alt="kachabazar" width="135" className="px-3 w-full" />
         )}
      </a>
      
      <ul className="mt-8">
        {(sidebar.filter(route => allowedMenus.includes(route.name))).map((route) =>
          route.routes ? (
            <SidebarSubMenu route={route} key={route.name} />
          ) : (
            <li className="relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className={`px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${state.adminInfo.role === 'SAdmin'? 'hover:text-red-700 dark:hover:text-red-200' : 'hover:text-sky-700 dark:hover:text-gray-200'}`}
                activeClassName={`${state.adminInfo.role === 'SAdmin'? 'bg-red-600 hover:text-white' : state.adminInfo.off === '2' ? "bg-green-400  hover:text-white" : "bg-sky-500 hover:text-white"} text-white`}
                rel="noreferrer"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className={`absolute inset-y-0 left-0 w-1 ${state.adminInfo.role === 'SAdmin'? 'bg-red-600' : state.adminInfo.off === '2' ? 'bg-green-400' : 'bg-sky-500'} rounded-tr-lg rounded-br-lg`}
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-4">{t(`${route.name}`)}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
        <Button onClick={handleLogOut} size="large" className={`w-full ${state.adminInfo.role === 'SAdmin'? 'bg-gray-400 hover:bg-red-600' : state.adminInfo.off === '2' ? 'bg-blue-400 hover:bg-green-500' : 'bg-sky-700 hover:bg-pink-700'}`}>
          <span className="flex items-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm ">{t("LogOut")}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default SidebarContent;

// import React, { useContext, useState } from "react";
// import { NavLink, Route } from "react-router-dom";
// import Cookies from "js-cookie";
// import { useTranslation } from "react-i18next";
// import { Button, WindmillContext } from "@windmill/react-ui";
// import { IoLogOutOutline } from "react-icons/io5";

// //internal import
// import sidebar from "@/routes/sidebar";
// // import SidebarSubMenu from "SidebarSubMenu";
// import logoDark from "@/assets/img/logo/logo-dark.png";
// // import logoLight from "@/assets/img/logo/logo-light.png";
// import { AdminContext } from "@/context/AdminContext";
// import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";

// const SidebarContent = () => {
//   const { t } = useTranslation();
//   const { mode } = useContext(WindmillContext);
//   const { dispatch } = useContext(AdminContext);

//   const handleLogOut = () => {
//     dispatch({ type: "USER_LOGOUT" });
//     Cookies.remove("adminInfo");
//   };

//   return (
//     <div className="py-4 text-gray-500 dark:text-gray-400">
//       <a className=" text-gray-900 dark:text-gray-200 sticky bg-white top-0" href="/dashboard">
//         {mode === "dark" ? (
//           // <img src={logoLight} alt="kachabazar" width="135" className="pl-6" />
//           <img src={logoLight} alt="kachabazar" width="135" className="px-3 w-full" />
//         ) : (
//           // <img src={logoDark} alt="kachabazar" width="135" className="pl-6" />
//           <img src={logoDark} alt="kachabazar" width="135" className="px-3 w-full" />
//         )}
//       </a>
//       <ul className="mt-8">
//         {sidebar.map((route) =>
//           route.routes ? (
//             <SidebarSubMenu route={route} key={route.name} />
//           ) : (
//             <li className="relative" key={route.name}>
//               <NavLink
//                 exact
//                 to={route.path}
//                 target={`${route?.outside ? "_blank" : "_self"}`}
//                 className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-sky-700 dark:hover:text-gray-200"
//                 activeClassName="bg-sky-500 text-white"
//                 rel="noreferrer"
//               >
//                 <Route path={route.path} exact={route.exact}>
//                   <span
//                     className="absolute inset-y-0 left-0 w-1 bg-sky-500 rounded-tr-lg rounded-br-lg"
//                     aria-hidden="true"
//                   ></span>
//                 </Route>
//                 <route.icon className="w-5 h-5" aria-hidden="true" />
//                 <span className="ml-4">{t(`${route.name}`)}</span>
//               </NavLink>
//             </li>
//           )
//         )}
//       </ul>
//       <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
//         <Button onClick={handleLogOut} size="large" className="w-full bg-sky-700 hover:bg-pink-700">
//           <span className="flex items-center">
//             <IoLogOutOutline className="mr-3 text-lg" />
//             <span className="text-sm ">{t("LogOut")}</span>
//           </span>
//         </Button>
//       </span>
//     </div>
//   );
// };

// export default SidebarContent;
