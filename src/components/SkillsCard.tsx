import Card from "./Card";
import Image from "next/image";
interface Skill {
    name: string;
    proficiency: number; // 0-100
    icon?: string;
    category?: string;
    imgUrl?: string;
    docUrl?: string;
}

interface SkillsCardProps {
    learned: Skill[];
    practicing: Skill[];
}

const getProficiencyLabel = (value: number) => {
    if (value >= 90) return "精通";
    if (value >= 70) return "熟练";
    if (value >= 50) return "掌握";
    if (value >= 30) return "了解";
    return "入门";
};

const buildGaugeStyle = (value: number, color: string) => {
    const safeValue = Math.max(6, Math.min(100, value));
    return {
        background: `conic-gradient(${color} ${safeValue * 3.6}deg, rgba(148, 163, 184, 0.2) 0deg)`,
    };
};

const tonePresets = {
    mastery: {
        gaugeColor: "#34d399",
        badgeClass: "text-emerald-600",
        glowClass: "shadow-[0_15px_35px_-15px_rgba(16,185,129,0.7)]",
        backgroundClass: "from-emerald-50/80 via-white/70 to-teal-50/70 bg-[linear-gradient(to_bottom_right,var(--skill-mastery-from),var(--skill-mastery-via),var(--skill-mastery-to))]",
        trackActiveClass: "bg-emerald-200 bg-[var(--skill-mastery-track)]",
    },
    growth: {
        gaugeColor: "#fb923c",
        badgeClass: "text-amber-600",
        glowClass: "shadow-[0_15px_35px_-15px_rgba(251,146,60,0.65)]",
        backgroundClass: "from-amber-50/80 via-white/70 to-orange-50/70 bg-[linear-gradient(to_bottom_right,var(--skill-growth-from),var(--skill-growth-via),var(--skill-growth-to))]",
        trackActiveClass: "bg-amber-200 bg-[var(--skill-growth-track)]",
    },
};

const SkillOrbit = ({
    skill,
    tone,
}: {
    skill: Skill;
    tone: keyof typeof tonePresets;
}) => {
    const preset = tonePresets[tone];
    const totalPhases = 4;
    const activePhases = Math.max(1, Math.ceil((skill.proficiency / 100) * totalPhases));

    return (
        <div
            className={`group relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border border-white/40 bg-gradient-to-br ${preset.backgroundClass} p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200/70 hover:shadow-xl ${preset.glowClass}`}
        >
            {/* logo衬托层 */}
            <div className="absolute inset-0 mt-15 z-0 flex items-center justify-start  opacity-30">
                {skill.imgUrl && (
                    <Image src={skill.imgUrl} alt={skill.name} width={200} height={300} />
                )}
            </div>
            {/* 技能名称 */}
            <div className="relative z-10 flex items-start justify-between gap-3">
                <button className="flex items-center gap-3" onClick={() => window.open(skill.docUrl, "_blank")}>
                    <p className=" font-bold text-2xl text-[var(--text-primary)]">{skill.name}</p>
                </button>
            </div>
            {/* 技能饼图 */}
            <div className="relative z-10 flex items-center gap-4 h-16 w-16">
                <div
                    className="absolute inset-0 rounded-full border-[var(--card-border)] bg-[var(--card-bg-strong)]"
                    style={buildGaugeStyle(skill.proficiency, preset.gaugeColor)}
                />
                <div className="absolute inset-1 flex flex-col items-center justify-center rounded-full text-center text-xl font-semibold shadow-inner bg-[var(--card-bg-stronger)] text-[var(--text-primary)]">
                    {skill.proficiency}%
                </div>
            </div>
        </div>
    );
};

export default function SkillsCard({ learned, practicing }: SkillsCardProps) {
    const totalSkills = learned.length + practicing.length;
    const averageProficiency =
        totalSkills === 0
            ? 0
            : Math.round(
                [...learned, ...practicing].reduce((sum, skill) => sum + skill.proficiency, 0) /
                totalSkills,
            );

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom_right,var(--card-gradient-from),var(--card-gradient-via),var(--card-gradient-to))]">
            <Card
                showBottomGradient={true}
                className="relative w-full overflow-hidden bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/60"
            >
            <div className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full blur-[140px] bg-[var(--blur-bg)]" />
            <div className="flex w-full flex-col gap-8">
                <header className="space-y-3 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-[var(--text-subtle)]">
                        Skill Orbit
                    </p>
                    <h2 className="text-3xl font-semibold text-[var(--text-primary)]">技术力雷达</h2>
                </header>

                <section className=" space-y-4">
                    <div className="flex gap-2">
                        <span className="font-serif font-bold text-5xl text-[#34d399]">S</span>
                        <div className="flex flex-col items-start  text-sm font-semibold">
                            <p className="text-xl text-[#34d399]">tack</p>
                            <p className="text-xs font-normal text-slate-500">已掌握的技术</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {learned.map((skill, index) => (
                            <SkillOrbit key={`learned-${skill.name}-${index}`} skill={skill} tone="mastery" />
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex gap-2">
                        <span className="font-serif font-bold text-5xl text-[#fb923c]">Q</span>
                        <div className="flex flex-col items-start  text-sm font-semibold">
                            <p className="text-xl text-[#fb923c]">ueue</p>
                            <p className="text-xs font-normal text-slate-500">学习中的技术</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {practicing.map((skill, index) => (
                            <SkillOrbit key={`practice-${skill.name}-${index}`} skill={skill} tone="growth" />
                        ))}
                    </div>
                </section>
            </div>
        </Card>
        </div>
    );
}
