import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Pagination, Input, Checkbox, Row, Col } from 'antd';
import { getAllTeams } from '../../api/api-test';
import styles from '../../styles/TeamManagmenet.module.css';
import '../../styles/TeamManagementModal.css'

const TeamManagementModal = ({ isOpen, closeModal, onCloseModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // fetch team data when page is mounted
  useEffect(() => {
    fetchTeams();
  }, []);

  
  // fetch teams and return results
  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      setTeams(response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const itemsPerPage = 6;

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

  // select teams and set teams data in selected teams list
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
  
    let tableData;
  
    // Check if the searchText is "nashi"
    const isNashiSearch = searchText.trim().toLowerCase() === 'なし';
  
    // If there is searchText and it's not "nashi", exclude "なし" entry from all pages
    if (searchText && !isNashiSearch) {
      tableData = filteredData.slice(startIndex, endIndex).map((team, index) => ({
        key: startIndex + index + 1,
        teamName: team.teamName,
        index: startIndex + index + 1,
      }));
    } else {
      // Include "なし" entry along with other data at the start of the modal load
      if (currentPage === 1) {
        tableData = [
          {
            key: 'none',
            teamName: 'なし',
            index: 1,
          },
          ...filteredData.slice(startIndex, endIndex - 1).map((team, index) => ({
            key: index + 2,
            teamName: team.teamName,
            index: startIndex + index + 2,
          })),
        ];
      } else {
        // Exclude "なし" entry from other pages
        tableData = filteredData.slice(startIndex, endIndex).map((team, index) => ({
          key: startIndex + index + 1,
          teamName: team.teamName,
          index: startIndex + index + 1,
        }));
      }
    }
  
    return tableData;
  };
  
  
  
  
  const columns = [
    {
      title: () => <div style={{ textAlign: 'center' }}>番号</div>,
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
      title: () => <div style={{ textAlign: 'center' }}>チーム名</div>,
      dataIndex: 'teamName',
      key: 'teamName',
      className: 'center',
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Wrapped div with inline CSS to center the content */}
          <div className={styles['search-container']}>
            <label htmlFor="">チーム名: </label>
            <div className={styles['input-container']}>
              <Input
                placeholder="検索条件入力"
                value={searchText}
                onChange={(e) => handleSearch(e)}
              />
            </div>
          </div>
        </div>
        
        <Table dataSource={renderData()} columns={columns} pagination={false} className={styles.table} />
         
        <Row className={styles['margin-top']}>
          <Col lg={8} offset={16} sm={12} xs={12}>
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
