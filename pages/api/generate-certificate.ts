import { makeCertificate } from "@/certificateGenerator";

export default function handler(req, res) {
  const { name, course } = req.body;

  // Generate the certificate for the student
  makeCertificate(name, course)
    .then((pdfBytes) => {
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(pdfBytes);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error generating certificate");
    });
}
