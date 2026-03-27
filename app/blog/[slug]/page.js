import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '../../../lib/posts';
import styles from './post.module.css';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: `${post.title} | Off Market Daily`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Back link */}
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        {/* Post header */}
        <div className={styles.header}>
          <div className={styles.postMeta}>
            {post.tag && (
              <span className={styles.tag}>{post.tag}</span>
            )}
            <span className={styles.date}>{post.date}</span>
            {post.readTime && (
              <span className={styles.readTime}>· {post.readTime}</span>
            )}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          {post.subtitle && (
            <p className={styles.subtitle}>{post.subtitle}</p>
          )}
        </div>

        {/* Post content */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* CTA */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaTitle}>
            Get Off Market Deals Sent to You
          </h3>
          <p className={styles.ctaDescription}>
            Get first access to investment properties with real margins.
          </p>
          <Link
            href="/#signup"
            className={styles.ctaButton}
          >
            Get Intel
          </Link>
        </div>
      </div>
    </div>
  );
}
