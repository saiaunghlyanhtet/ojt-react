import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Pagination, Input, Checkbox } from 'antd';
import { getAllTeams} from '../../api/api'

const TeamManagementModal = ({ isOpen, closeModal, onCloseModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      setTeams(response);
      console.log(response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const itemsPerPage = 5;

  const filteredData = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (e, teamName) => {
    const { checked } = e.target;

    if (checked) {
      setSelectedTeams((prevSelectedTeams) => [...prevSelectedTeams, teamName]);
    } else {
      setSelectedTeams((prevSelectedTeams) =>
        prevSelectedTeams.filter((name) => name !== teamName)
      );
    }
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
  
    return currentData.map((team, index) => ({
      key: index,
      teamName: team.teamName,
      index: startIndex + index + 1, // Add the index as a separate property
    }));
  };

  const columns = [
    {
      title: 'Number of Team Members',
      dataIndex: 'index',
      key: 'index',
      render: (text, record) => (
        <Checkbox
          checked={selectedTeams.includes(record.teamName)}
          onChange={(e) => handleCheckboxChange(e, record.teamName)}
        >
          {text}
        </Checkbox>
      ),
    },
    {
      title: 'Team Name',
      dataIndex: 'teamName',
      key: 'teamName',
    },
  ];

  const handleSearchClick = () => {
    onCloseModal(selectedTeams);
    
  };

  return (
    <Modal open={isOpen} onCancel={closeModal} footer={null}>
      <div className="modal-content">
        <h2>Data List</h2>
        <div className="search-container">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => handleSearch(e)}
          />
        </div>
        <Table dataSource={renderData()} columns={columns} pagination={false} />
        <div className="pagination">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
        <Button onClick={handleSearchClick}>Search</Button>
        <Button onClick={closeModal}>Close</Button>
      </div>
    </Modal>
  );
};

export default TeamManagementModal;
