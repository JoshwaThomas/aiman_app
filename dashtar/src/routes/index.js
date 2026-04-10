import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Attributes = lazy(() => import("@/pages/Attributes"));
const ChildAttributes = lazy(() => import("@/pages/ChildAttributes"));
const Pending = lazy(()=> import("@/pages/pending"));
const Accept = lazy(()=> import("@/pages/accept"));
const Reject = lazy(()=> import("@/pages/reject"));
const Quotations = lazy(()=> import("@/pages/Quotations"));
const Invoice = lazy(() => import("@/pages/invoice"));
const Payment = lazy(() => import("@/pages/payment"));
const Renewal = lazy(() => import("@/pages/renewal"));
// const Preview = lazy(() => import("@/components/invoice/Preview"))
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Category = lazy(() => import("@/pages/Category"));
const ChildCategory = lazy(() => import("@/pages/ChildCategory"));
const Staff = lazy(() => import("@/pages/Staff"));
const Customers = lazy(() => import("@/pages/Customers"));
const CustomerOrder = lazy(() => import("@/pages/CustomerOrder"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderInvoice = lazy(() => import("@/pages/OrderInvoice"));
const Coupons = lazy(() => import("@/pages/Coupons"));
// const Setting = lazy(() => import("@/pages/Setting"));
const Page404 = lazy(() => import("@/pages/404"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Languages = lazy(() => import("@/pages/Languages"));
const Currencies = lazy(() => import("@/pages/Currencies"));
const Setting = lazy(() => import("@/pages/Setting"));
const StoreHome = lazy(() => import("@/pages/StoreHome"));
const StoreSetting = lazy(() => import("@/pages/StoreSetting"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const ApplicationPreview = lazy(() => import("@/pages/ApplicationPreview"));
const ApplicationPrev = lazy(() => import("@/pages/ApplicationPrev"));
const ApplicationList = lazy(() => import("@/pages/ApplicationList"));
const AcceptApplication = lazy(() => import("@/pages/AcceptApplication"));
/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/pending",
    component: Pending,
  },
  {
    path: '/approved',
    component: Accept,
  },
  {
    path: '/rejected',
    component: Reject
  },
  {
    path: "/application",
    component: Quotations,
  },
  {
    path: "/invoice",
    component: Invoice,
  },
  {
    path: "/payment",
    component: Payment,
  },
  {
    path: "/renewal",
    component: Renewal,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/attributes",
    component: Attributes,
  },
  {
    path: "/attributes/:id",
    component: ChildAttributes,
  },
  {
    path: "/product/:id",
    component: ProductDetails,
  },
  {
    path: "/categories",
    component: Category,
  },
  {
    path: "/languages",
    component: Languages,
  },
  {
    path: "/currencies",
    component: Currencies,
  },

  {
    path: "/categories/:id",
    component: ChildCategory,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/customer-order/:id",
    component: CustomerOrder,
  },
  {
    path: "/our-staff",
    component: Staff,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/order/:id",
    component: OrderInvoice,
  },
  {
    path: "/coupons",
    component: Coupons,
  },
  { path: "/settings", component: Setting },
  {
    path: "/store/customization",
    component: StoreHome,
  },
  {
    path: "/store/store-settings",
    component: StoreSetting,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/coming-soon",
    component: ComingSoon,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/application-preview/:id",
    component: ApplicationPreview,
  },
  {
    path: "/application-prev",
    component: ApplicationPrev,
  },
  {
    path: "/application-list",
    component: ApplicationList,
  },
  {
    path: "/application-accept/:id",
    component: AcceptApplication,
  },
];

export default routes;
