"use client";

import { useCreateTutorialMutation } from "@/store/features/tutorial/tutorialApiSlice";
import axios from "axios";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  useField,
  useFormikContext,
} from "formik";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { useGetRoleQuery } from "@/store/features/role/roleApiSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/loading/Loading";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { toast } from "react-toastify";
import { CiFloppyDisk } from "react-icons/ci";
import { PiFloppyDiskLight } from "react-icons/pi";
import { TiCameraOutline } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";
import ConfirmCancel from "./component/ConfirmCancel";

const validationSchema = Yup.object({
  name: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  file: Yup.mixed()
    .test("fileSize", " File bigger than 5mb", (value) => {
      if (!value) {
        return true;
      }
      return value.size <= FILE_SIZE;
    })
    .test("filsFormat", "Unsupported format", (value) => {
      if (!value) {
        return true;
      }
      return SUPPORTED_FORMATS.includes(value.type);
    })
    .required("Thumnail is required"),
});

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp",
];

const FormAddNew = ({ closeModal, userId }) => {
  // console.log(userId, "user id");
  const [imgId, setImgId] = useState(0);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [editorData, setEditorData] = useState(); //ckeditor data
  const [editorLoaded, setEditorLoaded] = useState(false);
  const state = useSelector((state) => state);
  const { data: RoleData } = useGetRoleQuery(state?.auth?.accessToken);
  const [roles, setRoles] = useState([0]);
  const [tutorial, setTutorial] = useState({});
  const { data: user } = useSelector(selectCurrentUser);
  const [createTutorial, { isLoading: submitting, isSuccess }] =
    useCreateTutorialMutation();
  // console.log(user, "current user");
  const editorRef = useRef();
  const { CKEditor, DecoupledEditor } = editorRef.current || {};

  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  // console.log(editorData, "editor data use state");
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      DecoupledEditor: require("@ckeditor/ckeditor5-build-decoupled-document"),
    };
    setEditorLoaded(true);
    // setEditorData("Enter your content");
  }, []);

  const shoulComponentUpdate = useCallback(() => {
    return false;
  }, []);

  useEffect(() => {
    if (RoleData) {
      setRoles(RoleData?.data?.list);
    }
  }, [RoleData]);

  const uploadImageHandler = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/files`, values.file);
      // console.log(response.data, "respone when upload image");

      return (
        response.data?.data?.name ||
        "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const insertImgToDB = async (img) => {
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      name: img,
      type: "user",
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const respone = await fetch(`${BASE_URL}/images`, requestOptions);
      const responeData = await respone.json();
      const imgId = responeData.data.id;
      setImgId(imgId);
      // console.log(requestOptions.data, "upload imgae respone");
      return responeData.data.id || 4;
    } catch (error) {
      console.log("error : " + error);
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      name: values.name,
      description: values.description,
      thumbnail: values.thumbnail,
      createdBy: userId,
      htmlContent: editorData,
    });
    try {
      await createTutorial(raw).unwrap();
      setEditorData("");
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Tutorial created successfully");
      setLoading(false);
    }
  }, [isSuccess]);

  if (submitting) {
    return <Loading />;
  }

  return (
    <>
      {loading && <Loading />}
      <div className="bg-white dark:bg-secondary w-full mx-auto">
        <h2 className="text-start text-3xl  mb-5  text-light dark:text-white font-bold">
          Create New Tutorial
        </h2>
        {submitting && <Loading />}

        <Formik
          enableReinitialize={true}
          initialValues={{
            name: tutorial?.name,
            description: tutorial?.description,
            thumbnail: tutorial?.thumbnail,
            createdBy: userId || 32,
            htmlContent: tutorial?.htmlContent,
            file: undefined,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", values.file);

            const avatar = await uploadImageHandler({ file: formData });
            const imageid = await insertImgToDB(avatar);

            values.thumbnail = imageid;

            handleSubmit(values);
            // alert(JSON.stringify(values, null, 2))
            closeModal();
            setSubmitting(false);
            resetForm();
            setLoading(false);
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <>
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                    <div className="md:mb-5 mb-2 md:col-span-4 ">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Title
                      </label>
                      <Field
                        type="text"
                        name="name"
                        value={values.name}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="eg. How to Use the JavaScript Fullscreen API"
                      />
                      <ErrorMessage
                        name="name"
                        component="h1"
                        className="text-red-500 text-xs   "
                      />
                    </div>

                    <div className="md:mb-5 mb-2 md:col-span-4 ">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description
                      </label>
                      <Field
                        type="text"
                        name="description"
                        component="textarea"
                        rows="4"
                        value={values.description}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-main border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="eg. The Fullscreen API is a browser web API that allows you to enable fullscreen mode for HTML elements. It saves you the stress of using CSS and JavaScript to implement fullscreen functionality."
                      />
                      <ErrorMessage
                        name="description"
                        component="h1"
                        className="text-red-500 text-xs   "
                      />
                    </div>

                    {/* ckeditor  */}
                    <div className="md:col-span-4  ">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Content
                      </label>
                      {editorLoaded ? (
                        <CKEditor
                          data={editorData}
                          editor={DecoupledEditor}
                          config={{
                            ckfinder: {
                              // Upload the images to the server using the CKFinder QuickUpload command
                              // You have to change this address to your server that has the ckfinder php connector
                              uploadUrl:
                                " https://photostad-api.istad.co/api/v1/files", //Enter your upload url
                            },
                            placeholder: "Write your tutorial content here!",
                            // Automatic Editor Height Adjustment to Content
                            autoGrow_onStartup: true,
                            autoGrow_minHeight: 200,
                            autoGrow_maxHeight: 600,
                          }}
                          //create upload adapter to send image to server in Ckeditor
                          onReady={(editor) => {
                            editor.ui
                              .getEditableElement()
                              .parentElement.insertBefore(
                                editor.ui.view.toolbar.element,
                                editor.ui.getEditableElement()
                              );

                            editor.plugins.get(
                              "FileRepository"
                            ).createUploadAdapter = (loader) => {
                              return new MyUploadAdapter(loader);
                            };
                            // console.log("Editor is ready to use!", editor);
                          }}
                          shoulComponentUpdate={shoulComponentUpdate}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            // console.log({ event, editor, data }, "editor data");
                            setEditorData(data.replace(/"/g, "'"));
                            handleEditorChange(data);
                          }}
                          onError={(error, { willEditorRestart }) => {
                            // If the editor is restarted, the toolbar element will be created once again.
                            // The onReady callback will be called again and the new toolbar will be added.
                            // This is why you need to remove the older toolbar.
                            if (willEditorRestart) {
                              this.editor.ui.view.toolbar.element.remove();
                            }
                          }}
                        />
                      ) : (
                        <div>Editor loading</div>
                      )}
                    </div>
                

                  <div className="md:col-start-5 row-start-3 md:row-start-1 md:row-span-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Thumbnail
                    </label>
                    <Field
                      className="file-input rounded-main w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="file"
                      type="file"
                      title="Select a file"
                      setFieldValue={setFieldValue} // Set Formik value
                      component={CustomInput} // component prop used to render the custom input
                      isSubmitting={isSubmitting}
                    />
                    <ErrorMessage
                      name="file"
                      component="h1"
                      className="text-red-500 text-xs   "
                    />
                  </div>
                </div>

                {/* file for avarta */}

                {/* footer */}
                <div className="space-x-3">
                    <button
                    type="submit"
                      disabled={isSubmitting}
                      className="rounded-main px-5 btn   w-fit  bg-black text-white "
                    >
                      {/* {isSubmitting ? "Posting..." : "Post Now"}
                       */}
                      <PiFloppyDiskLight className="inline text-xl text-white font-black mr-1.5 " />{" "}
                      Save
                    </button>
                    <ConfirmCancel
                      closeModalCreateNew={closeModal}
                    />
                  </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

function CustomInput({ field, form, isSubmitting, ...props }) {
  const [preview, setPreview] = useState(null);
  // for reset imageds
  useEffect(() => {
    if (isSubmitting) {
      setPreview(null);
    }
  }, [isSubmitting]);
  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          form.setFieldValue(field.name, event.currentTarget.files[0]);
          setPreview(URL.createObjectURL(event.currentTarget.files[0]));
        }}
        // {...props} is use to pass all props from Formik Field componen
        {...props}
      />
      {preview ? (
        <div className="w-full  rounded-[16px] mt-5">
          <Image
            src={preview}
            alt="dummy"
            width="100"
            height="100"
            className="w-full"
          />
        </div>
      ) : (
        <div className="w-full rounded-[16px] mt-5">
          <img
            className="rounded-main"
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png"
            }
            alt="dummy"
          />
        </div>
      )}
    </div>
  );
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          // Your upload logic here
          // Example using fetch:
          const formData = new FormData();
          formData.append("file", file);

          fetch("https://photostad-api.istad.co/api/v1/files", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                response.json().then((data) => {
                  // console.log(data, "data upload image");
                  const url = data?.data?.url;

                  resolve({ default: url });
                });
              } else {
                reject(response.statusText);
              }
              // console.log(response, "response upload image");
            })
            .catch((error) => {
              reject(error);
              console.log(error, "error upload image");
            });
        })
    );
  }

  abort() {
    // Abort upload logic here
  }
}

export default FormAddNew;
