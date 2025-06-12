import axios from "axios";

const API_BASE = "/api/templates";

export const fetchTemplates = () => axios.get(API_BASE);
export const fetchTemplate = (id) => axios.get(`${API_BASE}/${id}`);
export const createTemplate = (data) => axios.post(API_BASE, data);
export const deleteTemplate = (id) => axios.delete(`${API_BASE}/${id}`);
// 추후 update 등도 추가 가능
