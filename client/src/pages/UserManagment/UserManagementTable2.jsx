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
    pageSize: 10,
};

const UserManagementTable = ({ data, loading, fetchUsers, searchState, setSearchState }) => {
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
    const [sortConfig, setSortConfig] = useState({
        sortField: null,
        sortOrder: null,
    });
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo === null) {
            navigate("/");
        }
    }, [userInfo, navigate, searchState]);





    const handleSearch = useCallback(() => {

        const searchDataResult = searchData(data, searchText);

        setSearchedData(searchDataResult);
        setSearchModalVisible(false);
        setIsSearching(false);
        setSearchState(true)

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

        const emailFieldError = form.getFieldError('email');

        if (emailFieldError && emailFieldError.length > 0) {

            return;

        }
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

            // Check if the email is valid using the emailRegex pattern
            if (!emailRegex.test(userData.email)) {
                message.error(Messages.M004); // Show error message for invalid email
                return;
            }

            // Check if the email already exists, except for the user being edited
            const existingUser = data.find(
                (user) => user.email === userData.email && user._id !== modalState.selectedUserId
            );

            if (existingUser) {
                message.error(Messages.M003); // Show error message for existing email
                return;
            }

            if (emailRegex.test(userData.email) && !existingUser) {
                const editUser = await updateUser(modalState.selectedUserId, userData);
            }


            message.success(Messages.M008);
            handleModalCancel();
            fetchUsers();
        } catch (error) {
            message.error(Messages.M009);
            console.error("Error updating user:", error);
        }
    }, [form, data, modalState.selectedUserId, handleModalCancel, userInfo]);


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
        if (data !== filteredData) {
            // If the 'data' prop is updated and the filteredData is different from the original data
            setSearchedData(data);
            setPagination(pagination);
            return;
        }

        // Update the sorting configuration
        setSortConfig({
            sortField: sorter.field,
            sortOrder: sorter.order,
        });

        // Custom sorting for "User Level" column
        if (sorter.field === "role") {
            const sortedData = data.slice().sort((a, b) => {
                const order = sorter.order === "ascend" ? 1 : -1;
                return a.user_level.localeCompare(b.user_level) * order;
            });

            // If you have searched data, apply sorting to it
            if (searchedData && searchedData.length > 0) {
                const searchedSortedData = searchedData.slice().sort((a, b) => {
                    const order = sorter.order === "ascend" ? 1 : -1;
                    return a.user_level.localeCompare(b.user_level) * order;
                });
                setSearchedData(searchedSortedData);
            }

            // Update the filteredData state with the sorted data

        } else {
            // Your existing sorting logic for other columns
            // ...
        }

        // Update the pagination
        setPagination(pagination);
    }, [data, searchedData, filteredData]);


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
            title: () => <div style={{ textAlign: 'center' }}>番号</div>,
            dataIndex: "_id",
            key: "_id",
            render: (_, record, index) => {
                const { current = 1, pageSize = 10 } = pagination;
                let currentRow = index + 1;

                // If we have searched data, calculate the current row number based on the filtered data
                if (searchedData && searchedData.length > 0) {
                    const currentRowIndex = searchedData.findIndex(item => item._id === record._id);
                    if (currentRowIndex !== -1) {
                        currentRow = currentRowIndex + 1;
                    }
                } else {
                    // If there's no search, calculate the current row number based on the current page and page size
                    currentRow = (current - 1) * pageSize + index + 1;
                }

                return isNaN(currentRow) ? "-" : currentRow;
            },



        },
        {
            title: () => <div style={{ textAlign: 'center' }}>ユーザー名</div>,
            dataIndex: "user_name",
            key: "username",
            render: (_, record) => `${record.user_name} ${record.user_name_last}`,
            width: 400,
        },
        {
            title: () => <div style={{ textAlign: 'center' }}>メールアドレス</div>,
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email", "メールアドレス"),
            width: 400,
        },
        {
            title: () => <div style={{ textAlign: 'center' }}>ユーザー権限</div>,
            dataIndex: "user_level",
            key: "role",
            sorter: (a, b) => a.user_level.localeCompare(b.user_level),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: () => <div style={{ textAlign: 'center' }}>操作</div>,
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
    var filteredData = []
    if (searchState) {
        filteredData = searchedData
    } else {
        filteredData = data?.filter((user) => user.del_flg === "0")
    }


    return (
        <>
            {userInfo && (userInfo.user_level === "super admin" || userInfo.user_level === "admin") ? (
                <div>
                    <Row>
                        <Col span={3} offset={21}>
                            <small style={{ color: "green" }}>
                                Total: {filteredData?.length} Rows
                            </small>
                        </Col>
                    </Row>

                    <Table
                        columns={columns}
                        rowKey={record => record._id}
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
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="ユーザー名[名]"
                                name="lastName"
                                rules={[{ required: true, message: Messages.M014 }]}
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="メールアドレス"
                                name="email"
                                rules={[
                                    { required: true, message: Messages.M002 },
                                    { pattern: emailRegex, message: Messages.M004 },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="ユーザー権限"
                                name="role"
                                rules={[{ required: true, message: Messages.M005 }]}
                            >
                                <Select

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
