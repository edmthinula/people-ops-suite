import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Avatar,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Card,
  CardContent,
  Stack,
  Link,
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import SlideshowIcon from '@mui/icons-material/Slideshow'; // For PPT
import DownloadIcon from '@mui/icons-material/Download';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import LockIcon from '@mui/icons-material/Lock';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useAppDispatch, useAppSelector } from '@root/src/slices/store';

// --- Custom Components & Styles ---

// 1. The Date Box (e.g., JAN 23)
const DateBox = ({ month , day }:{month:string, day:string}) => (
  <Box
    sx={{
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      padding: '8px 12px',
      textAlign: 'center',
      minWidth: '60px',
      mr: 2,
      backgroundColor: '#fff',
    }}
  >
    <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', color: '#757575', textTransform: 'uppercase' }}>
      {month}
    </Typography>
    <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold', color: '#333' }}>
      {day}
    </Typography>
  </Box>
);

// 2. Video Thumbnail Placeholder
const VideoThumbnail = ({ duration, label }:{duration :string , label:string}) => (
  <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', bgcolor: '#0a0f1c', aspectRatio: '16/9' }}>
    <Box
      sx={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <PlayCircleOutlineIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.7)' }} />
    </Box>
    {/* Label (Part 1/2) */}
    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
      <Chip label={label} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
    </Box>
    {/* Duration */}
    <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.7)', px: 1, borderRadius: 1 }}>
      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>{duration}</Typography>
    </Box>
  </Box>
);

// 3. File Attachment Card (Mini)
const FileChip = ({ icon, name, size }:{icon:React.ReactElement,name:string,size:string}) => (
  <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', minWidth: 200, borderRadius: 2 }}>
    <Box sx={{ mr: 1.5 }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{name}</Typography>
      <Typography variant="caption" color="text.secondary">{size}</Typography>
    </Box>
  </Paper>
);

// --- Main Dashboard Component ---

export default function CustomerMeetings() {
  const dispatch = useAppDispatch();
  const meeting = useAppSelector((state) => state.meeting);
  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">

        
        {/* === HEADER SECTION === */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1a1a1a' }}>
              customer name
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#bdbdbd' }}>TW</Avatar>
              <Typography variant="body2" color="text.secondary">
                Hosted by <strong>name</strong>
              </Typography>
              <Chip label="Active" size="small" sx={{ bgcolor: '#e6f4ea', color: '#1e8e3e', fontWeight: 600, height: 24 }} />
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<EditIcon />} sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#333' }}>
              Edit Series
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none', bgcolor: '#1976d2' }}>
              Schedule New
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          
          {/* === LEFT COLUMN: SESSIONS === */}
          <Grid item xs={12} lg={8}>
            
            {/* List Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HistoryIcon color="action" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Past Sessions & Recordings</Typography>
              </Stack>
              <Chip label="Total: 12 Sessions" size="small" sx={{ bgcolor: '#eee' }} />
            </Box>

            {/* Accordion 1 (Expanded) */}
            <Accordion defaultExpanded sx={{ mb: 2, borderRadius: '8px !important', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <DateBox month="JAN" day="23" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Routine Catchup - Sprint Review</Typography>
                    <Typography variant="caption" color="text.secondary">09:00 AM - 10:00 AM • 1 hr 2 mins</Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5, letterSpacing: 1 }}>SESSION RECORDINGS</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <VideoThumbnail label="Part 1" duration="34:12" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VideoThumbnail label="Part 2" duration="28:05" />
                  </Grid>
                </Grid>

                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5, letterSpacing: 1 }}>SESSION FILES</Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                   {/* Fix spacing override for stack + wrap */}
                   <Box sx={{marginTop: '0 !important', marginLeft: '0 !important'}}> 
                      <FileChip 
                        icon={<PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: 30 }} />} 
                        name="Minutes - Jan 23.pdf" 
                        size="2.4 MB" 
                      />
                   </Box>
                   <Box>
                      <FileChip 
                        icon={<DescriptionIcon sx={{ color: '#1976d2', fontSize: 30 }} />} 
                        name="Chat_Log.txt" 
                        size="14 KB" 
                      />
                   </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2 (Collapsed) */}
            <Accordion sx={{ mb: 2, borderRadius: '8px !important', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <DateBox month="JAN" day="16" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Requirement Gathering</Typography>
                    <Typography variant="caption" color="text.secondary">02:00 PM - 03:30 PM • 1 hr 30 mins</Typography>
                  </Box>
                  <Chip label="1 Recording" size="small" sx={{ mr: 2, bgcolor: '#f5f5f5' }} />
                </Box>
              </AccordionSummary>
            </Accordion>

            {/* Accordion 3 (Collapsed) */}
            <Accordion sx={{ mb: 2, borderRadius: '8px !important', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <DateBox month="JAN" day="09" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Kickoff Meeting</Typography>
                    <Typography variant="caption" color="text.secondary">10:00 AM - 11:00 AM • 58 mins</Typography>
                  </Box>
                  <Chip label="No Recording" size="small" sx={{ mr: 2, bgcolor: '#f5f5f5' }} />
                </Box>
              </AccordionSummary>
            </Accordion>

            {/* Pagination Mock */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                Rows per page: 10 <ExpandMoreIcon fontSize="small" /> &nbsp; 1-3 of 12 &nbsp; &lt; &nbsp; &gt;
            </Box>

          </Grid>

          {/* === RIGHT COLUMN: SIDEBAR === */}
          <Grid item xs={12} lg={4}>
            
            {/* Card 1: Upcoming Schedule */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Upcoming Schedule</Typography>
                  <Link href="#" underline="hover" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>View All</Link>
                </Box>

                <List disablePadding>
                  {/* Item 1 */}
                  <ListItem disableGutters alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box sx={{ minWidth: 40, mr: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>JAN</Typography>
                      <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold' }}>30</Typography>
                    </Box>
                    <ListItemText 
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Architecture Review</Typography>}
                      secondary={
                        <Box component="span">
                           <Typography variant="caption" display="block" color="text.secondary">10:00 AM - 12:00 PM</Typography>
                           <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: '#1976d2', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                              <VideoCameraBackIcon sx={{ fontSize: 14, mr: 0.5 }} /> Join Meeting
                           </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                  
                  {/* Item 2 */}
                  <ListItem disableGutters alignItems="flex-start" sx={{ mb: 2, mt: 1 }}>
                    <Box sx={{ minWidth: 40, mr: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>FEB</Typography>
                      <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold' }}>06</Typography>
                    </Box>
                    <ListItemText 
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Weekly Sync</Typography>}
                      secondary={
                        <Box component="span">
                           <Typography variant="caption" display="block" color="text.secondary">09:00 AM - 10:00 AM</Typography>
                           <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: '#757575', fontSize: '0.75rem' }}>
                              <LockIcon sx={{ fontSize: 14, mr: 0.5 }} /> Not Started
                           </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                   {/* Item 3 */}
                   <ListItem disableGutters alignItems="flex-start" sx={{ mt: 1 }}>
                    <Box sx={{ minWidth: 40, mr: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>FEB</Typography>
                      <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 'bold' }}>13</Typography>
                    </Box>
                    <ListItemText 
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Weekly Sync</Typography>}
                      secondary={<Typography variant="caption" display="block" color="text.secondary">09:00 AM - 10:00 AM</Typography>}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Card 2: All Attachments */}
            <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>All Attachments</Typography>
                  <Chip label="5 Files" size="small" />
                </Box>

                <List>
                  <ListItem 
                    disableGutters 
                    secondaryAction={<IconButton edge="end"><DownloadIcon color="action" /></IconButton>}
                  >
                    <PictureAsPdfIcon sx={{ color: '#d32f2f', mr: 2, fontSize: 32 }} />
                    <ListItemText 
                      primary="WSO2_Architecture_v2.pdf" 
                      primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      secondary="Added Jan 23 • 4.2 MB" 
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <Divider />
                  
                  <ListItem 
                    disableGutters 
                    secondaryAction={<IconButton edge="end"><DownloadIcon color="action" /></IconButton>}
                  >
                    <SlideshowIcon sx={{ color: '#f57c00', mr: 2, fontSize: 32 }} />
                    <ListItemText 
                      primary="Kickoff_Deck.pptx" 
                      primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      secondary="Added Jan 09 • 12.5 MB" 
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem 
                    disableGutters 
                    secondaryAction={<IconButton edge="end"><DownloadIcon color="action" /></IconButton>}
                  >
                    <InsertDriveFileIcon sx={{ color: '#1976d2', mr: 2, fontSize: 32 }} />
                    <ListItemText 
                      primary="Meeting_Notes_Jan16.docx" 
                      primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      secondary="Added Jan 16 • 156 KB" 
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
                
                <Button variant="outlined" fullWidth sx={{ mt: 1, textTransform: 'none', color: '#555', borderColor: '#e0e0e0' }}>
                  Show All Files
                </Button>
              </CardContent>
            </Card>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}