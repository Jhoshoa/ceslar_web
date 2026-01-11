import { Box, Typography, Divider } from '@mui/material';

const SectionTitle = ({
  title,
  subtitle,
  align = 'center',
  divider = true,
  light = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        textAlign: align,
        mb: 6,
        ...sx,
      }}
    >
      <Typography
        variant="h2"
        component="h2"
        sx={{
          color: light ? 'white' : 'primary.main',
          mb: subtitle ? 2 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="subtitle1"
          sx={{
            color: light ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            maxWidth: 600,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
      {divider && (
        <Divider
          sx={{
            width: 80,
            height: 4,
            backgroundColor: 'secondary.main',
            mx: align === 'center' ? 'auto' : 0,
            mt: 3,
            borderRadius: 2,
          }}
        />
      )}
    </Box>
  );
};

export default SectionTitle;
