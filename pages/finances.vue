<template>
  <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
    <!-- Search & Quick Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div class="flex-1 relative max-w-2xl group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search transactions by name or description..." 
          class="w-full pl-10 pr-4 py-2.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] placeholder:text-gray-400 shadow-sm"
        />
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <DateRangePicker v-model:start="startDate" v-model:end="endDate" />
        <button class="px-4 py-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2 shadow-sm h-[52px]">
          <Download class="w-4 h-4" /> Export
        </button>
      </div>
    </div>

    <!-- Header & Statistics -->
    <div class="space-y-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Finances</h1>
        <p class="text-xs font-medium text-gray-500">Track revenue, commissions, and all platform transactions.</p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Primary Stats -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Loading State -->
          <template v-if="loading && !stats">
            <div class="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-40 shadow-sm mb-6"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="i in 4" :key="`fin-loading-${i}`" class="bg-white p-5 rounded-xl border border-gray-100 animate-pulse h-32 shadow-sm"></div>
            </div>
          </template>

          <template v-else>
            <!-- Revenue Performance Widget -->
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="absolute -right-12 -top-12 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
              
              <div class="flex-1 space-y-1 z-10 w-full">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar class="w-3.5 h-3.5"/> Today's Revenue</p>
                <div class="flex items-baseline gap-3">
                  <h2 class="text-4xl font-black text-gray-900 tabular-nums font-heading tracking-tight">₦{{ (stats?.todaysRevenue || 0).toLocaleString() }}</h2>
                  
                  <div class="flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold"
                       :class="revenueGrowth >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'">
                    <TrendingUp v-if="revenueGrowth >= 0" class="w-3.5 h-3.5" />
                    <TrendingDown v-else class="w-3.5 h-3.5" />
                    {{ Math.abs(revenueGrowth).toFixed(1) }}%
                  </div>
                </div>
                <p class="text-xs font-medium text-gray-500 mt-2">Yesterday: ₦{{ (stats?.yesterdaysRevenue || 0).toLocaleString() }}</p>
              </div>

              <div class="w-full md:w-auto shrink-0 z-10 flex gap-2">
                <button class="flex-1 md:flex-none px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">View Report</button>
              </div>
            </div>

            <!-- Financial Cards Grid (2x2) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Total Volume Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                  <Wallet class="w-5 h-5 text-emerald-600" />
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Volume</p>
                <h2 class="text-2xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.totalVolume || 0).toLocaleString() }}</h2>
                <div class="flex items-center gap-1.5 mt-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">All time</span>
                </div>
              </div>

              <!-- Commission Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#FF5C1A]/30 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF5C1A]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center mb-4 border border-[#FF5C1A]/20 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp class="w-5 h-5 text-[#FF5C1A]" />
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Platform Earnings</p>
                <h2 class="text-2xl font-black text-[#FF5C1A] tabular-nums font-heading">₦{{ (stats?.totalCommissions || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-gray-500 mt-2 block uppercase tracking-wide">Total service fees</span>
              </div>

              <!-- Net Balance Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                  <ArrowDownLeft class="w-5 h-5 text-indigo-600" />
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Net Balance</p>
                <h2 class="text-2xl font-black text-gray-900 tabular-nums font-heading">₦{{ (netBalance || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-indigo-600 mt-2 block uppercase tracking-wide">Combined wallet balance</span>
              </div>

              <!-- Highest Spender Card -->
              <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Star class="w-5 h-5 text-[#FF5C1A]" fill="currentColor" />
                </div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Top Spender</p>
                <div v-if="stats?.highestPurchaseUser">
                  <h2 class="text-xl font-black text-white tabular-nums font-heading truncate">{{ stats.highestPurchaseUser.owner?.firstName }} {{ stats.highestPurchaseUser.owner?.lastName }}</h2>
                  <span class="text-[10px] font-bold text-[#FF5C1A] mt-2 block uppercase tracking-wide">₦{{ (stats.highestPurchaseUser.totalSpent || 0).toLocaleString() }} Lifetime</span>
                </div>
                <div v-else>
                  <h2 class="text-xl font-black text-white tabular-nums font-heading">N/A</h2>
                  <span class="text-[10px] font-bold text-gray-500 mt-2 block uppercase tracking-wide">No data yet</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Right Column: AI Actionable Insights -->
        <div class="lg:col-span-4">
          <div class="bg-gradient-to-b from-indigo-900 to-indigo-950 p-6 rounded-2xl border border-indigo-800 shadow-xl relative overflow-hidden h-full flex flex-col">
            <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5C1A] to-transparent opacity-50"></div>
            
            <div class="flex items-center gap-2 mb-6 z-10">
              <div class="p-2 bg-indigo-800/50 rounded-lg border border-indigo-700/50">
                <Sparkles class="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-white font-heading">Actionable Insights</h3>
                <p class="text-[10px] font-medium text-indigo-300">System generated recommendations</p>
              </div>
            </div>

            <div class="space-y-4 z-10 flex-1">
              <template v-if="loading && !stats">
                <div v-for="i in 3" :key="`insight-skel-${i}`" class="h-20 bg-indigo-800/30 animate-pulse rounded-xl border border-indigo-700/30"></div>
              </template>
              <template v-else>
                <div v-if="revenueGrowth < 0" class="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5"><TrendingDown class="w-4 h-4 text-rose-400" /></div>
                    <div>
                      <p class="text-xs font-bold text-rose-200 mb-1 group-hover:text-rose-100">Revenue is down {{ Math.abs(revenueGrowth).toFixed(1) }}%</p>
                      <p class="text-[10px] font-medium text-rose-300/80 leading-relaxed">Consider launching a targeted push campaign to inactive users to boost order volume today.</p>
                      <button class="mt-2 text-[10px] font-bold text-white bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/40 transition-colors">Create Campaign</button>
                    </div>
                  </div>
                </div>

                <div v-if="revenueGrowth > 10" class="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5"><TrendingUp class="w-4 h-4 text-emerald-400" /></div>
                    <div>
                      <p class="text-xs font-bold text-emerald-200 mb-1 group-hover:text-emerald-100">Strong Momentum (+{{ revenueGrowth.toFixed(1) }}%)</p>
                      <p class="text-[10px] font-medium text-emerald-300/80 leading-relaxed">Great job! Consider adjusting vendor commission rates slightly to capitalize on high volume.</p>
                      <button class="mt-2 text-[10px] font-bold text-white bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/40 transition-colors">Review Rates</button>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5"><UserPlus class="w-4 h-4 text-indigo-300" /></div>
                    <div>
                      <p class="text-xs font-bold text-indigo-100 mb-1 group-hover:text-white">Acquisition Strategy</p>
                      <p class="text-[10px] font-medium text-indigo-300/80 leading-relaxed">Top spender is highly active. Create a referral code for them to invite more high-value peers.</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Ledger -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden min-h-[400px] shadow-sm">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wide">Transactions</h3>
        <button class="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-semibold text-gray-600 border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
          <ListFilter class="w-3 h-3" />
          Filter
        </button>
      </div>

      <div v-if="loading" class="p-5">
        <SkeletonTable :rows="8" :cols="5" />
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="py-20 text-center">
        <EmptyState title="No transactions yet" description="When payments are made, they will show up here." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Date</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">User</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Amount</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-center">Type</th>
              <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap">Description</th>
              <th class="py-3 px-5 font-semibold text-gray-500 text-[11px] uppercase tracking-wide whitespace-nowrap text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-colors group cursor-pointer" @click="selectedTransaction = tx">
              <td class="py-3 px-5 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-900">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-[10px] font-medium text-gray-500">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-3 px-4 min-w-[200px]">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold border border-indigo-100 shrink-0">
                    {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-900 leading-none mb-0.5 truncate">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
                    <p class="text-[10px] font-medium text-gray-500 truncate">{{ tx.wallet?.owner?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="inline-flex items-center gap-1.5 pr-2 py-1 pl-1 bg-white border border-gray-100 rounded-md">
                  <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="w-5 h-5 border rounded flex items-center justify-center text-[10px] font-bold shrink-0">
                    {{ tx.type === 'credit' ? '+' : '-' }}
                  </div>
                  <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-xs font-bold tabular-nums">
                    ₦{{ (tx.amount || 0).toLocaleString() }}
                  </p>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex justify-center">
                  <StatusBadge :status="tx.type" class="scale-75 origin-center" />
                </div>
              </td>
              <td class="py-3 px-4 max-w-[200px]">
                <p class="text-[11px] font-medium text-gray-500 truncate">{{ tx.description }}</p>
              </td>
              <td class="py-3 px-5 text-right">
                <div class="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 group-hover:bg-gray-100 transition-colors">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && !loading" class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 gap-4">
        <div class="text-xs font-medium text-gray-500">
          Showing <span class="font-bold text-gray-900">{{ ((currentPage - 1) * 50) + 1 }}</span> to <span class="font-bold text-gray-900">{{ Math.min(currentPage * 50, totalTransactions) }}</span> of <span class="font-bold text-gray-900">{{ totalTransactions }}</span> transactions
        </div>
        <div class="flex items-center gap-1.5">
          <button 
            @click="handlePageChange(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center gap-1">
            <template v-for="page in displayedPages" :key="page">
              <button 
                v-if="page !== '...'"
                @click="handlePageChange(page as number)"
                :class="page === currentPage ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-md shadow-[#FF5C1A]/20' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'"
                class="w-8 h-8 rounded-lg border text-xs font-bold transition-all flex items-center justify-center"
              >
                {{ page }}
              </button>
              <span v-else class="w-8 h-8 flex items-center justify-center text-gray-400 text-xs font-bold">...</span>
            </template>
          </div>
          <button 
            @click="handlePageChange(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- SideDrawer for Transaction Details -->
    <SideDrawer :isOpen="!!selectedTransaction" @close="selectedTransaction = null">
      <template v-if="selectedTransaction">
        <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
          <div class="relative mb-3">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 font-heading mb-0.5">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
          <p class="text-[11px] font-medium text-gray-500 mb-6">{{ selectedTransaction.wallet?.owner?.email }}</p>
          
          <div class="flex flex-col items-center justify-center w-4/5 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
            <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-xl font-bold mb-2 tabular-nums">
              {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ (selectedTransaction.amount || 0).toLocaleString() }}
            </p>
            <StatusBadge :status="selectedTransaction.type" class="scale-75" />
          </div>
        </div>

        <div class="p-6 space-y-6 pb-24 bg-gray-50/30">
          <div class="space-y-3">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Transaction Details</h4>
            <div class="space-y-2">
              <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-gray-500">Transaction ID</span>
                  <Copy class="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
                </div>
                <span class="text-xs font-semibold text-gray-900 break-all font-mono">{{ selectedTransaction._id }}</span>
              </div>
              
              <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <span class="text-xs font-semibold text-gray-500">Date & Time</span>
                <div class="text-right">
                  <p class="text-xs font-semibold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                  <p class="text-[10px] font-medium text-gray-500">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div class="flex items-start gap-2">
                  <FileText class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div class="space-y-0.5">
                    <span class="text-xs font-semibold text-gray-500">Description</span>
                    <p class="text-xs font-medium text-gray-700 leading-relaxed">{{ selectedTransaction.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3" v-if="selectedTransaction.order">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Linked Order</h4>
            <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Package class="w-4 h-4 text-white" />
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-900 block leading-none mb-0.5">Order</span>
                  <span class="text-[10px] font-semibold text-[#FF5C1A]">#{{ selectedTransaction.order.slice(-12) }}</span>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <!-- Payout Details & Metadata -->
          <div class="space-y-3" v-if="selectedTransaction.metadata">
            <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Additional Details</h4>
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.bankCode">
                <span class="text-xs font-medium text-gray-500">Bank Code</span>
                <span class="text-xs font-bold text-gray-900">{{ selectedTransaction.metadata.bankCode }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.accountNumber">
                <span class="text-xs font-medium text-gray-500">Account Number</span>
                <span class="text-xs font-bold text-gray-900 font-mono">{{ selectedTransaction.metadata.accountNumber }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.userName">
                <span class="text-xs font-medium text-gray-500">Account Name</span>
                <span class="text-xs font-bold text-gray-900">{{ selectedTransaction.metadata.userName }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.paystackReference">
                <span class="text-xs font-medium text-gray-500">Paystack Ref</span>
                <span class="text-xs font-bold text-[#FF5C1A] font-mono">{{ selectedTransaction.metadata.paystackReference }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.transferCode">
                <span class="text-xs font-medium text-gray-500">Transfer Code</span>
                <span class="text-xs font-bold text-gray-900 font-mono">{{ selectedTransaction.metadata.transferCode }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="selectedTransaction.metadata.userEmail">
                <span class="text-xs font-medium text-gray-500">Email</span>
                <span class="text-xs font-bold text-gray-900">{{ selectedTransaction.metadata.userEmail }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="sticky bottom-0 -mx-6 -mb-8 mt-6 p-4 bg-white border-t border-gray-100 z-10 flex flex-col gap-2">
            <template v-if="selectedTransaction.type === 'debit' && selectedTransaction.status === 'pending'">
              <button 
                @click="handleApprovePayout(selectedTransaction._id)" 
                class="w-full py-3 px-4 rounded-lg text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                Approve (Auto Payout)
              </button>
              <button 
                @click="handleMarkAsPaid(selectedTransaction._id)" 
                class="w-full py-3 px-4 rounded-lg text-emerald-700 font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-200"
              >
                Mark as Paid Manually
              </button>
              <button 
                @click="handleRejectPayout(selectedTransaction._id)" 
                class="w-full py-3 px-4 rounded-lg text-white font-semibold text-xs bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                Reject Payout
              </button>
            </template>
            <template v-else>
              <button @click="handleDownloadReceipt(selectedTransaction._id)" class="w-full py-3 px-4 rounded-lg text-white font-semibold text-xs bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Download class="w-3.5 h-3.5" /> Download Receipt
              </button>
            </template>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { useAdminFinances } from '@/composables/modules/admin';
import { Download, Wallet, TrendingUp, TrendingDown, ArrowDownLeft, Search, ListFilter, ChevronRight, ChevronLeft, Copy, FileText, Package, Star, Calendar, Sparkles, UserPlus } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Finances - Errander Admin' });

const { stats, transactions, totalTransactions, currentPage, fetchTransactions, loading, fetchFinances, approvePayout, rejectPayout, markPayoutAsPaid, downloadReceipt } = useAdminFinances();

const searchQuery = ref('');
const selectedTransaction = ref<any>(null);
const startDate = ref('');
const endDate = ref('');

const handleApprovePayout = async (id: string) => {
  await approvePayout(id);
  selectedTransaction.value = null; // Close drawer after action
};

const handleMarkAsPaid = async (id: string) => {
  await markPayoutAsPaid(id);
  selectedTransaction.value = null; // Close drawer after action
};

const handleRejectPayout = async (id: string) => {
  await rejectPayout(id);
  selectedTransaction.value = null; // Close drawer after action
};

const handleDownloadReceipt = async (id: string) => {
  await downloadReceipt(id);
};

const netBalance = computed(() => {
  return transactions.value.reduce((acc: number, t: any) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);
});

const filteredTransactions = computed(() => {
  return transactions.value.filter((tx: any) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || 
      tx.description?.toLowerCase().includes(q) || 
      tx.wallet?.owner?.firstName?.toLowerCase().includes(q) ||
      tx.wallet?.owner?.lastName?.toLowerCase().includes(q);
      
    let matchesDate = true;
    if (startDate.value || endDate.value) {
      const txDate = new Date(tx.createdAt).getTime();
      if (startDate.value && txDate < new Date(startDate.value).getTime()) matchesDate = false;
      if (endDate.value && txDate > new Date(endDate.value).getTime() + 86400000) matchesDate = false;
    }
      
    return matchesSearch && matchesDate;
  });
});

const totalPages = computed(() => Math.ceil((totalTransactions.value || 0) / 50));

const revenueGrowth = computed(() => {
  if (!stats.value) return 0;
  const today = stats.value.todaysRevenue || 0;
  const yesterday = stats.value.yesterdaysRevenue || 0;
  if (yesterday === 0) return today > 0 ? 100 : 0;
  return ((today - yesterday) / yesterday) * 100;
});

const handlePageChange = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  await fetchTransactions(page, 50);
};

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
});

onMounted(fetchFinances);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
