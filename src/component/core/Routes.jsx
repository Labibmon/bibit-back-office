import React from "react";
import ChangeLog from '../pages/change-log/ChangeLog';
import Investor from '../pages/investor/Investor';
import Member from '../pages/permission/Permission';
import Role from "../pages/permission/role/Role";

export const routes = [
    {
      path: "/",
      exact: true,
      main: () => <ChangeLog />
    },
    {
      path: "/investor",
      main: () => <Investor />
    },
    {
      path: "/member",
      main: () => <Member />
    },
    {
      path: "/role",
      main: () => <Role />
    }
  ];