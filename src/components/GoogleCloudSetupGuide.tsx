import React, { useState } from 'react';
import {
  Cloud,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  FileText,
  Globe,
  Mail,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const GoogleCloudSetupGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const DEV_APP_URL = 'https://ais-dev-jjlupfpg6oxkzyp6karlo6-879234162937.us-east1.run.app';
  const SHARED_APP_URL = 'https://ais-pre-jjlupfpg6oxkzyp6karlo6-879234162937.us-east1.run.app';
  const USER_EMAIL = 'tradingasociados5@gmail.com';

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fields = [
    {
      id: 'app_name',
      label: 'Nombre de la aplicación (App Name)',
      value: 'SEO Flow Studio',
      description: 'El nombre que verán los usuarios al autorizar el acceso en la pantalla de consentimiento de Google.',
    },
    {
      id: 'support_email',
      label: 'Correo de asistencia al usuario (User support email)',
      value: USER_EMAIL,
      description: 'El correo electrónico que verán los usuarios si necesitan soporte sobre la app.',
    },
    {
      id: 'home_url',
      label: 'URL de la página principal (Application home page)',
      value: SHARED_APP_URL,
      description: 'La dirección web pública principal de tu suite SEO.',
    },
    {
      id: 'privacy_url',
      label: 'URL de la política de privacidad (Privacy Policy URL)',
      value: `${SHARED_APP_URL}/#privacy`,
      description: 'Requisito obligatorio de Google. Enlace directo al documento de privacidad publicado en tu app.',
    },
    {
      id: 'dev_email',
      label: 'Datos de contacto del desarrollador (Developer contact info)',
      value: USER_EMAIL,
      description: 'Google utiliza este correo para enviarte notificaciones sobre cambios en las APIs o proyectos.',
    },
    {
      id: 'redirect_uri_shared',
      label: 'URI de redireccionamiento autorizado 1 (Shared / Production)',
      value: `${SHARED_APP_URL}/auth/callback`,
      description: 'URI exacto al que Google devolverá el token tras el consentimiento del usuario.',
    },
    {
      id: 'redirect_uri_dev',
      label: 'URI de redireccionamiento autorizado 2 (Development)',
      value: `${DEV_APP_URL}/auth/callback`,
      description: 'URI para pruebas y desarrollo en tu contenedor activo.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                <Cloud className="w-3.5 h-3.5" />
                Google Cloud Console Wizard
              </span>
              <span aria-hidden="true">·</span>
              <span>OAuth 2.0 Credentials & Consent Screen</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Valores Listos para Copiar</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-400" />
              Guía de Configuración Paso a Paso: Google Cloud & Pantalla de Consentimiento
            </h2>
          </div>

          <a
            href="https://console.cloud.google.com/apis/credentials/consent"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Abrir Google Cloud Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-slate-400 pt-4 leading-relaxed">
          Google Cloud exige completar los datos de marca, política de privacidad y URIs de redirección para habilitar las APIs de <strong>Google Search Console</strong> y <strong>Google Analytics (GA4)</strong>. Copia y pega los valores exactos a continuación para superar la validación sin errores.
        </p>
      </section>

      {/* Copy-Paste Credentials & Consent Fields */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            1. Campos Requeridos en la Pantalla de Consentimiento de OAuth
          </span>
          <span className="text-slate-400 font-mono">Pestaña "Información de la app"</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fields.map((field) => (
            <div
              key={field.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5 max-w-xl">
                <span className="font-semibold text-slate-200 block">{field.label}</span>
                <span className="text-slate-400 text-[11px] block">{field.description}</span>
                <div className="pt-1 font-mono text-emerald-400 select-all text-xs break-all">
                  {field.value}
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(field.value, field.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors cursor-pointer self-start md:self-center shrink-0"
              >
                {copiedKey === field.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Valor</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Strategy: Testing vs Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Testing Mode Card (Recommended) */}
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/80 rounded-lg space-y-3">
          <div className="flex items-center gap-2 font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            Opción A: Modo "Pruebas" (Recomendado para tu Agencia)
          </div>
          <p className="text-slate-300 leading-relaxed">
            Si la app es para ti, tu equipo o clientes directos, <strong>no necesitas pasar por la verificación de Google de 3-7 días</strong>.
          </p>
          <div className="space-y-1.5 text-slate-400">
            <div>1. En la pantalla de consentimiento, deja el estado en <strong>"En prueba" (Testing)</strong>.</div>
            <div>2. Ve a la sección <strong>"Usuarios de prueba" (Test Users)</strong>.</div>
            <div>3. Añade tu correo: <code className="text-emerald-300 font-mono">tradingasociados5@gmail.com</code> y los correos de tus clientes.</div>
            <div>4. ¡Listo! Podrán iniciar sesión de inmediato sin bloqueos ni advertencias complejas.</div>
          </div>
        </div>

        {/* Public Production Mode Card */}
        <div className="p-4 bg-blue-950/30 border border-blue-800/80 rounded-lg space-y-3">
          <div className="flex items-center gap-2 font-semibold text-blue-300">
            <Globe className="w-4 h-4 text-blue-400 shrink-0" />
            Opción B: Modo "Producción Externa" (Público General)
          </div>
          <p className="text-slate-300 leading-relaxed">
            Si quieres que cualquier persona del mundo conecte su Google Search Console sin tener que añadirla antes como usuario de prueba:
          </p>
          <div className="space-y-1.5 text-slate-400">
            <div>1. Pega la <strong>URL de Política de Privacidad</strong> que ya hemos publicado arriba.</div>
            <div>2. Haz clic en <strong>"Publicar la app" (Publish App)</strong> en Google Cloud.</div>
            <div>3. Google revisará que uses los datos solo para la auditoría técnica conforme a su política de datos.</div>
          </div>
        </div>
      </div>

      {/* Required Scopes Summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3 text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          2. Permisos (Scopes) que debes Seleccionar en Google Cloud
        </h3>
        <p className="text-slate-400">
          En el paso 2 de la pantalla de consentimiento (*Permisos* o *Scopes*), añade únicamente estos permisos de solo lectura para cumplir con el principio de mínimo privilegio:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-[11px]">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <span className="text-blue-400 font-semibold block">.../auth/webmasters.readonly</span>
            <span className="text-slate-400 font-sans text-xs mt-1 block">
              Permite a la app consultar clics, impresiones, CTR y posiciones en Google Search Console sin modificar nada.
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded">
            <span className="text-purple-400 font-semibold block">.../auth/analytics.readonly</span>
            <span className="text-slate-400 font-sans text-xs mt-1 block">
              Permite a la app ver informes de sesiones orgánicas y conversiones en Google Analytics 4 (GA4).
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
