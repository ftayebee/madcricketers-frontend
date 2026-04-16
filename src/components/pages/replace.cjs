const fs = require('fs');
const file = 'd:/000 PERSONAL XAMPP/00-PROJECTS/00-MADCRICKETERS-CODEBASE/madcricketers-frontend/src/components/pages/MatchDetail.vue';
let content = fs.readFileSync(file, 'utf8');
const startMarker = '<!-- Scoreboard Hero Redesign -->';
const endMarker = '<!-- Context strip: result / toss / target message -->';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `<!-- Scoreboard Hero Redesign -->
                    <div class="pb-5">
                        
                        <div class="flex flex-col gap-4">
                            <!-- Team A Row -->
                            <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10"
                                :class="{'ring-1 ring-emerald-400': currentInnings?.batting_team_id === match.team_a?.id}">
                                <!-- LEFT: TEAM INFO -->
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                        <img v-if="match.team_a?.logo && !match.team_a.logo.includes('team-dummy')" 
                                            :src="match.team_a.logo" 
                                            @error="onImageError($event)"
                                            class="w-full h-full object-cover"/>
                                        <span v-else class="text-white font-bold text-sm">
                                            {{ getTeamAbbreviation(match.team_a?.name) }}
                                        </span>
                                    </div>
                                    <p class="text-white text-lg font-bold m-0 leading-tight">
                                        {{ match.team_a?.name }}
                                        <span v-if="currentInnings?.batting_team_id === match.team_a?.id" class="text-xs text-emerald-400 block mt-0.5 tracking-wider uppercase">Batting</span>
                                    </p>
                                </div>
                                <!-- RIGHT: SCORE INFO -->
                                <div class="text-right">
                                    <template v-if="teamScoreDisplay('team_a')">
                                        <p class="text-2xl font-extrabold m-0 leading-none text-white">
                                            {{ teamScoreDisplay('team_a').score }}
                                        </p>
                                        <p class="text-slate-400 text-sm font-medium m-0 mt-1">
                                            ({{ teamScoreDisplay('team_a').overs }} ov)
                                        </p>
                                    </template>
                                    <p v-else class="text-slate-500 text-sm italic m-0">Yet to bat</p>
                                </div>
                            </div>

                            <!-- Team B Row -->
                            <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10"
                                :class="{'ring-1 ring-emerald-400': currentInnings?.batting_team_id === match.team_b?.id}">
                                <!-- LEFT: TEAM INFO -->
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                        <img v-if="match.team_b?.logo && !match.team_b.logo.includes('team-dummy')" 
                                            :src="match.team_b.logo" 
                                            @error="onImageError($event)"
                                            class="w-full h-full object-cover"/>
                                        <span v-else class="text-white font-bold text-sm">
                                            {{ getTeamAbbreviation(match.team_b?.name) }}
                                        </span>
                                    </div>
                                    <p class="text-white text-lg font-bold m-0 leading-tight">
                                        {{ match.team_b?.name }}
                                        <span v-if="currentInnings?.batting_team_id === match.team_b?.id" class="text-xs text-emerald-400 block mt-0.5 tracking-wider uppercase">Batting</span>
                                    </p>
                                </div>
                                <!-- RIGHT: SCORE INFO -->
                                <div class="text-right">
                                    <template v-if="teamScoreDisplay('team_b')">
                                        <p class="text-2xl font-extrabold m-0 leading-none text-white">
                                            {{ teamScoreDisplay('team_b').score }}
                                        </p>
                                        <p class="text-slate-400 text-sm font-medium m-0 mt-1">
                                            ({{ teamScoreDisplay('team_b').overs }} ov)
                                        </p>
                                    </template>
                                    <p v-else class="text-slate-500 text-sm italic m-0">Yet to bat</p>
                                </div>
                            </div>
                        </div>

                        <!-- CRR | RRR | TARGET | PROJECTED | WIN PROB -->
                        <div v-if="match.status === 'live' && isInningsStarted" class="flex flex-wrap justify-between items-center bg-white/10 border border-white/10 rounded-lg p-3 mt-4 text-sm font-medium">
                            <div class="flex flex-wrap gap-4">
                                <span class="text-white"><span class="text-slate-400">CRR:</span> {{ getCurrentRunRateVal().toFixed(2) }}</span>
                                <span v-if="isSecondInnings" class="text-white"><span class="text-slate-400">RRR:</span> {{ getRequiredRunRate() }}</span>
                                <span v-if="isSecondInnings" class="text-yellow-400">Target: {{ getTarget() }}</span>
                                <span v-if="!isSecondInnings" class="text-white"><span class="text-slate-400">Projected:</span> {{ getProjectedScore() }}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-3 w-full sm:mt-0 sm:w-auto">
                                <span class="text-slate-400 text-xs uppercase tracking-wider hidden sm:inline">Win Prob:</span>
                                <div class="flex items-center gap-2 text-xs w-full sm:w-auto">
                                     <span class="text-white min-w-[30px] text-right">{{ getTeamAbbreviation(match.team_a?.name) }} {{ computedWinProbability.team_a }}%</span>
                                     <div class="w-full sm:w-24 h-1.5 bg-rose-500 rounded-full flex overflow-hidden">
                                          <div class="h-full bg-blue-500 transition-all duration-500" :style="{width: computedWinProbability.team_a + '%'}"></div>
                                     </div>
                                     <span class="text-white min-w-[30px]">{{ getTeamAbbreviation(match.team_b?.name) }} {{ computedWinProbability.team_b }}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Runs Needed Eqn -->
                        <div v-if="isSecondInnings && match.status === 'live'" class="mt-3 text-center">
                            <p class="text-emerald-400 font-semibold m-0 bg-white/5 border border-white/10 rounded-lg py-2">{{ getRunsNeededMessage() }}</p>
                        </div>
                    </div>

                    `;
    fs.writeFileSync(file, content.slice(0, startIndex) + replacement + content.slice(endIndex));
    console.log('Replaced successfully');
} else {
    console.log('Markers not found');
}
