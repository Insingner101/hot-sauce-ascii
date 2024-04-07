import DTButton from "@/components/DTButton";
import { CustomInput, DropdownInput } from "@/components/Input";
import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function applyFDCMform() {
  const methods = useForm();
  const onSubmit = (data: any) => {
    //console.log(data.Name);
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
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const [courseId, setCourseId] = useState("");
  const [course_title, setCourse_title] = useState("");
  const [course_ic, setCourse_ic] = useState("");
  const [loading, setLoading] = useState(false);
  const [ICMail, setICMail] = useState("");

  const getCourseDetails = async () => {
    try {
      const response = await fetch(
        `/api/fetch-course-form-details?course_id=${courseId}`
      );
      const data = await response.json();
      console.log(data);
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

  useEffect(() => {
    console.log(courseId);
    setLoading(true);
    getCourseDetails();
  }, [courseId]);

  return (
    <>
      <Head>
        <title>Apply - FDCM</title>
      </Head>
      <div className="w-full flex flex-col pt-10 pb-10 px-5 sm:px-16">
        <span className="text-black">Apply for FDCM</span>
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
            <CustomInput
              type="text"
              name="CourseTitle"
              label="Course Title"
              value={course_title}
              setValue={setCourse_title}
              placeholder=""
              isRequired={true}
            />
            <CustomInput
              type="text"
              name="IC"
              label="Course IC"
              value={course_ic}
              setValue={setCourse_ic}
              placeholder=""
              isRequired={true}
            />
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
                Apply
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
