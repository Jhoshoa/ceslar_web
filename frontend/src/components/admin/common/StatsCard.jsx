import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * Statistics card component for dashboard
 */
const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'primary',
  loading = false,
  subtitle,
  onClick,
}) => {
  // Color mapping
  const colorMap = {
    primary: { main: 'primary.main', light: 'primary.lighter', bg: '#e3f2fd' },
    secondary: { main: 'secondary.main', light: 'secondary.lighter', bg: '#fce4ec' },
    success: { main: 'success.main', light: 'success.lighter', bg: '#e8f5e9' },
    warning: { main: 'warning.main', light: 'warning.lighter', bg: '#fff3e0' },
    error: { main: 'error.main', light: 'error.lighter', bg: '#ffebee' },
    info: { main: 'info.main', light: 'info.lighter', bg: '#e1f5fe' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            }
          : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              gutterBottom
            >
              {loading ? <Skeleton width={80} /> : title}
            </Typography>

            {/* Value */}
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              {loading ? <Skeleton width={60} /> : value}
            </Typography>

            {/* Subtitle or Trend */}
            {loading ? (
              <Skeleton width={100} height={20} />
            ) : trend !== undefined ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend > 0 ? (
                  <TrendingUpIcon
                    sx={{ fontSize: 16, color: 'success.main' }}
                  />
                ) : trend < 0 ? (
                  <TrendingDownIcon
                    sx={{ fontSize: 16, color: 'error.main' }}
                  />
                ) : null}
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      trend > 0
                        ? 'success.main'
                        : trend < 0
                        ? 'error.main'
                        : 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {trend > 0 ? '+' : ''}
                  {trend}%
                </Typography>
                {trendLabel && (
                  <Typography variant="body2" color="text.secondary">
                    {trendLabel}
                  </Typography>
                )}
              </Box>
            ) : subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {/* Icon */}
          {icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: colors.bg,
                color: colors.main,
              }}
            >
              {loading ? (
                <Skeleton variant="circular" width={24} height={24} />
              ) : (
                icon
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  loading: PropTypes.bool,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
};

export default StatsCard;
