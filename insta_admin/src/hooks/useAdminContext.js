import { useContext } from 'react';
import { AdminContext } from '@/context/AdminContext';

export function useAdminContext() {
    const context = useContext(AdminContext);
    return context;
}
