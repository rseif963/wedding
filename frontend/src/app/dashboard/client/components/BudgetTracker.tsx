"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function BudgetTracker() {
  const {
    clientProfile,
    updatePlannedBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  } = useAppContext();

  const budget = clientProfile?.budget || { plannedAmount: 0, items: [] };

  // ------------------------------
  // Total Budget State
  // ------------------------------
  const [editingTotal, setEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState("");

  useEffect(() => {
    setTotalInput(formatNumber(budget.plannedAmount));
  }, [budget.plannedAmount]);

  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    const raw = Number(String(num).replace(/,/g, "")) || 0;
    return raw.toLocaleString("en-US");
  };

  const cleanNumber = (value: string) =>
    Number(value.replace(/,/g, "")) || 0;

  const handleTotalChange = (val: string) => {
    const cleaned = val.replace(/[^\d]/g, "");
    setTotalInput(formatNumber(cleaned));
  };

  const savePlannedBudget = async () => {
    const amount = cleanNumber(totalInput);
    const updated = await updatePlannedBudget(amount);

    if (updated) setEditingTotal(false);
  };

  // ------------------------------
  // Add Item
  // ------------------------------
  const [newItem, setNewItem] = useState({ title: "", cost: "" });

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.cost.trim()) return;

    const added = await addBudgetItem({
      title: newItem.title.trim(),
      cost: cleanNumber(newItem.cost),
    });

    if (added) setNewItem({ title: "", cost: "" });
  };

  // ------------------------------
  // Edit Item
  // ------------------------------
  const [activeEdit, setActiveEdit] = useState<null | string>(null);
  const [editForm, setEditForm] = useState({ title: "", cost: "" });

  const startEdit = (item: any) => {
    setActiveEdit(item._id);
    setEditForm({
      title: item.title,
      cost: formatNumber(item.cost),
    });
  };

  const saveItem = async (item: any) => {
    const updated = await updateBudgetItem(item._id, {
      title: editForm.title.trim(),
      cost: cleanNumber(editForm.cost),
    });

    if (updated) setActiveEdit(null);
  };

  // ------------------------------
  // Delete Item
  // ------------------------------
  const removeItem = async (id: string) => {
    await deleteBudgetItem(id);
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="bg-white w-full h-full p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900">Budget Tracker</h2>

      {/* Total Budget Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Total Planned Budget</span>

          {!editingTotal ? (
            <button
              onClick={() => setEditingTotal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={savePlannedBudget}
                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={() => setEditingTotal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        {!editingTotal ? (
          <p className="text-2xl font-semibold text-gray-900">
            Ksh {formatNumber(budget.plannedAmount)}
          </p>
        ) : (
          <input
            type="text"
            value={totalInput}
            onChange={(e) => handleTotalChange(e.target.value)}
            className="w-full p-2 border rounded-lg text-lg"
          />
        )}
      </div>

      {/* Add New Item */}
      <div className="bg-gray-50 p-4 rounded-xl mb-8 border">
        <h3 className="font-semibold mb-3 text-gray-800">Add Budget Item</h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Item title (e.g Venue)"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="flex-1 border p-2 rounded-lg"
          />

          <input
            type="text"
            placeholder="Cost"
            value={newItem.cost}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                cost: formatNumber(e.target.value.replace(/\D/g, "")),
              })
            }
            className="w-40 border p-2 rounded-lg"
          />

          <button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            Add <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Budget Items */}
      <div className="space-y-6">
        {budget.items?.length ? (
          budget.items.map((item: any) => {
            const percentage = budget.plannedAmount
              ? Math.min((item.cost / budget.plannedAmount) * 100, 100)
              : 0;

            const isEditing = activeEdit === item._id;

            return (
              <div key={item._id} className="pb-4 border-b border-gray-100">
                {/* Header */}
                <div className="flex justify-between text-sm font-medium mb-2">
                  {!isEditing ? (
                    <>
                      <span>{item.title}</span>
                      <span>Ksh {formatNumber(item.cost)}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="border p-1 rounded-lg w-32"
                      />
                      <input
                        type="text"
                        value={editForm.cost}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            cost: formatNumber(
                              e.target.value.replace(/\D/g, "")
                            ),
                          })
                        }
                        className="border p-1 rounded-lg w-24"
                      />
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2 text-sm">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit2 size={14} /> Edit
                      </button>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => saveItem(item)}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                      >
                        <Save size={14} /> Save
                      </button>

                      <button
                        onClick={() => setActiveEdit(null)}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No budget items added yet.</p>
        )}
      </div>
    </div>
  );
}
