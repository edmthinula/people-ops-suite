// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputAdornment,
} from "@mui/material";
import { State } from "@/types/types";
import { useEffect, useState, useRef } from "react";
import { ConfirmationType } from "@/types/types";
import ErrorHandler from "@component/common/ErrorHandler";
import { useAppDispatch, useAppSelector } from "@slices/store";
import { useConfirmationModalContext } from "@context/DialogContext";
import {
  ExpandMore,
  DeleteForever,
  Search,
  InsertDriveFile,
  Schedule,
  Loop,
  Person,
  Group,
  EventNote,
} from "@mui/icons-material";
import {
  fetchMeetings,
  deleteMeeting,
  fetchAttachments,
} from "@slices/meetingSlice/meeting";
import { useTheme } from "@mui/material/styles";

// Shadows
const MODERN_SHADOW = "0 4px 20px 0 rgba(0,0,0,0.05)";
const HOVER_SHADOW = "0 8px 30px 0 rgba(0,0,0,0.1)";


interface Attachment {
  title: string;
  fileId: string;
  fileUrl: string;
  iconLink: string;
  mimeType: string;
}

// Utility to format date nicely
const formatDateTime = (dateTimeStr: string) => {
  const utcDate = new Date(dateTimeStr + " UTC");
  return utcDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function MeetingHistory() {
  const theme = useTheme()
  const dispatch = useAppDispatch();
  const meeting = useAppSelector((state) => state.meeting);

  // Infinite Scroll State
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const observerTarget = useRef(null);

  // Local State
  const dialogContext = useConfirmationModalContext();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSearchQuery, setFilteredSearchQuery] = useState<string | null>(
    null,
  );

  // Attachment Caching (Map meetingId -> Attachment[])
  const [attachmentMap, setAttachmentMap] = useState<
    Record<number, Attachment[]>
  >({});
  const [loadingAttachments, setLoadingAttachments] = useState<
    Record<number, boolean>
  >({});

  // Fetch Meetings
  // 1. Initial Load & Search (Always triggers offset: 0)
  useEffect(() => {
    setPage(0);
    dispatch(
      fetchMeetings({ title: filteredSearchQuery, limit: pageSize, offset: 0 }),
    );
  }, [dispatch, filteredSearchQuery, pageSize]);

  // 2. Infinite Scroll Trigger (Only runs when page > 0)
  useEffect(() => {
    if (page > 0) {
      dispatch(
        fetchMeetings({
          title: filteredSearchQuery,
          limit: pageSize,
          offset: page * pageSize,
        }),
      );
    }
  }, [page, dispatch, filteredSearchQuery, pageSize]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && meeting.state !== State.loading) {
          const currentCount = meeting.meetings?.meetings?.length || 0;
          const totalCount = meeting.meetings?.count || 0; // Using the 'count' from your API

          // Stop incrementing page if we reached the total count
          if (currentCount < totalCount) {
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [meeting.state, meeting.meetings]);

  // --- Handlers ---
  const handleAccordionChange = (meetingId: number, isExpanded: boolean) => {
    if (isExpanded && !attachmentMap[meetingId]) {
      setLoadingAttachments((prev) => ({ ...prev, [meetingId]: true }));
      dispatch(fetchAttachments(meetingId)).then((data: any) => {
        if (data.payload && data.payload.attachments) {
          setAttachmentMap((prev) => ({
            ...prev,
            [meetingId]: data.payload.attachments,
          }));
        }
        setLoadingAttachments((prev) => ({ ...prev, [meetingId]: false }));
      });
    }
  };

  const handleDeleteMeeting = (meetingId: number, meetingTitle: string) => {
    dialogContext.showConfirmation(
      "Confirm Deletion",
      <Typography variant="body1">
        Are you sure you want to delete <strong>{meetingTitle}</strong>?
      </Typography>,
      ConfirmationType.accept,
      async () => {
        setLoadingDelete(true);
        await dispatch(deleteMeeting(meetingId)).then(() => {
          setLoadingDelete(false);
          setPage(0);
          dispatch(
            fetchMeetings({
              title: filteredSearchQuery,
              limit: pageSize,
              offset: 0,
            }),
          );
        });
      },
      "Yes",
      "No",
    );
  };

  const meetingList = meeting.meetings?.meetings ?? [];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        margin: "0 auto",
        bgcolor: "#fbfbfb",
        minHeight: "100vh",
      }}
    >
      {/* --- Page Header Section --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: theme.palette.brand.main,
              borderRadius: 1.5,
              p: 1,
              display: "flex",
              color: "white",
            }}
          >
            <EventNote />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="700" color="text.primary">
              Meeting History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review past discussions and upcoming schedules.
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          placeholder="Search meetings..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilteredSearchQuery(searchQuery);
              setPage(0);
            }
          }}
          sx={{
            width: 350,
            bgcolor: "white",
            boxShadow: MODERN_SHADOW,
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { border: "none" }, // Remove default border in favor of shadow
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: `1px solid ${theme.palette.brand.main}` },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* --- LEFT COLUMN: Meeting History List --- */}
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, minHeight: 500 }}>
            {meeting.state === State.loading && page === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress sx={{ color: theme.palette.brand.main }} />
              </Box>
            ) : meeting.state === State.failed ? (
              <ErrorHandler message="Failed to fetch meetings." />
            ) : meetingList.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: MODERN_SHADOW,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No meetings found.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {meetingList.map((row) => (
                  <Accordion
                    key={row.meetingId}
                    disableGutters
                    elevation={0}
                    onChange={(_, expanded) =>
                      handleAccordionChange(row.meetingId, expanded)
                    }
                    sx={{
                      boxShadow: MODERN_SHADOW,
                      borderRadius: "12px !important",
                      bgcolor: "white",
                      border: "1px solid transparent",
                      "&:before": { display: "none" },
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: HOVER_SHADOW,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {/* --- Accordion Header --- */}
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: theme.palette.brand.main }} />}
                      sx={{ px: 3, py: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          pr: 2,
                        }}
                      >
                        <Typography
                          fontWeight="700"
                          variant="subtitle1"
                          sx={{ color: "#2c3e50" }}
                        >
                          {row.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Schedule
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            {formatDateTime(row.startTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>

                    {/* --- Accordion Details --- */}
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                      <Divider sx={{ mb: 3 }} />
                      <Grid container spacing={3}>
                        {/* Info Grid */}
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              letterSpacing: 0.5,
                              fontWeight: "bold",
                            }}
                          >
                            HOST
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Person
                              fontSize="small"
                              sx={{ color: theme.palette.brand.main }}
                            />{" "}
                            {row.host}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              letterSpacing: 0.5,
                              fontWeight: "bold",
                            }}
                          >
                            RECURRING
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Loop
                              fontSize="small"
                              sx={{ color: theme.palette.brand.main }}
                            />{" "}
                            {row.isRecurring ? "Yes, Recurring Series" : "No"}
                          </Typography>
                        </Grid>

                        {/* Participants */}
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              letterSpacing: 0.5,
                              fontWeight: "bold",
                            }}
                          >
                            PARTICIPANTS
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            {row.internalParticipants
                              .toString()
                              .split(",")
                              .map((email: string, i: number) => (
                                <Chip
                                  key={i}
                                  label={email.trim()}
                                  icon={<Group sx={{ pl: 0.5 }} />}
                                  size="small"
                                  sx={{
                                    bgcolor: "#f5f5f5",
                                    color: "#555",
                                    fontWeight: 500,
                                  }}
                                />
                              ))}
                          </Box>
                        </Grid>

                        {/* Attachments */}
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              letterSpacing: 0.5,
                              fontWeight: "bold",
                            }}
                          >
                            ATTACHMENTS
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {loadingAttachments[row.meetingId] ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CircularProgress
                                  size={16}
                                  sx={{ color: theme.palette.brand.main }}
                                />
                                <Typography variant="caption">
                                  Loading...
                                </Typography>
                              </Box>
                            ) : attachmentMap[row.meetingId]?.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {attachmentMap[row.meetingId].map(
                                  (att, idx) => (
                                    <Button
                                      key={idx}
                                      variant="outlined"
                                      startIcon={<InsertDriveFile />}
                                      onClick={() =>
                                        window.open(att.fileUrl, "_blank")
                                      }
                                      size="small"
                                      sx={{
                                        borderColor: "#e0e0e0",
                                        color: "text.secondary",
                                        textTransform: "none",
                                        borderRadius: 2,
                                        "&:hover": {
                                          borderColor: theme.palette.brand.main,
                                          color: theme.palette.brand.main,
                                          bgcolor: "rgba(255, 80, 0, 0.04)",
                                        },
                                      }}
                                    >
                                      {att.title || "Attachment"}
                                    </Button>
                                  ),
                                )}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontStyle="italic"
                              >
                                No attachments available.
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        {/* Actions */}
                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: -2,
                          }}
                        >
                          <Button
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={() =>
                              handleDeleteMeeting(row.meetingId, row.title)
                            }
                            sx={{ textTransform: "none", fontWeight: 600 }}
                          >
                            Delete Meeting
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {/* Sentinel for Infinite Scroll */}
                <div
                  ref={observerTarget}
                  style={{ height: "20px", marginTop: "10px" }}
                >
                  {meeting.state === State.loading && page > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} sx={{ color: theme.palette.brand.main }} />
                    </Box>
                  )}
                </div>
              </Box>
            )}
          </Box>
        </Grid>

        {/* --- RIGHT COLUMN: Sidebar --- */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: MODERN_SHADOW,
              borderRadius: 3,
              position: "sticky",
              top: 24, // Keeps the sidebar fixed while scrolling the meeting list
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="700"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Schedule sx={{ color: theme.palette.brand.main }} /> Upcoming Meetings
              </Typography>

              <List disablePadding>
                {/* Dummy Data - Replace with actual state */}
                {[
                  {
                    title: "Design System Sync",
                    time: "Today, 14:00 PM",
                    tag: "SOON",
                  },
                  {
                    title: "Quarterly Review",
                    time: "Tomorrow, 10:00 AM",
                    tag: null,
                  },
                  {
                    title: "Client Onboarding",
                    time: "Jan 26, 09:00 AM",
                    tag: null,
                  },
                ].map((item, index) => (
                  <ListItem
                    key={index}
                    disableGutters
                    sx={{
                      borderBottom: index < 2 ? "1px solid #f0f0f0" : "none",
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          fontWeight="700"
                          color="text.primary"
                        >
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {item.time}
                          </Typography>
                        </Box>
                      }
                    />
                    {item.tag && (
                      <Chip
                        label={item.tag}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.7rem",
                          color: theme.palette.brand.main,
                          bgcolor: "rgba(255, 80, 0, 0.1)",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant="contained"
                disableElevation
              >
                View more meetings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MeetingHistory;
