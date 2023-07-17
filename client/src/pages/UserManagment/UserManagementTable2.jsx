import React, { useState, useRef, useCallback, useContext, useEffect } from "react";
import { Table, Space, Button, Modal, message, Form, Input, Select, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import styles from "../../styles/UserManagmenttable.module.css";
import { AuthContext } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../api/api-test";
import { Messages } from "../../data/message";
import {
    searchData,
    handleEditUser,
    handleDeleteUser,
} from "../../utils/UserManagementTableHelper";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const paginationConfig = {
    pageSize: 6,
};

const UserManagementTable = ({ data, loading, fetchUsers }) => {
    const form = Form.useForm()[0];
    const searchInput = useRef(null);
    const [modalState, setModalState] = useState({
        deleteModalShow: false,
        editModalShow: false,
        selectedUserId: null,
    });
    const [searchText, setSearchText] = useState("");
    const [searchedData, setSearchedData] = useState(null);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchedColumn] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [pagination, setPagination] = useState(paginationConfig);
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo === null) {
            navigate("/");
        }
    }, [userInfo, navigate]);

    const handleSearch = useCallback(() => {
        const searchDataResult = searchData(data, searchText);
        setSearchedData(searchDataResult);
        setSearchModalVisible(false);
        setIsSearching(false);
    }, [data, searchText]);

    const handleSearchModalVisible = () => {
        setSearchModalVisible(!searchModalVisible);
        setIsSearching(!isSearching);
    };

    const handleReset = useCallback((clearFilters) => {
        clearFilters();
        setSearchText("");
        setSearchedData(null);
    }, []);

    const handleModalOk = useCallback(() => {
        if (modalState.selectedUserId) {
            handleDeleteUser(form, data, modalState.selectedUserId, userInfo, fetchUsers);
            setModalState((prevState) => ({
                ...prevState,
                deleteModalShow: false,
              }));
        }
    }, [form, data, modalState.selectedUserId, userInfo, fetchUsers]);

    const handleModalCancel = useCallback(() => {
        setModalState((prevState) => ({
            ...prevState,
            deleteModalShow: false,
            editModalShow: false,
        }));
    }, [setModalState]);

    const handleEdit = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const userData = {
                user_name: values.firstName,
                user_name_last: values.lastName,
                email: values.email,
                user_level: values.role,
                del_flg: "0",
                update_user: userInfo !== null ? userInfo.user_id : null,
                update_datetime: new Date().toISOString(),
            };
            console.log(userData);
            const editUser = await updateUser(modalState.selectedUserId, userData);
            console.log("editdata", editUser);

            message.success(Messages.M008);
            handleModalCancel();
            fetchUsers();
        } catch (error) {
            message.error(Messages.M009);
            console.error("Error updating user:", error);
        }
    }, [form, fetchUsers, modalState.selectedUserId, handleModalCancel, userInfo]);

    const deleteshowModal = useCallback((userId) => {
        setModalState((prevState) => ({
            ...prevState,
            selectedUserId: userId,
            deleteModalShow: true,
        }));
    }, []);

    const editshowModal = useCallback((userId) => {
        setModalState((prevState) => ({
            ...prevState,
            selectedUserId: userId,
            editModalShow: true,
        }));
        handleEditUser(form, data, userId);
    }, [data, form]);


    const onChange = useCallback((pagination, filters, sorter) => {
        console.log("params", sorter);
        setPagination(pagination);
    }, []);

    const getColumnSearchProps = useCallback(
        (dataIndex, placeholder) => ({
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={placeholder}
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            setSearchText(e.target.value);
                        }}
                        onPressEnter={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        style={{ width: 188, marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            検索
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            キャンセル
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
            ),
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    : "",
            render: (text) =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ""}
                    />
                ) : (
                    text
                ),
        }),
        [handleSearch, handleReset, searchedColumn, searchText]
    );

    const columns = [
        {
            title: "番号",
            dataIndex: "_id",
            key: "id",
            render: (_, record, index) => {
                const { current = 1, pageSize = 10 } = pagination;
                const currentRow = (current - 1) * pageSize + index + 1;
                return isNaN(currentRow) ? "-" : currentRow;
            },



        },
        {
            title: "ユーザー名",
            dataIndex: "user_name",
            key: "username",
            render: (_, record) => `${record.user_name} ${record.user_name_last}`,
        },
        {
            title: "メールアドレス",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email", "メールアドレス"),
        },
        {
            title: "ユーザー権限",
            dataIndex: "user_level",
            key: "role",
            sorter: (a, b) => a.user_level.localeCompare(b.user_level),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => editshowModal(record._id)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => deleteshowModal(record._id)}
                    />
                </Space>
            ),
        },
    ];

    const filteredData = searchedData || data?.filter((user) => user.del_flg === "0");

    return (
        <>
            {userInfo && (userInfo.user_level === "super admin" || userInfo.user_level === "admin") ? (
                <div>
                    <Row>
                        <Col span={3} offset={21}>
                            <small style={{ color: "green" }}>
                                Total: {filteredData.length} Rows
                            </small>
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        loading={loading}
                        onChange={onChange}
                        pagination={paginationConfig}
                        className={styles.table}
                    />
                    <Modal
                        centered
                        open={modalState.deleteModalShow}
                        onOk={handleModalOk}
                        onCancel={handleModalCancel}
                    >
                        <p className={styles["confrimation-message"]}>{Messages.M010}</p>
                    </Modal>
                    <Modal
                        title="Edit User"
                        centered
                        open={modalState.editModalShow}
                        onOk={handleEdit}
                        onCancel={handleModalCancel}
                    >
                        <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Form.Item
                                label="ユーザー名[姓]"
                                name="firstName"
                                rules={[{ required: true, message: Messages.M013 }]}
                            >
                                <Input className={styles["usermanagement-input"]} disabled />
                            </Form.Item>
                            <Form.Item
                                label="ユーザー名[名]"
                                name="lastName"
                                rules={[{ required: true, message: Messages.M014 }]}
                            >
                                <Input className={styles["usermanagement-input"]} disabled />
                            </Form.Item>
                            <Form.Item
                                label="メールアドレス"
                                name="email"
                                rules={[
                                    { required: true, message: Messages.M002 },
                                    { pattern: emailRegex, message: Messages.M004 },
                                ]}
                            >
                                <Input className={styles["usermanagement-input"]} />
                            </Form.Item>
                            <Form.Item
                                label="ユーザー権限"
                                name="role"
                                rules={[{ required: true, message: Messages.M005 }]}
                            >
                                <Select
                                    className={styles["usermanagement-input"]}
                                    options={[
                                        {
                                            value: "admin",
                                            label: "Admin",
                                        },
                                        {
                                            value: "super admin",
                                            label: "Super Admin",
                                        },
                                        {
                                            value: "member",
                                            label: "Member",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="Search Users"
                        centered
                        open={searchModalVisible}
                        onCancel={handleSearchModalVisible}
                        footer={[
                            <Button key="cancel" onClick={handleSearchModalVisible}>
                                キャンセル
                            </Button>,
                            <Button key="search" type="primary" onClick={handleSearch}>
                                検索
                            </Button>,
                        ]}
                    >
                        <Input
                            ref={searchInput}
                            placeholder="メールアドレスを入力してください"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            style={{ width: 300 }}
                        />
                    </Modal>
                </div>
            ) : (
                <h1>no access</h1>
            )}
        </>
    );
};

export default UserManagementTable;
