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
        <button @click="triggerExport" class="px-4 py-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2 shadow-sm h-[52px]">
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
      <div class="flex flex-col gap-8">
        <!-- Primary Stats Section -->
        <div class="space-y-6 w-full">
          
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

            <!-- Financial Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Platform Revenue Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#FF5C1A]/30 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF5C1A]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center mb-4 border border-[#FF5C1A]/20 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp class="w-5 h-5 text-[#FF5C1A]" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Platform Share (Net Profit)</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total net profit retained by the platform from all revenue streams.
                  </div>
                </div>
                <h2 class="text-xl font-black text-[#FF5C1A] tabular-nums font-heading">₦{{ (stats?.totalCommissions || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-gray-500 mt-2 block uppercase tracking-wide">Pure platform profit</span>
              </div>

              <!-- Marketplace Platform Share Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#FF5C1A]/30 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF5C1A]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center mb-4 border border-[#FF5C1A]/20 group-hover:scale-110 transition-transform duration-300">
                  <Package class="w-5 h-5 text-[#FF5C1A]" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Marketplace Fees</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Platform's accumulated share from marketplace food orders (Service Fees + N50 Delivery Cut + Markups).
                  </div>
                </div>
                <h2 class="text-xl font-black text-[#FF5C1A] tabular-nums font-heading">₦{{ (stats?.platformMarketplace || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-gray-500 mt-2 block uppercase tracking-wide">From marketplace orders</span>
              </div>

              <!-- Custom Errands Platform Share Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-[#FF5C1A]/30 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF5C1A]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center mb-4 border border-[#FF5C1A]/20 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles class="w-5 h-5 text-[#FF5C1A]" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Errand Fees</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Platform's accumulated share specifically from Custom Errands percentage fees.
                  </div>
                </div>
                <h2 class="text-xl font-black text-[#FF5C1A] tabular-nums font-heading">₦{{ (stats?.platformCustomErrands || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-gray-500 mt-2 block uppercase tracking-wide">From custom errands</span>
              </div>

              <!-- Vendor Accrued Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                  <Store class="w-5 h-5 text-emerald-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendor Earnings</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total lifetime earnings accrued directly to all vendor wallets from successful orders.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.vendorAccrued || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-emerald-600 mt-2 block uppercase tracking-wide">Total accrued by vendors</span>
              </div>

              <!-- Dispatcher Accrued Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                  <Truck class="w-5 h-5 text-indigo-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dispatcher Earnings</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total lifetime earnings accrued directly to all dispatcher/errander wallets from completed deliveries.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.dispatcherAccrued || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-indigo-600 mt-2 block uppercase tracking-wide">Total accrued by dispatchers</span>
              </div>

              <!-- Vendor Payouts Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-amber-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                  <ArrowUpRight class="w-5 h-5 text-amber-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendor Payouts</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total amount of money successfully withdrawn and paid out to vendors.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.vendorPaidOut || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-amber-600 mt-2 block uppercase tracking-wide">Paid to vendors</span>
              </div>

              <!-- Dispatcher Payouts Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-fuchsia-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center mb-4 border border-fuchsia-100 group-hover:scale-110 transition-transform duration-300">
                  <ArrowUpRight class="w-5 h-5 text-fuchsia-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dispatcher Payouts</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total amount of money successfully withdrawn and paid out to dispatchers.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.dispatcherPaidOut || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-fuchsia-600 mt-2 block uppercase tracking-wide">Paid to dispatchers</span>
              </div>

              <!-- Student Funding Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                  <Wallet class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Funding</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total amount of money deposited/funded into student wallets via Paystack or direct top-ups.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.studentFunding || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-blue-600 mt-2 block uppercase tracking-wide">Total wallet top-ups</span>
              </div>

              <!-- Student Usage Card -->
              <div class="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-rose-200 transition-all duration-300">
                <div class="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-100 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard class="w-5 h-5 text-rose-600" />
                </div>
                <div class="flex items-center gap-1.5 mb-1 relative group/tooltip w-fit">
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet Usage</p>
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-20 font-medium leading-relaxed">
                    Total amount of money spent by students from their wallets to pay for orders and services.
                  </div>
                </div>
                <h2 class="text-xl font-black text-gray-900 tabular-nums font-heading">₦{{ (stats?.studentUsage || 0).toLocaleString() }}</h2>
                <span class="text-[10px] font-bold text-rose-600 mt-2 block uppercase tracking-wide">Total spent by students</span>
              </div>
            </div>
          </template>
        </div>

        <!-- AI Actionable Insights Section -->
        <div class="w-full">
          <div class="bg-gradient-to-r from-black to-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6">
            <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-[#FF5C1A] rounded-full blur-3xl opacity-10"></div>
            <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5C1A] to-transparent opacity-50"></div>
            
            <div class="flex flex-col justify-center min-w-[200px] z-10 border-r border-gray-800 pr-6">
              <div class="flex items-center gap-2 mb-2">
                <div class="p-2 bg-[#FF5C1A]/10 rounded-lg border border-[#FF5C1A]/20">
                  <Sparkles class="w-4 h-4 text-[#FF5C1A]" />
                </div>
                <h3 class="text-sm font-bold text-white font-heading">Actionable Insights</h3>
              </div>
              <p class="text-[10px] font-medium text-gray-400">System generated recommendations</p>
            </div>

            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
              <template v-if="loading && !stats">
                <div v-for="i in 3" :key="`insight-skel-${i}`" class="h-20 bg-gray-800/50 animate-pulse rounded-xl border border-gray-700/50"></div>
              </template>
              <template v-else>
                <div v-if="revenueGrowth < 0" class="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3 h-full">
                    <div class="mt-0.5"><TrendingDown class="w-4 h-4 text-rose-400" /></div>
                    <div class="flex flex-col h-full justify-between">
                      <div>
                        <p class="text-xs font-bold text-rose-200 mb-1 group-hover:text-rose-100">Revenue is down {{ Math.abs(revenueGrowth).toFixed(1) }}%</p>
                        <p class="text-[10px] font-medium text-rose-300/80 leading-relaxed">Consider launching a targeted push campaign to inactive users to boost order volume today.</p>
                      </div>
                      <button class="mt-3 w-fit text-[10px] font-bold text-white bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/40 transition-colors">Create Campaign</button>
                    </div>
                  </div>
                </div>

                <div v-if="revenueGrowth > 10" class="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3 h-full">
                    <div class="mt-0.5"><TrendingUp class="w-4 h-4 text-emerald-400" /></div>
                    <div class="flex flex-col h-full justify-between">
                      <div>
                        <p class="text-xs font-bold text-emerald-200 mb-1 group-hover:text-emerald-100">Strong Momentum (+{{ revenueGrowth.toFixed(1) }}%)</p>
                        <p class="text-[10px] font-medium text-emerald-300/80 leading-relaxed">Great job! Consider adjusting vendor commission rates slightly to capitalize on high volume.</p>
                      </div>
                      <button class="mt-3 w-fit text-[10px] font-bold text-white bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/40 transition-colors">Review Rates</button>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div class="flex items-start gap-3 h-full">
                    <div class="mt-0.5"><Users class="w-4 h-4 text-amber-400" /></div>
                    <div class="flex flex-col h-full justify-between">
                      <div>
                        <p class="text-xs font-bold text-amber-200 mb-1 group-hover:text-amber-100">Acquisition Strategy</p>
                        <p class="text-[10px] font-medium text-amber-300/80 leading-relaxed">Top spender is highly active. Create a referral code for them to invite more high-value peers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers Leaderboards -->
      <div class="mt-8 space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
            <Award class="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 font-heading tracking-tight">Top Performers</h3>
            <p class="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Platform Hall of Fame</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- Top Spender -->
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Spender</p>
                <h4 class="font-bold text-gray-900 truncate mt-1 max-w-[150px]">{{ stats?.highestPurchaseUser?.owner?.firstName }} {{ stats?.highestPurchaseUser?.owner?.lastName }}</h4>
              </div>
              <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black border border-blue-100">
                {{ stats?.highestPurchaseUser?.owner?.firstName?.charAt(0) || '?' }}
              </div>
            </div>
            <div class="pt-3 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p class="text-[10px] font-medium text-gray-400">Total Spent</p>
                <p class="font-black text-gray-900">₦{{ (stats?.highestPurchaseUser?.totalSpent || 0).toLocaleString() }}</p>
              </div>
              <span class="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">Student</span>
            </div>
          </div>

          <!-- Highest Points -->
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Highest Points</p>
                <h4 class="font-bold text-gray-900 truncate mt-1 max-w-[150px]">{{ stats?.highestPointsUser?.firstName }} {{ stats?.highestPointsUser?.lastName }}</h4>
              </div>
              <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-black border border-amber-100">
                {{ stats?.highestPointsUser?.firstName?.charAt(0) || '?' }}
              </div>
            </div>
            <div class="pt-3 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p class="text-[10px] font-medium text-gray-400">Total Points</p>
                <p class="font-black text-gray-900">{{ (stats?.highestPointsUser?.points || 0).toLocaleString() }} pt</p>
              </div>
              <span class="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wide">Rewards</span>
            </div>
          </div>

          <!-- Top Vendor -->
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Vendor</p>
                <h4 class="font-bold text-gray-900 truncate mt-1 max-w-[150px]">{{ stats?.topVendor?.owner?.firstName }} {{ stats?.topVendor?.owner?.lastName }}</h4>
              </div>
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black border border-emerald-100">
                {{ stats?.topVendor?.owner?.firstName?.charAt(0) || '?' }}
              </div>
            </div>
            <div class="pt-3 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p class="text-[10px] font-medium text-gray-400">Total Earned</p>
                <p class="font-black text-gray-900">₦{{ (stats?.topVendor?.totalEarned || 0).toLocaleString() }}</p>
              </div>
              <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">Vendor</span>
            </div>
          </div>

          <!-- Top Errander -->
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div class="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Dispatcher</p>
                <h4 class="font-bold text-gray-900 truncate mt-1 max-w-[150px]">{{ stats?.topErrander?.owner?.firstName }} {{ stats?.topErrander?.owner?.lastName }}</h4>
              </div>
              <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black border border-indigo-100">
                {{ stats?.topErrander?.owner?.firstName?.charAt(0) || '?' }}
              </div>
            </div>
            <div class="pt-3 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p class="text-[10px] font-medium text-gray-400">Total Earned</p>
                <p class="font-black text-gray-900">₦{{ (stats?.topErrander?.totalEarned || 0).toLocaleString() }}</p>
              </div>
              <span class="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">Errander</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Ledger -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden min-h-[400px] shadow-sm">
      <div class="border-b border-gray-100 bg-gray-50/50">
        <div class="flex items-center justify-between p-4 pb-0 overflow-x-auto">
          <div class="flex items-center gap-6">
            <button @click="activeCategory = 'all'" :class="activeCategory === 'all' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] pb-4 font-bold' : 'text-gray-500 hover:text-gray-900 pb-4 font-semibold text-sm transition-colors'">All Transactions</button>
            <button @click="activeCategory = 'deposits'" :class="activeCategory === 'deposits' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] pb-4 font-bold' : 'text-gray-500 hover:text-gray-900 pb-4 font-semibold text-sm transition-colors'">Deposits</button>
            <button @click="activeCategory = 'withdrawals'" :class="activeCategory === 'withdrawals' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] pb-4 font-bold' : 'text-gray-500 hover:text-gray-900 pb-4 font-semibold text-sm transition-colors'">Withdrawals</button>
            <button @click="activeCategory = 'payout_requests'" :class="activeCategory === 'payout_requests' ? 'text-rose-600 border-b-2 border-rose-600 pb-4 font-bold flex items-center gap-2' : 'text-gray-500 hover:text-gray-900 pb-4 font-semibold text-sm transition-colors flex items-center gap-2'">
              Payout Requests
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>
          </div>
          <button class="mb-4 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md text-xs font-semibold text-gray-600 border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
            <ListFilter class="w-3 h-3" />
            Filter
          </button>
        </div>
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
            <tr class="bg-black text-white border-b border-gray-800">
              <th @click="sortBy('createdAt')" class="py-4 px-6 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white transition-colors group">
                <div class="flex items-center gap-1">Date <ArrowUp v-if="sortKey === 'createdAt' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'createdAt' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('user')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center gap-1">User <ArrowUp v-if="sortKey === 'user' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'user' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('amount')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center gap-1">Amount <ArrowUp v-if="sortKey === 'amount' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'amount' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('type')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap text-center cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center justify-center gap-1">Type <ArrowUp v-if="sortKey === 'type' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'type' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('status')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap text-center cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center justify-center gap-1">Status <ArrowUp v-if="sortKey === 'status' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'status' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('description')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center gap-1">Description <ArrowUp v-if="sortKey === 'description' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'description' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th @click="sortBy('reference')" class="py-4 px-5 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center gap-1">Reference <ArrowUp v-if="sortKey === 'reference' && sortOrder === 'asc'" class="w-3 h-3"/><ArrowDown v-if="sortKey === 'reference' && sortOrder === 'desc'" class="w-3 h-3"/></div>
              </th>
              <th class="py-4 px-6 font-bold text-gray-300 text-[10px] uppercase tracking-widest whitespace-nowrap text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-[#FF5C1A]/5 transition-colors group cursor-pointer border-b border-gray-50 last:border-0" @click="selectedTransaction = tx">
              <td class="py-4 px-6 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900">{{ new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                  <span class="text-[10px] font-semibold text-gray-500">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="py-4 px-5 min-w-[200px]">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-sm font-black border border-[#FF5C1A]/20 shrink-0">
                    {{ tx.wallet?.owner?.firstName?.[0] || 'U' }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 leading-tight mb-0.5 truncate">{{ tx.wallet?.owner?.firstName }} {{ tx.wallet?.owner?.lastName }}</p>
                    <p class="text-[10px] font-semibold text-gray-500 truncate">{{ tx.wallet?.owner?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-5">
                <div class="inline-flex items-center gap-2 pr-3 py-1.5 pl-1.5 bg-white border border-gray-100 rounded-lg shadow-sm group-hover:border-[#FF5C1A]/30 transition-all">
                  <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="w-6 h-6 border rounded-md flex items-center justify-center text-[11px] font-black shrink-0">
                    <ArrowDownLeft v-if="tx.type === 'credit'" class="w-3.5 h-3.5" />
                    <ArrowUpRight v-else class="w-3.5 h-3.5" />
                  </div>
                  <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'" class="text-sm font-black tabular-nums">
                    ₦{{ (tx.amount || 0).toLocaleString() }}
                  </p>
                </div>
              </td>
              <td class="py-4 px-5 text-center">
                <div class="flex flex-col items-center gap-1 justify-center">
                  <StatusBadge :status="tx.type" class="scale-90 origin-center" />
                  <span v-if="tx.actionType === 'manual'" class="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">Manual</span>
                </div>
              </td>
              <td class="py-4 px-5 text-center">
                <div class="flex justify-center">
                  <span :class="{
                    'bg-amber-50 text-amber-600 border-amber-200': tx.status === 'pending',
                    'bg-emerald-50 text-emerald-600 border-emerald-200': tx.status === 'completed',
                    'bg-rose-50 text-rose-600 border-rose-200': tx.status === 'failed',
                    'bg-gray-50 text-gray-600 border-gray-200': !tx.status
                  }" class="px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider">
                    {{ tx.status || 'completed' }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-5 max-w-[200px]">
                <div class="flex items-center gap-2">
                  <p class="text-[11px] font-semibold text-gray-700 truncate" :title="tx.description">{{ tx.description }}</p>
                  <a v-if="tx.proofOfTransaction" :href="tx.proofOfTransaction" target="_blank" @click.stop class="text-blue-500 hover:text-blue-700 bg-blue-50 p-1 rounded transition-colors shrink-0" title="View Receipt">
                    <ExternalLink class="w-3.5 h-3.5" />
                  </a>
                </div>
              </td>
              <td class="py-4 px-5">
                <p class="text-[11px] font-mono font-bold text-gray-600 truncate max-w-[120px] bg-gray-50 px-2 py-1 rounded">{{ tx.reference || (tx.order ? 'Order #' + tx.order.slice(-6) : 'N/A') }}</p>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
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
        <div class="flex flex-col items-center justify-center pt-4 pb-3 border-b border-gray-100 relative">
          <div class="absolute top-2 right-2" v-if="selectedTransaction.status">
            <span :class="{
              'bg-amber-100 text-amber-700': selectedTransaction.status === 'pending',
              'bg-emerald-100 text-emerald-700': selectedTransaction.status === 'completed',
              'bg-rose-100 text-rose-700': selectedTransaction.status === 'failed',
            }" class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {{ selectedTransaction.status }}
            </span>
          </div>

          <div class="relative mb-2 mt-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-black/20 border-2 border-gray-800">
              {{ selectedTransaction.wallet?.owner?.firstName?.[0] || 'U' }}
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <StatusBadge :status="selectedTransaction.type" class="scale-75" />
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 font-heading mb-0.5 mt-1">{{ selectedTransaction.wallet?.owner?.firstName }} {{ selectedTransaction.wallet?.owner?.lastName }}</h3>
          <p class="text-[10px] font-medium text-gray-500 mb-4 bg-gray-100 px-2 py-0.5 rounded-full">{{ selectedTransaction.wallet?.owner?.email }}</p>
          
          <div class="w-full px-4">
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-center shadow-lg relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Amount</p>
              <p :class="selectedTransaction.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'" class="text-2xl font-black mb-0.5 tabular-nums tracking-tight relative z-10">
                {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ (selectedTransaction.amount || 0).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-4 pb-24 bg-gray-50/50">
          <div class="space-y-2">
            <h4 class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
              <FileText class="w-3.5 h-3.5" />
              Transaction Details
            </h4>
            
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div class="flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <span class="text-[11px] font-semibold text-gray-500">Transaction ID</span>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold text-gray-900 font-mono select-all">{{ selectedTransaction._id }}</span>
                  <Copy class="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#FF5C1A] transition-all" />
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <span class="text-[11px] font-semibold text-gray-500">Date</span>
                <span class="text-[11px] font-bold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
              </div>

              <div class="flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <span class="text-[11px] font-semibold text-gray-500">Time</span>
                <span class="text-[11px] font-bold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</span>
              </div>
              
              <div class="p-3 bg-gray-50/50">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mb-0.5">Description</span>
                <p class="text-xs font-semibold text-gray-800 leading-snug">{{ selectedTransaction.description }}</p>
              </div>

              <div v-if="selectedTransaction.actionType" class="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <span class="text-[11px] font-semibold text-gray-500">Action Type</span>
                <span class="text-[11px] font-bold text-gray-900 capitalize">{{ selectedTransaction.actionType }}</span>
              </div>
              
              <div v-if="selectedTransaction.actionBy" class="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <span class="text-[11px] font-semibold text-gray-500">Action By (Admin ID)</span>
                <span class="text-[11px] font-bold text-gray-900 font-mono">{{ selectedTransaction.actionBy }}</span>
              </div>

              <div v-if="selectedTransaction.proofOfTransaction" class="p-3 border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mb-2">Proof of Transaction</span>
                <a :href="selectedTransaction.proofOfTransaction" target="_blank" class="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">
                  <ExternalLink class="w-3.5 h-3.5" />
                  View Receipt
                </a>
              </div>
            </div>
          </div>

          <div class="space-y-2" v-if="selectedTransaction.order || selectedTransaction.reference">
            <h4 class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
              <Package class="w-3.5 h-3.5" />
              Related Records
            </h4>

            <div class="grid grid-cols-1 gap-2">
              <div v-if="selectedTransaction.order" class="flex items-center justify-between p-3 rounded-lg border border-gray-100 shadow-sm bg-white cursor-pointer hover:border-[#FF5C1A]/30 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-[#FF5C1A]/10 flex items-center justify-center group-hover:bg-[#FF5C1A]/20 transition-colors">
                    <Package class="w-4 h-4 text-[#FF5C1A]" />
                  </div>
                  <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Linked Order</span>
                    <span class="text-xs font-black text-gray-900 font-mono">#{{ selectedTransaction.order.slice(-10) }}</span>
                  </div>
                </div>
                <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white text-gray-400 transition-colors">
                  <ChevronRight class="w-3 h-3" />
                </div>
              </div>
              
              <div v-if="selectedTransaction.reference" class="flex items-center justify-between p-3 rounded-lg border border-gray-100 shadow-sm bg-white">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <FileText class="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Payment Reference</span>
                    <span class="text-[11px] font-bold text-gray-900 font-mono">{{ selectedTransaction.reference }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payout Details & Metadata -->
          <div class="space-y-2" v-if="selectedTransaction.metadata && Object.keys(selectedTransaction.metadata).length > 0">
            <h4 class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
              <Sparkles class="w-3.5 h-3.5" />
              Metadata
            </h4>
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              <div class="flex justify-between items-center p-2.5 hover:bg-gray-50 transition-colors" v-for="(value, key) in selectedTransaction.metadata" :key="key">
                <span class="text-[10px] font-semibold text-gray-500 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
                <span class="text-[10px] font-bold text-gray-900 text-right truncate max-w-[200px]" :title="String(value)">{{ value }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="sticky bottom-0 -mx-6 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-20 flex flex-col gap-2">
            <template v-if="selectedTransaction.type === 'debit' && selectedTransaction.status === 'pending'">
              <button 
                @click="handleApprovePayout(selectedTransaction._id)" 
                class="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Approve (Auto Payout)
              </button>
              <button 
                @click="handleMarkAsPaid(selectedTransaction._id)" 
                class="w-full py-3 px-4 rounded-xl text-emerald-700 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-200"
              >
                Mark as Paid Manually
              </button>
              <button 
                @click="handleRejectPayout(selectedTransaction._id)" 
                class="w-full py-3 px-4 rounded-xl text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 border border-rose-200 mt-2"
              >
                Reject Payout
              </button>
            </template>
            <template v-else>
              <button @click="handleDownloadReceipt(selectedTransaction._id)" class="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gray-900 hover:bg-black shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Download class="w-4 h-4" /> Download Official Receipt
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
import { Download, Wallet, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, ArrowUp, ArrowDown, Search, ListFilter, ChevronRight, ChevronLeft, Copy, FileText, Package, Star, Calendar, Sparkles, UserPlus, ExternalLink, Info, Store, Truck, CreditCard } from 'lucide-vue-next';
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

const { stats, transactions, totalTransactions, currentPage, fetchTransactions, loading, fetchFinances, approvePayout, rejectPayout, markPayoutAsPaid, downloadReceipt, exportTransactions } = useAdminFinances();

const searchQuery = ref('');
const selectedTransaction = ref<any>(null);
const startDate = ref('');
const endDate = ref('');
const activeCategory = ref('all');

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

const sortKey = ref('');
const sortOrder = ref<'asc' | 'desc'>('desc');

const buildQuery = () => {
  const query: any = {
    search: searchQuery.value,
    startDate: startDate.value,
    endDate: endDate.value,
    sortBy: sortKey.value,
    sortOrder: sortOrder.value
  };

  if (activeCategory.value === 'deposits') {
    query.type = 'credit';
  } else if (activeCategory.value === 'withdrawals') {
    query.type = 'debit';
  } else if (activeCategory.value === 'payout_requests') {
    query.category = 'payout_requests';
  }

  return query;
};

const triggerExport = async () => {
  await exportTransactions(buildQuery());
};

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

watch([searchQuery, startDate, endDate, sortKey, sortOrder, activeCategory], () => {
  // Reset to page 1 on filter change
  fetchTransactions(1, 50, buildQuery());
}, { deep: true });

const filteredTransactions = computed(() => transactions.value);

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
  await fetchTransactions(page, 50, buildQuery());
};

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
});

onMounted(() => {
  fetchFinances(); // Initial load
});
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
