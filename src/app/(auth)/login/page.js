"use client";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FcGoogle } from "react-icons/fc";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useNewRegisterWithGoogleMutation,
  useRegisterWithGoogleMutation,
} from "@/store/features/auth/authApiSlice";
import {
  setCredentials,
  setCurrentUser,
} from "@/store/features/auth/authSlice";
import { HiEye, HiEyeOff } from "react-icons/hi";

import { setEmail } from "@/store/features/anonymous/anonymousSlice";
import { BASE_URL } from "@/lib/baseUrl";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const initialValues = {
  email: "",
  password: "",
};

const Page = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const session = useSession();
  const dispatch = useDispatch();
  const [mail, setMail] = useState("");
  const [registerWithGoogle] = useRegisterWithGoogleMutation();
  const [registerGoogle, { isSuccess, isLoading: registering }] =
    useNewRegisterWithGoogleMutation();
  const GoogleSecretKey = "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";
  const [login, { isLoading, isSuccess: logedIN }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (logedIN) {
      toast.success("Login successfully");
    }
  }, [logedIN]);

  // check email return boolean

  const handleSubmit = async (values) => {
    setIsSubmit(true);
    const { email, password } = values;
    try {
      const { data } = await login({ email, password }).unwrap();
      dispatch(setCredentials(data));
      // router.push("/");
      // redirect to home page
      window.location.href = "/";

      setIsSubmit(false);
    } catch (error) {
      toast.error(`Login failed. Error: ${error.message}`);
      console.log("error login", error);
      setIsSubmit(false);
      if (error.data && error.data.code === 401) {
        setLoginError("Invalid email or password");
      } else {
        setLoginError("An error occurred during login");
      }
    }
  };

  const handleGoogleAuth = useCallback(async () => {
    try {

      const response = await fetch(
        `${BASE_URL}/auth/email/${session?.data.user.email}`
      );
      const data = await response.json();
      console.log(data, "test data");

      if (data?.data) {
        
        const email = session?.data.user.email;
        const password =
          session?.data.user.email + "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";

    

        try {
          const { data } = await login({ email, password }).unwrap();
         
          // return token and assign token to setCredentials
          dispatch(setCredentials(data));
          // alert("login with google success");

          router.push("/");
        } catch (error) {
          console.log("error login", error);

          if (error.data && error.data.code === 401) {
            setLoginError("Invalid email or password");
          } else {
            setLoginError("An error occurred during login");
          }
        }
      } else {
      
        const header = new Headers();
        header.append("Content-Type", "application/json");
        let raw = JSON.stringify({
          email: session?.data?.user?.email
        });
        let requestOptions = {
          method: "POST",
          headers: header,
          body: raw,
          redirect: "follow",
        };

        const registerResponse = await fetch(
          `${BASE_URL}/auth/register-with-google`,
          requestOptions
        );
        const registerData = await registerResponse.json();
       

        if (registerData?.code === 200) {
          const email = session?.data?.user.email;
          const password =
            session?.data?.user.email+"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";
         

          try {
            const { data } = await login({ email, password }).unwrap();
         
            // return token and assign token to setCredentials
            dispatch(setCredentials(data));

            router.push("/");
          } catch (error) {
            console.log("error login", error);

            if (error.data && error.data.code === 401) {
              setLoginError("Invalid email or password");
            } else {
              setLoginError("An error occurred during login");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [dispatch, login, router, session]);

  useEffect(() => {
    if (session) {
      handleGoogleAuth();
    }
  }, [session]);

  const handleGoogleSignIn = async () => {
    await signIn("google");
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className="bg-white dark:bg-black w-full lg:w-[1290px] items-center h-[100vh] mx-auto flex flex-wrap  ">
        <div className="w-1/2 hidden md:flex justify-center items-center ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-96  flex"
            src={`./assets/image/auth/${
              theme === "dark" ? "Designer-dark" : "Designer"
            }.gif`}
            alt="sign up logo"
          />
        </div>
        <div className="md:w-1/2 w-full">
          <div className="form-container w-[90%]  xl:w-[600px] mx-auto  border p-10 rounded-[16px]">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <Image
                    className="mx-auto pt-5 pb-10 max-sm:pb-6"
                    width={170}
                    height={100}
                    src={`/assets/image/${
                      theme === "dark" ? "mainlogov2" : "mainlogo-blackv2"
                    }.png`}
                    alt="logo photo"
                  />
                  <h1 className="font-bold text-2xl mb-5 dark:text-white max-sm:text-center">
                    Log In
                  </h1>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <Field
                      placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[16px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      {showPassword ? (
                        <HiEye
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword()}
                        />
                      ) : (
                        <HiEyeOff
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => handleTogglePassword()}
                        />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <small className="justify-end ml-3 flex mt-3 dark:text-white">
                    Forgot password?{" "}
                    <span className="text-[#E85854] ps-2 cursor-pointer">
                      <Link href={"/sendemail"}>Click here</Link>{" "}
                    </span>{" "}
                  </small>
                  {loginError && (
                    <div className="text-red-500 text-sm mb-6">
                      {loginError}
                    </div>
                  )}
                  <div className="mt-8">
                    <button
                      type="submit"
                      className={`rounded-[16px]  hover:bg-gray-700  bg-red p-2.5 w-full text-white border-none 
                              ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
                      disabled={isSubmit}
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
                        "Log In"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="cursor-pointer p-2.5 bg-slate-100 dark:bg-black  dark:text-white  border w-full rounded-[16px]"
              >
                <FcGoogle className="inline" /> Log In with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
