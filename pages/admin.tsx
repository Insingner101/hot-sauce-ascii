import Accordion from "@/components/Accordion";
import DTButton from "@/components/DTButton";
import { CustomInput } from "@/components/Input";
import Loader from "@/components/Loader";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export interface AppliedStudent {
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

export interface GroupedStudents {
  students: AppliedStudent[];
  ic_mail: string;
}

export default function Admin() {
  const methods = useForm();
  const [students, setStudents] = useState<AppliedStudent[]>([]);
  const [loading, setLoading] = useState(false);

  const getFDCM = async () => {
    fetch("/api/fetch-student-form-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => setStudents(result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getFDCM();
  }, []);

  function groupByIC(students: AppliedStudent[]): GroupedStudents[] {
    const groupedStudents: { [key: string]: GroupedStudents } = {};

    for (const student of students) {
      const { course_ic, ic, email_id, email_status } = student;

      if (!email_status) {
        if (!groupedStudents[course_ic]) {
          groupedStudents[course_ic] = {
            students: [],
            ic_mail: course_ic,
          };
        }
        groupedStudents[course_ic].students.push(student);
      }
    }

    return Object.values(groupedStudents).filter(
      (group) => group.students.length > 0
    );
  }

  const sendMail = async () => {
    setLoading(true);
    let mails = groupByIC(students);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(mails);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch("/api/send-email", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        getFDCM()
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-10 px-5 sm:px-16">
      <Head>
        <title>Admin - FDCM</title>
      </Head>
      <div className="flex items-center justify-between w-full">
        <span className="text-black">Applied Students</span>
        <DTButton
          onClick={() => {
            sendMail();
          }}
          className="py-2"
        >
          {loading ? <Loader /> : "Email Faculty"}
        </DTButton>
      </div>
      {students.filter((student) => !student.email_status).length > 0 ? (
        students
          .filter((student) => !student.email_status)
          .map((student, index) => (
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
                      <KeyValueElement
                        keyString="Id"
                        value={student.student_id}
                      />
                      <KeyValueElement
                        keyString="Grade"
                        value={student.grade}
                      />
                      <KeyValueElement
                        keyString="Email sent"
                        value={student.email_status ? "Yes" : "No"}
                      />
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium leading-none text-black">
                          Links:
                        </p>
                        <Link
                          href={student.links}
                          target="_blank"
                          className="text-base leading-none text-muted-foreground text-[#0000EE]"
                        >
                          Resume
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              }
              height="h-[16rem] md:h-[10rem]"
            />
          ))
      ) : (
        <span className="text-light font-medium mt-16 text-left w-full">
          All students mailed to respective faculties.
        </span>
      )}
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
