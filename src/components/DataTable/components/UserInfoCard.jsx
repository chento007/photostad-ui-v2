"use client";

import { Button, Card, Modal, Select } from "flowbite-react";

export default function UserInfoCard({user}) {
  const [openModal, setOpenModal] = useState();
  const [modalSize, setModalSize] = useState < string > "md";
  const props = { modalSize, openModal, setModalSize, setOpenModal };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => props.setOpenModal("size")}>Toggle modal</Button>
      </div>
      <Modal
        show={props.openModal === "size"}
        size={props.modalSize}
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <Card>
            <div className="flex justify-end px-4 pt-4"></div>
            <div className="flex flex-col items-center pb-10">
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                Bonnie Green
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Visual Designer
              </span>
              <div className="mt-4 flex space-x-3 lg:mt-6">
                <a
                  className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  href="#"
                >
                  <p>Add friend</p>
                </a>
                <a
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  href="#"
                >
                  <p>Message</p>
                </a>
              </div>
            </div>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => props.setOpenModal(undefined)}>
            I accept
          </Button>
          <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
