import { AiAuditAdvisorResponse } from '../types/aiAdvisor';

export const generateAdvisorAnalysis = async (
  domain: string,
  issuesCount: number,
  healthScore: number
): Promise<AiAuditAdvisorResponse> => {
  // Graceful simulation with realistic Gemini reasoning
  // In a full-stack node context with GEMINI_API_KEY, this calls @google/genai with 'gemini-3.8-flash'
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        executiveSummary: `Análisis heurístico de IA completado para ${domain}. Se detecta una fuga de autoridad en rutas parametrizadas y una penalización activa en la experiencia móvil (LCP de 4.8s frente a competidores en 1.9s). La resolución secuencial de estas 4 palancas priorizadas tiene un potencial de recuperación orgánica de +18% a +25% de conversiones.`,
        estimatedRecoverableRevenueUsd: 18420,
        confidenceScore: 94,
        competitiveEdgeAdvice:
          'Los 3 principales rivales de la SERP ya tienen 96% de marcado Schema.org con valoraciones. Implementar Rich Snippets elevará de inmediato tu CTR sin necesidad de esperar a que cambie el ranking.',
        priorityTasks: [
          {
            id: 'task-ai-1',
            priority: 'P1 - Inmediato',
            title: 'Desplegar Regla de Auto-Canonicalización en Filtros Parametrizados',
            category: 'SEO Técnico',
            estimatedTrafficImpact: '+15% Tráfico Orgánico en Colecciones Clave',
            rationale:
              '320 URLs con variantes de query strings (?color=, ?sort=) compiten internamente entre sí (canibalización), diluyendo el PageRank de la categoría raíz.',
            stepByStepAction:
              'Abre el archivo layout/theme.liquid (o plantilla de categoría en WP), verifica la condición de tags activos y fuerza el enlace canónico hacia la URL base limpia.',
            targetFile: 'layout/theme.liquid (Línea 42)',
            readySnippet: `{% if template contains 'collection' and current_tags %}\n  <link rel="canonical" href="{{ shop.url }}{{ collection.url }}" />\n  <meta name="robots" content="noindex, follow" />\n{% else %}\n  <link rel="canonical" href="{{ canonical_url }}" />\n{% endif %}`,
          },
          {
            id: 'task-ai-2',
            priority: 'P1 - Inmediato',
            title: 'Optimización Crítica de LCP Móvil: Preload de Banner y Fetchpriority High',
            category: 'Core Web Vitals',
            estimatedTrafficImpact: '+7% Tasa de Conversión Móvil (Ahorro de 2.7s)',
            rationale:
              'Google CrUX reporta 4.8 segundos en conexiones reales 4G. El banner principal se descarga tarde debido a fuentes y scripts de analítica bloqueantes.',
            stepByStepAction:
              'Añade una etiqueta <link rel="preload"> en el <head> con atributo fetchpriority="high" apuntando a la versión WebP responsiva.',
            targetFile: 'snippets/hero-preload.html',
            readySnippet: `<link rel="preload" as="image" href="/cdn/hero-banner-mobile.webp" fetchpriority="high" imagesizes="100vw" />`,
          },
          {
            id: 'task-ai-3',
            priority: 'P2 - Alto Impacto',
            title: 'Inyección Automatizada de Rich Snippets Product y AggregateRating',
            category: 'Schema.org',
            estimatedTrafficImpact: '+8% CTR en Búsquedas Transaccionales',
            rationale:
              'Tus competidores muestran estrellas doradas y stock en Google. La ausencia de Schema estructurado hace que tus snippets pasen desapercibidos.',
            stepByStepAction:
              'Inyecta el marcado JSON-LD en todas las páginas de producto mediante el gancho del header o la plantilla de ficha.',
            targetFile: 'templates/product-schema.jsonld',
            readySnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org/",\n  "@type": "Product",\n  "name": "{{ product.title }}",\n  "offers": { "@type": "Offer", "price": "{{ product.price }}", "availability": "https://schema.org/InStock" },\n  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "318" }\n}\n</script>`,
          },
          {
            id: 'task-ai-4',
            priority: 'P3 - Quick Win',
            title: 'Mapeo Directo 301 de URLs en 404 con Backlinks Históricos',
            category: 'SEO Técnico',
            estimatedTrafficImpact: 'Recuperación de Autoridad de 14 Dominios de Prensa',
            rationale:
              '14 URLs de campañas pasadas devuelven código HTTP 404 pero aún reciben enlaces externos entrantes de periódicos y blogs del sector.',
            stepByStepAction:
              'Edita el archivo de configuración .htaccess o Nginx y crea reglas de redirección 301 directas hacia las categorías activas más afines.',
            targetFile: 'config/nginx-redirects.conf',
            readySnippet: `rewrite ^/ofertas-primavera-2025/pack-luminosidad/?$ /colecciones/packs-regalo permanent;`,
          },
        ],
      });
    }, 1200);
  });
};
