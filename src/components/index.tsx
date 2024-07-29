import Loader from "@/components/common/loader/loader.tsx";
import { Suspense, lazy } from "react";

// Lazy load components
const LazyBaseCheckbox = lazy(() => import("./core/BaseCheckbox"));
const LazyBaseInput = lazy(() => import("./core/BaseInput"));
const LazyFloatingInput = lazy(() => import("./core/FloatingInput"));
const LazyTooltip = lazy(() => import("./core/BaseTooltip"));

// load Button
import LazyButton from "@/components/core/BaseButton";

// load Custom Tables
import LazyBaseTable from "@/components/tables/antd/BaseTable";

// load Modal
import LazyModal from "@/components/modal/modal";

// Export wrapped components
export const Button = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyButton {...props} />
  </Suspense>
);

export const BaseCheckbox = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyBaseCheckbox {...props} />
  </Suspense>
);

export const BaseInput = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyBaseInput {...props} />
  </Suspense>
);

export const FloatingInput = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyFloatingInput {...props} />
  </Suspense>
);

export const BaseTableAntd = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyBaseTable {...props} />
  </Suspense>
);

export const BaseTooltip = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyTooltip {...props} />
  </Suspense>
);

export const BaseModal = (props: any) => (
  <Suspense fallback={<Loader />}>
    <LazyModal {...props} />
  </Suspense>
);
