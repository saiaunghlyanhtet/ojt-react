import React, { useState, useEffect } from 'react';
import { Button, Select, Row, Col, Layout, message } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import styles from "../../styles/TeamManagmenet.module.css";
import TeamManagementModal from './TeamManagementModal';
import { getAllUsers, updateUser, getAllTeams } from '../../api/api-test';
import { Messages } from "../../data/message";

const { Option } = Select;
const { Search } = Input;

const TeamManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading] = useState(false);
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    fetchTeamList()
  }, []);

  const fetchTeamList =  async () => {
    try {
      const response = await getAllTeams();
            setTeamList(response);
    } catch (error) {
      console.log(error);
    }

  }
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleModal = () => {
    setIsOpen(true);
    setUsers(users)
  };

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleModalClose = (selectedTeamsData) => {
    console.log("selectedTeamsData:", selectedTeamsData);
    console.log("Is selectedTeamsData null?", selectedTeamsData === null);
    
    if (selectedTeamsData === null || selectedTeamsData.length === 0 || selectedTeamsData.some(teamData => teamData === 'なし')) {
      const updatedUsers = users.filter((user) => !user.team);
      setFilteredUsers(updatedUsers);
    } else {
      console.log(selectedTeamsData);
      const updatedUsers = users.filter((user) =>
        selectedTeamsData.some((teamData) => teamData === user.team)
      );
      setFilteredUsers(updatedUsers);
      console.log(updatedUsers);
    }
  
    handleOk();
  };
  

  const handleChooseUser = (userId) => {
    const updatedUsers = filteredUsers.map((user) => {
      if (user._id === userId) {
        console.log(user)
        return { ...user, chosen: !user.chosen };
      }

      return user;

    });

    setFilteredUsers(updatedUsers);
  };

  const handleChooseUser1 = (userId) => {
    const updatedUsers = selectedUsers.map((user) => {
      if (user._id === userId) {
        console.log(user);
        return { ...user, chosen: !user.chosen };
      }
      return user;
    });

    setSelectedUsers(updatedUsers);
  };

  const handleMoveToSelected = () => {
    const chosenUsers = filteredUsers.filter((user) => user.chosen);
    const updatedSelectedUsers = chosenUsers.map((user) => ({
      ...user,
      chosen: false,
    }));

    setSelectedUsers([...selectedUsers, ...updatedSelectedUsers]);
    setFilteredUsers(filteredUsers.filter((user) => !user.chosen));
  };

  const handleMoveToUsers = () => {
    const movedUsers = selectedUsers.filter((user) => user.chosen);
    const updatedMovedUsers = movedUsers.map((user) => ({
      ...user,
      chosen: false,
    }));
    setFilteredUsers([...filteredUsers, ...updatedMovedUsers]);
    setSelectedUsers(selectedUsers.filter((user) => !user.chosen));
  };

  const handleTeamSelection = (value) => {
    setSelectedTeam(value);
  };

  const handleUpdateUsers = async () => {
    try {
      const updatePromises = selectedUsers.map(async (user) => {
        console.log(user);
        const { chosen, ...rest } = user;
        const userData = { ...rest, team: selectedTeam };
        const newUser = {
          user_name: userData.user_name,
          team: userData.team,
          user_name_last: userData.user_name_last,
          email: userData.email,
          user_level: userData.user_level,
          del_flg: userData.del_flg
        }
        console.log(userData);
        await updateUser(userData._id, newUser);
        

      });

      await Promise.all(updatePromises);
      message.success(Messages.M008);

      fetchUsers();
        setSelectedUsers([]);
        setSelectedTeam('');
    } catch (error) {
      // Handle error if any update operation fails
      console.error(error);
    }
  };


  const handleUserClick = (userId) => {
    handleChooseUser(userId);
    console.log(userId);
  };



  return (
    <Layout className="layout">
      <div className={styles['teamsetting-main']}>
        <div className={styles['teamsetting-container']}>
          <div className={styles['teamsetting-search']}>
            <Form.Item label="チーム名：">
              <Search
                style={{ width: '350px' }}
                onSearch={handleModal}
                enterButton
              />
            </Form.Item>
            {isOpen && (
              <TeamManagementModal
                isOpen={isOpen}
                closeModal={handleOk}
                teams={users}
                onCloseModal={handleModalClose}
              />
            )}
          </div>
          <Row>
            <Col span={3} offset={14}>
              <Select
                className={styles['margin-bottom']}
                value={selectedTeam}
                onChange={handleTeamSelection}
                style={{ width: 200 }}
              >
                <Option value="">None</Option>
                {teamList && (
                  teamList.map((team) => (
                                      <Option key={team._id} value={team.teamName}>
                                        {team.teamName}
                                      </Option>
                                    ))
                )}
              </Select>
            </Col>
          </Row>
          <div className={styles['teamsetting-box-main']}>
            <div className={styles['teamsetting-box-container']}>
              <div className={styles['teamsetting-box']}>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {filteredUsers ? (
                      filteredUsers.map((user, key) => (
                        <div
                          key={user._id}
                          className={user.chosen ? 'chosen' : ''}
                          style={{
                            backgroundColor: user.chosen ? 'lightblue' : '',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleUserClick(user._id)}
                        >
                          {user.user_name} {user.user_name_last}, <br />
                          {user.email}
                          <hr />
                        </div>
                      ))
                    ) : (
                      <div>No data</div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={styles['teamsetting-btn-main']}>
              <div
                className={styles['teamsetting-btn-container']}
                onClick={handleMoveToSelected}
                disabled={!filteredUsers.some((user) => user.chosen)}
              >
                <DoubleRightOutlined className={styles['teamsetting-btn']} />
              </div>
              <div
                className={styles['teamsetting-btn-container']}
                onClick={handleMoveToUsers}
                disabled={!selectedUsers.some((user) => user.chosen)}
              >
                <DoubleLeftOutlined className={styles['teamsetting-btn']} />
              </div>
            </div>
            <div className={styles['teamsetting-box-container']}>
              <div className={styles['teamsetting-box']}>
                <div className={styles['teamsetting-user']}>
                  {selectedUsers ? (
                    selectedUsers.map((user) => (
                      <div
                        key={user._id}
                        className={user.chosen ? 'chosen' : ''}
                        style={{
                          backgroundColor: user.chosen ? 'lightblue' : '',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleChooseUser1(user._id)}
                      >
                        {user.user_name} {user.user_name_last}, <br />
                        {user.email}
                        <hr />
                      </div>
                    ))
                  ) : (
                    <div>No data</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles['center-button']}>
            <Button
              type="primary"
              onClick={handleUpdateUsers}
              disabled={!selectedTeam || selectedUsers.length === 0}
            >
              Update Users
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamManage;
