import React, { useState } from 'react';
import { Button, Select, Row, Col, Layout, Table } from 'antd';
import TeamManagementModal from './TeamManagementModal';

const { Option } = Select;
const { Content } = Layout;

const TeamManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, title: 'John Doe', team: '' },
    { id: 2, title: 'Jane Smith', team: '' },
    { id: 3, title: 'Mike Johnson', team: '' },
    { id: 4, title: 'Sarah Williams', team: '' },
    { id: 5, title: 'Sarah Williams', team: '' },
    { id: 6, title: 'Sarah Williams', team: '' },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleChooseUser = (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, chosen: !user.chosen };
      }
      return user;
    });

    setUsers(updatedUsers);
  };

  const handleChooseUser1 = (userId) => {
    const updatedUsers = selectedUsers.map((user) => {
      if (user.id === userId) {
        return { ...user, chosen: true };
      }
      return user;
    });

    setSelectedUsers(updatedUsers);
  };

  const handleMoveToSelected = () => {
    const chosenUsers = users.filter((user) => user.chosen);
    const updatedSelectedUsers = chosenUsers.map((user) => ({
      ...user,
      chosen: false,
    }));

    setSelectedUsers([...selectedUsers, ...updatedSelectedUsers]);
    setUsers(users.filter((user) => !user.chosen));
  };

  const handleMoveToUsers = () => {
    const movedUsers = selectedUsers.filter((user) => user.chosen);
    const updatedMovedUsers = movedUsers.map((user) => ({
      ...user,
      chosen: false,
    }));
    setUsers([...users, ...updatedMovedUsers]);
    setSelectedUsers(selectedUsers.filter((user) => !user.chosen));
  };

  const handleTeamSelection = (value) => {
    setSelectedTeam(value);
  };

  const handleUpdateUsers = () => {
    const updatedSelectedUsers = selectedUsers.map((user) => {
      const { chosen, ...rest } = user;
      return { ...rest, team: selectedTeam };
    });
    console.log(updatedSelectedUsers);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
  ];

  const rowSelection = {
    selectedRowKeys: users.filter((user) => user.chosen).map((user) => user.id),
    onChange: (selectedRowKeys) => {
      const updatedUsers = users.map((user) => {
        if (selectedRowKeys.includes(user.id)) {
          return { ...user, chosen: true };
        }
        return { ...user, chosen: false };
      });

      setUsers(updatedUsers);
    },
  };

  const rowSelection1 = {
    selectedRowKeys: selectedUsers.filter((user) => user.chosen).map((user) => user.id),
    onChange: (selectedRowKeys) => {
      const updatedSelectedUsers = selectedUsers.map((user) => {
        if (selectedRowKeys.includes(user.id)) {
          return { ...user, chosen: true };
        }
        return { ...user, chosen: false };
      });

      setSelectedUsers(updatedSelectedUsers);
    },
  };

  return (
    <Layout className="content">
      <Row>
      <div className="team-dropdown">
                <Select
                  value={selectedTeam}
                  onChange={handleTeamSelection}
                  style={{ width: 200 }}
                >
                  <Option value="">None</Option>
                  <Option value="Team A">Team A</Option>
                  <Option value="Team B">Team B</Option>
                  <Option value="Team C">Team C</Option>
                </Select>
                <Button
                  type="primary"
                  onClick={handleUpdateUsers}
                  disabled={!selectedTeam || selectedUsers.length === 0}
                >
                  Update Users
                </Button>
                <Button onClick={handleModal}>Modal</Button>
                {isOpen && (
                  <TeamManagementModal isOpen={isOpen} closeModal={handleOk} data={users} />
                )}
              </div>
      </Row>
      <Row gutter={[16, 0]} justify="center">
        <Col span={9}>
          <div className="column">
            <h2>Users without a Team</h2>
            <div className="table-container">
              <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                bordered
                rowSelection={rowSelection}
                pagination={false}
                className="user-table"
              />
            </div>
          </div>
        </Col>
        <Col span={4} className="arrow-container">
          <div className="button-container">
            <Button
              type="primary"
              onClick={handleMoveToSelected}
              disabled={!users.some((user) => user.chosen)}
            >
              &gt;
            </Button>
          </div>
          <div className="button-container">
            <Button
              type="primary"
              onClick={handleMoveToUsers}
              disabled={!selectedUsers.some((user) => user.chosen)}
            >
              &lt;
            </Button>
          </div>
        </Col>
        <Col span={9}>
          <div className="column">
            <div className="team-selection">
              <h2>Selected Users</h2>
              
              <div className="table-container">
                <Table
                  dataSource={selectedUsers}
                  columns={columns}
                  rowKey="id"
                  bordered
                  rowSelection={rowSelection1}
                  pagination={false}
                  className="user-table"
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
  
  
};

export default TeamManagement;
