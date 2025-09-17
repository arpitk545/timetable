import { apiConnector } from "../apiConnector"; 
import {generatetimetableAPI, getALLTimeTableAPI } from "../api";

export const Generatetimetable = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiConnector(
      "POST",
      generatetimetableAPI,
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
export const getAllTimeTable = async () => {
  try {
    const response = await apiConnector(
      "GET",
      getALLTimeTableAPI,
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