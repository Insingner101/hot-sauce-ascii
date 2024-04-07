import Accordion from "@/components/Accordion";
import DTButton from "@/components/DTButton";
import { CustomInput } from "@/components/Input";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface AppliedStudent {
  student_id: string;
  name: string;
  course_id: string;
  grade: string;
  links: string;
  email_id: string;
  course_ic: string;
  ic: string;
  email_status: boolean;
}

export default function formEg() {
  const methods = useForm();
  const [students, setStudents] = useState<AppliedStudent[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/fetch-student-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => setStudents(result))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-10 px-5 sm:px-16">
      <Head>
        <title>Admin - FDCM</title>
      </Head>
      <div className="flex items-center justify-between w-full">
        <span className="text-black">Applied Students</span>
        <DTButton
          onClick={() => signOut({ callbackUrl: "/" })}
          className="py-2"
        >
          Email Faculty
        </DTButton>
      </div>
      {students.map((student, index) => (
        <Accordion
          key={index}
          Header={
            <div className="w-full flex items-center justify-between pr-2">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none text-black">
                  {student?.name}
                </p>
                <p className="text-sm leading-none text-muted-foreground text-light">
                  {student?.email_id}
                </p>
              </div>
              <p className="text-base font-medium leading-none text-black">
                {student?.course_id}
              </p>
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
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium leading-none text-black">
                      {student?.ic}
                    </p>
                    <p className="text-sm leading-none text-muted-foreground text-light">
                      {student?.course_ic}
                    </p>
                  </div>
                </div>
              </div>
              {/* student details  */}
              <div className="flex flex-col gap-1">
                <p className="text-base leading-none text-muted-foreground text-light">
                  Student details
                </p>
                <div className="rounded flex flex-col gap-2 border border-lightgray p-2.5">
                  <KeyValueElement keyString="Id" value={student.student_id} />
                  <KeyValueElement keyString="Grade" value={student.grade} />
                  <KeyValueElement
                    keyString="Email sent"
                    value={student.email_status ? "Yes" : "No"}
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium leading-none text-black">
                      Links:
                    </p>
                    <Link href={student.links} target="_blank" className="text-base leading-none text-muted-foreground text-[#0000EE]">
                      Resume
                    </Link>
                  </div>
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
