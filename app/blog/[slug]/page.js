import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '../../../lib/posts';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
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
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fff'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>
            Off Market Daily
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/#markets" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Markets</Link>
          <Link href="/#about" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Why Off Market</Link>
          <Link href="/blog" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Blog</Link>
          <Link
            href="/#signup"
            style={{
              backgroundColor: '#00b894',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Get Deal Alerts
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article style={{
        padding: '60px 40px 80px',
        maxWidth: '720px',
        margin: '0 auto'
      }}>
        {/* Back link */}
        <Link href="/blog" style={{
          color: '#00b894',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '32px'
        }}>
          ← Back to Blog
        </Link>

        {/* Post header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            {post.tag && (
              <span style={{
                backgroundColor: '#00b894',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {post.tag}
              </span>
            )}
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              {post.date}
            </span>
            {post.readTime && (
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                · {post.readTime}
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: '38px',
            fontWeight: '800',
            color: '#1e293b',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
            marginBottom: '16px'
          }}>
            {post.title}
          </h1>
          {post.subtitle && (
            <p style={{
              fontSize: '20px',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              {post.subtitle}
            </p>
          )}
        </div>

        {/* Post content */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* CTA */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          marginTop: '48px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Get Off Market Deals Sent to You
          </h3>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '20px' }}>
            Join the buyer list and get first access to investment properties with real margins.
          </p>
          <Link
            href="/#signup"
            style={{
              display: 'inline-block',
              backgroundColor: '#00b894',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Join the Buyer List — Free
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#fff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
              Off Market Daily
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>
            © 2026 Off Market Daily
          </div>
        </div>
      </footer>
    </div>
  );
}
undefined
