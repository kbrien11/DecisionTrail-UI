import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {Decision} from "@/app/types/Decision";



interface EditDecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    decision: Decision;
    onSave: (updated: Decision) => Promise<void>;
}

export default function EditDecisionModal({
                                              isOpen,
                                              onClose,
                                              decision,
                                              onSave,
                                          }: EditDecisionModalProps) {
    const [formData, setFormData] = useState({
        summary: "",
        rationale: "",
        status: "",
    });


    useEffect(() => {
        if (decision) {
            setFormData({
                summary: decision.summary || "",
                rationale: decision.rationale || "",
                status: decision.status || "",
            });
        }
    }, [decision]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave({ ...decision, ...formData });
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-bold mb-6 text-gray-800">
                        Edit Decision
                    </Dialog.Title>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                                Summary
                            </label>
                            <input
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Enter summary"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="rationale" className="block text-sm font-medium text-gray-700 mb-1">
                                Rationale
                            </label>
                            <textarea
                                id="rationale"
                                name="rationale"
                                value={formData.rationale}
                                onChange={handleChange}
                                placeholder="Enter rationale"
                                className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm text-white rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}