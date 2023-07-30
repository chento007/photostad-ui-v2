"use client";

import UserDataTable from "@/components/DataTable/UserDataTable";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Page() {
  return (
    <div className={"w-full p-6 mx-auto db-bg h-full dark:bg-primary"}>
      <div className="sticky top-20 z-40 db-bg dark:bg-primary">
        <h1 className={"text-[32px] text-light dark:text-white font-semibold "}>
          User Management
        </h1>

        <div className="text-sm breadcrumbs p-0 pt-1 pb-5">
          <ul className="font-extralight text-light dark:text-white">
            <li>
              <Link
                className="text-black dark:text-white"
                href={"/admin/dashboard"}
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                className="text-black dark:text-white"
                href={"/admin/dashboard/usermanagement"}
              >
                User Management
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <section>
        <div className="h-screen">
          <UserDataTable />
        </div>
      </section>
    </div>
  );
}
