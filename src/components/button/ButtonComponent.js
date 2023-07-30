import Link from "next/link";
import WatermarkNavItem from "../nav/components/WatermarkNavItem";
import { useSession } from "next-auth/react";
import { useGetUserQuery } from "@/store/features/user/userApiSlice";
import { useEffect, useState } from "react";

export default function ButtonComponent({name,type,goto ,isBold}){
    let text_bold = ""
    if(isBold){
       text_bold = " font-bold "
    }
    const { data: user, isSuccess } = useGetUserQuery();
    const { data: session } = useSession();
    const [uuid, setUuid] = useState();
    useEffect(()=>{
        
        if (user) {
          setUuid(user?.data?.uuid);
        }
      }
    ,[user]
    )

    const handleWatermarkClick = () => {
        // router.push({ pathname: 'https://photostad-editor.vercel.app/watermark', query: { uuid } });
        window.open(`https://photostad-editor.vercel.app/?watermark?${uuid}`, "_blank");
      };
      const handleCertificateClick = () => {
        window.open(`https://photostad-editor.vercel.app/?certificate?${uuid}`, "_blank");
      };
    
    return (
        <>
        <Link href={goto} className="">
            <button type={type} class={text_bold+ "focus:outline-none text-white bg-[#E85854]  focus:ring-4 focus:ring-red-300 rounded-[16px] text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600  dark:focus:ring-red-900 max-sm:text-[10px] max-sm:py-[5px] max-sm:px-[10px] max-sm:items-center max-sm:mb-0"}>
                {name}
            </button>
        </Link>
        {user || session ? (
            <Link href={"#"}>
              <span
                onClick={handleCertificateClick}
                className=" hover:text-black dark:hover:text-white text-black dark:text-white"
              >
                Certificate
              </span>
            </Link>
          ) : (
            <WatermarkNavItem title={"Certificate"} />
          )}

        </>
    )
}