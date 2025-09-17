import { apiConnector } from "../apiConnector";
import { registerAPI,loginAPI } from "../api";
import toast from "react-hot-toast";
import { setToken, setUser } from "../../components/slices/authSlice";

export const singup =async (formData)=>{
    try{
        const response =await apiConnector("POST",registerAPI,formData,{
            "Content-Type": "application/json"
        });
        return response.data;
    }catch(error){
        console.error("Error in signup API:", error);
        throw error;
    }
}

//login api response 
export const login =async (formData)=>{
    try{
        const response =await apiConnector("POST",loginAPI,formData,{
            "Content-Type": "application/json"
        });
        return response.data;
    }catch(error){
        console.error("Error in login API:", error);
        throw error;
    }
}
// ── LOGOUT ──────────────────────────────────────────────────────────────────
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}