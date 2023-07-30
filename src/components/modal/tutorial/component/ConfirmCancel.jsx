"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RxCrossCircled } from "react-icons/rx";

export default function ConfirmCancel({closeModalCreateNew}) {
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };

  const handleClose = ()=>{
      closeModalCreateNew()
      setOpenModal(undefined)
  }

  return (
    <>
      <div
        onClick={() => props.setOpenModal("pop-up")}
        className="rounded-main  px-5 btn   w-fit mt-1 bg-red text-white "
      >
        <RxCrossCircled className="inline text-xl text-white font-black mr-1.5 " />{" "}
        <span className="">Cancel</span>
      </div>
      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to Cancel? All your data will be lost.
            </h3>
            <div className="flex justify-center gap-4">
              <button className="bg-red text-white px-5 py-2 rounded-main"
                
                onClick={handleClose}
              >
                Yes, I am sure
              </button>
              <button className="bg-gray-200  text-gray-500 px-5 py-2 rounded-main"
                
                onClick={() => props.setOpenModal(undefined)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
