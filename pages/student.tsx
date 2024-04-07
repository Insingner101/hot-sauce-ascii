import { useEffect, useState } from "react";
import Accordion from "@/components/Accordion";
import DTButton from "@/components/DTButton";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { makeCertificate } from "@/utils/run"; // Import the function to generate the certificate

export default function AppliedStudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/fetch-student-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => setStudents(result))
      .catch((error) => console.error(error));
  }, []);

  // Function to handle certificate download
  const handleDownloadCertificate = (student) => {
    // Generate the certificate for the student
    const certificatePdf = makeCertificate(student);

    // Convert the PDF to a blob
    const pdfBlob = new Blob([certificatePdf], { type: "application/pdf" });

    // Create a download link for the blob
    const url = URL.createObjectURL(pdfBlob);

    // Create an anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${student.name}_certificate.pdf`;

    // Append the link to the document and trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-10 px-5 sm:px-16">
      <Head>
        <title>Admin - FDCM</title>
      </Head>
      <div className="flex items-center justify-between w-full">
        <span className="text-black">Applied Students</span>
        <DTButton onClick={() => signOut({ callbackUrl: "/" })} className="py-2">
          Email Faculty
        </DTButton>
      </div>
      {students.map((student, index) => (
        <Accordion
          key={index}
          Header={
            <div className="w-full flex items-center justify-between pr-2">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none text-black">{student?.name}</p>
                <p className="text-sm leading-none text-muted-foreground text-light">{student?.email_id}</p>
              </div>
              <p className="text-base font-medium leading-none text-black">{student?.course_id}</p>
            </div>
          }
          Content={
            <div className="w-full flex flex-col md:flex-row p-2 gap-5">
              {/* instructor details  */}
              <div className="flex flex-col gap-1">
                <p className="text-base leading-none text-muted-foreground text-light">Instructor in charge</p>
                <div className="rounded border border-lightgray p-2.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium leading-none text-black">{student?.ic}</p>
                    <p className="text-sm leading-none text-muted-foreground text-light">{student?.course_ic}</p>
                  </div>
                </div>
              </div>
              {/* student details  */}
              <div className="flex flex-col gap-1">
                <p className="text-base leading-none text-muted-foreground text-light">Student details</p>
                <div className="rounded flex flex-col gap-2 border border-lightgray p-2.5">
                  {/* Render student details here */}
                </div>
              </div>
              {/* Download certificate button */}
              <DTButton onClick={() => handleDownloadCertificate(student)}>Download Certificate</DTButton>
            </div>
          }
          height="h-[16rem] md:h-[10rem]"
        />
      ))}
    </div>
  );
}
