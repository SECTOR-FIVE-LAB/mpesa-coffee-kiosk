// utils/auth.ts
import {jwtDecode} from 'jwt-decode';

export const isAdmin = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decoded: any = jwtDecode(token);
  return decoded.isAdmin === true;
};
