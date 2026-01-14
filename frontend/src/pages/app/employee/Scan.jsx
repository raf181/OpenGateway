import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeScan() {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [scanHovered, setScanHovered] = useState(false);
  const [manualHovered, setManualHovered] = useState(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setScanning(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraPermission(false);
      setError('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    // In a real app, this would look up the asset by barcode
    // For demo, redirect to assets page
    navigate('/app/assets?barcode=' + encodeURIComponent(manualCode.trim()));
  };

  const simulateScan = () => {
    // Simulate a successful scan for demo purposes
    stopCamera();
    navigate('/app/assets/1');
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-1)',
    borderRadius: 'var(--radius-2)',
    border: '1px solid var(--border)',
    padding: '24px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-0)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-1)',
    color: 'var(--fg-0)',
    fontSize: '16px',
    fontFamily: 'var(--font-mono)',
  };

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--bg-0)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fg-0)', margin: 0, fontFamily: 'var(--font-display)' }}>Scan Asset</h1>
          <p style={{ color: 'var(--fg-1)', fontSize: '14px', marginTop: '8px' }}>Scan a barcode or QR code to quickly find an asset</p>
        </div>

        {/* Camera Preview */}
        <div style={{ ...cardStyle, marginBottom: '20px' }}>
          {!scanning ? (
            <div style={{
              height: '280px',
              backgroundColor: 'var(--bg-0)',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(198, 255, 58, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg style={{ width: 40, height: 40, color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p style={{ color: 'var(--fg-1)', fontSize: '14px', margin: 0 }}>Camera is not active</p>
              <button
                onClick={startCamera}
                onMouseEnter={() => setScanHovered(true)}
                onMouseLeave={() => setScanHovered(false)}
                style={{
                  padding: '12px 32px',
                  backgroundColor: scanHovered ? '#d4ff5a' : 'var(--accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-1)',
                  color: '#0b0d10',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Start Scanning
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '280px',
                  backgroundColor: '#000',
                  borderRadius: 'var(--radius-1)',
                  objectFit: 'cover',
                }}
              />
              
              {/* Scan overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '2px solid var(--accent)',
                  borderRadius: '16px',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}>
                  {/* Corner markers */}
                  <div style={{ position: 'absolute', top: -4, left: -4, width: 24, height: 24, borderTop: '4px solid var(--accent)', borderLeft: '4px solid var(--accent)', borderRadius: '4px 0 0 0' }} />
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderTop: '4px solid var(--accent)', borderRight: '4px solid var(--accent)', borderRadius: '0 4px 0 0' }} />
                  <div style={{ position: 'absolute', bottom: -4, left: -4, width: 24, height: 24, borderBottom: '4px solid var(--accent)', borderLeft: '4px solid var(--accent)', borderRadius: '0 0 0 4px' }} />
                  <div style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderBottom: '4px solid var(--accent)', borderRight: '4px solid var(--accent)', borderRadius: '0 0 4px 0' }} />
                </div>
              </div>

              <div style={{ 
                position: 'absolute', 
                bottom: '12px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  onClick={simulateScan}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--accent)',
                    border: 'none',
                    borderRadius: 'var(--radius-1)',
                    color: '#0b0d10',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Simulate Scan
                </button>
                <button
                  onClick={stopCamera}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: 'var(--radius-1)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-1)',
              color: '#f87171',
              fontSize: '13px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ color: 'var(--fg-1)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        {/* Manual Entry */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg-0)', margin: '0 0 16px' }}>Enter Code Manually</h3>
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="AST-2024-001"
              style={inputStyle}
            />
            <button
              type="submit"
              onMouseEnter={() => setManualHovered(true)}
              onMouseLeave={() => setManualHovered(false)}
              style={{
                padding: '12px 24px',
                backgroundColor: manualHovered ? '#d4ff5a' : 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-1)',
                color: '#0b0d10',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Look Up
            </button>
          </form>
        </div>

        {/* Tips */}
        <div style={{ marginTop: '32px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--fg-1)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tips</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TipItem text="Hold your device steady about 6 inches from the code" />
            <TipItem text="Ensure the barcode or QR code is well-lit" />
            <TipItem text="The code should be fully visible within the scan area" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <svg style={{ width: 16, height: 16, color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span style={{ color: 'var(--fg-1)', fontSize: '14px' }}>{text}</span>
    </div>
  );
}
