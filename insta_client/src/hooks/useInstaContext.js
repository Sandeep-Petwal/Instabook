import { useContext } from 'react';
import { InstaContext } from '@/context';

export function useInstaContext() {
    const context = useContext(InstaContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
