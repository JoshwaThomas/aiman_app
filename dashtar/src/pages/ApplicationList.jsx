import React, { useState, useContext } from "react";
import Step1Personal from "@/components/form/steps/Step1";
import Step2Academic from "@/components/form/steps/Step2Academic";
import Step3Course from "@/components/form/steps/Step3Course";
import Step4Upload from "@/components/form/steps/Step4Upload";

import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import useAsync from "@/hooks/useAsync";
import AdminServices from "@/services/AdminServices";

function ApplicationList() {

    const { data, loading, error } = useAsync(() =>
            AdminServices.getAllApplication()
        );
        console.log('all application data', data);
  return (
    <div>

    </div>
  )
}

export default ApplicationList