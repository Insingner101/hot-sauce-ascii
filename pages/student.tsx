import { useEffect, useState } from "react";
import Accordion from "@/components/Accordion";
import DTButton from "@/components/DTButton";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useGlobalContext } from "@/context/GlobalContext";
import toast from "react-hot-toast";
import { FDCM, KeyValueElement } from "./hod";
import { AiOutlineCloseCircle } from "react-icons/ai";
// import { makeCertificate } from "@/utils/run"; // Import the function to generate the certificate

export default function AppliedStudentsPage() {
  const [student, setStudent] = useState<FDCM[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useGlobalContext();

  const getFdcmDetails = async () => {
    setLoading(true);
    fetch("/api/fetch-fdcm-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setStudent(
            result.filter((student: FDCM) => student.email_id === user.email)
          );
        } else toast.error("Details not found");
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to fetch your details!");
        setLoading(false);
      });
  };

  useEffect(() => {
    getFdcmDetails();
  }, []);

  const makeCertificate = async () => {
    console.log(user.name, "CS F121");
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ mail: user.email });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch("http://localhost:3000/api/download-certificate", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
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
      <div className="flex items-center justify-center w-full">
        {/* <span className="text-black">Applied Students</span> */}
        {/* Download certificate button */}
        {student.length > 0 ? (
          <>
            {student.map((stud, index) => (
              <Accordion
                key={index}
                Header={
                  <div className="w-full flex items-center justify-between pr-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-medium leading-none text-black">
                        {stud?.student_id}
                      </p>
                      <p className="text-sm leading-none text-muted-foreground text-light">
                        {stud?.email_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-medium leading-none text-black">
                        {stud?.course_id}
                      </p>
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
                            {stud?.faculty_name}
                          </p>
                          <p className="text-sm leading-none text-muted-foreground text-light">
                            {stud?.course_ic}
                          </p>
                          <KeyValueElement
                            keyString="Component"
                            value={stud.component}
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
                          value={stud.recommendation}
                        />
                        <KeyValueElement
                          keyString="Remark"
                          value={stud.remark}
                        />
                        <KeyValueElement keyString="Grade" value={stud.grade} />
                      </div>
                    </div>
                  </div>
                }
                height="h-[16rem] md:h-[10rem]"
              />
            ))}
            <DTButton
              onClick={() => {
                makeCertificate();
              }}
              className="w-fit"
            >
              Download Certificate
            </DTButton>
          </>
        ) : (
          <div
            className="bg-red-100 flex items-center w-full border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold mr-2 flex items-center">
              <AiOutlineCloseCircle className="inline-block align-text-top mr-2" />
              Error
            </strong>
            <span className="block sm:inline">
              Unable to fetch your details
            </span>
          </div>
        )}
      </div>
      <DTButton
        onClick={() => {
          makeCertificate();
        }}
        className="w-fit"
      >
        Download Certificate
      </DTButton>
    </div>
  );
}
