"use client"
import React from "react"
import Link from "next/link"
import WatermarkDataTable from "@/components/DataTable/WatermarkDataTable"


export default function Page() {
	return (
		<div className='w-full p-6 mx-auto db-bg h-screen dark:bg-primary'>
			{/* header section */}
			<div className='db-bg dark:bg-primary sticky top-20 z-40'>
				<h1
					className={
						"text-[32px] text-light dark:text-white font-semibold "
					}
				>
					Report And Statistic
				</h1>
				{/* breadcrumbs */}
				<div className="text-sm breadcrumbs p-0 pt-1 pb-5">
					<ul className='font-extralight text-light dark:text-white'>
						<li>
							<Link className="text-black dark:text-white" href={"/admin/dashboard"}>Admin</Link>
						</li>
						<li>
							<Link className="text-black dark:text-white" href={"/admin/dashboard/reportandstatistic"}>
								Report And Statistic
							</Link>
						</li>
						<li>
							<Link className="text-black dark:text-white" href={"/admin/dashboard/reportandstatistic/watermarkoveriew"}>
								Watermark Overview
							</Link>
						</li>
					</ul>
				</div>
			</div>
			{/* end of header section */}

			<main className="h-screen">

				<WatermarkDataTable />
			
			</main>
		</div>
	)
}
