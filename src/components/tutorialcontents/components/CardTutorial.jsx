import Image from "next/image";
import Link from "next/link";
import React from "react";

const CardTutorial = ({ uuid, slug, name, thumbnail }) => {
  return (
    <Link href={`/tutorial/${uuid}/${slug}`}>
      <div className="card  w-[300px] h-[300px]">
        <Image className=" object-cover rounded-t-main w-[300px] h-[200px]" width={300} height={200}  src={thumbnail} alt="thumbnail" />
        <div className="p-3">
          <p className="text-content2">{name}</p>
        </div>
      </div>
    </Link>
  );
};

export default CardTutorial;
