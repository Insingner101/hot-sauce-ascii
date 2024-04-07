import DTButton from "@/components/DTButton";
import { CustomInput, DropdownInput } from "@/components/Input";
import { useGlobalContext } from "@/context/GlobalContext";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function applyFDCMform() {
  const methods = useForm();
  const onSubmit = (data: any) => {
    console.log(data.Name);
  };

  const [courseId,setCourseId] = useState("")
  const [loading, setLoading] = useState(false)

  const getCourseDetails = async() => {
    try {
      const response = await fetch(`/api/fetch-course-form-details?course_id=${courseId}`);
      const data = await response.json();
      console.log(data);
      if(data.course_title){
        methods.setValue('CourseTitle',data.course_title)
        methods.setValue('IC',data.ic)
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  }

  useEffect(() => {
    console.log(courseId)
    setLoading(true)
    getCourseDetails()
  }, [courseId])

  // const fetchCourseDetails = async (courseCode: string) => {
  //   // Implement logic to fetch course details based on course code from your backend
  //   // For example, you can make an API call here
  //   try {
  //     const response = await fetch(`/api/fetch-course-form-details?course_id=${courseCode}`);
  //     const data = await response.json();
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching course details:', error);
  //     return null;
  //   }
  // };

  // const handleCourseCodeBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
  //   const courseCode = event.target.value;
  //   console.log(courseCode);
  //   const details = await fetchCourseDetails(courseCode);
  //   if (!details.error) {
  //     methods.setValue('CourseTitle', details.course_title);
  //     methods.setValue('IC', details.ic);
  //     // Set values for other fields as needed
  //   } else if (courseCode !== undefined) {
  //     methods.setError('CourseCode', { type: 'custom', message: 'Course not found' });
  //   }
  // };

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col gap-4 max-w-[16rem]"
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
            placeholder=""
            isRequired={true}
          />
          <CustomInput
            type="text"
            name="IC"
            label="Course IC"
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
          
          <button
            type="submit"
            className="text-black text-base font-medium px-5 py-1 rounded-[5px] bg-rafflesGold"
          >
            Next
          </button>
        </form>
      </FormProvider>
      <DTButton
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-[16rem] py-2"
      >
        Sign out
      </DTButton>
    </>
  );
}