import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Management
        </Typography>

        {user && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography variant="body2" fontWeight={500}>
                {user.firstname} {user.lastname}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};
