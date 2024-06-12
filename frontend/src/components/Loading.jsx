import React from "react";
import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
      }}
    >
      <HashLoader size={100} color="grey" margin={2} />
    </div>
  );
}
