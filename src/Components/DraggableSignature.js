import Draggable from "react-draggable";
import { BigButton } from "./BigButton"; // The default
import { FaCheck, FaTimes } from "react-icons/fa";
import { cleanBorder, errorColor, goodColor, primary45 } from "../utils/colors";
import { Resizable } from "re-resizable";
export default function DraggableSignature({ url, onEnd, onSet, onCancel }) {
  const styles = {
    container: {
      position: "absolute",
      zIndex: 100000,
      border: `2px solid ${primary45}`,
      width: "20%",
    },
    controls: {
      position: "absolute",
      right: 0,
      display: "inline-block",
      backgroundColor: primary45,
      // borderRadius: 4,
    },
    smallButton: {
      display: "inline-block",
      cursor: "pointer",
      padding: 4,
    },
  };
  return (
    <Draggable onStop={onEnd} bounds="body" disabled={false}>
      <div style={styles.container}>
        <div style={styles.controls}>
          <div
            style={styles.smallButton}
            // ký số
            onClick={onSet}
          >
            <FaCheck color={goodColor} />
          </div>
          <div style={styles.smallButton} onClick={onCancel}>
            <FaTimes color={errorColor} />
          </div>
        </div>
        {/* <img src={url} width={200} style={styles.img} draggable={false} /> */}
        <Resizable
          // hiển thị
          defaultSize={{
            width: 200,
            height: 100,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #ddd",
            background: "#f0f0f0",
          }}
          lockAspectRatio={true}
        >
          <img src={url} width={"100%"} style={styles.img} draggable={false} />
        </Resizable>
      </div>
    </Draggable>
  );
}
