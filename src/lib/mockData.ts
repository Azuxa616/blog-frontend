export interface BlogItemData {
    layout: "normal" | "reverse";
    coverImage: string;
    title: string;
    description: string;
    category: string;
    publishDate: string;
    viewCount?: number;
}

export const mockBlogData: BlogItemData[] = [
    {
        layout: "normal",
        coverImage: "/imgs/404.jpg",
        title: "现代前端开发的最佳实践",
        description: "探讨React、Vue和Angular等主流前端框架的最佳实践，包括组件设计、状态管理、性能优化等方面的经验分享。",
        category: "前端开发",
        publishDate: "2024-01-15",
        viewCount: 1234
    },
    {
        layout: "reverse",
        coverImage: "/imgs/404.jpg",
        title: "TypeScript高级特性深度解析",
        description: "详细介绍TypeScript的高级类型特性，包括条件类型、映射类型、模板字面量类型等，帮助开发者更好地利用类型系统。",
        category: "TypeScript",
        publishDate: "2024-01-12",
        viewCount: 987
    },
    {
        layout: "normal",
        coverImage: "/imgs/404.jpg",
        title: "Node.js微服务架构设计",
        description: "分享微服务架构的设计思路，包括服务拆分、API网关、负载均衡、服务发现等关键技术点的实践经验。",
        category: "后端开发",
        publishDate: "2024-01-10",
        viewCount: 2156
    },
    {
        layout: "reverse",
        coverImage: "/imgs/404.jpg",
        title: "CSS Grid布局完全指南",
        description: "全面介绍CSS Grid布局系统，包括基本概念、属性详解、实际应用案例，帮助开发者掌握现代布局技术。",
        category: "CSS",
        publishDate: "2024-01-08",
        viewCount: 876
    },
    {
        layout: "normal",
        coverImage: "/imgs/404.jpg",
        title: "Docker容器化部署实战",
        description: "从零开始学习Docker容器化技术，包括Dockerfile编写、多容器应用编排、CI/CD集成等实用技能。",
        category: "DevOps",
        publishDate: "2024-01-05",
        viewCount: 1543
    },
    {
        layout: "reverse",
        coverImage: "/imgs/404.jpg",
        title: "React性能优化深度指南",
        description: "深入探讨React应用的性能优化技巧，包括虚拟化、代码分割、懒加载、memoization等高级技术。",
        category: "React",
        publishDate: "2024-01-03",
        viewCount: 3241
    },
    {
        layout: "normal",
        coverImage: "/imgs/404.jpg",
        title: "JavaScript异步编程精讲",
        description: "详细解析JavaScript异步编程的发展历程，从回调地狱到Promise，再到async/await的演进过程。",
        category: "JavaScript",
        publishDate: "2024-01-01",
        viewCount: 4567
    },
    {
        layout: "reverse",
        coverImage: "/imgs/404.jpg",
        title: "数据库设计原则与实践",
        description: "探讨关系型数据库和NoSQL数据库的设计原则，包括范式化、索引优化、查询性能等方面的最佳实践。",
        category: "数据库",
        publishDate: "2023-12-28",
        viewCount: 2134
    }
];

// 分类统计数据
export const categoryStats = {
    "前端开发": 2,
    "TypeScript": 1,
    "后端开发": 1,
    "CSS": 1,
    "DevOps": 1,
    "React": 1,
    "JavaScript": 1,
    "数据库": 1
};

// 按分类筛选博客数据
export function getBlogsByCategory(category: string): BlogItemData[] {
    return mockBlogData.filter(blog => blog.category === category);
}

// 获取最新博客（按发布时间排序）
export function getLatestBlogs(count: number = 6): BlogItemData[] {
    return [...mockBlogData]
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, count);
}

// 获取热门博客（按浏览量排序）
export function getPopularBlogs(count: number = 6): BlogItemData[] {
    return [...mockBlogData]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, count);
}
