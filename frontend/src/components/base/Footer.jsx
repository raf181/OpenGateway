/**
 * Footer - "Site index" style with editorial hierarchy
 */

export function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'API'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Docs', 'Status', 'Support', 'Community'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies', 'Compliance'],
    },
  ];

  return (
    <footer style={{
      borderTop: `1px solid var(--border)`,
      backgroundColor: 'var(--bg-0)',
      padding: 'var(--space-8) var(--space-6)',
      position: 'relative',
    }}>
      {/* Accent rail on left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: 'var(--accent)',
        }}
      />

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingLeft: 'var(--space-8)',
      }}>
        {/* Main sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-9)',
        }}>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--fg-0)',
                marginBottom: 'var(--space-4)',
              }}>
                {section.title}
              </h4>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}>
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        display: 'block',
                        marginBottom: 'var(--space-2)',
                        color: 'var(--fg-1)',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'color var(--dur-2) var(--ease-out)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--fg-1)';
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid var(--border)`,
          paddingTop: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--fg-1)',
          }}>
            © 2026 OpenGateway Security. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-5)',
          }}>
            {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
              <a
                key={platform}
                href="#"
                style={{
                  color: 'var(--fg-1)',
                  textDecoration: 'none',
                  transition: 'color var(--dur-2) var(--ease-out)',
                  fontSize: '13px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--fg-1)';
                }}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* End marker */}
        <div style={{
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: `1px solid var(--border)`,
          borderTopOpacity: 0.3,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-1)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>END / 05</span>
        </div>
      </div>
    </footer>
  );
}
