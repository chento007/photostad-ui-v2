import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-screen h-screen fixed top-0 right-0 z-50 flex justify-center items-center">
      <Image
        width={350}
        height={290}
        alt="loading image "
        src={"/assets/loading/loading.gif"}
      ></Image>
    </div>
  );
}
