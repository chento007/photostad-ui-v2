import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Forbidden() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      router.push("/");
    }, countdown * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid h-screen  px-4 bg-white place-content-center">
      <div className="text-center skeleton-pulse bg-white">
        <div className="flex justify-center items-center mb-5 ">
          <Image
            width={300}
            height={200}
            src="/assets/image/mainlogo-blackv2.png"
            alt="images"
            className="w-32  "
          ></Image>
        </div>
        <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl ">
          Forbidden 403!
        </p>

        <p className="mt-4 text-gray-600">
         You can not access this page. you are being redirct back to home page  in {countdown} seconds
        </p>
      </div>
    </div>
  );
}