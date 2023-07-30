"use client";
import DashboardOverview from "@/components/admin-dashboard/DashboardOverview";
import { useGetAdminQuery } from "@/store/features/auth/authApiSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
  return (
    <div>
      <div className=" db-bg  p-6   dark:bg-primary  rounded-md shadow h-full">
        <div className="sticky top-20 z-30 db-bg dark:bg-primary">
          <h1 className="text-[32px] font-semibold dark:text-white ">
            Dashboard Overview
          </h1>
          <div className="text-sm breadcrumbs p-0 pt-1 pb-5">
          <ul className="font-extralight text-light dark:text-white">
              <li>
                <Link
                  className="dark:text-white text-black"
                  href={"/admin/dashboard"}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  className="dark:text-white text-black"
                  href={"/admin/dashboard"}
                >
                  Dashboard Overview
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <main>
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
};

export default Page;
