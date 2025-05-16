"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  CssBaseline,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function WelcomePage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleGetStarted = () => {
    router.push("/record");
  };

  async function handleGetImage() {
    try {
      const base64Img: string = await invoke("get_image");
      setImageSrc(`data:image/png;base64,${base64Img}`);
    } catch (error) {
      console.error("Failed to get image:", error);
    }
  }

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          height: "100vh",
          bgcolor: "#2C2F33",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#23272A",
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            border: "2px solid #5865F2",
            maxWidth: 900,
            width: "100%",
            boxShadow: "0em 0.1875em 0.375em rgba(0,0,0,0.16)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack on small screens
            gap: 4,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left box: Welcome */}
          <Box
            sx={{
              flex: 1,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
              minWidth: 0,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              Welcome to
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              TKL Chat!
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: "#99AAB5", mb: 4, fontWeight: 500 }}
            >
              Your all-in-one presentation and collaboration platform.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: "#5865F2",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                alignSelf: { xs: "center", md: "flex-start" },
                "&:hover": {
                  backgroundColor: "#4752c4",
                },
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Get Started
            </Button>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: "#5865F2",
              opacity: 0.3,
              display: { xs: "none", md: "block" },
            }}
          />

          {/* Right box: Capture test */}
          <Box
            sx={{
              flex: 1,
              color: "#99AAB5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Typography variant="h6" mb={2}>
              Want to test a capture?
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleGetImage}
              sx={{
                backgroundColor: "#5865F2",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                mb: 4,
                "&:hover": {
                  backgroundColor: "#4752c4",
                },
              }}
              endIcon={<CameraAltIcon />}
            >
              Capture
            </Button>

            {imageSrc && (
              <Box
                component="img"
                src={imageSrc}
                alt="Generated from Tauri"
                sx={{ maxWidth: "100%", borderRadius: 2 }}
              />
            )}
          </Box>
        </Paper>

        <Box mt={4} color="#99AAB5" fontSize="0.9rem">
          &copy; {new Date().getFullYear()} TKL. All rights reserved.
        </Box>
      </Container>
    </>
  );
}
