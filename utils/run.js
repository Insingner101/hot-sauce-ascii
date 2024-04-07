import { createCanvas, loadImage, registerFont } from "canvas";
// const fs = require('fs');
import { PDFDocument } from "pdf-lib";

// Register font files
registerFont("utils/font/GreatVibes-Regular.ttf", { family: "Great Vibes" });
registerFont("utils/coursefont/OpenSauceSans-Regular.ttf", {
  family: "Open Sauce Sans",
});

// Global Variables
const FONT_SIZE = 180;
const FONT_COLOR = "#FFFFFF";
const COURSE_FONT_SIZE = 40;
const SIGNATURE_PATH = "utils/sign.png";

export default async function makeCertificate(name, course) {
  // Create canvas
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext("2d");

  // Load template image
  const template = await loadImage("utils/cert.png");
  canvas.width = template.width;
  canvas.height = template.height;
  ctx.drawImage(template, 0, 0);

  // Set font properties
  ctx.font = `${FONT_SIZE}px 'Great Vibes'`;
  ctx.fillStyle = FONT_COLOR;

  // Measure text width
  const nameWidth = ctx.measureText(name).width;

  // Draw name
  ctx.fillText(
    name,
    (canvas.width - nameWidth) / 2,
    (canvas.height - FONT_SIZE) / 2 + 165
  );

  // Set course font properties
  ctx.font = `${COURSE_FONT_SIZE}px 'Open Sauce Sans'`;

  // Measure course text width
  const courseWidth = ctx.measureText(course).width;

  // Draw course
  ctx.fillText(
    course,
    (canvas.width - courseWidth) / 2,
    (canvas.height - COURSE_FONT_SIZE) / 2 + 220
  );

  // Load signature image
  const signature = await loadImage(SIGNATURE_PATH);

  // Draw signature
  ctx.drawImage(
    signature,
    (canvas.width - signature.width) / 2,
    canvas.height - signature.height - 115
  );

  // Convert canvas to PDF
  const pdfBytes = await canvasToPDF(canvas);

  return pdfBytes;
}

async function canvasToPDF(canvas) {
    console.log("creating doc")
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([canvas.width, canvas.height]);
  const pdfImage = await pdfDoc.embedPng(canvas.toBuffer());
  page.drawImage(pdfImage, {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  });
  return await pdfDoc.save();
}
