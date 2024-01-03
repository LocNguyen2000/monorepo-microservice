import React from "react";

const siderHeight = "100vw";
const siderWidth = "12vw";

const headerHight = "7vh";
const headerWidth = `calc(100vw - ${siderWidth})`;

const navHight = "5vh";
const navWidth = headerWidth;

const contentHeight = `calc(100% - ${headerHight})`;
const contentWidth = `calc(100% - ${siderWidth})`;

const headerTop = "0";
const headerLeft = `calc(${siderWidth})`;
const navTop = `calc(${headerHight})`;
const navLeft = `calc(${siderWidth})`;
const contentTop = `calc(${headerHight} + ${navHight})`;
const contentLeft = `calc(${siderWidth})`;

export const headerStyle: React.CSSProperties = {
  position: "fixed",
  top: headerTop,
  left: headerLeft,
  width: headerWidth,
  height: headerHight,
  minHeight: headerHight,
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  color: "#fff",
  // backgroundColor: "#222831",
  borderBottom: "1px solid white",
};

export const navHeaderStyle: React.CSSProperties = {
  position: "fixed",
  top: navTop,
  left: navLeft,
  width: navWidth,
  height: navHight,
  minHeight: navHight,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderBottom: "0.5px solid rgba(0, 0, 0, 0.2)",
};

export const contentStyle: React.CSSProperties = {
  position: "fixed",
  top: contentTop,
  left: contentLeft,
  width: contentWidth,
  height: contentHeight,
  // textAlign: "center",
  color: "#fff",
  padding: "0 30px",
  backgroundColor: "#EEEEEE",
  overflowY: "auto",
};

export const siderStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: siderWidth,
  height: siderHeight,
  padding: "0.5rem",
};
