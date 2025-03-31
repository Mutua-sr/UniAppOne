import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import type { SelectChangeEvent } from '@mui/material';
import { groupService, type Group } from '../../services/groupService';

type TabValue = 'classroom' | 'community';

const GroupBrowser = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabValue>('classroom');
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadGroups = React.useCallback(async () => {
    try {
      setLoading(true);
      let result: Group[];
      if (searchQuery) {
        result = await groupService.searchGroups(searchQuery, activeTab, { category: selectedCategory });
      } else if (selectedCategory) {
        result = await groupService.listByCategory(activeTab, selectedCategory);
      } else {
        result = await groupService.getPopularGroups(activeTab);
      }
      setGroups(result);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedCategory, searchQuery]);

  const loadCategories = React.useCallback(async () => {
    try {
      const result = await groupService.getCategories(activeTab);
      setCategories(result);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [activeTab]);

  React.useEffect(() => {
    void loadGroups();
    void loadCategories();
  }, [loadGroups, loadCategories]);

  const handleSearch = (event: { target: { value: string } }) => {
    setSearchQuery(event.target.value);
    if (!event.target.value) {
      void loadGroups();
    }
  };

  const handleJoin = async (group: Group) => {
    try {
      await groupService.joinGroup(group._id, group.type);
      navigate(`/${group.type}s/${group._id}`);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleTabChange = (_: unknown, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Classrooms" value="classroom" />
        <Tab label="Communities" value="community" />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder={`Search ${activeTab}s...`}
          value={searchQuery}
          onChange={handleSearch}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {group.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {group.type === 'classroom' ? (
                        `${group.stats.studentCount || 0} students`
                      ) : (
                        `${group.stats.memberCount || 0} members`
                      )}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => void handleJoin(group)}
                      size="small"
                    >
                      Join
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default GroupBrowser;