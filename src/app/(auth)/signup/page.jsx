"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useRegisterMutation,
  useVerifyMutation,
} from "@/store/features/auth/authApiSlice";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { setEmail } from "@/store/features/anonymous/anonymousSlice";
import Loading from "@/components/loading/Loading";

const validationShcema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});


const Page = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  // call theme
  const { theme } = useTheme();
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [verify] = useVerifyMutation();
  const [isLoadingComponent, setIsLoading] = useState(false);
  // register
  const createNewUser = async (user) => {

    const { email, password, confirmedPassword } = user;

    dispatch(setEmail(email));

    try {

      const { data } = await register({
        email,
        password,
        confirmedPassword,
      }).unwrap();


      if (data) {


        try {

          const { data: dataVerify } = await verify(email);


          console.log("dataVerify:", dataVerify);
          
          router.push("/otp-verification");
        } catch (e) {
          console.log("dataVerify failed", e);
        }
      }
    } catch (error) {

      for (var i = 0; i < error?.data?.errors.length; i++) {


        const errorMessage = error?.data?.errors[i]?.message;

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

      }

    }
    // end of submit to server

  };
  
  const logginGoogle = async () => {
    () => signIn("google")
    router.push("");
  }

  const handleTogglePassword = (field) => {
    if (field === "Password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    isLoadingComponent ? <><Loading /></> :
     <div className="w-full bg-white dark:bg-slate-950">
       <div className="bg-white  dark:bg-slate-950 w-full lg:w-[1290px] mx-auto flex flex-wrap items-center h-[100vh] ">
        <div className="w-1/2 hidden md:flex justify-center items-center">
          <img
            className="w-96  flex"
            src={`./assets/image/auth/${theme === "dark" ? "Designer-dark" : "Designer"
              }.gif`}
            alt="sign up logo"
          />
        </div><ToastContainer />
        <div className="md:w-1/2 w-full">
          <Formik

            initialValues={{
              email: "",
              password: "",
              confirmedPassword: "",//Chento@123
            }}

            validationSchema={validationShcema}

            onSubmit={async (values, { setSubmitting, resetForm }) => {

              setIsLoading(true);
              await createNewUser(values);
              setSubmitting(false);
              resetForm();
              setIsLoading(false);

            }}

          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-container w-[90%]  xl:w-[600px] mx-auto  border p-10 rounded-[16px]">
                  <Image
                    className="mx-auto pt-5 pb-10 max-sm:pb-6"
                    width={170}
                    height={100}
                    src={`/assets/image/${theme === "dark" ? "mainlogov2" : "mainlogo-blackv2"
                      }.png`}
                    alt="logo photo"
                  />
                  <h1 className="font-bold text-2xl mb-5 dark:text-white">
                    Sign Up
                  </h1>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <Field
                      placeholder=" Enter your email"
                      type="email"
                      name="email"
                      className="bg-gray-50 border rounded-[16px] border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mb-6"
                  />
                  <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        placeholder=" Enter your password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[16px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {showPassword ? (
                        <HiEye
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword("Password")}
                        />
                      ) : (
                        <HiEyeOff
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword("Password")}
                        />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mb-6"
                  />
                  <div className="my-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Field
                        name="confirmedPassword"
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-[16px]"
                      />
                      {showConfirmPassword ? (
                        <HiEye
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword("confirmPassword")}
                        />
                      ) : (
                        <HiEyeOff
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword("confirmPassword")}
                        />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="confirmedPassword"
                    component="div"
                    className="text-red-500 text-sm mb-6"
                  />
                  <div className="mt-6">
                    <button
                      type="submit"
                      className={`rounded-main  hover:bg-gray-700  bg-red p-2.5 w-full text-white border-none 
                              ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
                      disabled={isSubmitting}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "	Register"
                      )}
                    </button>
                  </div>

                  {/* <div className="divider">
                  <span className="font-extralight text-[12px]">OR</span>
                </div>

                <button
                  onClick={logginGoogle}
                  className="cursor-pointer p-2.5 bg-slate-100 dark:bg-black  dark:text-white  border w-full rounded-[16px]"
                >
                  <FcGoogle className="inline" /> sign up with google
                </button> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
     </div>
  );
};

export default Page;
