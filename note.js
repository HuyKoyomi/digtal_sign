// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
// import React, { useEffect, useRef, useState } from "react";
// import { pdfjs, Document, Page } from "react-pdf";
// import PagingControl from "../Components/PagingControl";
// import Drop from "../Drop";
// import { blobToURL } from "../utils/Utils";
// import { BigButton } from "../Components/BigButton";
// import DraggableText from "../Components/DraggableText";
// import dayjs from "dayjs";
// import { PDFDocument, rgb } from "pdf-lib";
// import DraggableSignature from "../Components/DraggableSignature";
// import { AddSigDialog } from "../Components/AddSigDialog";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //     'pdfjs-dist/build/pdf.worker.min.js',
// //     import.meta.url,
// //   ).toString();

// //   const options = {
// //     cMapUrl: 'cmaps/',
// //     standardFontDataUrl: 'standard_fonts/',
// //   };
// function downloadURI(uri, name) {
//   const styles = {
//     container: {
//       maxWidth: 900,
//       margin: "0 auto",
//     },
//     sigBlock: {
//       display: "inline-block",
//       border: "1px solid #000",
//     },
//     documentBlock: {
//       maxWidth: 800,
//       margin: "20px auto",
//       marginTop: 8,
//       border: "1px solid #999",
//     },
//     controls: {
//       maxWidth: 800,
//       margin: "0 auto",
//       marginTop: 8,
//     },
//   };
//   var link = document.createElement("a");
//   link.download = name;
//   link.href = uri;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
// const PdfSign = (props) => {
//   const styles = {
//     container: {
//       maxWidth: 900,
//       margin: "0 auto",
//     },
//     sigBlock: {
//       display: "inline-block",
//       border: "1px solid #000",
//     },
//     documentBlock: {
//       maxWidth: 800,
//       margin: "20px auto",
//       marginTop: 8,
//       border: "1px solid #999",
//     },
//     controls: {
//       maxWidth: 800,
//       margin: "0 auto",
//       marginTop: 8,
//     },
//   };
//   const [pdf, setPdf] = useState(null);
//   const [autoDate, setAutoDate] = useState(true);
//   const [signatureURL, setSignatureURL] = useState(null);
//   const [position, setPosition] = useState(null);
//   const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
//   const [textInputVisible, setTextInputVisible] = useState(false);
//   const [pageNum, setPageNum] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pageDetails, setPageDetails] = useState(null);
//   const documentRef = useRef(null);
//   const [scalepdf, setScalepdf] = useState(1);

//   function changeScale(i) {
//     if (scalepdf + i > 0) {
//       setScalepdf(scalepdf + i);
//     }
//   }

//   //===========================================================================================
//   const [textCoordinates, setTextCoordinates] = useState([]);
//   const [signatureURLList, setSignatureURLList] = useState([]);

//   const DIGITALSIGNLIST = ["${DigitalSignA}", "${DigitalSignB}"];

//   useEffect(() => {
//     console.log("textCoordinates", textCoordinates);
//   }, [textCoordinates]);
  
//   useEffect(() => {
//     console.log("signatureURLList", signatureURLList);
//   }, [signatureURLList]);

//   const handleLoadSuccess = async (pdf) => {
//     const page = await pdf.getPage(1); // Lấy trang đầu tiên (ở đây là trang 1)
//     const content = await page.getTextContent(); // lấy nội dung file pdf

//     let tmpCoordinatesList = [];

//     for (const element of DIGITALSIGNLIST) {
//       // tìm kiếm text
//       const textToFind = element; // Đoạn văn bản cần tìm tọa độ
//       content.items.forEach((item) => {
//         if (item.str === textToFind) {
//           // tính tọa độ, chiều dài, rộng
//           const { transform } = item;
//           let coordinates = {
//             x: transform[4],
//             y: transform[5],
//           };
//           // thêm vào mảng tmp chữ ký
//           tmpCoordinatesList.push(coordinates);
//         }
//       });
//     }
//     // set lại giá trị vào state
//     setTextCoordinates(tmpCoordinatesList);
//   };
//   //===========================================================================================
//   async function sign() {
//     let URL = pdf;
//     for (let i = 0; i < signatureURLList.length; i++) {
//       const pdfDoc = await PDFDocument.load(URL);
//       const pages = pdfDoc.getPages(); // lấy file
//       const firstPage = pages[pageNum]; // lấy trang hiện tại
//       console.log("i", i);
//       const pngImage = await pdfDoc.embedPng(signatureURLList[i]); // gán ảnh chữ ký số
//       const pngDims = pngImage.scale(scalepdf * 0.2); // căn chỉnh lại tỉ lệ chữ ký

//       const infoCoordinates = {
//         x: textCoordinates[i].x,
//         y: textCoordinates[i].y,
//         width: pngDims.width,
//         height: pngDims.height,
//       };
//       // vẽ lên file pdf
//       firstPage.drawImage(pngImage, infoCoordinates);
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([new Uint8Array(pdfBytes)]);
//       // gán lại URL mới
//       URL = await blobToURL(blob);
//     }
//     // load lại page
//     setPdf(URL);
//   }
//   //===========================================================================================
//   // const changeHandler = async (event) => {
//   //   const fileUpload = event.target.files[0];

//   //   const pdfDoc = await PDFDocument.load(pdf);
//   //   const pages = pdfDoc.getPages(); // lấy file
//   //   const firstPage = pages[pageNum]; // lấy trang hiện tại
//   //   const pngImage = await pdfDoc.embedPng(
//   //     "https://www.google.com/imgres?imgurl=https%3A%2F%2Fpenstore.vn%2Fwp-content%2Fuploads%2F2018%2F11%2FNhung-mau-chu-ky-dep-ten-Anh-hop-phong-thuy.jpg&tbnid=1rlN_YJg2rzCmM&vet=12ahUKEwj7wOqVxqP_AhWkwnMBHQv6CScQMygHegUIARDGAQ..i&imgrefurl=https%3A%2F%2Fpenstore.vn%2Fchu-ky-dep-ten-anh%2Fnhung-mau-chu-ky-dep-ten-anh-hop-phong-thuy&docid=Jv3A87aFZmg34M&w=933&h=746&q=anh%20ch%E1%BB%A9%20k%C3%BD&ved=2ahUKEwj7wOqVxqP_AhWkwnMBHQv6CScQMygHegUIARDGAQ"
//   //   ); // gán ảnh chữ ký số
//   //   const pngDims = pngImage.scale(scalepdf * 0.2); // căn chỉnh lại tỉ lệ chữ ký

//   //   const infoCoordinates = {
//   //     x: textCoordinates?.x, //newX,
//   //     y: textCoordinates?.y, //newY,
//   //     width: pngDims.width,
//   //     height: pngDims.height,
//   //   };
//   //   firstPage.drawImage(pngImage, infoCoordinates);
//   //   const pdfBytes = await pdfDoc.save();
//   //   const blob = new Blob([new Uint8Array(pdfBytes)]);

//   //   const URL = await blobToURL(blob);
//   //   setPdf(URL);
//   //   setPosition(null);
//   //   setSignatureURL(null);

//   //   console.log("fileUpload", fileUpload);
//   // };
//   //===========================================================================================

//   return (
//     <div style={styles.container}>
//       {!pdf ? (
//         <Drop
//           onLoaded={async (files) => {
//             const URL = await blobToURL(files[0]);
//             setPdf(URL);
//           }}
//         />
//       ) : null}
//       {signatureDialogVisible ? (
//         <AddSigDialog
//           autoDate={autoDate}
//           setAutoDate={setAutoDate}
//           onClose={() => setSignatureDialogVisible(false)}
//           onConfirm={(url) => {
//             setSignatureURL(url);
//             setSignatureURLList([...signatureURLList, ...[url]]);
//             setSignatureDialogVisible(false);
//           }}
//         />
//       ) : null}
//       {pdf ? (
//         <div>
//           {/* {!signatureURL ? (
//             <button
//               //   marginRight={8}
//               title={"Add signature"}
//               onClick={() => setSignatureDialogVisible(true)}
//             >
//               Add signature
//             </button>
//           ) : null} */}
//           <button
//             //   marginRight={8}
//             title={"Add signature"}
//             onClick={() => setSignatureDialogVisible(true)}
//           >
//             Add signature
//           </button>

//           <button
//             // marginRight={8}
//             title={"Add Date"}
//             onClick={() => setTextInputVisible("date")}
//           >
//             Add Date
//           </button>

//           <button
//             // marginRight={8}
//             title={"Add Text"}
//             onClick={() => setTextInputVisible(true)}
//           >
//             Add Text
//           </button>
//           <button
//             // marginRight={8}
//             title={"Reset"}
//             onClick={() => {
//               setTextInputVisible(false);
//               setSignatureDialogVisible(false);
//               setSignatureURL(null);
//               setPdf(null);
//               setTotalPages(0);
//               setPageNum(0);
//               setPageDetails(null);
//             }}
//           >
//             Reset
//           </button>
//           <button onClick={() => changeScale(0.5)}>+</button>
//           <button onClick={() => changeScale(-0.5)}>-</button>
//           <button>Editor Ink</button>
//           {pdf ? (
//             <button
//               //   marginRight={8}
//               //   inverted={true}
//               title={"Download"}
//               onClick={() => {
//                 downloadURI(pdf, "file.pdf");
//               }}
//             >
//               Download
//             </button>
//           ) : null}
//           {pdf ? (
//             <button title={"Download"} onClick={sign}>
//               Sign
//             </button>
//           ) : null}

//           <div ref={documentRef} style={styles.documentBlock}>
//             {textInputVisible ? (
//               <DraggableText
//                 initialText={
//                   textInputVisible === "date"
//                     ? dayjs().format("M/d/YYYY")
//                     : null
//                 }
//                 onCancel={() => setTextInputVisible(false)}
//                 onEnd={setPosition}
//                 onSet={async (text) => {
//                   const { originalHeight, originalWidth } = pageDetails;
//                   const scale = originalWidth / documentRef.current.clientWidth;

//                   const y =
//                     documentRef.current.clientHeight -
//                     (position.y +
//                       12 * scale -
//                       position.offsetY -
//                       documentRef.current.offsetTop);
//                   const x =
//                     position.x -
//                     166 -
//                     position.offsetX -
//                     documentRef.current.offsetLeft;

//                   // new XY in relation to actual document size
//                   const newY =
//                     (y * originalHeight) / documentRef.current.clientHeight;
//                   const newX =
//                     (x * originalWidth) / documentRef.current.clientWidth;

//                   const pdfDoc = await PDFDocument.load(pdf);

//                   const pages = pdfDoc.getPages();
//                   const firstPage = pages[pageNum];

//                   firstPage.drawText(text, {
//                     x: textCoordinates?.x, //newX,
//                     y: textCoordinates?.y, //newY,
//                     size: 20 * scale,
//                   });

//                   const pdfBytes = await pdfDoc.save();
//                   const blob = new Blob([new Uint8Array(pdfBytes)]);

//                   const URL = await blobToURL(blob);
//                   setPdf(URL);
//                   setPosition(null);
//                   setTextInputVisible(false);
//                 }}
//               />
//             ) : null}

//             {/* {signatureURL ? (
//               <DraggableSignature
//                 url={signatureURL}
//                 onCancel={() => {
//                   setSignatureURL(null);
//                 }}
//                 // onSet={async () => {
//                 //   //  lấy chiều dài rộng ban đầu
//                 //   const { originalHeight, originalWidth } = pageDetails;
//                 //   // tính tỉ lệ
//                 //   const scale = originalWidth / documentRef.current.clientWidth;
//                 //   // tính x, y
//                 //   const y =
//                 //     documentRef.current.clientHeight -
//                 //     (position.y -
//                 //       position.offsetY +
//                 //       64 -
//                 //       documentRef.current.offsetTop);
//                 //   const x =
//                 //     position.x -
//                 //     160 -
//                 //     position.offsetX -
//                 //     documentRef.current.offsetLeft;

//                 //   // XY mới liên quan đến kích thước tài liệu thực tế
//                 //   // new XY in relation to actual document size
//                 //   const newY =
//                 //     (y * originalHeight) / documentRef.current.clientHeight;
//                 //   const newX =
//                 //     (x * originalWidth) / documentRef.current.clientWidth;

//                 //   const pdfDoc = await PDFDocument.load(pdf);

//                 //   const pages = pdfDoc.getPages(); // lấy file
//                 //   const firstPage = pages[pageNum]; // lấy trang hiện tại

//                 //   const pngImage = await pdfDoc.embedPng(signatureURL); // gán ảnh chữ ký số
//                 //   const pngDims = pngImage.scale(scale * 0.3); // căn chỉnh lại tỉ lệ chữ ký
//                 //   // console.log("Hant: ",scale * .3)
//                 //   console.log("HANT CO");
//                 //   console.log("scale: ", scale);
//                 //   console.log(scale * 0.3);
//                 //   const infoCoordinates = {
//                 //     x: textCoordinates?.x, //newX,
//                 //     y: textCoordinates?.y, //newY,
//                 //     width: pngDims.width,
//                 //     height: pngDims.height,
//                 //   };
//                 //   firstPage.drawImage(pngImage, infoCoordinates);

//                 //   // set ngày giờ
//                 //   // if (autoDate) {
//                 //   //   firstPage.drawText(
//                 //   //     `Signed ${dayjs().format("M/d/YYYY HH:mm:ss ZZ")}`,
//                 //   //     {
//                 //   //       x: newX,
//                 //   //       y: newY - 10,
//                 //   //       size: 14 * scale,
//                 //   //       color: rgb(0.074, 0.545, 0.262),
//                 //   //     }
//                 //   //   );
//                 //   // }

//                 //   const pdfBytes = await pdfDoc.save();
//                 //   const blob = new Blob([new Uint8Array(pdfBytes)]);

//                 //   const URL = await blobToURL(blob);
//                 //   setPdf(URL);
//                 //   setPosition(null);
//                 //   setSignatureURL(null);
//                 // }}
//                 onSet={sign}
//                 onEnd={setPosition}
//               />
//             ) : null} */}

//             <Document
//               file={pdf}
//               // onLoadSuccess={(data) => {
//               //   setTotalPages(data.numPages);
//               // }}
//               onLoadSuccess={handleLoadSuccess}
//             >
//               <Page
//                 pageNumber={pageNum + 1}
//                 width={800}
//                 height={1200}
//                 scale={scalepdf}
//                 onLoadSuccess={(data) => {
//                   console.log("HANT:  data");
//                   console.log(data);
//                   setPageDetails(data);
//                 }}
//               />
//             </Document>
//           </div>
//           <PagingControl
//             pageNum={pageNum}
//             setPageNum={setPageNum}
//             totalPages={totalPages}
//           />
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default PdfSign;


//------------------------------------------------------------------------------------

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
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
//   ).toString();

//   const options = {
//     cMapUrl: 'cmaps/',
//     standardFontDataUrl: 'standard_fonts/',
//   };
function downloadURI(uri, name) {
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

            {/* {signatureURL ? (
              <DraggableSignature
                url={signatureURL}
                onCancel={() => {
                  setSignatureURL(null);
                }}
                // onSet={async () => {
                //   //  lấy chiều dài rộng ban đầu
                //   const { originalHeight, originalWidth } = pageDetails;
                //   // tính tỉ lệ
                //   const scale = originalWidth / documentRef.current.clientWidth;
                //   // tính x, y
                //   const y =
                //     documentRef.current.clientHeight -
                //     (position.y -
                //       position.offsetY +
                //       64 -
                //       documentRef.current.offsetTop);
                //   const x =
                //     position.x -
                //     160 -
                //     position.offsetX -
                //     documentRef.current.offsetLeft;

                //   // XY mới liên quan đến kích thước tài liệu thực tế
                //   // new XY in relation to actual document size
                //   const newY =
                //     (y * originalHeight) / documentRef.current.clientHeight;
                //   const newX =
                //     (x * originalWidth) / documentRef.current.clientWidth;

                //   const pdfDoc = await PDFDocument.load(pdf);

                //   const pages = pdfDoc.getPages(); // lấy file
                //   const firstPage = pages[pageNum]; // lấy trang hiện tại

                //   const pngImage = await pdfDoc.embedPng(signatureURL); // gán ảnh chữ ký số
                //   const pngDims = pngImage.scale(scale * 0.3); // căn chỉnh lại tỉ lệ chữ ký
                //   // console.log("Hant: ",scale * .3)
                //   console.log("HANT CO");
                //   console.log("scale: ", scale);
                //   console.log(scale * 0.3);
                //   const infoCoordinates = {
                //     x: textCoordinates?.x, //newX,
                //     y: textCoordinates?.y, //newY,
                //     width: pngDims.width,
                //     height: pngDims.height,
                //   };
                //   firstPage.drawImage(pngImage, infoCoordinates);

                //   // set ngày giờ
                //   // if (autoDate) {
                //   //   firstPage.drawText(
                //   //     `Signed ${dayjs().format("M/d/YYYY HH:mm:ss ZZ")}`,
                //   //     {
                //   //       x: newX,
                //   //       y: newY - 10,
                //   //       size: 14 * scale,
                //   //       color: rgb(0.074, 0.545, 0.262),
                //   //     }
                //   //   );
                //   // }

                //   const pdfBytes = await pdfDoc.save();
                //   const blob = new Blob([new Uint8Array(pdfBytes)]);

                //   const URL = await blobToURL(blob);
                //   setPdf(URL);
                //   setPosition(null);
                //   setSignatureURL(null);
                // }}
                onSet={sign}
                onEnd={setPosition}
              />
            ) : null} */}

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
