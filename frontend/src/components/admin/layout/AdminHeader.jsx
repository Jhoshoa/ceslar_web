import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import LanguageSwitcher from '../../common/LanguageSwitcher';

const AdminHeader = ({
  title,
  onToggleSidebar,
  sidebarCollapsed,
  onCollapseSidebar,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { isSystemAdmin, isAdmin } = usePermissions();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLangMenuOpen = (event) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const getRoleBadge = () => {
    if (isSystemAdmin) return t('admin.role.systemAdmin', 'System Admin');
    if (isAdmin) return t('admin.role.admin', 'Admin');
    return t('admin.role.staff', 'Staff');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
        ml: isMobile ? 0 : sidebarCollapsed ? '72px' : '260px',
        width: isMobile ? '100%' : `calc(100% - ${sidebarCollapsed ? 72 : 260}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onToggleSidebar}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Tooltip title={sidebarCollapsed ? t('admin.expandSidebar', 'Expand') : t('admin.collapseSidebar', 'Collapse')}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={onCollapseSidebar}
                sx={{ mr: 1 }}
              >
                {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            {title || t('admin.title', 'Admin Panel')}
          </Typography>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Switcher */}
          <Tooltip title={t('common.language', 'Language')}>
            <IconButton color="inherit" onClick={handleLangMenuOpen}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={handleLangMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={() => { i18n.changeLanguage('es'); handleLangMenuClose(); }}
              selected={i18n.language === 'es'}
            >
              Espanol
            </MenuItem>
            <MenuItem
              onClick={() => { i18n.changeLanguage('en'); handleLangMenuClose(); }}
              selected={i18n.language === 'en'}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => { i18n.changeLanguage('pt'); handleLangMenuClose(); }}
              selected={i18n.language === 'pt'}
            >
              Portugues
            </MenuItem>
          </Menu>

          {/* Notifications (placeholder) */}
          <Tooltip title={t('admin.notifications', 'Notifications')}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Box
            onClick={handleUserMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              p: 0.5,
              pl: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {user?.name || user?.email || 'Admin'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                lineHeight={1}
              >
                {getRoleBadge()}
              </Typography>
            </Box>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ width: 36, height: 36 }}
            >
              {user?.name?.[0] || 'A'}
            </Avatar>
          </Box>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { minWidth: 200, mt: 1 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.name || 'Admin User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('admin.menu.profile', 'Profile')} />
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('admin.menu.settings', 'Settings')} />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary={t('admin.menu.logout', 'Logout')} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

AdminHeader.propTypes = {
  title: PropTypes.string,
  onToggleSidebar: PropTypes.func,
  sidebarCollapsed: PropTypes.bool,
  onCollapseSidebar: PropTypes.func,
};

export default AdminHeader;
