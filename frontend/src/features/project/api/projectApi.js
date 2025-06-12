import axios from "axios";

const API_BASE = "/api/projects";

export const fetchProjects = () => axios.get(API_BASE);
export const fetchProject = (id) => axios.get(`${API_BASE}/${id}`);
export const createProject = (data) => axios.post(API_BASE, data);
export const deleteProject = (id) => axios.delete(`${API_BASE}/${id}`);
// 추후 update 등도 추가 가능
