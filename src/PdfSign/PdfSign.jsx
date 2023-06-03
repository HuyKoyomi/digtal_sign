import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import React, { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import PagingControl from "../Components/PagingControl";
import Drop from "../Drop";
import { blobToURL } from "../utils/Utils";
import { BigButton } from "../Components/BigButton";
import DraggableText from "../Components/DraggableText";
import dayjs from "dayjs";
import { PDFDocument, rgb } from "pdf-lib";
import DraggableSignature from "../Components/DraggableSignature";
import { AddSigDialog } from "../Components/AddSigDialog";
import { Canvas } from "@react-pdf/renderer";
import { fabric } from "fabric";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const PdfSign = (props) => {
  const styles = {
    container: {
      maxWidth: 900,
      margin: "0 auto",
    },
    sigBlock: {
      display: "inline-block",
      border: "1px solid #000",
    },
    documentBlock: {
      maxWidth: 800,
      margin: "20px auto",
      marginTop: 8,
      border: "1px solid #999",
    },
    controls: {
      maxWidth: 800,
      margin: "0 auto",
      marginTop: 8,
    },
  };
  const [pdf, setPdf] = useState(null);
  const [autoDate, setAutoDate] = useState(true);
  const [signatureURL, setSignatureURL] = useState(null);
  const [position, setPosition] = useState(null);
  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageDetails, setPageDetails] = useState(null);
  const documentRef = useRef(null);
  const [scalepdf, setScalepdf] = useState(1);

  function changeScale(i) {
    if (scalepdf + i > 0) {
      setScalepdf(scalepdf + i);
    }
  }

  //===========================================================================================
  const [textCoordinates, setTextCoordinates] = useState({});

  useEffect(() => {
    console.log("textCoordinates", textCoordinates);
  }, [textCoordinates]);

  const handleLoadSuccess = async (pdf) => {
    const page = await pdf.getPage(1); // Lấy trang đầu tiên (ở đây là trang 1)
    const content = await page.getTextContent();
    // tìm kiếm text
    const textToFind = "${DigitalSignA}"; // Đoạn văn bản cần tìm tọa độ
    // so sánh chuỗi vãn bản bản
    content.items.forEach((item) => {
      if (item.str === textToFind) {
        // tính tọa độ, chiều dài, rộng
        const { transform } = item;
        setTextCoordinates({
          x: transform[4],
          y: transform[5],
        });
      }
    });
  };
  //===========================================================================================
  async function sign(signatureURL) {
    const pdfDoc = await PDFDocument.load(pdf);
    const pages = pdfDoc.getPages(); // lấy file
    const firstPage = pages[pageNum]; // lấy trang hiện tại
    const pngImage = await pdfDoc.embedPng(signatureURL); // gán ảnh chữ ký số
    const pngDims = pngImage.scale(scalepdf * 0.2); // căn chỉnh lại tỉ lệ chữ ký

    const infoCoordinates = {
      x: textCoordinates?.x, //newX,
      y: textCoordinates?.y, //newY,
      width: pngDims.width,
      height: pngDims.height,
    };
    firstPage.drawImage(pngImage, infoCoordinates);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)]);

    const URL = await blobToURL(blob);
    setPdf(URL);
    setPosition(null);
    setSignatureURL(null);
  }
  //===========================================================================================
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("hello");
    const canvas = new fabric.Canvas(canvasRef.current, { selection: false });

    // Tạo hình vuông ban đầu
    const square = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      // fill: "red",
      fill: "rgba(0, 0, 0, 0.5)",
    });

    // Thêm hình vuông vào canvas
    canvas.add(square);

    // Bật tính năng kéo thả cho hình vuông
    square.set("draggable", true);

    // Xử lý sự kiện khi di chuyển hình vuông
    square.on("moving", () => {
      canvas.requestRenderAll();
    });
  }, [pdf]);
  //===========================================================================================

  return (
    <div style={styles.container}>
      {!pdf ? (
        <Drop
          onLoaded={async (files) => {
            const URL = await blobToURL(files[0]);
            setPdf(URL);
          }}
        />
      ) : null}
      {signatureDialogVisible ? (
        <AddSigDialog
          autoDate={autoDate}
          setAutoDate={setAutoDate}
          onClose={() => setSignatureDialogVisible(false)}
          onConfirm={(url) => {
            sign(url);
            setSignatureDialogVisible(false);
          }}
        />
      ) : null}
      {pdf ? (
        <div>
          {!signatureURL ? (
            <button
              //   marginRight={8}
              title={"Add signature"}
              onClick={() => setSignatureDialogVisible(true)}
            >
              Add signature
            </button>
          ) : null}

          <button
            // marginRight={8}
            title={"Add Date"}
            onClick={() => setTextInputVisible("date")}
          >
            Add Date
          </button>

          <button
            // marginRight={8}
            title={"Add Text"}
            onClick={() => setTextInputVisible(true)}
          >
            Add Text
          </button>
          <button
            // marginRight={8}
            title={"Reset"}
            onClick={() => {
              setTextInputVisible(false);
              setSignatureDialogVisible(false);
              setSignatureURL(null);
              setPdf(null);
              setTotalPages(0);
              setPageNum(0);
              setPageDetails(null);
            }}
          >
            Reset
          </button>
          <button onClick={() => changeScale(0.5)}>+</button>
          <button onClick={() => changeScale(-0.5)}>-</button>
          <button>Editor Ink</button>
          {pdf ? (
            <button
              //   marginRight={8}
              //   inverted={true}
              title={"Download"}
              onClick={() => {
                downloadURI(pdf, "file.pdf");
              }}
            >
              Download
            </button>
          ) : null}

          <div ref={documentRef} style={styles.documentBlock}>
            {textInputVisible ? (
              <DraggableText
                initialText={
                  textInputVisible === "date"
                    ? dayjs().format("M/d/YYYY")
                    : null
                }
                onCancel={() => setTextInputVisible(false)}
                onEnd={setPosition}
                onSet={async (text) => {
                  const { originalHeight, originalWidth } = pageDetails;
                  const scale = originalWidth / documentRef.current.clientWidth;

                  const y =
                    documentRef.current.clientHeight -
                    (position.y +
                      12 * scale -
                      position.offsetY -
                      documentRef.current.offsetTop);
                  const x =
                    position.x -
                    166 -
                    position.offsetX -
                    documentRef.current.offsetLeft;

                  // new XY in relation to actual document size
                  const newY =
                    (y * originalHeight) / documentRef.current.clientHeight;
                  const newX =
                    (x * originalWidth) / documentRef.current.clientWidth;

                  const pdfDoc = await PDFDocument.load(pdf);

                  const pages = pdfDoc.getPages();
                  const firstPage = pages[pageNum];

                  firstPage.drawText(text, {
                    x: textCoordinates?.x, //newX,
                    y: textCoordinates?.y, //newY,
                    size: 20 * scale,
                  });

                  const pdfBytes = await pdfDoc.save();
                  const blob = new Blob([new Uint8Array(pdfBytes)]);

                  const URL = await blobToURL(blob);
                  setPdf(URL);
                  setPosition(null);
                  setTextInputVisible(false);
                }}
              />
            ) : null}

            <Document
              file={pdf}
              // onLoadSuccess={(data) => {
              //   setTotalPages(data.numPages);
              // }}
              onLoadSuccess={handleLoadSuccess}
            >
              <Page
                pageNumber={pageNum + 1}
                width={800}
                height={1200}
                scale={scalepdf}
                onLoadSuccess={(data) => {
                  console.log("HANT:  data");
                  console.log(data);
                  setPageDetails(data);
                }}
              />
            </Document>
            <Canvas ref={canvasRef} className="fabric-canvas" />
          </div>
          <PagingControl
            pageNum={pageNum}
            setPageNum={setPageNum}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PdfSign;
