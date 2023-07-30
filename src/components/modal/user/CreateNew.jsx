"use client";

import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { Button, Modal, Select } from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TfiClose } from "react-icons/tfi";
import { BASE_URL } from "@/lib/baseUrl";
import { fetchRoles, selectAllRoles } from "@/store/features/role/roleSlice";
import { useCreateUserMutation } from "@/store/features/user/userApiSlice";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import Loading from "@/components/loading/Loading";
import { useGetRoleQuery } from "@/store/features/role/roleApiSlice";
import { PiDownloadSimpleBold, PiFloppyDiskLight } from "react-icons/pi";
import ConfirmCancel from "../tutorial/component/ConfirmCancel";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    ),
  role: Yup.string().required("Role is required"),
  givenName: Yup.string().required("First Name is required"),
  familyName: Yup.string().required("Last Name is required"),
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
    .required("Avarta is required"),
});

const FILE_SIZE = 1024 * 1024 * 5; // 5MB

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp",
];

const CreateNew = () => {
  const [openModal, setOpenModal] = React.useState(undefined);
  const [modalSize, setModalSize] = React.useState("6xl");
  const props = { modalSize, openModal, setModalSize, setOpenModal };
  const { data: user } = useSelector(selectCurrentUser);
  const [isError, setIsError] = useState(false);
  const [roles, setRoles] = useState([]);
  // console.log(user, "current user");
  const [imageName, setImageName] = useState(null);
  const dispatch = useDispatch();
  const [imgId, setImgId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  // const roles = useSelector(selectAllRoles);
  const { data } = useGetRoleQuery();
  // console.log(data, "data from role api", roles, "roles from role api");
  const [
    createUser,
    { isSuccess, data: createduser, isError: createError, error },
  ] = useCreateUserMutation();
  useEffect(() => {
    if (data) {
      setRoles(data?.data?.list);
    }
  }, [data]);

  const uploadImageHandler = async (values) => {
    const formData = new FormData();
    formData.append("file", values.file);

    try {
      const response = await axios.post(`${BASE_URL}/files`, values.file);
      // console.log("respone file upload : ", response);
      const name = await response.data?.data?.name;
      // console.log("name : ", response.data?.data?.name);
      setImageName(response.data?.data?.name);
      return (
        response.data?.data?.name ||
        "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
      );
    } catch (error) {
      // console.log("error hz chento : ", error);
      setIsError(true);
      setTimeout(() => {
        if (error.status === 400) {
          // Bad Request error
          const errorMessage = error.data.errors[0].message;
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (error.status >= 500 && error.status <= 500) {
          // Unauthorized error
          toast.error("Internal server error please contact CHENTO !", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Other errors
          toast.error("Failed to upload file", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }, 100);
    }
  };

  const insertImgToDB = async (img) => {
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
      return responeData.data.id || 4;
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        if (error.status === 400) {
          // Bad Request error
          const errorMessage = error.data.errors[0].message;
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (error.status >= 500 && error.status <= 500) {
          // Unauthorized error
          toast.error("Internal server error please contact CHENTO !", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Other errors

          toast.error("Insert Image to upload file", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }, 100);
    }
  };

  const submitHandler = async (values) => {
    var raw = JSON.stringify({
      familyName: values.familyName,
      givenName: values.givenName,
      username: values.username,
      email: values.email,
      password: values.password,
      avatar: values.avatar,
      roleIds: [values.role],
    });

    try {
      const respone = await createUser(raw).unwrap();

      setTimeout(() => {
        toast.success(respone.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, 100);

      

      setIsError(false);
      props.setOpenModal(undefined);
    } catch (error) {
      for (var i = 0; i < error?.data?.errors.length; i++) {
        const errorMessage = error.data.errors[i].message;

        setTimeout(() => {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }, 100);

        setIsError(true);
      }
      setIsError(true);
    }
  };

  return (
    <>
      <button
        onClick={() => props.setOpenModal("size")}
        className="rounded-main px-5 max-sm:px-2 p-2.5 bg-black text-white  "
      >
        <AiOutlinePlusCircle className="inline text-2xl" />{" "}
        <span className="max-sm:hidden">Add new User</span>
      </button>

      {loading && <Loading />}
      <Modal
        show={props.openModal === "size"}
        size={props.modalSize}
        onClose={() => props.setOpenModal(undefined)}
      >
        <div className="p-5 rounded-main dark:bg-secondary bg-white">
          <h2 className="text-start text-3xl  mb-5  text-light dark:text-white font-bold">
            Create User
          </h2>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              role: [],
              givenName: "",
              familyName: "",
              avatar: " ",
              file: undefined,
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setLoading(true);

              const formData = new FormData();
              formData.append("file", values.file);
              const avartar = await uploadImageHandler({ file: formData });

              if (!isError) {
                const imageid = await insertImgToDB(avartar);
                values.avatar = imageid;
                const data = await submitHandler(values);
      
                // console.log(data, "data from submit handler");
                setLoading(false);
                setSubmitting(false);
              }
              if(isError === false) resetForm();

              if (isError) {
                //  console.log(error?.data?.error[0].message,"error from api");
                setTimeout(() => {
                  toast.error(`Please try again error ; ${error?.data}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }, 100);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <>
                <Form>
                  <div className="grid gap-x-10 gap-6 mb-3 md:grid-cols-2 w-full ">
                    {/* First name */}
                    <div className="mb-3">
                      <label
                        htmlFor="first_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        First name
                      </label>
                      <Field
                        type="text"
                        id="givenName"
                        name="givenName"
                        className="bg-gray-50 border placeholder:dark:text-white border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your first name..."
                      />
                      <ErrorMessage
                        name="givenName"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    {/* Last name */}
                    <div className="mb-3">
                      <label
                        htmlFor="familyName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Last name
                      </label>
                      <Field
                        type="text"
                        id="familyName"
                        name="familyName"
                        className="bg-gray-50 border placeholder:dark:text-white border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your family name..."
                      />
                      <ErrorMessage
                        name="familyName"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Username
                      </label>

                      <Field
                        type="text"
                        name="username"
                        id="username"
                        className="bg-gray-50 border placeholder:dark:text-white border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your username"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    {/* phone number */}
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email"
                        className="bg-gray-50 border placeholder:dark:text-white border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {/* address */}
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className=" p-2.5 w-full placeholder:dark:text-white text-sm text-gray-900 bg-gray-50 rounded-main border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your password"
                      />
                      <span
                        className="-ml-8 -mb-1 cursor-pointer"
                        type="button"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                      </span>

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Role
                      </label>
                      <Field
                        as="select"
                        id="role"
                        name="role"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-main border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected disabled>
                          Select role{" "}
                        </option>
                        {roles.map((r, i) => (
                          <option key={i} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className=" mb-6 w-full ">
                      <label htmlFor="file" className="mb-3">
                        Avarta
                      </label>
                      <Field
                        type="file"
                        name="file"
                        id="file"
                        setFieldValue={setFieldValue}
                        isSubmitting={isSubmitting}
                        component={CustomInput}
                        className="input-file bg-gray-50 rounded-main border dark:text-white  focus:ring-blue-500 focus:border-blue-500   dark:border-gray-600 file:bg-black border-slate-300 h-[45px]  file:text-black"
                      />
                      <ErrorMessage
                        name="file"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-x-3">
                    <button
                      disabled={isSubmitting}
                      className="rounded-main px-5 btn   w-fit  bg-black text-white "
                    >
                      {/* {isSubmitting ? "Posting..." : "Post Now"}
                       */}
                      <PiFloppyDiskLight className="inline text-xl text-white font-black mr-1.5 " />{" "}
                      <span>Save</span>
                    </button>
                    <ConfirmCancel
                      closeModalCreateNew={() => props.setOpenModal(undefined)}
                    />
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </Modal>
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
        {...props}
      />
      {preview ? (
        <div className="w-full rounded-[16px] mt-5">
          <img className="rounded-main" src={preview} alt="dummy" />
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

export default CreateNew;
