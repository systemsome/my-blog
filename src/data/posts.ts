import type { BlogPost } from '../types/blog';

/**
 * 示例博客文章数据
 * NOTE: 使用丰富的中文内容展示真实博客效果
 */
export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: '探索 React 18 的并发特性',
        excerpt: '深入了解 React 18 带来的并发渲染、自动批处理和 Suspense 改进，让你的应用更加流畅。',
        content: `
## React 18 的革命性更新

React 18 引入了全新的并发渲染机制，这是 React 架构的一次重大升级。

### 并发渲染

并发渲染允许 React 在后台准备多个 UI 版本，而不会阻塞主线程。这意味着：

- 更流畅的用户交互
- 更好的响应性
- 优先处理紧急更新

### 自动批处理

React 18 扩展了自动批处理的范围，现在包括：

\`\`\`typescript
// 所有这些状态更新都会自动批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会重新渲染一次！
}, 1000);
\`\`\`

### useTransition Hook

新的 \`useTransition\` Hook 让你可以将某些更新标记为非紧急：

\`\`\`typescript
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  // 紧急更新：显示用户输入
  setInputValue(e.target.value);
  
  // 非紧急更新：搜索结果
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
}
\`\`\`

这些特性让 React 应用能够更智能地管理 UI 更新，为用户提供更好的体验。
    `,
        author: '张三',
        date: '2026-01-08',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        tags: ['React', 'JavaScript', '前端开发'],
        readTime: 8
    },
    {
        id: '2',
        title: 'TypeScript 高级类型技巧',
        excerpt: '掌握条件类型、映射类型和模板字面量类型，写出更强大的类型定义。',
        content: `
## TypeScript 类型体操

TypeScript 的类型系统非常强大，让我们来探索一些高级技巧。

### 条件类型

条件类型让你可以根据条件选择类型：

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<number>;   // false
\`\`\`

### 映射类型

映射类型可以基于现有类型创建新类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

### 模板字面量类型

TypeScript 4.1 引入的模板字面量类型非常强大：

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>; // 'onClick'
type HoverEvent = EventName<'hover'>; // 'onHover'
\`\`\`

### infer 关键字

使用 \`infer\` 可以在条件类型中推断类型：

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return 'Hello';
}

type GreetReturn = ReturnType<typeof greet>; // string
\`\`\`

掌握这些技巧，你就能写出更加健壮和可维护的 TypeScript 代码！
    `,
        author: '李四',
        date: '2026-01-06',
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
        tags: ['TypeScript', '类型系统', '前端开发'],
        readTime: 10
    },
    {
        id: '3',
        title: '现代 CSS 布局技巧',
        excerpt: '从 Flexbox 到 Grid，再到 Container Queries，掌握现代 CSS 布局的精髓。',
        content: `
## CSS 布局的现代艺术

CSS 布局在过去几年有了翻天覆地的变化，让我们来看看最新的技巧。

### CSS Grid 布局

Grid 是二维布局的终极解决方案：

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

### Flexbox 进阶

Flexbox 在一维布局中依然强大：

\`\`\`css
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

### Container Queries

容器查询是响应式设计的未来：

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

### CSS 变量与计算

结合变量和 calc() 实现动态样式：

\`\`\`css
:root {
  --spacing-unit: 8px;
  --card-padding: calc(var(--spacing-unit) * 3);
}

.card {
  padding: var(--card-padding);
}
\`\`\`

这些现代 CSS 技巧让布局变得更加简单和强大！
    `,
        author: '王五',
        date: '2026-01-04',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        tags: ['CSS', '布局', 'Web 设计'],
        readTime: 6
    },
    {
        id: '4',
        title: '构建高性能 Web 应用',
        excerpt: '从代码分割到缓存策略，全面提升你的 Web 应用性能。',
        content: `
## Web 性能优化指南

性能是用户体验的核心，让我们来看看如何构建高性能的 Web 应用。

### 代码分割

使用动态导入实现代码分割：

\`\`\`typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### 图片优化

现代图片格式和懒加载：

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" loading="lazy" alt="描述" />
</picture>
\`\`\`

### 缓存策略

合理使用缓存提升加载速度：

\`\`\`javascript
// Service Worker 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
\`\`\`

### 性能监控

使用 Web Vitals 监控核心指标：

\`\`\`typescript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
\`\`\`

持续关注和优化性能，才能为用户提供最佳体验！
    `,
        author: '赵六',
        date: '2026-01-02',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        tags: ['性能优化', 'Web 开发', '最佳实践'],
        readTime: 12
    }
];
