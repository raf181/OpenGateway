import { useOutletContext } from 'react-router-dom';

const Icon = ({ type, className = 'w-5 h-5 text-primary-600' }) => {
  switch (type) {
    case 'lock':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="10" width="12" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 016 0v3" />
        </svg>
      );
    case 'box':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h6" />
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
    default:
      return null;
  }
};

export default function Product() {
  const { setDemoModalOpen, setPricingModalOpen } = useOutletContext();

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Resumen de plataforma
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              GeoCustody combina gestion de inventario y verificacion de red para ofrecer una solucion completa de cadena de custodia.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Arquitectura del sistema</h2>
          
          <div className="max-w-4xl mx-auto">
            <svg viewBox="0 0 800 500" className="w-full h-auto">
              {/* Background */}
              <rect x="0" y="0" width="800" height="500" fill="#f8fafc" rx="8"/>
              
              {/* User Layer */}
              <g>
                <rect x="50" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="120" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Empleado</text>
                <text x="120" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">App movil</text>
              </g>
              
              <g>
                <rect x="230" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="300" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Gerente</text>
                <text x="300" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">Aprobaciones</text>
              </g>
              
              <g>
                <rect x="410" y="40" width="140" height="80" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8"/>
                <text x="480" y="75" textAnchor="middle" className="text-sm" fill="#1e40af" fontWeight="600">Administrador</text>
                <text x="480" y="95" textAnchor="middle" className="text-xs" fill="#1e40af">Panel</text>
              </g>

              {/* Arrows down */}
              <path d="M120 120 L120 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M300 120 L300 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M480 120 L480 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* API Gateway */}
              <rect x="100" y="170" width="400" height="60" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8"/>
              <text x="300" y="205" textAnchor="middle" fill="#92400e" fontWeight="600">GeoCustody API Gateway</text>

              {/* Arrow down */}
              <path d="M300 230 L300 270" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* Core Services */}
              <g>
                <rect x="50" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="125" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Motor de politicas</text>
                <text x="125" y="330" textAnchor="middle" className="text-xs" fill="#166534">Reglas y decisiones</text>
              </g>

              <g>
                <rect x="225" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="300" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Servicio de custodia</text>
                <text x="300" y="330" textAnchor="middle" className="text-xs" fill="#166534">Transacciones</text>
              </g>

              <g>
                <rect x="400" y="280" width="150" height="70" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" rx="8"/>
                <text x="475" y="310" textAnchor="middle" fill="#166534" fontWeight="600">Servicio de auditoria</text>
                <text x="475" y="330" textAnchor="middle" className="text-xs" fill="#166534">Cadena hash</text>
              </g>

              {/* Arrows */}
              <path d="M300 350 L300 390" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              {/* External Services */}
              <g>
                <rect x="580" y="170" width="170" height="180" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" rx="8"/>
                <text x="665" y="200" textAnchor="middle" fill="#9d174d" fontWeight="600">Telefónica</text>
                <text x="665" y="220" textAnchor="middle" fill="#9d174d" fontWeight="600">Open Gateway</text>
                <text x="665" y="260" textAnchor="middle" className="text-xs" fill="#9d174d">• Verificacion de numero</text>
                <text x="665" y="280" textAnchor="middle" className="text-xs" fill="#9d174d">• Verificacion de ubicacion</text>
                <text x="665" y="300" textAnchor="middle" className="text-xs" fill="#9d174d">• Deteccion de SIM swap</text>
                <text x="665" y="320" textAnchor="middle" className="text-xs" fill="#9d174d">• Deteccion de cambio de dispositivo</text>
              </g>

              {/* Arrow to external */}
              <path d="M500 200 L570 200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)"/>

              {/* Database */}
              <g>
                <ellipse cx="300" cy="420" rx="100" ry="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <rect x="200" y="420" width="200" height="40" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <ellipse cx="300" cy="460" rx="100" ry="20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
                <text x="300" y="445" textAnchor="middle" fill="#4338ca" fontWeight="600">Base de datos</text>
              </g>

              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Core Components */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Componentes clave</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Icon type="lock" className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Motor de politicas</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Evalua resultados de verificacion frente a reglas configurables para tomar decisiones de autorizacion.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Numero no coincide → DENY</li>
                <li>• Fuera de geocerca → DENY o STEP_UP (segun sensibilidad)</li>
                <li>• Alta sensibilidad + senales de riesgo → STEP_UP</li>
                <li>• Sensibilidad media + SIM swap → STEP_UP</li>
                <li>• Todos los controles pasan → ALLOW</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Icon type="box" className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Servicio de custodia</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Gestiona el ciclo completo de las transacciones de custodia de activos.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CHECK_OUT - El empleado toma custodia</li>
                <li>• CHECK_IN/RETURN - Activo devuelto</li>
                <li>• TRANSFER - Custodia a otro empleado</li>
                <li>• INVENTORY_CLOSE - Verificacion de cierre de inventario</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Icon type="clipboard" className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Servicio de auditoria</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Mantiene un registro inviolable de todos los eventos de custodia.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cadena hash enlazando cada evento</li>
                <li>• Resumen de verificacion almacenado</li>
                <li>• Verificacion de integridad de cadena</li>
                <li>• Consulta por activo, usuario o rango temporal</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Icon type="antenna" className="w-5 h-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Integracion Open Gateway</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Aprovecha las APIs de red de Telefonica para verificacion.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Number Verification - Confirma identidad del dispositivo</li>
                <li>• Device Location - Geocerca basada en red</li>
                <li>• SIM Swap Detection - Senal de fraude</li>
                <li>• Device Swap Detection - Senal de fraude</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Listo para verlo en accion?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Solicita una demo para ver como GeoCustody protege tus operaciones de activos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setDemoModalOpen(true)} className="btn-primary">
              Solicitar demo
            </button>
            <button onClick={() => setPricingModalOpen(true)} className="btn-secondary">
              Solicitar precios
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
