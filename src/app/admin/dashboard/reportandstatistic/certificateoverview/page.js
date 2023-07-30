"use client";

import CertificateDataTable from "@/components/DataTable/CertificateDataTable";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="w-full p-6 mx-auto db-bg h-screen dark:bg-primary">
      {/* header section */}
      <div className="db-bg dark:bg-primary sticky top-20 z-40">
        <h1
          className={
            "text-[32px] text-light dark:text-white font-semibold "
          }
        >
          Report And Statistic
        </h1>
        {/* breadcrumbs */}
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
                href={"/admin/dashboard/reportandstatistic"}
              >
                Report And Statistic
              </Link>
            </li>
            <li>
              <Link
                className="text-black dark:text-white"
                href={"/admin/dashboard/certificateoverview"}
              >
                Certificate Overview
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* end of header section */}

      <main className="h-screen">
        <CertificateDataTable />
      </main>
    </div>
  );
}
