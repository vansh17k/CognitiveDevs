/**
 * ============================================================================
 * COMMODITIES CATALOG PAGE (src/app/products/page.jsx)
 * ============================================================================
 * 
 * Directory of pre-packaged commodities evaluated under PCR 2011:
 * - Search by commodity name, brand, category, or barcode
 * - Grid / Table view toggle
 * - Filter by Category and Compliance Status
 * - Direct OCR audit inspection trigger
 */

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Camera, 
  Plus,
  Scale
} from 'lucide-react';
import { useApp } from '../layout.jsx';
import { Sidebar } from '../../components/Sidebar.jsx';
import { Header } from '../../components/Header.jsx';
import { SearchBar } from '../../components/SearchBar.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { ProductCard } from '../../components/ProductCard.jsx';
import { ProductTable } from '../../components/ProductTable.jsx';

export default function ProductsPage() {
  const { products, setSelectedProduct, navigate, startNewScan } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const categories = ['All', 'Dairy Products', 'Confectionery', 'Packaged Snacks', 'Instant Foods', 'Beverages'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const isCompliant = (p.complianceScore || 0) >= 90;
    const matchesStatus = 
      selectedStatus === 'All' || 
      (selectedStatus === 'Compliant' && isCompliant) ||
      (selectedStatus === 'Non-Compliant' && !isCompliant);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewDetails = (prod) => {
    setSelectedProduct(prod);
    navigate('result');
  };

  const handleInspect = (prod) => {
    startNewScan(prod.image, prod.name, prod.id);
  };

  return (
    <div className="flex-1 flex bg-slate-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Pre-Packaged Commodities Directory
              </h2>
              <p className="text-xs text-slate-500">
                Audited packaging registry under Legal Metrology (Packaged Commodities) Rules, 2011
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('scan')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scan New Commodity</span>
              </button>
            </div>
          </div>

          {/* Search, Filters, and View toggle */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by commodity name, brand, or SKU..."
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              statuses={['All', 'Compliant', 'Non-Compliant']}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
            />
          </div>

          {/* Commodities Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={handleViewDetails}
                  onInspect={handleInspect}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <ProductTable
                products={filteredProducts}
                onViewDetails={handleViewDetails}
                onInspect={handleInspect}
              />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
