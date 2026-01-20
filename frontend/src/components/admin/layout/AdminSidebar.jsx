import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChurchIcon from '@mui/icons-material/Church';
import EventIcon from '@mui/icons-material/Event';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import GroupsIcon from '@mui/icons-material/Groups';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import { usePermissions } from '../../../hooks/usePermissions';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const AdminSidebar = ({ open, onClose, collapsed = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isSystemAdmin, isAdmin, canManageContent, permissions } = usePermissions();

  // Navigation items based on permissions
  const navItems = useMemo(() => {
    const items = [
      {
        id: 'dashboard',
        label: t('admin.nav.dashboard', 'Dashboard'),
        path: '/admin',
        icon: <DashboardIcon />,
        visible: canManageContent,
      },
      {
        id: 'churches',
        label: t('admin.nav.churches', 'Churches'),
        path: '/admin/churches',
        icon: <ChurchIcon />,
        visible: permissions.canViewChurches,
      },
      {
        id: 'events',
        label: t('admin.nav.events', 'Events'),
        path: '/admin/events',
        icon: <EventIcon />,
        visible: permissions.canViewEvents,
      },
      {
        id: 'sermons',
        label: t('admin.nav.sermons', 'Sermons'),
        path: '/admin/sermons',
        icon: <VideoLibraryIcon />,
        visible: permissions.canViewSermons,
      },
      {
        id: 'ministries',
        label: t('admin.nav.ministries', 'Ministries'),
        path: '/admin/ministries',
        icon: <GroupsIcon />,
        visible: permissions.canViewMinistries,
      },
      {
        id: 'questions',
        label: t('admin.nav.questions', 'Questions'),
        path: '/admin/questions',
        icon: <QuizIcon />,
        visible: permissions.canViewQuestions,
      },
      {
        id: 'users',
        label: t('admin.nav.users', 'Users'),
        path: '/admin/users',
        icon: <PeopleIcon />,
        visible: permissions.canViewUsers,
      },
    ];

    return items.filter(item => item.visible);
  }, [t, canManageContent, permissions]);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose?.();
    }
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'primary.dark',
        color: 'white',
      }}
    >
      {/* Logo/Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ height: 40, width: 40, borderRadius: 1 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
              }}
            >
              {t('admin.title', 'Admin Panel')}
            </Typography>
          </>
        )}
        {collapsed && (
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ height: 32, width: 32, borderRadius: 1 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const button = (
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: collapsed ? 0.5 : 1,
                my: 0.5,
                borderRadius: 2,
                justifyContent: collapsed ? 'center' : 'flex-start',
                bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: active
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? 'secondary.light' : 'rgba(255,255,255,0.7)',
                  minWidth: collapsed ? 0 : 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.id} disablePadding>
              {collapsed ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Back to site */}
      <List>
        <ListItem disablePadding>
          {collapsed ? (
            <Tooltip title={t('admin.nav.backToSite', 'Back to Site')} placement="right" arrow>
              <ListItemButton
                onClick={() => navigate('/')}
                sx={{
                  mx: 0.5,
                  my: 0.5,
                  borderRadius: 2,
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 0 }}
                >
                  <HomeIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ) : (
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('admin.nav.backToSite', 'Back to Site')}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          )}
        </ListItem>
      </List>

      {/* Role indicator */}
      {!collapsed && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              display: 'block',
              textAlign: 'center',
            }}
          >
            {isSystemAdmin
              ? t('admin.role.systemAdmin', 'System Admin')
              : isAdmin
              ? t('admin.role.admin', 'Admin')
              : t('admin.role.staff', 'Staff')}
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'none',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

AdminSidebar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  collapsed: PropTypes.bool,
};

export default AdminSidebar;
