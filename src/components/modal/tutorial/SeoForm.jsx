"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { use, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/baseUrl";
import { useSelector } from "react-redux";
import { useGetAdminQuery } from "@/store/features/auth/authApiSlice";
import { CgLayoutGrid } from "react-icons/cg";
import { toast } from "react-toastify";
import { useGetTutorialByIdQuery, useUpdateTutorialSEOMutation } from "@/store/features/tutorial/tutorialApiSlice";
import { PiFloppyDiskLight } from "react-icons/pi";
import ConfirmCancel from "./component/ConfirmCancel";

const validationSchema = Yup.object({
  keyword: Yup.string().required("Keyword is required"),
  slug: Yup.string().required("Slug is required"),
  openGraphDescription: Yup.string().required("Description is required"),
});

export default function SeoForm({ id, closeModal }) {

  const [loading, setLoading] = useState(false);
  const { data } = useGetAdminQuery();
  const token = useSelector((state) => state?.auth?.accessToken);
  const state = useSelector((state) => state);
  const userId = useSelector(
    (state) => state?.api?.queries.getAdmin?.data?.data?.id
  );
  const [dataTutorial, setDataTutorial] = useState(null);

  const { data: tutorial, isLoading, isSuccess } = useGetTutorialByIdQuery(id);

  const [updateTutorialSeo, { }] = useUpdateTutorialSEOMutation(id);

  useEffect(() => {
    setDataTutorial(tutorial?.data);
  }, [tutorial]);

  useEffect(() => {
    setDataTutorial(tutorial?.data);
  }, []);

  const handleSetSeo = async (values) => {

    setLoading(true);

    let raw = JSON.stringify({
      createdBy: data?.data?.id,
      keyword: values.keyword,
      openGraphDescription: values.openGraphDescription,
      slug: values.slug,
    });
    
    try {
      const respone = await updateTutorialSeo({ id: id, data: raw }).unwrap();
      setTimeout(() => {
        toast.success(respone.message, {
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
    } catch (error) {
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
          toast.error("Update has been failed.", {
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


  return (
    <Formik
      enableReinitialize={true}

      initialValues={{

        slug: dataTutorial?.slug,
        createdBy: data?.data?.id,
        keyword: dataTutorial?.keyword,
        openGraphDescription: dataTutorial?.openGraphDescription,

      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {

        handleSetSeo(values);
        closeModal();
        resetForm();

      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <div className="grid grid-cols-1 mt-10  gap-5">
            <div className=" w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Keyword
              </label>
              <Field
                type="text"
                name="keyword"
                values={values.keyword}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
              />
              <ErrorMessage
                name="keyword"
                component="h1"
                className="text-red-500 text-xs  "
              />
            </div>
            <div className=" w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Slug
              </label>
              <Field
                type="text"
                values={values.slug}
                name="slug"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=" "
              />
              <ErrorMessage
                name="slug"
                component="h1"
                className="text-red-500 text-xs  "
              />
            </div>
            <div className=" w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Descripton
              </label>
              <Field
                type="text"
                values={values.openGraphDescription}
                name="openGraphDescription"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-main focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=" "
              />
              <ErrorMessage
                name="openGraphDescription"
                component="h1"
                className="text-red-500 text-xs  "
              />
            </div>
          </div >
          <div className="space-x-3 mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-main px-5 btn   w-fit  bg-black text-white "
            >
              {/* {isSubmitting ? "Posting..." : "Post Now"}
               */}
              <PiFloppyDiskLight className="inline text-xl text-white font-black mr-1.5" />{" "}
              Save
            </button>
            <ConfirmCancel
              closeModalCreateNew={closeModal}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
