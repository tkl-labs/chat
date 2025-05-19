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

      <div className="max-w-full min-h-screen py-8 flex justify-center items-center bg-primary-background">
        <div className="flex w-full h-[75vh] gap-4">
          <div className="flex basis-[25%] flex-col gap-4">
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
            <div className="flex-auto bg-[#23272A] text-white-900"></div>
            
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
          </div>
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
        </div>
      </div>
    </>
  );
}
