import DTButton from "@/components/DTButton";
import { CustomInput, DropdownInput } from "@/components/Input";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function ApplyFDCMform() {
  const methods = useForm();
  const onSubmit: SubmitHandler<any> = (data: any) => {
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      student_id: data.ID,
      name: data.Name,
      course_id: data.CourseCode,
      grade: data.grade,
      links: data.link,
      email_id: data.mail,
      course_ic: ICMail,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch("/api/update-form-details", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.message === "Form details updated successfully") {
          setShowSuccessBanner(true);
          setErrorMessage("");
          setShowErrorBanner(false);
        } else if (result.message === "Student has already applied for this course") {
          setShowErrorBanner(true);
          setErrorMessage(result.message);
          setShowSuccessBanner(false);
        } else if (result.message === "Invalid course id") {
          setShowErrorBanner(true);
          setErrorMessage(result.message);
          setShowSuccessBanner(false);
        } else if (result.message === "Unauthorized submission") {
          setShowErrorBanner(true);
          setErrorMessage(result.message);
          setShowSuccessBanner(false);
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error(error);
        setShowErrorBanner(true);
        setErrorMessage("Error updating form details");
        setShowSuccessBanner(false);
        setLoading(false)
      });
  };

  const [courseId, setCourseId] = useState("");
  const [course_title, setCourse_title] = useState("");
  const [course_ic, setCourse_ic] = useState("");
  const [loading, setLoading] = useState(false);
  const [ICMail, setICMail] = useState("");
  const [isCourseDetailsLoading, setIsCourseDetailsLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCourseDetails = useCallback(async () => {
    try {
      setIsCourseDetailsLoading(true);
      const response = await fetch(`/api/fetch-course-form-details?course_id=${courseId}`);
      const data = await response.json();
      if (data.course_title) {
        setCourse_title(data.course_title);
        setCourse_ic(data.ic);
        setICMail(data.course_ic);
      } else {
        setCourse_title("");
        setCourse_ic("");
        setICMail("");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setIsCourseDetailsLoading(false);
    }
  }, [courseId]);
  
  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      getCourseDetails();
    }, 500);
  
    return () => clearTimeout(delayedFetch);
  }, [getCourseDetails]);

  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      getCourseDetails();
    }, 500);
  
    return () => clearTimeout(delayedFetch);
  }, [courseId, getCourseDetails]);

  return (
    <>
      <Head>
        <title>Apply - FDCM</title>
      </Head>
      <div className="w-full flex flex-col pt-10 pb-10 px-5 sm:px-16">
        <span className="text-black text-xl font-medium">Apply for FDCM</span>
        {showErrorBanner && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold mr-2">
              <AiOutlineCloseCircle className="inline-block align-text-top mr-2" />
              Error
            </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        {showSuccessBanner && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold mr-2">
              <AiOutlineCheckCircle className="inline-block align-text-top mr-2" />
              Success
            </strong>
            <span className="block sm:inline">Apllication submitted successfully.</span>
          </div>
        )}
        <FormProvider {...methods}>
          <form
            className="w-full h-fit gap-4 grid grid-cols-1 sm:grid-cols-2"
            autoComplete="off"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <CustomInput
              type="text"
              name="Name"
              label="Name"
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="ID"
              label="ID NO"
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="mail"
              label="Mail ID"
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="CourseCode"
              value={courseId}
              setValue={setCourseId}
              label="Course ID"
              placeholder=""
              isRequired={true}
            />
            {isCourseDetailsLoading ? (
              <div className="col-span-2 flex justify-center items-center h-11">
                <span className="text-black text-opacity-[0.85] text-sm">Loading course details...</span>
              </div>
            ) : (
              <>
                <CustomInput
                  type="text"
                  name="CourseTitle"
                  label="Course Title"
                  value={course_title}
                  setValue={setCourse_title}
                  placeholder=""
                  isRequired={false}
                  isLoading={false}
                />
                <CustomInput
                  type="text"
                  name="IC"
                  label="Course IC"
                  value={course_ic}
                  setValue={setCourse_ic}
                  placeholder=""
                  isRequired={false}
                  isLoading={false}
                />
              </>
            )}
            <CustomInput
              type="text"
              name="grade"
              label="Grade obtained"
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="link"
              label="Link to Resume"
              placeholder=""
              isRequired={true}
            />
            <div></div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="w-fit flex items-center justify-between px-4 py-2 gap-3 font-semibold border hover:shadow dark:border-0 border-[#e5e7eb] bg-white text-black rounded-md cursor-pointer transition-all"
              >
                {loading ? <Loader /> : "Apply"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
