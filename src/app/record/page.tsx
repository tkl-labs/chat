"use client";

import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  CssBaseline,
} from "@mui/material";

export default function RecordPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabContents = [
    "Component for power point will go here",
    "Component for main screen will go here",
  ];

  const elevation3Shadow = "0em 0.1875em 0.375em rgba(0,0,0,0.16)";

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: "#2C2F33",
          minHeight: "100vh",
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "75vh",
            gap: 2,
          }}
        >
          <Box
            sx={{
              flexBasis: "25%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#23272A",
                color: "#fff",
                borderRadius: 2,
                padding: 2,
                overflow: "auto",
                boxShadow: elevation3Shadow,
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={2} color="#fff">
                Primary Source
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                backgroundColor: "#23272A",
                color: "#fff",
                borderRadius: 2,
                padding: 2,
                overflow: "auto",
                boxShadow: elevation3Shadow,
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={2} color="#fff">
                Secondary Source
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexBasis: "75%",
              backgroundColor: "#23272A",
              color: "#fff",
              borderRadius: 2,
              padding: 2,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                borderRadius: 3,
                backgroundColor: "#23272A",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              {["Power Point", "Main Screen"].map((label) => (
                <Tab
                  key={label}
                  label={label}
                  sx={{
                    minWidth: 0,
                    minHeight: 32,
                    borderRadius: 3,
                    color: "#99AAB5",
                    textTransform: "none",
                    fontWeight: "bold",
                    px: 3,
                    mr: 1,
                    "&.Mui-selected": {
                      backgroundColor: "#5865F2",
                      color: "#fff",
                    },
                    "&:hover": {
                      backgroundColor: "#40444B",
                      color: "#fff",
                    },
                  }}
                />
              ))}
            </Tabs>

            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: "#2C2F33",
                borderRadius: 2,
                p: 3,
                color: "#fff",
                overflowY: "auto",
              }}
            >
              <Typography variant="body1">{tabContents[value]}</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
