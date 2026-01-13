import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS, APP_NAME } from '../../commons/constants';
import { LanguageSwitcher } from '../common';
import ceslarLogo from '../../assets/images/ceslar_logo.svg';

const Header = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();
  const { isAuthenticated, user, login, logout } = useAuth();

  // Get translated nav item label
  const getNavLabel = (item) => {
    const key = `nav.${item.key || item.label.toLowerCase()}`;
    const translated = t(key);
    // Return original label if translation key doesn't exist
    return translated !== key ? translated : item.label;
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={ceslarLogo}
            alt={APP_NAME}
            sx={{ height: 36, width: 'auto' }}
          />
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemText primary={getNavLabel(item)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <LanguageSwitcher variant="text" />
        </Box>
        {isAuthenticated ? (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => {
              handleDrawerToggle();
              logout();
            }}
          >
            {t('nav.logout')}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              handleDrawerToggle();
              login();
            }}
          >
            {t('nav.login')}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo - Desktop */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              component="img"
              src={ceslarLogo}
              alt={APP_NAME}
              sx={{ height: 48, width: 'auto' }}
            />
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo - Mobile */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              component="img"
              src={ceslarLogo}
              alt={APP_NAME}
              sx={{ height: 36, width: 'auto' }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  position: 'relative',
                  '&::after': isActive(item.path)
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 24,
                        height: 3,
                        backgroundColor: 'secondary.main',
                        borderRadius: 1,
                      }
                    : {},
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                {getNavLabel(item)}
              </Button>
            ))}
          </Box>

          {/* Language Switcher, Give Button & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <LanguageSwitcher variant="text" />
            </Box>

            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/give"
              sx={{
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {t('nav.give')}
            </Button>

            {isAuthenticated ? (
              <>
                <Tooltip title={t('nav.profile')}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name}
                      src={user?.picture}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/dashboard"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{t('nav.admin')}</Typography>
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{t('nav.profile')}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      logout();
                    }}
                  >
                    <Typography textAlign="center">{t('nav.logout')}</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonIcon />}
                onClick={login}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                {t('nav.login')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
