import DTButton from "@/components/DTButton";
import { CustomInput, DropdownInput } from "@/components/Input";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ApplyFDCMform() {
  const methods = useForm();

  const [courseId, setCourseId] = useState("");
  const [course_title, setCourse_title] = useState("");
  const [course_ic, setCourse_ic] = useState("");
  const [loading, setLoading] = useState(false);
  const [ICMail, setICMail] = useState("");

  const onSubmit = (data: any) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      student_id: data.id,
      email_id: data.mail,
      course_id: data.courseCode,
      component: data.courseComponent,
      grade: data.grade,
      recommendation: data?.recommendation ?? "",
      remark: data?.remark ?? "",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch("/api/update-fdcm-details", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.message && result.message.includes("success"))
          toast.success("FDCM added successfully!");
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const getCourseDetails = async () => {
    try {
      const response = await fetch(
        `/api/fetch-course-form-details?course_id=${courseId}`
      );
      const data = await response.json();
      if (data.course_title) {
        setCourse_title(data.course_title);
        setCourse_ic(data.ic);
        setICMail(data.course_ic);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      return null;
    }
  };

  return (
    <>
      <Head>
        <title>Faculty - FDCM</title>
      </Head>
      <div className="w-full flex flex-col pt-10 pb-10 px-5 sm:px-16">
        <span className="text-black">Add FDCM details</span>
        <FormProvider {...methods}>
          <form
            className="w-full h-fit gap-4 grid grid-cols-1 sm:grid-cols-2"
            autoComplete="off"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <CustomInput
              type="text"
              name="name"
              label="Name"
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="id"
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
              name="courseCode"
              value={courseId}
              setValue={setCourseId}
              label="Course ID"
              placeholder=""
              isRequired={true}
            />
            <DropdownInput
              options={["Tutorial", "Lab"]}
              name="courseComponent"
              label="Component"
              value={course_title}
              setValue={setCourse_title}
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="grade"
              label="Course Grade"
              value={course_ic}
              setValue={setCourse_ic}
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="recommendation"
              label="Recommendation"
              placeholder=""
              isRequired={false}
            />
            <CustomInput
              type="text"
              name="remark"
              label="Remark"
              placeholder=""
              isRequired={false}
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
