import { apiConnector } from "../apiConnector"; 
import {addRoomAPI,getAllRoomAPI} from "../api";


export const addRoom = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await apiConnector(
      "POST",
      addRoomAPI,
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
export const getAllRoom = async () => {
  try {
    const response = await apiConnector(
      "GET",
      getAllRoomAPI,
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