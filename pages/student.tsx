import { useEffect, useState } from "react";
import Accordion from "@/components/Accordion";
import DTButton from "@/components/DTButton";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useGlobalContext } from "@/context/GlobalContext";
// import { makeCertificate } from "@/utils/run"; // Import the function to generate the certificate

export default function AppliedStudentsPage() {
  const [students, setStudents] = useState([]);
  const {user} = useGlobalContext()

  useEffect(() => {
    fetch("/api/fetch-student-details", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => setStudents(result))
      .catch((error) => console.error(error));
  }, []);

  const makeCertificate = async () => {
    console.log(user.name, "CS F121")
  }

  // Function to handle certificate download
  // const handleDownloadCertificate = (student) => {
  //   // Generate the certificate for the student
  //   const certificatePdf = makeCertificate(student);

  //   // Convert the PDF to a blob
  //   const pdfBlob = new Blob([certificatePdf], { type: "application/pdf" });

  //   // Create a download link for the blob
  //   const url = URL.createObjectURL(pdfBlob);

  //   // Create an anchor element to trigger download
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `${student.name}_certificate.pdf`;

  //   // Append the link to the document and trigger download
  //   document.body.appendChild(link);
  //   link.click();

  //   // Clean up
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-10 px-5 sm:px-16">
      <Head>
        <title>Admin - FDCM</title>
      </Head>
      <div className="flex items-center justify-between w-full">
        {/* <span className="text-black">Applied Students</span> */}
        {/* Download certificate button */}
        <DTButton onClick={() => {makeCertificate()}} className="w-fit">
          Download Certificate
        </DTButton>
      </div>
    </div>
  );
}
