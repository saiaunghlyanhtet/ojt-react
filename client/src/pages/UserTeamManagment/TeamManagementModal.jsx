import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Pagination, Input, Checkbox, Row, Col } from 'antd';
import { getAllTeams } from '../../api/api-test';
import styles from '../../styles/TeamManagmenet.module.css';

const TeamManagementModal = ({ isOpen, closeModal, onCloseModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');


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

  const clearErrorMessage = () => {
    setErrorMessage('');
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

    clearErrorMessage();
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    
    const tableData = [
      {
        key: 'none',
        teamName: 'なし',
        index: 1,
      },
      ...currentData.map((team, index) => ({
        key: index + 2,
        teamName: team.teamName,
        index: startIndex + index + 2,
      })),
    ];

    return tableData;
  };

  const columns = [
    {
      title: '番号',
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
      title: 'チーム名',
      dataIndex: 'teamName',
      key: 'teamName',
    },
  ];

  const handleSearchClick = () => {
    if (selectedTeams.length > 0) {
      onCloseModal(selectedTeams);
    } else {
      setErrorMessage('Please check at least one checkbox');
    }
  };

  return (
    <Modal open={isOpen} onCancel={closeModal} footer={null} title="チーム名検索">
      <div className="modal-content">
        <div className={styles['search-container']}>
          <label htmlFor="">チーム名</label>
          <div className={styles['input-container']}>
            <Input placeholder="Search" value={searchText} onChange={(e) => handleSearch(e)} />
          </div>
        </div>
        <Table dataSource={renderData()} columns={columns} pagination={false} />
        <Row className={styles['margin-top']}>
          <Col span={6} offset={18}>
            <div className="pagination">
              <Pagination
                current={currentPage}
                total={filteredData.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          </Col>
        </Row>
        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
        <div className={styles['center-button']}>
          <Button onClick={handleSearchClick}>追加</Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamManagementModal;
