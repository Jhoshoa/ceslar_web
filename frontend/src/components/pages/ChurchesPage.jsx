import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Pagination,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChurchIcon from '@mui/icons-material/Church';
import { ChurchSelector, ChurchCard } from '../features/churches';
import { SectionTitle } from '../common';
import { churchesApi } from '../../services/api';

const ChurchesPage = () => {
  const { t } = useTranslation('churches');
  const { country, department } = useParams();
  const navigate = useNavigate();

  const [churches, setChurches] = useState([]);
  const [groupedChurches, setGroupedChurches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchChurches = async () => {
      setLoading(true);
      setError(null);
      try {
        if (country && department) {
          // Filter by country and department
          const response = await churchesApi.getAll({
            country: decodeURIComponent(country),
            department: decodeURIComponent(department),
            page,
            limit: 12,
          });
          // Handle paginated response: response.data = { data: [...], pagination: {...} }
          const churchesData = response.data?.data || response.data?.docs || response.data || [];
          setChurches(Array.isArray(churchesData) ? churchesData : []);
          setTotalPages(response.data?.pagination?.totalPages || response.data?.totalPages || 1);
        } else if (country) {
          // Filter by country only
          const response = await churchesApi.getByCountry(decodeURIComponent(country));
          setChurches(response.data || []);
          setTotalPages(1);
        } else {
          // Get all churches grouped
          const response = await churchesApi.getGrouped();
          setGroupedChurches(response.data || []);
          // Also get flat list for list view
          const listResponse = await churchesApi.getAll({ page, limit: 12 });
          // Handle paginated response: listResponse.data = { data: [...], pagination: {...} }
          const churchesData = listResponse.data?.data || listResponse.data?.docs || listResponse.data || [];
          setChurches(Array.isArray(churchesData) ? churchesData : []);
          setTotalPages(listResponse.data?.pagination?.totalPages || listResponse.data?.totalPages || 1);
        }
      } catch (err) {
        setError(err.message || 'Error loading churches');
      } finally {
        setLoading(false);
      }
    };

    fetchChurches();
  }, [country, department, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs sx={{ mb: 3 }}>
      <Link
        underline="hover"
        color="inherit"
        href="/"
        onClick={(e) => { e.preventDefault(); navigate('/'); }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
      </Link>
      <Link
        underline="hover"
        color={country ? 'inherit' : 'text.primary'}
        href="/churches"
        onClick={(e) => { e.preventDefault(); navigate('/churches'); }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <ChurchIcon sx={{ mr: 0.5 }} fontSize="small" />
        {t('title')}
      </Link>
      {country && (
        <Link
          underline="hover"
          color={department ? 'inherit' : 'text.primary'}
          href={`/churches/${country}`}
          onClick={(e) => { e.preventDefault(); navigate(`/churches/${country}`); }}
        >
          {decodeURIComponent(country)}
        </Link>
      )}
      {department && (
        <Typography color="text.primary">
          {decodeURIComponent(department)}
        </Typography>
      )}
    </Breadcrumbs>
  );

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Skeleton variant="rectangular" height={180} />
          <Box sx={{ pt: 1 }}>
            <Skeleton width="60%" height={32} />
            <Skeleton width="80%" />
            <Skeleton width="40%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const renderGroupedView = () => (
    <Box>
      {groupedChurches.map((countryGroup) => (
        <Paper key={countryGroup._id} sx={{ mb: 4, p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight={600}
            sx={{
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => navigate(`/churches/${countryGroup._id.toLowerCase()}`)}
          >
            {countryGroup._id}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {countryGroup.totalCount} {countryGroup.totalCount === 1 ? 'iglesia' : 'iglesias'}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {countryGroup.departments.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.department}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => navigate(`/churches/${countryGroup._id.toLowerCase()}/${dept.department?.toLowerCase()}`)}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {dept.department || 'Sin departamento'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dept.count} {dept.count === 1 ? 'iglesia' : 'iglesias'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {renderBreadcrumbs()}

        {/* Header */}
        <SectionTitle
          title={t('title')}
          subtitle={t('subtitle')}
          align="left"
        />

        {/* Church Selector */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <ChurchSelector variant="outlined" />
        </Paper>

        {/* View Mode Tabs (only when not filtered) */}
        {!country && !department && (
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Por País" value="grouped" />
            <Tab label="Lista" value="list" />
          </Tabs>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && renderSkeleton()}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Grouped View */}
            {viewMode === 'grouped' && !country && groupedChurches.length > 0 && (
              renderGroupedView()
            )}

            {/* List View */}
            {(viewMode === 'list' || country) && (
              <>
                {churches.length === 0 ? (
                  <Alert severity="info">
                    {t('noResults')}
                  </Alert>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {churches.map((church) => (
                        <Grid item xs={12} sm={6} md={4} key={church._id}>
                          <ChurchCard church={church} />
                        </Grid>
                      ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                        />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ChurchesPage;
