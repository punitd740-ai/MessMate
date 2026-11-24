import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Calendar
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function InventoryManagementTab() {
  const [inventory, setInventory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State: Add Item
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('vegetables');
  const [newItemStock, setNewItemStock] = useState(25);
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemMinThreshold, setNewItemMinThreshold] = useState(15);
  const [newItemCost, setNewItemCost] = useState(60);

  // Form State: Restock
  const [addedQuantity, setAddedQuantity] = useState(20);
  const [costPerUnit, setCostPerUnit] = useState(0);

  const fetchInventory = async () => {
    setLoading(true);
    const res = await api.get('/owner/inventory');
    if (res.success) {
      setInventory(res.items || []);
      setPurchases(res.purchases || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const res = await api.post('/owner/inventory', {
      itemName: newItemName,
      category: newItemCategory,
      currentStock: Number(newItemStock),
      unit: newItemUnit,
      minThreshold: Number(newItemMinThreshold),
      costPerUnit: Number(newItemCost)
    });

    setActionLoading(false);
    if (res.success) {
      setAddItemModalOpen(false);
      setNotification({ type: 'success', message: `Added ${newItemName} to kitchen inventory.` });
      setNewItemName('');
      fetchInventory();
    } else {
      setNotification({ type: 'error', message: res.message || 'Failed to add item' });
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setActionLoading(true);

    const res = await api.put(`/owner/inventory/${selectedItem._id}`, {
      addedStock: Number(addedQuantity),
      costPerUnit: Number(costPerUnit) || selectedItem.costPerUnit
    });

    setActionLoading(false);
    if (res.success) {
      setRestockModalOpen(false);
      setNotification({
        type: 'success',
        message: `Restocked ${selectedItem.itemName} by +${addedQuantity} ${selectedItem.unit}. Purchase logged!`
      });
      fetchInventory();
    } else {
      setNotification({ type: 'error', message: res.message || 'Restock failed' });
    }
  };

  const lowStockItems = inventory.filter(i => Number(i.currentStock) <= Number(i.minThreshold));

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory & Procurement Management</h2>
          <p className="text-xs text-slate-500">
            Track ingredient stock levels, threshold alerts, and wholesale purchase records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddItemModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient</span>
          </button>
          <button
            onClick={fetchInventory}
            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            &times;
          </button>
        </div>
      )}

      {/* Low-Stock Alert Callout */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-semibold text-sm">Low-Stock Alert:</strong>{' '}
              <span>{lowStockItems.map(i => `${i.itemName} (${i.currentStock} ${i.unit} left)`).join(' • ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Items Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Kitchen Ingredients & Stock Levels</h3>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {inventory.length} Total Items
          </span>
        </div>

        {inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ingredient Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Min. Threshold</th>
                  <th className="py-3 px-4">Cost / Unit</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => {
                  const isLow = Number(item.currentStock) <= Number(item.minThreshold);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.itemName}</td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.minThreshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        ₹{item.costPerUnit || 0} / {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 w-max">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setCostPerUnit(item.costPerUnit || 0);
                            setRestockModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No ingredients added yet. Click "Add Ingredient" to get started.
          </div>
        )}
      </div>

      {/* Procurement & Purchase History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Wholesale Purchase Records</h3>
            <p className="text-xs text-slate-400">Automatically logged when ingredients are restocked</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {purchases.length} Purchases
          </span>
        </div>

        {purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Total Cost</th>
                  <th className="py-3 px-4">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((pur) => (
                  <tr key={pur._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {pur.invoiceNumber || 'PUR-001'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{pur.purchaseDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{pur.itemName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {pur.quantity} {pur.unit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">₹{pur.unitPrice}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{pur.totalCost}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{pur.supplier || 'Mandi Wholesale'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No purchase records logged yet.
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Add Item Modal */}
      <Modal isOpen={addItemModalOpen} onClose={() => setAddItemModalOpen(false)} title="Add Kitchen Ingredient">
        <form onSubmit={handleAddItem} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ingredient Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Rice, Fresh Paneer, Mustard Oil"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="grains">Grains & Flour</option>
                <option value="vegetables">Fresh Vegetables</option>
                <option value="dairy">Dairy & Milk Products</option>
                <option value="oil">Oils & Ghee</option>
                <option value="spices">Spices & Condiments</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Measurement Unit</label>
              <select
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="liters">liters</option>
                <option value="packets">packets</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
              <input
                type="number"
                required
                value={newItemStock}
                onChange={(e) => setNewItemStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Threshold</label>
              <input
                type="number"
                required
                value={newItemMinThreshold}
                onChange={(e) => setNewItemMinThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cost / Unit (₹)</label>
              <input
                type="number"
                required
                value={newItemCost}
                onChange={(e) => setNewItemCost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddItemModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
            >
              {actionLoading ? 'Adding...' : 'Add Ingredient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Restock Modal */}
      <Modal isOpen={restockModalOpen} onClose={() => setRestockModalOpen(false)} title="Restock Ingredient">
        {selectedItem && (
          <form onSubmit={handleRestock} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-sm font-bold text-emerald-950">{selectedItem.itemName}</div>
              <div className="text-slate-600 mt-1">
                Current Stock: <strong>{selectedItem.currentStock} {selectedItem.unit}</strong> (Min: {selectedItem.minThreshold} {selectedItem.unit})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity to Add ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addedQuantity}
                  onChange={(e) => setAddedQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cost per {selectedItem.unit} (₹)
                </label>
                <input
                  type="number"
                  required
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">Total Purchase Expense:</span>
              <strong className="text-sm text-slate-900">
                ₹{Number(addedQuantity) * Number(costPerUnit)}
              </strong>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRestockModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
              >
                {actionLoading ? 'Restocking...' : 'Confirm Restock & Log Purchase'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
