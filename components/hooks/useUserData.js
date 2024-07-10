// components/hooks/useUserData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortColumn, setSortColumn] = useState(columnFields[0].value);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await axios.get('/api/v1/users');
      setUsers(usersData);
      setFilteredUsers(usersData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const x = a[sortColumn];
        const y = b[sortColumn];
        if (x < y) return sortDirection === 'asc' ? -1 : 1;
        if (x > y) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [searchName, searchEmail, users, sortColumn, sortDirection]);

  const handleOnSearch = event => {
    let { name, value } = event.target;

    if (name === 'name') {
      setSearchName(value);
    } else if (name === 'email') {
      setSearchEmail(value);
    }
  };

  const handleSort = column => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    users: filteredUsers,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  };
};

export default useUserData;