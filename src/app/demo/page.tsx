'use client';

import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import EcoNudgeWidget from '@/components/sdk/EcoNudgeWidget';
import type { UserAction, GreenAlternative } from '@/lib/types';
import { useImpact } from '@/context/ImpactContext';
import { geocode, calculateDistance } from '@/lib/geocoding';

// Import our massive generated datasets
import foodsData from '@/lib/data/food.json';
import clothesData from '@/lib/data/clothes.json';
import { playWaterDrop } from '@/lib/audio';

type TabId = 'ride' | 'food' | 'shop';

interface DemoTab {
  id: TabId;
  label: string;
  accent: string;
  accentRgb: string;
}

const tabs: DemoTab[] = [
  { id: 'ride', label: '🚗 Ride Booking', accent: '#3b82f6', accentRgb: '59,130,246' },
  { id: 'food', label: '🍔 Food Delivery', accent: '#f97316', accentRgb: '249,115,22' },
  { id: 'shop', label: '🛒 Shopping', accent: '#a855f7', accentRgb: '168,85,247' },
];

/* ------------------------------------------------------------------ */
/*  Dynamic Ride Card                                                  */
/* ------------------------------------------------------------------ */
function RideCard({ accent, onBook }: { accent: string; onBook: (action: UserAction) => void }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState<number | null>(null);

  const handleCalculate = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination.');
      return;
    }
    setLoading(true);
    setError('');
    
    const [origRes, destRes] = await Promise.all([
      geocode(origin),
      geocode(destination)
    ]);

    if (!origRes || !destRes) {
      setError('Could not find one of the locations. Try being more specific.');
      setLoading(false);
      return;
    }

    const dist = calculateDistance(origRes.lat, origRes.lon, destRes.lat, destRes.lon);
    setDistance(dist);
    setLoading(false);
  };

  const fare = distance ? Math.round(distance * 22) : 0; // ₹22/km

  const handleBook = () => {
    if (!distance) return;
    onBook({
      id: `ride-${Date.now()}`,
      category: 'transport',
      mode: 'cab',
      distance: distance,
      title: 'Premium Sedan Ride',
      description: `${origin} → ${destination}`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${accent}22` }}>🚗</div>
        <div>
          <h3 className="text-lg font-bold text-white">QuickRide</h3>
          <p className="text-xs text-gray-500">Global Real-Time Routing</p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
        <input 
          type="text" 
          placeholder="Origin (e.g., Times Square, NY)"
          className="w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
          value={origin}
          onChange={(e) => { setOrigin(e.target.value); setDistance(null); }}
        />
        <input 
          type="text" 
          placeholder="Destination (e.g., Central Park, NY)"
          className="w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
          value={destination}
          onChange={(e) => { setDestination(e.target.value); setDistance(null); }}
        />
        
        {error && <p className="text-xs text-red-400">{error}</p>}
        
        {!distance ? (
          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full rounded-lg bg-blue-500/20 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/30 disabled:opacity-50"
          >
            {loading ? 'Calculating Route...' : 'Calculate Distance'}
          </button>
        ) : (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Distance</span>
              <span className="font-bold text-white">{distance.toFixed(1)} km</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-400">Estimated Fare</span>
              <span className="font-bold text-white">₹{fare}</span>
            </div>
          </div>
        )}
      </div>

      <motion.button
        whileHover={distance ? { scale: 1.02 } : {}}
        whileTap={distance ? { scale: 0.98 } : {}}
        onClick={handleBook}
        disabled={!distance}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-50 cursor-pointer"
        style={{ background: distance ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : '#374151' }}
      >
        Book Ride →
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dynamic Food Card (1000+ Items)                                   */
/* ------------------------------------------------------------------ */
function FoodCard({ accent, onOrder }: { accent: string; onOrder: (action: UserAction) => void }) {
  const [search, setSearch] = useState('');
  
  // Filter massive JSON client-side
  const filteredFoods = useMemo(() => {
    return foodsData
      .filter((f) => f.title.toLowerCase().includes(search.toLowerCase()) || f.cuisine.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5); // show top 5
  }, [search]);

  const [selectedFood, setSelectedFood] = useState<any>(foodsData[0]);

  const handleOrder = () => {
    onOrder({
      id: selectedFood.id,
      category: 'food',
      mealType: selectedFood.mealType,
      cuisine: selectedFood.cuisine,
      packagingType: selectedFood.packagingType,
      title: selectedFood.title,
      description: `${selectedFood.restaurant} • ${selectedFood.cuisine}`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${accent}22` }}>🍽️</div>
        <div>
          <h3 className="text-lg font-bold text-white">FoodDash</h3>
          <p className="text-xs text-gray-500">1000+ Dishes Available</p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
        <input 
          type="text" 
          placeholder="Search 1000+ dishes (e.g. Pizza, Sushi...)"
          className="w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-orange-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="max-h-[140px] overflow-y-auto space-y-1 mt-2 pr-1 custom-scrollbar">
          {filteredFoods.length === 0 ? (
            <p className="text-xs text-gray-500 p-2 text-center">No dishes found</p>
          ) : (
            filteredFoods.map((food) => (
              <div 
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`cursor-pointer rounded-lg p-2 text-sm transition ${selectedFood?.id === food.id ? 'bg-orange-500/20 text-orange-100' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{food.title}</span>
                  <span className="text-xs">₹{food.price}</span>
                </div>
                <div className="text-[10px] text-gray-500 flex gap-2">
                  <span>{food.cuisine}</span>
                  <span className="uppercase">{food.mealType}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOrder}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        Place Order (₹{selectedFood?.price || 0}) →
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dynamic Shop Card (100+ Items)                                    */
/* ------------------------------------------------------------------ */
function ShopCard({ accent, onBuy }: { accent: string; onBuy: (action: UserAction) => void }) {
  const [search, setSearch] = useState('');
  
  const filteredClothes = useMemo(() => {
    return clothesData
      .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5); 
  }, [search]);

  const [selectedItem, setSelectedItem] = useState<any>(clothesData[0]);

  const handleBuy = () => {
    onOrder({
      id: selectedItem.id,
      category: 'shopping',
      productType: selectedItem.productType,
      shippingMode: 'express', // default for demo
      title: selectedItem.title,
      description: `${selectedItem.brand} • ${selectedItem.material}`,
    });
  };

  const onOrder = onBuy; // alias

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${accent}22` }}>🛍️</div>
        <div>
          <h3 className="text-lg font-bold text-white">ShopFast</h3>
          <p className="text-xs text-gray-500">Massive Clothing Catalog</p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
        <input 
          type="text" 
          placeholder="Search clothes (e.g. Cotton, Vintage...)"
          className="w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="max-h-[140px] overflow-y-auto space-y-1 mt-2 pr-1 custom-scrollbar">
          {filteredClothes.length === 0 ? (
            <p className="text-xs text-gray-500 p-2 text-center">No items found</p>
          ) : (
            filteredClothes.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer rounded-lg p-2 text-sm transition ${selectedItem?.id === item.id ? 'bg-purple-500/20 text-purple-100' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate pr-2">{item.title}</span>
                  <span className="text-xs shrink-0">₹{item.price}</span>
                </div>
                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>{item.brand}</span>
                  <span>{item.material}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBuy}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        Buy Now (₹{selectedItem?.price || 0}) →
      </motion.button>
    </div>
  );
}

function DemoPageContent() {
  const [activeTab, setActiveTab] = useState<TabId>('ride');
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<UserAction | null>(null);
  const { handleSelectAlternative } = useImpact();
  const searchParams = useSearchParams();

  // Handle voice auto-trigger
  useEffect(() => {
    const auto = searchParams.get('auto');
    if (auto && ['ride', 'food', 'shop'].includes(auto)) {
      setActiveTab(auto as TabId);
      // Construct a fake action to trigger the widget immediately
      const fakeAction: UserAction = {
        id: `voice-${Date.now()}`,
        category: auto === 'ride' ? 'transport' : auto === 'food' ? 'food' : 'shopping',
        title: auto === 'ride' ? 'Voice Ride Booking' : auto === 'food' ? 'Voice Food Order' : 'Voice Shopping',
        description: 'Triggered via Voice Command 🎙️',
      };
      setTimeout(() => {
        setCurrentAction(fakeAction);
        setIsWidgetOpen(true);
      }, 500); // small delay to allow tab switch animation
    }
  }, [searchParams]);

  const handleAction = useCallback((action: UserAction) => {
    playWaterDrop();
    setCurrentAction(action);
    setIsWidgetOpen(true);
  }, []);

  const onAlternativeSelected = useCallback((alt: GreenAlternative) => {
    handleSelectAlternative(alt);
    setIsWidgetOpen(false);
    setCurrentAction(null);
  }, [handleSelectAlternative]);

  const handleDismiss = useCallback(() => {
    setIsWidgetOpen(false);
    setCurrentAction(null);
  }, []);

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl"
      >
        Live <span className="gradient-text">Demo</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 text-center text-sm text-gray-500"
      >
        Click any action button below to see EcoNudge in action
      </motion.p>

      {/* Tab bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(tab.id)}
            className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition cursor-pointer ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${tab.accent}33, ${tab.accent}11)`,
                  border: `1px solid ${tab.accent}44`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Platform card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          className="glass-card mx-auto max-w-md overflow-hidden p-6"
          style={{
            borderColor: `rgba(${currentTab.accentRgb}, 0.15)`,
            boxShadow: `0 0 60px rgba(${currentTab.accentRgb}, 0.08)`,
          }}
        >
          {activeTab === 'ride' && (
            <RideCard accent={currentTab.accent} onBook={handleAction} />
          )}
          {activeTab === 'food' && (
            <FoodCard accent={currentTab.accent} onOrder={handleAction} />
          )}
          {activeTab === 'shop' && (
            <ShopCard accent={currentTab.accent} onBuy={handleAction} />
          )}
        </motion.div>
      </AnimatePresence>

      {currentAction && (
        <EcoNudgeWidget
          isOpen={isWidgetOpen}
          action={currentAction}
          onAlternativeSelected={onAlternativeSelected}
          onClose={handleDismiss}
        />
      )}
    </main>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-white">Loading demo...</div>}>
      <DemoPageContent />
    </Suspense>
  );
}
