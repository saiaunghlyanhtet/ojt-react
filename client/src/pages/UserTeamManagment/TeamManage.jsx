import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, Row, Col, Layout, message } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import styles from "../../styles/TeamManagmenet.module.css";
import TeamManagementModal from './TeamManagementModal';
import { getAllUsers, updateUser, getAllTeams } from '../../api/api-test';
import { Messages } from "../../data/message";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';


const TeamManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const {userInfo} = useContext(AuthContext)
  
  
  const navigate = useNavigate();

  // fetch data when page is mounted
  useEffect(() => {
    if(userInfo) {
      if (!isDataFetched) {
        fetchTeamList();
        fetchUsers();
        setIsDataFetched(true);
      }
    } else {
      navigate('/')
    }
  }, [isDataFetched, userInfo, navigate]);

  // set default team on page mount
  useEffect(() => {
    if (teamList.length > 0 && !selectedTeam) {
      setSelectedTeam(teamList[0].teamName);
    }
  }, [teamList, selectedTeam]);

  // fetch team data and return team list
  const fetchTeamList = async () => {
    try {
      const response = await getAllTeams();
      setTeamList(response);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch users and return users
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

  // filter users data based on the selected team data and set users in the filtered users list
  const handleModalClose = async (selectedTeamsData) => {
    // Fetch users again when the modal is closed
    await fetchUsers();

    if (selectedTeamsData === null || selectedTeamsData.length === 0 || selectedTeamsData.some(teamData => teamData === 'なし')) {
      const updatedUsers = users.filter((user) => !user.team);
      setFilteredUsers(updatedUsers);
    } else {
      const updatedUsers = users.filter((user) =>
        selectedTeamsData.some((teamData) => teamData === user.team)
      );
      if (updatedUsers.length === 0) {
        message.error(Messages.M018);
      }
      setFilteredUsers(updatedUsers);
    }
    handleOk();
  };

  // chooser users to send to the second column
  const handleChooseUser = (userId) => {
    const updatedUsers = filteredUsers.map((user) => {
      if (user._id === userId) {

        return { ...user, chosen: !user.chosen };
      }

      return user;

    });

    setFilteredUsers(updatedUsers);
  };

  // chooser users to send to the first column
  const handleChooseUser1 = (userId) => {
    const updatedUsers = selectedUsers.map((user) => {
      if (user._id === userId) {
        return { ...user, chosen: !user.chosen };
      }
      return user;
    });

    setSelectedUsers(updatedUsers);
  };

  // move the chosen users to the second column
  const handleMoveToSelected = () => {
    const chosenUsers = filteredUsers.filter((user) => user.chosen);
    const updatedSelectedUsers = chosenUsers.map((user) => ({
      ...user,
      chosen: false,
    }));

    setSelectedUsers([...selectedUsers, ...updatedSelectedUsers]);
    setFilteredUsers(filteredUsers.filter((user) => !user.chosen));
  };

  // move the choser users to the first column
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

  // update the list of users using their key and updated team information
  const handleUpdateUsers = async () => {
    try {
      const updatePromises = selectedUsers.map(async (user) => {
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
  };

  return (
    <Layout className='content'>
     
      <div className={styles['teamsetting-main']}>
        <div className={styles['teamsetting-container']}>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12}>

              <Form.Item label="チーム名：">
                <Button onClick={handleModal} style={{backgroundColor : 'blue'}}>
                  <SearchOutlined />
                </Button>
              </Form.Item>
              {isOpen && (
                <TeamManagementModal
                  isOpen={isOpen}
                  closeModal={handleOk}
                  teams={users}
                  onCloseModal={handleModalClose}
                />
              )}
              <br />
              <br />
              <br />
              <div style={{ marginTop: 10 }}>
                <div className={styles['teamsetting-box-container1']} >
                  <div>ユーザー名:</div>
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
                                backgroundColor: user.chosen ? 'lightblue' : 'white',
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
              </div>

            </Col>

            <Col xs={24} sm={24} md={4} lg={4}>
              <br />
              <br />
              <br />
              <div className={styles['teamsetting-btn-main']}>
                <div
                  className={styles['teamsetting-btn-container']}
                  onClick={handleMoveToSelected}
                  disabled={filteredUsers.length > 0 ? false : true}
                >
                  <DoubleRightOutlined className={styles['teamsetting-btn']} />
                </div>
                <div
                  className={styles['teamsetting-btn-container']}
                  onClick={handleMoveToUsers}
                  disabled={selectedUsers.length > 0 ? false : true}
                >
                  <DoubleLeftOutlined className={styles['teamsetting-btn']} />
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8}>
              <br />
                          <br />
              <div>チームに移動</div>
              <Select
                className={styles["margin-bottom"]}
                value={selectedTeam}
                onChange={handleTeamSelection}
                style={{ width: 225 }}
              >
                {teamList.map((team) => (
                  <Select.Option key={team._id} value={team.teamName}>
                    {team.teamName}
                  </Select.Option>
                ))}
              </Select>

              <div>
                <br />
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
            </Col>
          </Row>

          <div className={styles['teamsetting-box-main']}>
            <div className={styles['center-button']}>
              <Button
                type="primary"
                onClick={handleUpdateUsers}
                disabled={!selectedTeam || selectedUsers.length === 0}
              >
                決 定
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamManage;
