import Image from "next/image";
import Card from "./Card";
import { SkeletonBox, SkeletonText, SkeletonAvatar, SkeletonHeatmap, SkeletonStatCard, SkeletonCard } from "./Skeleton";

interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  language: string | null;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  stargazers_count: number;
}

interface Skill {
  name: string;
  proficiency: number; // 0-100
  icon?: string;
  category?: string;
  imgUrl?: string;
  docUrl?: string;
}

interface GithubCardProps {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  learned?: Skill[];
  practicing?: Skill[];
  isLoading?: boolean;
  error?: string | null;
}

interface ContributionCell {
  date: string;
  count: number;
}

interface ContributionSnapshot {
  weeks: ContributionCell[][];
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
}

const CONTRIBUTION_DAYS = 42;

const buildContributionSnapshot = (repos: GitHubRepo[]): ContributionSnapshot => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: ContributionCell[] = Array.from({ length: CONTRIBUTION_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (CONTRIBUTION_DAYS - 1 - index));
    return { date: date.toISOString().split("T")[0], count: 0 };
  });

  const dayMap = new Map(days.map((item) => [item.date, item]));

  repos.forEach((repo) => {
    const updated = new Date(repo.updated_at);
    updated.setHours(0, 0, 0, 0);
    const key = updated.toISOString().split("T")[0];
    const slot = dayMap.get(key);

    if (slot) {
      const weight = 1 + Math.min(3, Math.floor((repo.description?.length || repo.name.length) / 40));
      slot.count += weight;
    }
  });

  const counts = days.map((day) => day.count);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const activeDays = counts.filter((count) => count > 0).length;

  let longestStreak = 0;
  let rollingStreak = 0;
  counts.forEach((count) => {
    if (count > 0) {
      rollingStreak += 1;
      longestStreak = Math.max(longestStreak, rollingStreak);
    } else {
      rollingStreak = 0;
    }
  });

  let currentStreak = 0;
  for (let i = counts.length - 1; i >= 0; i -= 1) {
    if (counts[i] > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const weeks: ContributionCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return {
    weeks,
    total,
    activeDays,
    currentStreak,
    longestStreak,
  };
};

const getHeatClass = (value: number) => {
  if (value === 0) return "bg-slate-200/70";
  if (value === 1) return "bg-emerald-200/80";
  if (value === 2) return "bg-emerald-300/80";
  if (value === 3) return "bg-emerald-500/80";
  return "bg-emerald-600";
};

const getHeatBgClass = (value: number) => {
  if (value === 0) return "bg-[var(--heatmap-empty)]";
  if (value === 1) return "bg-[var(--heatmap-low)]";
  if (value === 2) return "bg-[var(--heatmap-medium)]";
  if (value === 3) return "bg-[var(--heatmap-high)]";
  return "bg-[var(--heatmap-max)]";
};

const formatRelativeTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const diff = Date.now() - date.getTime();

  const units = [
    { label: "年", value: 1000 * 60 * 60 * 24 * 365 },
    { label: "月", value: 1000 * 60 * 60 * 24 * 30 },
    { label: "天", value: 1000 * 60 * 60 * 24 },
    { label: "小时", value: 1000 * 60 * 60 },
    { label: "分钟", value: 1000 * 60 },
  ];

  for (const unit of units) {
    if (diff >= unit.value) {
      const count = Math.floor(diff / unit.value);
      return `${count}${unit.label}前`;
    }
  }

  return "刚刚更新";
};

// 获取编程语言的常见颜色（GitHub 风格）
const getLanguageColor = (language: string | null): string => {
  if (!language) return "bg-gray-500";

  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-500",
    Python: "bg-blue-600",
    Java: "bg-orange-500",
    "C++": "bg-blue-700",
    C: "bg-gray-600",
    "C#": "bg-purple-600",
    Go: "bg-cyan-500",
    Rust: "bg-orange-600",
    PHP: "bg-indigo-500",
    Ruby: "bg-red-500",
    Swift: "bg-orange-400",
    Kotlin: "bg-purple-500",
    HTML: "bg-orange-500",
    CSS: "bg-blue-500",
    Vue: "bg-green-500",
    React: "bg-cyan-400",
    Shell: "bg-gray-400",
    Dockerfile: "bg-blue-400",
  };

  return colors[language] || "bg-gray-500";
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

  return (
    <div
      className={`group relative overflow-hidden flex items-center justify-between gap-4 rounded-2xl border border-white/40 bg-gradient-to-br ${preset.backgroundClass} p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200/70 hover:shadow-xl ${preset.glowClass}`}
    >
      {/* logo衬托层 */}
      <div className="absolute inset-0 mt-15 z-0 flex items-center justify-start opacity-30">
        {skill.imgUrl && (
          <Image src={skill.imgUrl} alt={skill.name} width={200} height={300} />
        )}
      </div>
      {/* 技能名称 */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <button className="flex items-center gap-3" onClick={() => skill.docUrl && window.open(skill.docUrl, "_blank")}>
          <p className="font-bold text-2xl text-[var(--text-primary)]">{skill.name}</p>
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

export default function GithubCard({ user, repos = [], learned = [], practicing = [], isLoading = false, error = null }: GithubCardProps) {
  const contribution = buildContributionSnapshot(repos);
  const sortedRepos = [...repos].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  const highlightedRepos = sortedRepos.slice(0, 3);

  // 使用默认值或实际值
  const displayUser = user || {
    avatar_url: "",
    name: "",
    login: "",
    bio: null,
    followers: 0,
    following: 0,
    public_repos: 0,
  };

  const statBlocks = [
    {
      label: "Followers",
      caption: "关注者",
      value: displayUser.followers.toLocaleString(),
      accent: "text-blue-600",
    },
    {
      label: "Following",
      caption: "关注中",
      value: displayUser.following.toLocaleString(),
      accent: "text-purple-600",
    },
    {
      label: "Public Repos",
      caption: "公开项目",
      value: displayUser.public_repos.toLocaleString(),
      accent: "text-emerald-600",
    },
    {
      label: "Activity",
      caption: "近 6 周活跃",
      value: (contribution.total || repos.length).toLocaleString(),
      accent: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 错误提示 */}
      {error && (
        <div className="flex items-center justify-center w-full max-w-xl p-4 rounded-xl bg-[var(--error-bg)] border-[var(--error-border)]">
          <p className="text-sm text-[var(--error-text)]">{error}</p>
        </div>
      )}

      {/* 用户信息区域 */}
      <header className="flex items-center gap-6 text-center ">
        {/* 头像区域 */}
        <div className="relative">
          <div className="absolute inset-0 -m-4 rounded-3xl " />
          <div className="relative overflow-hidden rounded-3xl border">
            {isLoading || !user ? (
              <SkeletonAvatar size="xl" />
            ) : (
              <Image
                src={displayUser.avatar_url}
                alt={`${displayUser.name || displayUser.login} 的头像`}
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* 用户信息区域 */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col flex-wrap content-center gap-3 ">
            {isLoading || !user ? (
              <>
                <SkeletonText width="w-48" height="h-8" />
                <SkeletonText width="w-24" height="h-6" />
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-white">
                  {displayUser.name || displayUser.login}
                </h2>
                <span className="rounded-full border border-slate-200/80 px-3 py-1 text-sm text-muted">
                  @{displayUser.login}
                </span>
              </>
            )}
          </div>
          {/* 社交按钮区域 */}
          <div className="flex flex-col gap-3 items-center justify-center max-w-45 m-auto">
            {/* GitHub 按钮 */}
            <button
              className="w-full group flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => window.open("https://github.com/Azuxa616", "_blank")}
              disabled={isLoading}
            >
              <Image
                src="/svgs/github.svg"
                alt="github"
                width={20}
                height={20}
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span>访问 GitHub</span>
            </button>
            {/* Gitee 按钮 */}
            <button
              className="w-full group flex items-center gap-3 bg-gradient-to-r from-[#d81e06] to-[#c0392b] hover:from-[#c0392b] hover:to-[#a93226] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => window.open("https://gitee.com/Azuxa616", "_blank")}
            >
              <Image
                src="/svgs/gitee.svg"
                alt="gitee"
                width={20}
                height={20}
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span>访问 Gitee</span>
            </button>
          </div>

        </div>
        {/* 提交热力图区域 */}
        <div className="rounded-2xl border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-inner">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">近 6 周提交热力图</p>
              {isLoading || !user ? (
                <SkeletonText width="w-32" height="h-3" className="mt-1" />
              ) : (
                <p className="text-xs text-slate-500">
                  活跃天数 {contribution.activeDays} / {CONTRIBUTION_DAYS}
                </p>
              )}
            </div>
            {isLoading || !user ? (
              <SkeletonBox className="h-6 w-20 rounded-full" />
            ) : (
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-[var(--badge-emerald-bg)] text-[var(--badge-emerald-text)]">
                {contribution.total} 次互动
              </span>
            )}
          </div>
          <div className="flex gap-1 ">
            {isLoading || !user ? (
              <SkeletonHeatmap weeks={6} daysPerWeek={7} />
            ) : (
              contribution.weeks.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <span
                      key={day.date}
                      className={`h-5 w-5 rounded-sm transition-colors ${getHeatClass(day.count)} ${getHeatBgClass(day.count)}`}
                      title={`${day.date} · ${day.count || "暂无"} 次活动`}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

        </div>
        {/* 统计信息区域 */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading || !user ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonStatCard key={`skeleton-stat-${index}`} />
            ))
          ) : (
            statBlocks.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-center shadow-sm backdrop-blur"
              >
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  {stat.label}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.caption}</p>
              </div>
            ))
          )}
        </div>
      </header>
      {/* 技能+仓库区域 */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom_right,var(--card-gradient-from),var(--card-gradient-via),var(--card-gradient-to))]">
        <Card
          showBottomGradient={true}
          className="relative w-full overflow-hidden "
        >
        <div className="flex w-full  gap-8">
          {/* 技术力雷达区域 */}
          {(learned.length > 0 || practicing.length > 0) && (
            <div>
              <header className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-secondary">
                  Skill Orbit
                </p>
                <h2 className="text-3xl font-semibold text-[var(--text-primary)]">技术力雷达</h2>
              </header>
              <div className="flex flex-col">
                {learned.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex gap-2">
                      <span className="font-serif font-bold text-5xl text-[#34d399]">S</span>
                      <div className="flex flex-col items-start text-sm font-semibold">
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
                )}

                {practicing.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex gap-2">
                      <span className="font-serif font-bold text-5xl text-[#fb923c]">Q</span>
                      <div className="flex flex-col items-start text-sm font-semibold">
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
                )}
              </div>

            </div>
          )}

          {/* 精选仓库区域 */}
          <section className="rounded-2xl border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">精选仓库</p>
              {isLoading || !user ? (
                <SkeletonText width="w-16" height="h-3" />
              ) : (
                <span className="text-xs text-slate-500">{repos.length} 个项目</span>
              )}
            </div>
            <ul className="space-y-3">
              {isLoading || !user || highlightedRepos.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={`skeleton-repo-${index}`}
                    className="rounded-2xl border-[var(--card-border)] bg-[var(--card-bg-stronger)] p-4"
                  >
                    <div className="flex flex-col gap-2">
                      {/* 标题和时间 */}
                      <div className="flex items-center justify-between gap-2">
                        <SkeletonText width="w-32" height="h-5" />
                        <SkeletonText width="w-16" height="h-3" />
                      </div>
                      {/* 描述 */}
                      <SkeletonText width="w-full" height="h-4" />
                      <SkeletonText width="w-3/4" height="h-4" />
                      {/* 语言标签骨架 */}
                      <div className="flex items-center gap-2">
                        <SkeletonBox className="h-3 w-3 rounded-full" />
                        <SkeletonText width="w-16" height="h-3" />
                      </div>
                      {/* 底部信息栏骨架 */}
                      <div className="flex flex-wrap gap-2">
                        <SkeletonBox className="h-5 w-16 rounded-full" />
                        <SkeletonBox className="h-5 w-20 rounded-full" />
                        <SkeletonBox className="h-5 w-20 rounded-full" />
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                highlightedRepos.map((repo) => (
                  <li
                    key={repo.id}
                    className="group rounded-2xl border-[var(--card-border)] bg-[var(--card-bg-stronger)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/70 hover:shadow-lg"
                  >
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold transition-colors group-hover:text-blue-600 text-[var(--text-primary)]">
                          {repo.name}
                        </p>
                        <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(repo.updated_at)}</span>
                      </div>
                      {repo.description && (
                        <p className="text-sm leading-relaxed line-clamp-2 text-[var(--text-secondary)]">
                          {repo.description}
                        </p>
                      )}
                      {/* 语言标签 */}
                      {repo.language && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-3 w-3 rounded-full ${getLanguageColor(repo.language)}`}
                            aria-label={`编程语言: ${repo.language}`}
                          />
                          <span className="text-xs text-[var(--text-muted)]">{repo.language}</span>
                        </div>
                      )}
                      {/* 底部信息栏：星标、许可证、最近活跃 */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* 星标数 */}
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-[var(--badge-amber-bg)] text-[var(--badge-amber-text)]">
                          <svg
                            className="h-3 w-3 fill-current"
                            viewBox="0 0 16 16"
                            aria-label="星标"
                          >
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                          </svg>
                          <span>{repo.stargazers_count.toLocaleString()}</span>
                        </span>
                        {/* 许可证 */}
                        {repo.license && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-[var(--badge-slate-bg)] text-[var(--badge-slate-text)]">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-label="许可证"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>{repo.license.spdx_id === "NOASSERTION" ? repo.license.name : repo.license.spdx_id}</span>
                          </span>
                        )}
                        <span className="opacity-0 transition-opacity group-hover:opacity-100 text-[var(--badge-blue-text)]">点击查看 →</span>
                      </div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </Card>
      </div>
    </div>

  );
}
