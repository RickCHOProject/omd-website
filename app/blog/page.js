import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import styles from './blog.module.css';

export const metadata = {
  title: 'Blog | Off Market Daily',
  description: 'Real estate investing insights, market analysis, and off-market deal strategies from Off Market Daily.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Page header */}
        <div className={styles.header}>
          <div className={styles.pageTag}>
            <div className={styles.bar}></div>
            <span>Intelligence</span>
          </div>
          <h1 className={styles.title}>The Off Market Daily Blog</h1>
          <p className={styles.subtitle}>
            Market insights, investing strategies, and real numbers for real estate investors.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Posts coming soon.</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.postCard}
              >
                <div className={styles.postMeta}>
                  {post.tag && (
                    <span className={styles.tag}>{post.tag}</span>
                  )}
                  <span className={styles.date}>{post.date}</span>
                  {post.readTime && (
                    <span className={styles.readTime}>· {post.readTime}</span>
                  )}
                </div>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
