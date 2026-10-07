import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 text-slate-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la Suite SEO
        </button>
        <span className="text-xs text-slate-500 font-mono">Última actualización: Octubre 2026</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Google API Services User Data Policy Compliance
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Política de Privacidad de SEO Flow Studio
        </h1>
        <p className="text-xs text-slate-400">
          Esta Política de Privacidad describe cómo <strong>SEO Flow Studio</strong> recopila, utiliza y protege la información obtenida a través de la integración con Google Cloud, Google Search Console y Google Analytics.
        </p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-white">1. Información que Recopilamos</h2>
          <p>
            Al conectar su cuenta de Google mediante OAuth 2.0, nuestra aplicación solicita acceso de solo lectura (<code>webmasters.readonly</code> y <code>analytics.readonly</code>) exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Métricas de rendimiento orgánico en búsquedas: total de clics, impresiones, CTR y posición promedio de palabras clave.</li>
            <li>Listado de propiedades y dominios verificados en su cuenta de Google Search Console.</li>
            <li>Métricas agregadas de Core Web Vitals (LCP, FID/INP, CLS) a través de PageSpeed Insights y Chrome UX Report.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-white">2. Uso Exclusivo de los Datos</h2>
          <p>
            Los datos obtenidos de las APIs de Google se utilizan de forma única y exclusiva para:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Generar paneles de control analíticos y diagnósticos técnicos en su sesión de trabajo.</li>
            <li>Construir informes ejecutivos descargables en formato PDF para su agencia o clientes.</li>
            <li>Registrar puntos históricos en la base de datos local SQLite en su entorno de escritorio (Tauri).</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-white">3. Cumplimiento de la Política de Datos de Usuario de las APIs de Google</h2>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 space-y-1">
            <p>
              El uso y transferencia de información recibida de las APIs de Google a cualquier otra app cumple estrictamente con la <strong className="text-white">Google API Services User Data Policy</strong>, incluidos los requisitos de Uso Limitado (Limited Use Requirements).
            </p>
            <p className="text-slate-400">
              <strong>SEO Flow Studio NO vende, no alquila ni transfiere datos de usuarios de Google a terceros</strong>, plataformas publicitarias, intermediarios de datos ni para el entrenamiento de modelos de inteligencia artificial general.
            </p>
          </div>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-white">4. Almacenamiento y Seguridad de Credenciales</h2>
          <p>
            Los tokens de acceso de OAuth 2.0 se gestionan en memoria o de forma local protegida por el sistema operativo. Nuestra arquitectura desacopla el almacenamiento de credenciales para que ninguna clave secreta se transmita sin cifrado seguro TLS/HTTPS.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-sm font-semibold text-white">5. Revocación de Acceso y Contacto</h2>
          <p>
            Los usuarios pueden revocar el acceso de nuestra aplicación en cualquier momento desde la configuración de su cuenta de Google en <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">myaccount.google.com/permissions</a> o pulsando el botón "Disconnect" dentro de la suite.
          </p>
          <p className="pt-1 text-slate-400">
            Para dudas sobre privacidad y protección de datos, contacte a: <span className="font-mono text-slate-200">tradingasociados5@gmail.com</span>
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>SEO Flow Studio · Entorno Certificado OAuth 2.0</span>
        <button
          type="button"
          onClick={onBack}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Cerrar Política
        </button>
      </div>
    </div>
  );
};
