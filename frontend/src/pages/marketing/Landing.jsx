import { useOutletContext } from 'react-router-dom';
import { useI18n } from '../../i18n';

const Icon = ({ type, className = 'w-10 h-10 text-primary-600' }) => {
  switch (type) {
    case 'location':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4-4.667 6-8 6-11a6 6 0 10-12 0c0 3 2 6.333 6 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'phone':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
          <circle cx="12" cy="5" r="1" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c6-2.5 8-6.5 8-11.5V6l-8-3-8 3v3.5C4 14.5 6 18.5 12 21z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6" />
        </svg>
      );
    case 'antenna':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="6" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v12m-4 0h8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 11c1.5-2 4-3 7-3s5.5 1 7 3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9c2-2.5 5.5-4 9-4s7 1.5 9 4" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="10" width="12" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 016 0v3" />
        </svg>
      );
    case 'link':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l-2 2a3 3 0 104.243 4.243l2-2M14 10l2-2a3 3 0 10-4.243-4.243l-2 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 11l-2 2" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13h3v6H5zM10.5 9H14v10h-3.5zM16 5h3v14h-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16" />
        </svg>
      );
    case 'check':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.42L8.5 12.086l6.793-6.796a1 1 0 011.411 0z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Landing() {
  const { setDemoModalOpen, setPricingModalOpen } = useOutletContext();
  const { lang } = useI18n();

  const copy = lang === 'es'
    ? {
        heroTitle: 'Demuestra quien manipulo un activo. Demuestra donde ocurrio.',
        heroSubtitle: 'GeoCustody es una plataforma empresarial de custodia e inventario que autoriza acciones sobre activos usando verificacion de red de Telefonica Open Gateway. Reduce perdidas, mejora el inventario y evita transacciones fuera de sitio.',
        requestDemo: 'Solicitar demo',
        requestPricing: 'Solicitar precios',
        heroNote: 'Disenado para almacenes, equipos de campo y operaciones reguladas.',
        overviewTitle: 'Cadena de custodia con verificacion de grado operador',
        overviewSubtitle: 'GeoCustody convierte la gestion de activos en transacciones verificadas. Cada retiro, transferencia, devolucion y cierre de inventario puede exigir prueba de presencia en sitio e identidad movil esperada.',
        overviewFeatures: [
          { title: 'Acciones verificadas en sitio', icon: 'location', desc: 'La verificacion de ubicacion por red confirma presencia fisica en sitios autorizados.' },
          { title: 'Vinculacion empleado-numero', icon: 'phone', desc: 'Asocia sesiones de empleados a numeros moviles verificados para mayor identidad.' },
          { title: 'Aprobaciones antifraude', icon: 'shield', desc: 'Detecta SIM swap y cambios de dispositivo para evitar accesos no autorizados.' },
          { title: 'Auditoria inmutable', icon: 'clipboard', desc: 'Registro inviolable de eventos de custodia con verificacion por cadena hash.' },
        ],
        howTitle: 'Autoriza acciones en tiempo real',
        howSteps: [
          { step: '1', title: 'Escanear activo', desc: 'Identificacion por QR o etiqueta NFC' },
          { step: '2', title: 'Verificar identidad', desc: 'Verificacion de numero con Open Gateway' },
          { step: '3', title: 'Verificar ubicacion', desc: 'Comprobacion de geocerca por red' },
          { step: '4', title: 'Aplicar politica', desc: 'Evaluar reglas y senales de riesgo' },
          { step: '5', title: 'Registrar custodia', desc: 'Entrada de auditoria inmutable' },
        ],
        howNoteStrong: 'No es GPS. No es suposicion.',
        howNoteBody: 'Las comprobaciones de ubicacion se basan en red para reducir suplantacion. Telefonica Open Gateway ofrece verificacion de grado operador que no puede falsificarse con apps.',
        keyTitle: 'Disenado para control operativo',
        keyBlocks: [
          {
            title: 'Inventario y custodia',
            items: ['Catalogo de activos con etiquetas QR/NFC', 'Seguimiento completo del ciclo de custodia', 'Gestion de excepciones y alertas', 'Soporte para multiples sitios']
          },
          {
            title: 'Autorizacion y politicas',
            items: ['Control de acceso por roles', 'Geocercas configurables', 'Flujos de aprobacion gerencial', 'Reglas segun sensibilidad del activo']
          },
          {
            title: 'Auditoria e informes',
            items: ['Linea temporal completa de eventos', 'Informes de cumplimiento', 'Exportacion CSV', 'Alertas en tiempo real']
          },
        ],
        useTitle: 'Donde encaja GeoCustody',
        useCases: [
          { title: 'Herramientas de almacen', desc: 'Rastrea herramientas de alto valor y asegura retiros y devoluciones en sitio.' },
          { title: 'Kits de servicio en campo', desc: 'Verifica que los tecnicos tengan el equipo correcto al llegar al cliente.' },
          { title: 'Hardware de datacenter', desc: 'Asegura cadena de custodia para servidores, discos y red.' },
          { title: 'Dispositivos medicos', desc: 'Cumple normativa con manejo verificado de equipamiento medico.' },
          { title: 'Equipos de construccion', desc: 'Evita el uso fuera de sitio de maquinaria y herramientas costosas.' },
          { title: 'Inventario regulado', desc: 'Cumple auditorias para sustancias y materiales controlados.' },
        ],
        integrationsTitle: 'Integraciones',
        integrations: [
          { title: 'Telefonica Open Gateway', icon: 'antenna', desc: 'Verificacion de numero, ubicacion, SIM swap y cambio de dispositivo' },
          { title: 'Proveedores SSO', icon: 'lock', desc: 'Azure AD, Okta, Google Workspace, Keycloak' },
          { title: 'Webhooks y API', icon: 'link', desc: 'API REST y notificaciones webhook' },
          { title: 'Sistemas empresariales', icon: 'chart', desc: 'ServiceNow, SAP, Intune (opcional)' },
        ],
        securityTitle: 'Seguridad y privacidad por diseno',
        securitySubtitle: 'GeoCustody realiza verificacion por transaccion. No hace rastreo continuo. Tu controlas la retencion y el acceso a los registros.',
        securityListTitle: 'Seguridad',
        securityList: ['Cifrado de extremo a extremo', 'Infraestructura conforme SOC 2 Tipo II', 'Control de acceso por roles', 'Auditoria con deteccion de manipulacion', 'Pruebas de penetracion regulares'],
        privacyListTitle: 'Privacidad',
        privacyList: ['Sin rastreo continuo de ubicacion', 'Verificacion solo por transaccion', 'Retencion de datos configurable', 'Cumplimiento RGPD', 'Acuerdos de tratamiento de datos disponibles'],
        screenshotsTitle: 'Capturas del producto',
        screenshotsSubtitle: 'Una vista rapida de las pantallas que usan empleados, managers y admins para operar cadena de custodia con evidencia verificable.',
        screenshots: [
          {
            title: 'Panel de activos en tiempo real',
            desc: 'Busqueda por tag, estado de custodia y acciones de retiro/devolucion con decision instantanea.',
            chips: ['Activos', 'Estado', 'Custodia']
          },
          {
            title: 'Solicitudes STEP_UP',
            desc: 'Cola de aprobaciones con contexto de riesgo, usuario solicitante y evidencia de red para aprobar o rechazar.',
            chips: ['Aprobaciones', 'Riesgo', 'Manager']
          },
          {
            title: 'Auditoria hash-link',
            desc: 'Linea de eventos con prev_hash/hash para validar integridad y detectar alteraciones del historial.',
            chips: ['Auditoria', 'Integridad', 'Compliance']
          },
        ],
        pricingTitle: 'Precios claros para cada etapa',
        pricingSubtitle: 'Modelo anual por empleado segun tamano de plantilla.',
        pricingRecommended: 'PLAN RECOMENDADO',
        pricingUsage: 'Facturacion anual por empleado.',
        talkToSales: 'Hablar con ventas',
        pricingTiers: [
          {
            name: 'Starter',
            price: '18 EUR por empleado/ano',
            range: 'Hasta 1.000 empleados',
            features: ['Inventario y custodia', 'Auditoria y trazabilidad', 'Soporte por email']
          },
          {
            name: 'Business',
            price: '12 EUR por empleado/ano',
            range: '1.001 a 15.000 empleados',
            features: ['Aprobaciones STEP_UP', 'Integracion SSO', 'Soporte prioritario'],
            popular: true
          },
          {
            name: 'Enterprise',
            price: '7 EUR por empleado/ano',
            range: 'Mas de 15.000 empleados',
            features: ['SLA dedicado', 'Integraciones a medida', 'Customer success manager']
          },
        ],
        faqTitle: 'Preguntas frecuentes',
        faqItems: [
          { q: 'Que es Telefonica Open Gateway?', a: 'Telefonica Open Gateway es un conjunto de APIs de red con servicios de verificacion de grado operador, incluyendo numero, ubicacion y senales antifraude como SIM swap.' },
          { q: 'GeoCustody rastrea empleados de forma continua?', a: 'No. Solo verifica ubicacion en el momento de la transaccion de custodia. No guarda rastreo continuo ni historico de ubicacion.' },
          { q: 'Que ocurre si falla la verificacion?', a: 'Segun tu politica, un fallo puede denegar la accion o crear una solicitud STEP_UP para aprobacion de gerencia.' },
          { q: 'GeoCustody funciona sin conexion?', a: 'El escaneo basico puede funcionar offline, pero la verificacion requiere conectividad porque usa APIs de Telefonica Open Gateway.' },
          { q: 'La auditoria es realmente inviolable?', a: 'La auditoria usa una cadena hash donde cada evento incluye el hash del anterior. Cualquier cambio rompe la cadena y se detecta al instante.' },
          { q: 'Que redes moviles son compatibles?', a: 'GeoCustody usa Telefonica Open Gateway, con soporte sobre redes Telefonica y redes asociadas. La cobertura depende de la region.' },
        ],
        ctaTitle: 'Deja de suponer. Empieza a demostrar custodia.',
        ctaSubtitle: 'GeoCustody vuelve verificable la gestion de activos con autorizacion de grado operador.',
        ctaNote: 'Disenado para seguridad empresarial y realidad operativa.',
      }
    : {
        heroTitle: 'Prove who handled an asset. Prove where it happened.',
        heroSubtitle: 'GeoCustody is an enterprise custody and inventory platform that authorizes asset actions with Telefonica Open Gateway network verification. Reduce losses, improve inventory accuracy, and prevent off-site transactions.',
        requestDemo: 'Request demo',
        requestPricing: 'Request pricing',
        heroNote: 'Built for warehouses, field teams, and regulated operations.',
        overviewTitle: 'Chain of custody with operator-grade verification',
        overviewSubtitle: 'GeoCustody turns asset management into verifiable transactions. Every checkout, transfer, return, and inventory close can require proof of on-site presence and expected mobile identity.',
        overviewFeatures: [
          { title: 'Verified on-site actions', icon: 'location', desc: 'Network location checks confirm physical presence at authorized sites.' },
          { title: 'Employee-number binding', icon: 'phone', desc: 'Bind employee sessions to verified mobile numbers for stronger identity.' },
          { title: 'Fraud-aware approvals', icon: 'shield', desc: 'Detect SIM swap and device changes to prevent unauthorized activity.' },
          { title: 'Immutable audit trail', icon: 'clipboard', desc: 'Tamper-evident custody logging with hash-chain verification.' },
        ],
        howTitle: 'Authorize actions in real time',
        howSteps: [
          { step: '1', title: 'Scan asset', desc: 'QR code or NFC tag identification' },
          { step: '2', title: 'Verify identity', desc: 'Number verification via Open Gateway' },
          { step: '3', title: 'Verify location', desc: 'Network geofence check' },
          { step: '4', title: 'Apply policy', desc: 'Evaluate rules and risk signals' },
          { step: '5', title: 'Record custody', desc: 'Immutable audit entry' },
        ],
        howNoteStrong: 'Not GPS. Not a guess.',
        howNoteBody: 'Location checks are network-based to reduce spoofing risk. Telefonica Open Gateway provides operator-grade verification that cannot be faked by apps.',
        keyTitle: 'Built for operational control',
        keyBlocks: [
          {
            title: 'Inventory and custody',
            items: ['Asset catalog with QR/NFC tags', 'Full custody lifecycle tracking', 'Exception handling and alerts', 'Multi-site support']
          },
          {
            title: 'Authorization and policy',
            items: ['Role-based access control', 'Configurable geofences', 'Manager approval workflows', 'Rules by asset sensitivity']
          },
          {
            title: 'Audit and reporting',
            items: ['Complete event timeline', 'Compliance reporting', 'CSV export', 'Real-time alerts']
          },
        ],
        useTitle: 'Where GeoCustody fits',
        useCases: [
          { title: 'Warehouse tools', desc: 'Track high-value tools and enforce on-site checkout and return.' },
          { title: 'Field service kits', desc: 'Verify technicians have the right equipment at customer locations.' },
          { title: 'Datacenter hardware', desc: 'Secure chain of custody for servers, storage, and network gear.' },
          { title: 'Medical devices', desc: 'Meet compliance with verified handling of medical equipment.' },
          { title: 'Construction equipment', desc: 'Prevent off-site use of expensive machinery and tools.' },
          { title: 'Regulated inventory', desc: 'Support audits for controlled materials and sensitive stock.' },
        ],
        integrationsTitle: 'Integrations',
        integrations: [
          { title: 'Telefonica Open Gateway', icon: 'antenna', desc: 'Number verification, location, SIM swap, and device swap signals' },
          { title: 'SSO providers', icon: 'lock', desc: 'Azure AD, Okta, Google Workspace, Keycloak' },
          { title: 'Webhooks and API', icon: 'link', desc: 'REST API and webhook notifications' },
          { title: 'Enterprise systems', icon: 'chart', desc: 'ServiceNow, SAP, Intune (optional)' },
        ],
        securityTitle: 'Security and privacy by design',
        securitySubtitle: 'GeoCustody verifies per transaction. It does not perform continuous tracking. You control retention and access to records.',
        securityListTitle: 'Security',
        securityList: ['End-to-end encryption', 'SOC 2 Type II aligned infrastructure', 'Role-based access control', 'Tamper detection in audit records', 'Regular penetration testing'],
        privacyListTitle: 'Privacy',
        privacyList: ['No continuous location tracking', 'Verification only at transaction time', 'Configurable data retention', 'GDPR alignment', 'Data processing agreements available'],
        screenshotsTitle: 'Product screenshots',
        screenshotsSubtitle: 'A quick look at the screens used by employees, managers, and admins to run verifiable custody workflows.',
        screenshots: [
          {
            title: 'Live asset dashboard',
            desc: 'Tag search, custody state visibility, and instant checkout/return decisions.',
            chips: ['Assets', 'Status', 'Custody']
          },
          {
            title: 'STEP_UP requests',
            desc: 'Approval queue with risk context, requester details, and network evidence.',
            chips: ['Approvals', 'Risk', 'Manager']
          },
          {
            title: 'Hash-linked audit',
            desc: 'Event trail with prev_hash/hash to validate integrity and detect tampering.',
            chips: ['Audit', 'Integrity', 'Compliance']
          },
        ],
        pricingTitle: 'Clear pricing for each stage',
        pricingSubtitle: 'Annual per-employee pricing based on workforce size.',
        pricingRecommended: 'RECOMMENDED PLAN',
        pricingUsage: 'Annual billing per employee.',
        talkToSales: 'Talk to sales',
        pricingTiers: [
          {
            name: 'Starter',
            price: 'EUR 18 per employee/year',
            range: 'Up to 1,000 employees',
            features: ['Inventory and custody', 'Audit and traceability', 'Email support']
          },
          {
            name: 'Business',
            price: 'EUR 12 per employee/year',
            range: '1,001 to 15,000 employees',
            features: ['STEP_UP approvals', 'SSO integration', 'Priority support'],
            popular: true
          },
          {
            name: 'Enterprise',
            price: 'EUR 7 per employee/year',
            range: 'More than 15,000 employees',
            features: ['Dedicated SLA', 'Custom integrations', 'Customer success manager']
          },
        ],
        faqTitle: 'Frequently asked questions',
        faqItems: [
          { q: 'What is Telefonica Open Gateway?', a: 'Telefonica Open Gateway is a set of network APIs with operator-grade verification services, including number verification, location, and anti-fraud signals such as SIM swap.' },
          { q: 'Does GeoCustody continuously track employees?', a: 'No. It only verifies location at custody transaction time. It does not store continuous location tracking.' },
          { q: 'What happens when verification fails?', a: 'Depending on your policy, a failure can deny the action or create a STEP_UP request for manager approval.' },
          { q: 'Can GeoCustody work offline?', a: 'Basic scanning can work offline, but verification requires connectivity because it uses Telefonica Open Gateway APIs.' },
          { q: 'Is the audit trail really tamper-evident?', a: 'The audit trail uses a hash chain where each event includes the previous hash. Any modification breaks the chain and is detected immediately.' },
          { q: 'Which mobile networks are supported?', a: 'GeoCustody uses Telefonica Open Gateway with support on Telefonica networks and partner networks, subject to regional availability.' },
        ],
        ctaTitle: 'Stop assuming. Start proving custody.',
        ctaSubtitle: 'GeoCustody makes asset management verifiable with operator-grade authorization.',
        ctaNote: 'Built for enterprise security and operational reality.',
      };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              {copy.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setDemoModalOpen(true)} className="btn-primary">
                {copy.requestDemo}
              </button>
              <button onClick={() => setPricingModalOpen(true)} className="btn-secondary">
                {copy.requestPricing}
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              {copy.heroNote}
            </p>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.overviewTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {copy.overviewSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.overviewFeatures.map((feature, i) => (
              <div key={i} className="card text-center">
                <div className="flex items-center justify-center mb-4">
                  <Icon type={feature.icon} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.howTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {copy.howSteps.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-primary-50 border border-primary-200 rounded-xl p-6">
            <p className="text-primary-800 text-center">
              <strong>{copy.howNoteStrong}</strong> {copy.howNoteBody}
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.keyTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {copy.keyBlocks.map((block, i) => (
              <div key={i} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{block.title}</h3>
                <ul className="space-y-2 text-gray-600">
                  {block.items.map(item => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.useTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.useCases.map((useCase, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.integrationsTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.integrations.map((item, i) => (
              <div key={i} className="card text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon type={item.icon} className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              {copy.securityTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              {copy.securitySubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{copy.securityListTitle}</h3>
              <ul className="space-y-2 text-gray-300">
                {copy.securityList.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon type="check" className="w-4 h-4 text-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{copy.privacyListTitle}</h3>
              <ul className="space-y-2 text-gray-300">
                {copy.privacyList.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon type="check" className="w-4 h-4 text-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.screenshotsTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {copy.screenshotsSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {copy.screenshots.map((item, i) => (
              <div key={i} className="card p-4">
                <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white overflow-hidden mb-4">
                  <div className="h-8 px-3 flex items-center gap-1.5 border-b border-gray-200 bg-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 rounded bg-primary-100/70" />
                      <div className="h-16 rounded bg-gray-200" />
                      <div className="h-16 rounded bg-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 rounded bg-gray-200" />
                      <div className="h-2.5 rounded bg-gray-200 w-5/6" />
                      <div className="h-2.5 rounded bg-gray-200 w-4/6" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.chips.map(chip => (
                    <span key={chip} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.pricingTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {copy.pricingSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {copy.pricingTiers.map((tier, i) => (
              <div key={i} className={`card flex flex-col ${tier.popular ? 'ring-2 ring-primary-600 shadow-lg' : ''}`}>
                {tier.popular && (
                  <div className="text-xs font-semibold text-primary-600 mb-2">{copy.pricingRecommended}</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tier.range}</p>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900">{tier.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{copy.pricingUsage}</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-2">
                  <button onClick={() => setDemoModalOpen(true)} className="btn-primary w-full btn-sm">
                    {copy.requestDemo}
                  </button>
                  <button onClick={() => setPricingModalOpen(true)} className="btn-secondary w-full btn-sm">
                    {copy.talkToSales}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {copy.faqTitle}
            </h2>
          </div>

          <div className="space-y-6">
            {copy.faqItems.map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            {copy.ctaTitle}
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            {copy.ctaSubtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setDemoModalOpen(true)} className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              {copy.requestDemo}
            </button>
            <button onClick={() => setPricingModalOpen(true)} className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              {copy.requestPricing}
            </button>
          </div>
          <p className="mt-8 text-sm text-primary-200">
            {copy.ctaNote}
          </p>
        </div>
      </section>
    </div>
  );
}
