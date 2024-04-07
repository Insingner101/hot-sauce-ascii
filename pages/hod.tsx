import Accordion from "@/components/Accordion";
import Loader from "@/components/Loader";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FDCM {
  student_id: string;
  email_id: string;
  course_id: string;
  component: string;
  grade: string;
  recommendation: string;
  remark: string;
  signed_status: boolean;
  course_ic: string;
  faculty_name: string;
}

const RoundedButton = ({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}) => {
  return (
    <button
      onClick={disabled ? () => toast.error("Student already signed!") : onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold transition-opacity ${
        disabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
      }`}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};

export default function FormEg() {
  const methods = useForm();
  const [students, setStudents] = useState<FDCM[]>([]);
  const [loading, setLoading] = useState(false);
  const [signStudentMail, setSignStudentMail] = useState("");

  const getFdcmDetails = async () => {
    setLoading(true);
    fetch("http://localhost:3000/api/fetch-fdcm-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        setStudents(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to fetch FDCM details!");
        setLoading(false);
      });
  };

  useEffect(() => {
    getFdcmDetails();
  }, []);

  const signStudent = async (id: string, course_id: string) => {
    console.log(id, course_id);
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      student_id: id,
      course_id: course_id,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch("http://localhost:3000/api/update-sign-details", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.message && result.message.includes("successfully"))
          toast.success("Signed successfully!");
        getFdcmDetails();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Signing failed!");
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-10 px-5 sm:px-16">
      <Head>
        <title>HOD - FDCM</title>
      </Head>
      <div className="flex items-center justify-between w-full">
        <span className="text-black">Applied Students</span>
      </div>
      {students.map((student, index) => (
        <Accordion
          key={index}
          Header={
            <div className="w-full flex items-center justify-between pr-2">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none text-black">
                  {student?.student_id}
                </p>
                <p className="text-sm leading-none text-muted-foreground text-light">
                  {student?.email_id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base font-medium leading-none text-black">
                  {student?.course_id}
                </p>
                <RoundedButton
                  onClick={() => {
                    setSignStudentMail(student.email_id);
                    signStudent(student.student_id, student.course_id);
                  }}
                  disabled={student.signed_status}
                  loading={loading && signStudentMail === student.email_id}
                >
                  Sign
                </RoundedButton>
              </div>
            </div>
          }
          Content={
            <div className="w-full flex flex-col md:flex-row p-2 gap-5">
              {/* instructor details  */}
              <div className="flex flex-col gap-1">
                <p className="text-base leading-none text-muted-foreground text-light">
                  Instructor in charge
                </p>
                <div className="rounded border border-lightgray p-2.5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-base font-medium leading-none text-black">
                      {student?.faculty_name}
                    </p>
                    <p className="text-sm leading-none text-muted-foreground text-light">
                      {student?.course_ic}
                    </p>
                    <KeyValueElement
                      keyString="Component"
                      value={student.component}
                    />
                  </div>
                </div>
              </div>
              {/* student details  */}
              <div className="flex flex-col gap-1">
                <p className="text-base leading-none text-muted-foreground text-light">
                  Student details
                </p>
                <div className="rounded flex flex-col gap-2 border border-lightgray p-2.5">
                  <KeyValueElement
                    keyString="Recommendation"
                    value={student.recommendation}
                  />
                  <KeyValueElement keyString="Remark" value={student.remark} />
                  <KeyValueElement keyString="Grade" value={student.grade} />
                </div>
              </div>
            </div>
          }
          height="h-[16rem] md:h-[10rem]"
        />
      ))}
    </div>
  );
}

const KeyValueElement = ({
  keyString,
  value,
}: {
  keyString: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-base font-medium leading-none text-black">
        {keyString}:
      </p>
      <p className="text-base leading-none text-muted-foreground text-light">
        {value}
      </p>
    </div>
  );
};
