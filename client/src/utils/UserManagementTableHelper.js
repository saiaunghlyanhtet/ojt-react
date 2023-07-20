import { message } from "antd";
import { deleteUser } from "../api/api-test";
import { Messages } from "../data/message";

// search user information based on data and search text
export const searchData = (data, searchText) => {
  return data.filter((user) =>
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );
};

// pass form, all user data, and user id to get specific user information and 
// populate that information with the form
export const handleEditUser = async (form, data, userId) => {
  try {
    const selectedUser = data.find((user) => user._id === userId);
    form.resetFields();
    if (selectedUser) {
      form.setFieldsValue({
        firstName: selectedUser.user_name,
        lastName: selectedUser.user_name_last,
        email: selectedUser.email,
        role: selectedUser.user_level,
      });
    }
  } catch (error) {
    console.error("Error editing user:", error);
  }
};

// pass form, user data, user id, user info, and fetch user callback function and 
// delete user based on parameters passed in.
export const handleDeleteUser = async (
  form,
  data,
  userId,
  userInfo,
  fetchUsers
) => {
  try {
    const selectedUserIndex = data.findIndex((user) => user._id === userId);
    form.resetFields();
    if (selectedUserIndex !== -1) {
      const selectedUser = data[selectedUserIndex];
      const userData = {
        user_name: selectedUser.user_name,
        user_name_last: selectedUser.user_name_last,
        email: selectedUser.email,
        user_level: selectedUser.user_level,
        del_flg: "1",
        update_user: userInfo.user_id,
        update_datetime: new Date().toISOString(),
      };
      await deleteUser(userId, userData);
      // Remove the deleted user from the data array
      const updatedData = [...data];
      updatedData.splice(selectedUserIndex, 1);
      // Update the UI by calling fetchUsers or updating the data source
      fetchUsers(updatedData);
    }
    message.success(Messages.M011);
  } catch (error) {
    message.error(Messages.M012);
    console.error("Error updating user:", error);
  }
};
