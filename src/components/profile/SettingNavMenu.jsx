"use client";

import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";
import SettingIcon from "../icon/SettingIcon";
import UserAccIcon from "../icon/UserAccIcon";
import { CiCircleChevLeft } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function SettingNavMenu() {
  // call theme
  const { theme } = useTheme();
  // console.log(theme);
  const router = useRouter()
 const handleBack = () => {
  router.push('/')
 }
  return (
    
    <aside className="sidebar max-sm:hidden justify-start w-[318px]  z-0 bg-white dark:bg-[#1e1e1e]  rounded-main  ">
      <section className="sidebar-content h-fit min-h-[20rem] overflow-visible">
        <nav className="menu rounded-md">
          <section className="menu-section px-4">
            <div onClick={handleBack} className="cursor-pointer text-2xl">
              <CiCircleChevLeft className="inline mr-2  font-bold" />

              <span className="menu-title inline text-lg">Back</span>
            </div>
            <ul className="menu-items text-black dark:text-white">
              <Link href={"/profile/setting"}>
                <li className="menu-item text-black dark:text-white  hover:bg-gray-200 dark:hover:bg-primary " >
                  <UserAccIcon />

                  <span>Profile Management</span>
                </li>
              </Link>

              <li>
                <input type="checkbox" id="menu-1" className="menu-toggle" />
                <label className="menu-item justify-between hover:bg-gray-200 dark:hover:bg-primary" htmlFor="menu-1">
                  <div className="flex gap-2 text-black dark:text-white">
                    <SettingIcon />
                    <span>General</span>
                  </div>

                  <span className="menu-icon text-black dark:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </label>

                <div className="menu-item-collapse">
                  <div className="min-h-0">
                    <Link href={"/profile/setting/generalsetting"}>
                      <label className="menu-item text-black dark:text-white  hover:bg-gray-200 dark:hover:bg-primary ml-6">General setting</label>
                    </Link>
                    <Link href={"/profile/setting/passwordandemail"}>
                      <label className="menu-item text-black dark:text-white  hover:bg-gray-200 dark:hover:bg-primary ml-6">
                        Password and Email
                      </label>
                    </Link>
                    <Link href={"/profile/setting/moreinfo"}>
                      {" "}
                      <label className="menu-item text-black dark:text-white  hover:bg-gray-200 dark:hover:bg-primary ml-6">
                        More information
                      </label>{" "}
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </nav>
      </section>
    </aside>
    
  );
}
