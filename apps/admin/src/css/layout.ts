import React from "react";

export const siderHeight = "100vh";
export const siderWidth = "var(--admin-sidebar-width)";

export const headerHight = "64px";
export const headerWidth = `calc(100vw - ${siderWidth})`;

const navHight = "48px";
const navWidth = headerWidth;

export const footerHeight = "52px";
export const footerWidth = `calc(100vw - ${siderWidth})`;

export const contentHeight = `calc(100vh - ${headerHight} - ${navHight} - ${footerHeight})`;
export const contentWidth = `calc(100vw - ${siderWidth})`;

const headerTop = "0";
const headerLeft = siderWidth;
const navTop = headerHight;
const navLeft = siderWidth;
const contentTop = `calc(${headerHight} + ${navHight})`;
const contentLeft = siderWidth;
const footerBottom = "0";
const footerLeft = siderWidth;

export const headerStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 20,
  top: headerTop,
  left: headerLeft,
  width: headerWidth,
  height: headerHight,
  minHeight: headerHight,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "1rem",
  padding: "0 1.5rem",
  color: "#ffffff",
  backgroundColor: "#232f3e",
};

export const navHeaderStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 19,
  top: navTop,
  left: navLeft,
  width: navWidth,
  height: navHight,
  minHeight: navHight,
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "center",
  gap: "1rem",
  padding: "0 1.5rem",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d5dbdb",
};

export const contentStyle: React.CSSProperties = {
  position: "fixed",
  top: contentTop,
  left: contentLeft,
  width: contentWidth,
  height: contentHeight,
  color: "#16191f",
  backgroundColor: "#f2f3f3",
  overflowY: "auto",
};

export const siderStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 21,
  top: 0,
  left: 0,
  width: siderWidth,
  height: siderHeight,
  padding: "1rem 0.75rem",
  backgroundColor: "#232f3e",
};

export const footerStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 19,
  bottom: footerBottom,
  left: footerLeft,
  width: footerWidth,
  height: footerHeight,
  padding: "0 1.5rem",
  backgroundColor: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "1px solid #d5dbdb",
};

export const alignCenter: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};
