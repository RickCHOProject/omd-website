import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';

export const metadata = {
  title: 'Blog | Off Market Daily',
  description: 'Real estate investing insights, market analysis, and off-market deal strategies from Off Market Daily.',
};

export default function BlogPage() {
  const posts = getAllPosts();

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

      {/* Blog Header */}
      <section style={{
        padding: '60px 40px 40px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '16px',
          letterSpacing: '-0.5px'
        }}>
          The Off Market Daily Blog
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          lineHeight: '1.6',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          Market insights, investing strategies, and real numbers for real estate investors.
        </p>
      </section>

      {/* Posts Grid */}
      <section style={{
        padding: '20px 40px 80px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <p style={{ fontSize: '18px' }}>Posts coming soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid #e2e8f0',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {post.tag && (
                      <span style={{
                        backgroundColor: '#00b894',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.3px'
                      }}>
                        {post.tag}
                      </span>
                    )}
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                      {post.date}
                    </span>
                    {post.readTime && (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        · {post.readTime}
                      </span>
                    )}
                  </div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {post.title}
                  </h2>
                  <p style={{
                    color: '#64748b',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

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
