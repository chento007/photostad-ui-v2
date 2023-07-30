"use client";
import React from "react";
import { Button, Modal, Select } from "flowbite-react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import FormAddNew from "./FormAddNew";
import { TfiClose } from "react-icons/tfi";
import { useCreateTutorialMutation } from "@/store/features/tutorial/tutorialApiSlice";
import Loading from "@/components/loading/Loading";

export default function AddNewModal({ userData }) {
  const [openModal, setOpenModal] = React.useState(undefined);
  const [modalSize, setModalSize] = React.useState("7xl");
  const [createTutorial, { isLoading: submitting }] =
    useCreateTutorialMutation();

  const props = { modalSize, openModal, setModalSize, setOpenModal };
  const userId = userData?.data?.id;

  if (submitting) {
    alert("loading");
  }

  return (
    <>
      <button
        onClick={() => props.setOpenModal("size")}
        className="rounded-main px-5 max-sm:px-2 p-2.5 bg-black text-white  "
      >
        <AiOutlinePlusCircle className="inline text-2xl" />{" "}
        <span className="max-sm:hidden">Add new tutorial</span>
      </button>
      <Modal
        show={props.openModal === "size"}
        size={props.modalSize}
        onClose={() => props.setOpenModal(undefined)}
      >
        
        <div className="p-6 rounded-main dark:bg-secondary bg-white">
          {/* <FormAddTTR closeModal={() => props.setOpenModal(undefined)} /> */}
          <FormAddNew
            closeModal={() => props.setOpenModal(undefined)}
            userId={userId}
          />
        </div>
      </Modal>
    </>
  );
}
