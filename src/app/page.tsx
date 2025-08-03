"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Container, // Import Container from MUI
  Typography, // Import Typography
  CircularProgress, // Import CircularProgress
  Box, // Import Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';

// Styled TableCell for better readability
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

interface ShortLink {
  id: number;
  originalUrl: string;
  shortCode: string;
  isActive: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllLinks();
  }, []);

  const fetchAllLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/all-links');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLinks(data.links);
    } catch (e: any) {
      setError('Failed to load links.');
      console.error("Failed to fetch links", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (shortCode: string) => {
    try {
      const response = await fetch('/api/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistically update the UI
      setLinks(links.map(link =>
        link.shortCode === shortCode ? { ...link, isActive: false } : link
      ));
    } catch (error) {
      console.error("Failed to deactivate link", error);
      alert('Failed to deactivate link');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLinks([...links, {
        id: Date.now(), //temp id
        originalUrl: data.url,
        shortCode: data.shortCode,
        isActive: true,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
      setNewUrl('');
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to create link", error);
      alert(`Failed to create link: ${error.message}`);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container sx={{ padding: '20px' }}> {/* Add padding to the main container */}
      <Typography variant="h4" component="h1" gutterBottom>
        Boost Shortener
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen} sx={{ marginBottom: '20px' }}> {/* Add margin to the button */}
        Create New Link
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Short Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="Original URL"
            type="url"
            fullWidth
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ marginBottom: '20px' }}> {/* Add margin to the table */}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Original URL</StyledTableCell>
              <StyledTableCell align="right">Short Code</StyledTableCell>
              <StyledTableCell align="center">Clicks</StyledTableCell>
              <StyledTableCell align="center">Active</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link) => (
              <TableRow
                key={link.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                    {link.originalUrl}
                  </a>
                </TableCell>
                <TableCell align="right">
                  <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                    {link.shortCode}
                  </a>
                </TableCell>
                <TableCell align="center">{link.clicks}</TableCell>
                <TableCell align="center">{link.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="deactivate"
                    onClick={() => handleDeactivate(link.shortCode)}
                    disabled={!link.isActive}
                  >
                    <DeleteIcon color={link.isActive ? "error" : "disabled"} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;