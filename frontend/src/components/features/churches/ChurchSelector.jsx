import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { churchesApi } from '../../../services/api';

const ChurchSelector = ({
  onSelect,
  showSearchButton = true,
  variant = 'standard',
  size = 'medium',
  direction = 'row'
}) => {
  const { t } = useTranslation('churches');
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [churches, setChurches] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('');

  const [loading, setLoading] = useState({ countries: false, departments: false, churches: false });
  const [error, setError] = useState(null);

  // Load countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const response = await churchesApi.getCountries();
        setCountries(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Load departments when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setDepartments([]);
      setSelectedDepartment('');
      return;
    }

    const fetchDepartments = async () => {
      setLoading(prev => ({ ...prev, departments: true }));
      try {
        const response = await churchesApi.getDepartments(selectedCountry);
        setDepartments(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, departments: false }));
      }
    };
    fetchDepartments();
  }, [selectedCountry]);

  // Load churches when department changes
  useEffect(() => {
    if (!selectedCountry || !selectedDepartment) {
      setChurches([]);
      setSelectedChurch('');
      return;
    }

    const fetchChurches = async () => {
      setLoading(prev => ({ ...prev, churches: true }));
      try {
        const response = await churchesApi.getAll({
          country: selectedCountry,
          department: selectedDepartment,
        });
        // Handle paginated response: response.data = { data: [...], pagination: {...} }
        const churchesData = response.data?.data || response.data?.docs || response.data || [];
        setChurches(Array.isArray(churchesData) ? churchesData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, churches: false }));
      }
    };
    fetchChurches();
  }, [selectedCountry, selectedDepartment]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedDepartment('');
    setSelectedChurch('');
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedChurch('');
  };

  const handleChurchChange = (event) => {
    const churchId = event.target.value;
    setSelectedChurch(churchId);

    if (onSelect && churchId) {
      const church = churches.find(c => c._id === churchId);
      onSelect(church);
    }
  };

  const handleSearch = () => {
    if (selectedChurch) {
      const church = churches.find(c => c._id === selectedChurch);
      if (church?.slug) {
        navigate(`/churches/${selectedCountry.toLowerCase()}/${selectedDepartment.toLowerCase()}/${church.slug}`);
      }
    } else if (selectedDepartment) {
      navigate(`/churches/${selectedCountry.toLowerCase()}/${selectedDepartment.toLowerCase()}`);
    } else if (selectedCountry) {
      navigate(`/churches/${selectedCountry.toLowerCase()}`);
    } else {
      navigate('/churches');
    }
  };

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction === 'row' ? { xs: 'column', md: 'row' } : 'column',
        gap: 2,
        alignItems: direction === 'row' ? { xs: 'stretch', md: 'flex-end' } : 'stretch',
      }}
    >
      {/* Country Select */}
      <FormControl
        variant={variant}
        size={size}
        sx={{ minWidth: { xs: '100%', md: 200 } }}
      >
        <InputLabel id="country-select-label">{t('filters.country')}</InputLabel>
        <Select
          labelId="country-select-label"
          id="country-select"
          value={selectedCountry}
          label={t('filters.country')}
          onChange={handleCountryChange}
          disabled={loading.countries}
          endAdornment={loading.countries && <CircularProgress size={20} sx={{ mr: 2 }} />}
        >
          <MenuItem value="">
            <em>{t('filters.allCountries')}</em>
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Department Select */}
      <FormControl
        variant={variant}
        size={size}
        sx={{ minWidth: { xs: '100%', md: 200 } }}
        disabled={!selectedCountry}
      >
        <InputLabel id="department-select-label">{t('filters.department')}</InputLabel>
        <Select
          labelId="department-select-label"
          id="department-select"
          value={selectedDepartment}
          label={t('filters.department')}
          onChange={handleDepartmentChange}
          disabled={!selectedCountry || loading.departments}
          endAdornment={loading.departments && <CircularProgress size={20} sx={{ mr: 2 }} />}
        >
          <MenuItem value="">
            <em>{t('filters.allDepartments')}</em>
          </MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Church Select */}
      <FormControl
        variant={variant}
        size={size}
        sx={{ minWidth: { xs: '100%', md: 250 } }}
        disabled={!selectedDepartment}
      >
        <InputLabel id="church-select-label">{t('filters.city')}</InputLabel>
        <Select
          labelId="church-select-label"
          id="church-select"
          value={selectedChurch}
          label={t('filters.city')}
          onChange={handleChurchChange}
          disabled={!selectedDepartment || loading.churches}
          endAdornment={loading.churches && <CircularProgress size={20} sx={{ mr: 2 }} />}
        >
          <MenuItem value="">
            <em>{t('filters.allCities')}</em>
          </MenuItem>
          {churches.map((church) => (
            <MenuItem key={church._id} value={church._id}>
              {church.name} - {church.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Search Button */}
      {showSearchButton && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{
            minWidth: 120,
            height: size === 'small' ? 40 : 56,
          }}
        >
          {t('search.byLocation')}
        </Button>
      )}
    </Box>
  );
};

export default ChurchSelector;
