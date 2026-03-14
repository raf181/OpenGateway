import { useOutletContext } from 'react-router-dom';

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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Demuestra quien manipulo un activo. Demuestra donde ocurrio.
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              GeoCustody es una plataforma empresarial de custodia e inventario que autoriza acciones sobre activos usando verificacion de red de Telefonica Open Gateway. Reduce perdidas, mejora el inventario y evita transacciones fuera de sitio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setDemoModalOpen(true)} className="btn-primary">
                Solicitar demo
              </button>
              <button onClick={() => setPricingModalOpen(true)} className="btn-secondary">
                Solicitar precios
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Disenado para almacenes, equipos de campo y operaciones reguladas.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">
            Confiado por equipos que gestionan equipamiento de alto valor e inventario regulado.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((name, i) => (
              <div key={i} className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Cadena de custodia con verificacion de grado operador
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              GeoCustody convierte la gestion de activos en transacciones verificadas. Cada retiro, transferencia, devolucion y cierre de inventario puede exigir prueba de presencia en sitio e identidad movil esperada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Acciones verificadas en sitio', icon: 'location', desc: 'La verificacion de ubicacion por red confirma presencia fisica en sitios autorizados.' },
              { title: 'Vinculacion empleado-numero', icon: 'phone', desc: 'Asocia sesiones de empleados a numeros moviles verificados para mayor identidad.' },
              { title: 'Aprobaciones antifraude', icon: 'shield', desc: 'Detecta SIM swap y cambios de dispositivo para evitar accesos no autorizados.' },
              { title: 'Auditoria inmutable', icon: 'clipboard', desc: 'Registro inviolable de eventos de custodia con verificacion por cadena hash.' },
            ].map((feature, i) => (
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
              Autoriza acciones en tiempo real
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {[
              { step: '1', title: 'Escanear activo', desc: 'Identificacion por QR o etiqueta NFC' },
              { step: '2', title: 'Verificar identidad', desc: 'Verificacion de numero con Open Gateway' },
              { step: '3', title: 'Verificar ubicacion', desc: 'Comprobacion de geocerca por red' },
              { step: '4', title: 'Aplicar politica', desc: 'Evaluar reglas y senales de riesgo' },
              { step: '5', title: 'Registrar custodia', desc: 'Entrada de auditoria inmutable' },
            ].map((item, i) => (
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
              <strong>No es GPS. No es suposicion.</strong> Las comprobaciones de ubicacion se basan en red para reducir suplantacion. Telefonica Open Gateway ofrece verificacion de grado operador que no puede falsificarse con apps.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Diseñado para control operativo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Inventario y custodia</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Catalogo de activos con etiquetas QR/NFC</li>
                <li>• Seguimiento completo del ciclo de custodia</li>
                <li>• Gestion de excepciones y alertas</li>
                <li>• Soporte para multiples sitios</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Autorizacion y politicas</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Control de acceso por roles</li>
                <li>• Geocercas configurables</li>
                <li>• Flujos de aprobacion gerencial</li>
                <li>• Reglas segun sensibilidad del activo</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Auditoria e informes</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Linea temporal completa de eventos</li>
                <li>• Informes de cumplimiento</li>
                <li>• Exportacion CSV</li>
                <li>• Alertas en tiempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Donde encaja GeoCustody
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Herramientas de almacen', desc: 'Rastrea herramientas de alto valor y asegura retiros y devoluciones en sitio.' },
              { title: 'Kits de servicio en campo', desc: 'Verifica que los tecnicos tengan el equipo correcto al llegar al cliente.' },
              { title: 'Hardware de datacenter', desc: 'Asegura cadena de custodia para servidores, discos y red.' },
              { title: 'Dispositivos medicos', desc: 'Cumple normativa con manejo verificado de equipamiento medico.' },
              { title: 'Equipos de construccion', desc: 'Evita el uso fuera de sitio de maquinaria y herramientas costosas.' },
              { title: 'Inventario regulado', desc: 'Cumple auditorias para sustancias y materiales controlados.' },
            ].map((useCase, i) => (
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
              Integraciones
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Telefonica Open Gateway', icon: 'antenna', desc: 'Verificacion de numero, ubicacion, SIM swap y cambio de dispositivo' },
              { title: 'Proveedores SSO', icon: 'lock', desc: 'Azure AD, Okta, Google Workspace, Keycloak' },
              { title: 'Webhooks y API', icon: 'link', desc: 'API REST y notificaciones webhook' },
              { title: 'Sistemas empresariales', icon: 'chart', desc: 'ServiceNow, SAP, Intune (opcional)' },
            ].map((item, i) => (
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
              Seguridad y privacidad por diseno
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              GeoCustody realiza verificacion por transaccion. No hace rastreo continuo. Tu controlas la retencion y el acceso a los registros.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Seguridad</h3>
              <ul className="space-y-2 text-gray-300">
                {[
                  'Cifrado de extremo a extremo',
                  'Infraestructura conforme SOC 2 Tipo II',
                  'Control de acceso por roles',
                  'Auditoria con deteccion de manipulacion',
                  'Pruebas de penetracion regulares'
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon type="check" className="w-4 h-4 text-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Privacidad</h3>
              <ul className="space-y-2 text-gray-300">
                {[
                  'Sin rastreo continuo de ubicacion',
                  'Verificacion solo por transaccion',
                  'Retencion de datos configurable',
                  'Cumplimiento RGPD',
                  'Acuerdos de tratamiento de datos disponibles'
                ].map(item => (
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
              Ve la plataforma en accion
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Panel de activos', desc: 'Visualiza todos los activos, su estado y custodias actuales.' },
              { title: 'Flujo de verificacion', desc: 'Feedback en tiempo real sobre verificacion de numero y ubicacion.' },
              { title: 'Aprobaciones gerenciales', desc: 'Revisa y aprueba solicitudes STEP_UP de empleados.' },
              { title: 'Linea de auditoria', desc: 'Historial completo de eventos con detalle de verificacion.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Captura de ejemplo</span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
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
              Precios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: 'Starter', 
                price: 'Contactar', 
                features: ['Hasta 100 activos', 'Hasta 10 usuarios', 'Informes basicos', 'Soporte por email'] 
              },
              { 
                name: 'Business', 
                price: 'Contactar', 
                features: ['Hasta 1.000 activos', 'Hasta 50 usuarios', 'Informes avanzados', 'Integracion SSO', 'Soporte prioritario'],
                popular: true
              },
              { 
                name: 'Enterprise', 
                price: 'Contactar', 
                features: ['Activos ilimitados', 'Usuarios ilimitados', 'Integraciones a medida', 'Soporte dedicado', 'Garantias SLA', 'Opcion on-premise'] 
              },
            ].map((tier, i) => (
              <div key={i} className={`card ${tier.popular ? 'ring-2 ring-primary-600' : ''}`}>
                {tier.popular && (
                  <div className="text-xs font-semibold text-primary-600 mb-2">MAS POPULAR</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{tier.price}</p>
                <ul className="mt-6 space-y-2">
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
                    Solicitar demo
                  </button>
                  <button onClick={() => setPricingModalOpen(true)} className="btn-secondary w-full btn-sm">
                    Solicitar precios
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
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Que es Telefonica Open Gateway?', a: 'Telefonica Open Gateway es un conjunto de APIs de red con servicios de verificacion de grado operador, incluyendo numero, ubicacion y senales antifraude como SIM swap.' },
              { q: 'GeoCustody rastrea empleados de forma continua?', a: 'No. Solo verifica ubicacion en el momento de la transaccion de custodia. No guarda rastreo continuo ni historico de ubicacion.' },
              { q: 'Que ocurre si falla la verificacion?', a: 'Segun tu politica, un fallo puede denegar la accion o crear una solicitud STEP_UP para aprobacion de gerencia.' },
              { q: 'GeoCustody funciona sin conexion?', a: 'El escaneo basico puede funcionar offline, pero la verificacion requiere conectividad porque usa APIs de Telefonica Open Gateway.' },
              { q: 'La auditoria es realmente inviolable?', a: 'La auditoria usa una cadena hash donde cada evento incluye el hash del anterior. Cualquier cambio rompe la cadena y se detecta al instante.' },
              { q: 'Que redes moviles son compatibles?', a: 'GeoCustody usa Telefonica Open Gateway, con soporte sobre redes Telefonica y redes asociadas. La cobertura depende de la region.' },
            ].map((item, i) => (
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
            Deja de suponer. Empieza a demostrar custodia.
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            GeoCustody vuelve verificable la gestion de activos con autorizacion de grado operador.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setDemoModalOpen(true)} className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Solicitar demo
            </button>
            <button onClick={() => setPricingModalOpen(true)} className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Solicitar precios
            </button>
          </div>
          <p className="mt-8 text-sm text-primary-200">
            Diseñado para seguridad empresarial y realidad operativa.
          </p>
        </div>
      </section>
    </div>
  );
}
