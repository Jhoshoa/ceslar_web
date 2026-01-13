import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇧🇴', region: 'Bolivia' },
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'USA' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'Brasil' }
];

const LanguageSwitcher = ({ variant = 'icon', color = 'inherit' }) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  return (
    <>
      {variant === 'icon' ? (
        <Tooltip title={t('language.select')}>
          <IconButton
            onClick={handleClick}
            color={color}
            aria-label={t('language.select')}
            aria-controls={open ? 'language-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t('language.select')}>
          <IconButton
            onClick={handleClick}
            color={color}
            sx={{
              borderRadius: 1,
              px: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Typography variant="body2" sx={{ mr: 0.5, fontSize: '1.2rem' }}>
              {currentLanguage.flag}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {currentLanguage.code.toUpperCase()}
            </Typography>
          </IconButton>
        </Tooltip>
      )}

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
            sx={{
              minWidth: 180,
              '&.Mui-selected': {
                backgroundColor: 'action.selected'
              }
            }}
          >
            <ListItemIcon sx={{ fontSize: '1.5rem', minWidth: 36 }}>
              {lang.flag}
            </ListItemIcon>
            <ListItemText
              primary={lang.name}
              secondary={lang.region}
              primaryTypographyProps={{ fontWeight: i18n.language === lang.code ? 600 : 400 }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            {i18n.language === lang.code && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
