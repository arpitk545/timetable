import { apiConnector } from "../apiConnector"; 
import { addFacultyAPI,getallFacultyListAPI } from "../api";


export const addFaculty = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiConnector(
      "POST",
      addFacultyAPI,
      formData,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error in addFaculty API:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to add faculty"
    );
  }
};

//get all the faculty list
export const getAllFaculty = async () => {
  try {
    const response = await apiConnector(
      "GET",
      getallFacultyListAPI,
      null,
      {
        "Content-Type": "application/json"
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error fetching faculty list:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch faculty list"
    );
  }
};