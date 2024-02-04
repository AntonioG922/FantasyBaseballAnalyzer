"use client";

import { AppBar, Box, Toolbar } from "@mui/material";
import "./globals.css";
import { Inter } from "next/font/google";
import { useState } from "react";

import Header from "./components/header/header"
import Nav from "./components/navrail/nav"

import {HEADER} from "./components/header/config-layout"
import {NAV} from "./components/navrail/config-layout"

import { useResponsive } from "./hooks/use-responsive";

const inter = Inter({ subsets: ["latin"] });

const SPACING = 8;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lgUp = useResponsive("up", "lg");
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 1,
            display: "flex",
            flexDirection: "column",
            py: `${HEADER.H_MOBILE + SPACING}px`,
            ...(lgUp && {
              px: 2,
              py: `${HEADER.H_DESKTOP + SPACING}px`,
              width: `calc(100% - ${NAV.WIDTH}px)`,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
