/* eslint-disable react/prop-types */
import  { useState } from 'react';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Trash2,
    Database,
    ExternalLink
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Table = ({ columns, data, onSort, sortColumn, sortDirection, onDeleteUser }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();

    const handleDeleteUser = () => {
        if (selectedUser) {
            onDeleteUser(selectedUser);
            setSelectedUser(null);
        }
    };

    return (
        <>
            <div className="w-full overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left font-medium text-zinc-300"
                                >
                                    {column.key !== "profile_url" && (
                                        <button
                                            className="inline-flex items-center gap-2 hover:text-white"
                                            onClick={() => onSort(column.key)}
                                        >
                                            {column.label}
                                            {sortColumn === column.key ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-zinc-500" />
                                            )}
                                        </button>
                                    )}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-left font-medium text-zinc-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="group transition-colors hover:bg-zinc-800/50"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3 text-zinc-300"
                                        >
                                            {column.key === 'profile_url' ? (
                                                <div className="relative h-10 w-10">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={row[column.key]}
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback>{row.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            ) : column.key === 'status' ? (
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row[column.key].toLowerCase() === 'active'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : row[column.key].toLowerCase() === 'inactive'
                                                        ? 'bg-yellow-500/10 text-yellow-500'
                                                        : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {row[column.key]}
                                                </span>
                                            ) : column.key === 'createdAt' ? (
                                                <span className="whitespace-nowrap">{new Date(row[column.key]).toLocaleString()}</span>
                                            ) : (
                                                <span className="whitespace-nowrap">{row[column.key]}</span>
                                            )}
                                        </td>
                                    ))}

                                    {/* action col  */}
                                    <td className="px-4 py-3">
                                        <button
                                            className="rounded-lg p-2 hover:bg-zinc-800"
                                            onClick={() => navigate(`/users/${row.user_id}`)}
                                        >
                                            <ExternalLink  className="h-8 w-6 text-green-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-4 py-8 text-center text-zinc-500"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Database className="h-8 w-8" />
                                        <p>No data available.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Delete User</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Are you sure you want to delete this user?
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="flex items-center space-x-4 py-4">
                            <Avatar>
                                <AvatarImage
                                    src={selectedUser.profile_url}
                                    alt={selectedUser.name}
                                />
                                <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-zinc-100 font-medium">{selectedUser.name}</p>
                                <p className="text-zinc-400 text-sm">{selectedUser.email}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {/* <DialogClose asChild>
                            <Button variant="outline" className="w-full text-zinc-300 border-zinc-700">
                                Cancel
                            </Button>
                        </DialogClose> */}
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            className="w-full bg-red-600 m-1 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Confirm Delete
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            className="w-full bg-red-600 m-1 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Table;