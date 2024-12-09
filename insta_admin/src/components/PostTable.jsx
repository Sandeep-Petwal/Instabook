/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Database, Trash2 } from 'lucide-react';
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

const PostTable = ({ columns, data, onSort, sortColumn, sortDirection, onDeletePost }) => {
    const [selectedPost, setSelectedPost] = useState(null);

    const handleRowClick = (row) => {
        setSelectedPost(row);
    };

    const handleDeletePost = () => {
        if (selectedPost) {
            onDeletePost(selectedPost);
            setSelectedPost(null);
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
                                    {column.key == "createdBy" ? (
                                        <button
                                            className="inline-flex items-center gap-2 hover:text-white"
                                        >
                                            {column.label}
                                        </button>
                                    )
                                        : (
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
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="group transition-colors hover:bg-zinc-800/50 cursor-pointer"
                                    onClick={() => handleRowClick(row)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3 text-zinc-300"
                                        >
                                            {column.key === 'image_url' ? (
                                                <div className="relative h-10 w-10">
                                                    <img
                                                        src={row[column.key]}
                                                        alt="post image"
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-800"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : column.key === 'createdBy' ? (
                                                <span className="whitespace-nowrap">{ "("+row["user_id"] + ") "+ row["user"].name}</span>
                                            ) : column.key === 'createdAt' ? (
                                                <span className="whitespace-nowrap">{new Date(row[column.key]).toLocaleString() + " (" + row["timeAgo"] + ")"}</span>
                                            ) : (
                                                <span className="whitespace-nowrap">{row[column.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
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

            {/* Post Details Dialog */}
            <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Post Details</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {/* View post information and manage post */}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPost && (
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={selectedPost.image_url}
                                    alt="Post"
                                    className="max-w-full max-h-64 object-cover rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-zinc-100">Caption</h3>
                                <p className="text-zinc-300">{selectedPost.caption}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-zinc-100">Creator Details</h3>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={selectedPost.user?.avatar || '/default-avatar.png'}
                                            alt={selectedPost.user?.name}
                                        />
                                        <AvatarFallback>{selectedPost.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-zinc-100 font-medium">{selectedPost.user?.name}</p>
                                        <p className="text-zinc-400 text-sm">{selectedPost.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePost}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PostTable;