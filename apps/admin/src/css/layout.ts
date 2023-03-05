import React from "react";

const minHeaderHight = "100px";
const headerHight = "10%";
const headerWidth = "100%";
const siderHeight = "90%";
const siderWidth = "10%";
const contentLeft = "calc(10% + 32px)";
const contentWidth = "90%";
const contentHeight = "90%";

export const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  position: "fixed",
  top: 0,
  textAlign: "center",
  color: "#fff",
  width: headerWidth,
  height: headerHight,
  minHeight: minHeaderHight,
  backgroundColor: "#222831",
};

export const logoHeaderStyle: React.CSSProperties = {
  width: "140px",
  height: "50%",
  backgroundColor: "InfoText",
};

export const contentStyle: React.CSSProperties = {
  position: "fixed",
  top: headerHight,
  left: contentLeft,
  width: contentWidth,
  height: contentHeight,
  textAlign: "center",
  color: "#fff",
  padding: "0 30px",
  backgroundColor: "#EEEEEE",
};

export const siderStyle: React.CSSProperties = {
  position: "fixed",
  top: headerHight,
  left: 0,
  width: siderWidth,
  height: siderHeight,
  color: "#fff",
};
