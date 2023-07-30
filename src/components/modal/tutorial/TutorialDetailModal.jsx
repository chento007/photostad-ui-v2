"use client";
import React from "react";
import FormAddNew from "./FormAddNew";
import { Modal } from "flowbite-react";
import { GrFormView } from "react-icons/gr";
import TutorialDetail from "./TutorialDetail";
import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { useGetTutorialByIdQuery } from "@/store/features/tutorial/tutorialApiSlice";

export default function TutorialDetailModal({ id }) {
  const [openModal, setOpenModal] = React.useState(undefined);
  const [modalSize, setModalSize] = React.useState("4xl");

  const props = { modalSize, openModal, setModalSize, setOpenModal };
  const {data, isLoading ,isSuccess} = useGetTutorialByIdQuery(id)
    const content = data?.data?.htmlContent
    const title = data?.data?.name


    if(isLoading) return <LoadingSkeleton />

  return (
    <>
      <button
        onClick={() => props.setOpenModal("size")}
        className=" text-white  "
      >
        <GrFormView className="text-2xl"/>
      </button>
      <Modal
        show={props.openModal === "size"}
        size={props.modalSize}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header>{title ? title : "no title"}</Modal.Header>
        <Modal.Body>
          <TutorialDetail content={content} />
        </Modal.Body>
      </Modal>
    </>
  );
}
