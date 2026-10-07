import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Building,
  ShoppingBag,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileCode2,
  Share2
} from 'lucide-react';
import {
  FaqSchemaForm,
  LocalBusinessSchemaForm,
  ProductSchemaForm,
  SchemaType
} from '../types/schemaBuilder';

interface SchemaMarkupBuilderModuleProps {
  currentDomain: string;
}

export const SchemaMarkupBuilderModule: React.FC<SchemaMarkupBuilderModuleProps> = ({
  currentDomain,
}) => {
  const [selectedSchemaType, setSelectedSchemaType] = useState<SchemaType>('Product');
  const [copied, setCopied] = useState(false);

  // Form State: Product
  const [productForm, setProductForm] = useState<ProductSchemaForm>({
    name: 'Sérum Facial Ácido Hialurónico Botánico 50ml',
    image: `https://${currentDomain}/images/serum-hialuronico.webp`,
    description: 'Sérum hidratante de alta penetración con doble peso molecular y extractos orgánicos certificados.',
    sku: 'AUR-SERUM-HA-50',
    brand: 'Aura Cosmética Natural',
    price: '34.90',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    ratingValue: '4.9',
    reviewCount: '318',
  });

  // Form State: LocalBusiness
  const [businessForm, setBusinessForm] = useState<LocalBusinessSchemaForm>({
    name: 'Clínica & Boutique Aura Estética Botánica',
    image: `https://${currentDomain}/images/fachada-boutique.webp`,
    telephone: '+34 912 345 678',
    streetAddress: 'Calle Velázquez 42, 1º Izquierda',
    addressLocality: 'Madrid',
    postalCode: '28001',
    addressCountry: 'ES',
    priceRange: '€€',
    openingHours: 'Mo-Sa 10:00-20:00',
    geoLatitude: '40.4268',
    geoLongitude: '-3.6845',
  });

  // Form State: FAQPage
  const [faqForm, setFaqForm] = useState<FaqSchemaForm>({
    faqs: [
      {
        question: '¿Cuándo se notan los primeros resultados del sérum botánico?',
        answer: 'La hidratación dérmica es perceptible desde la primera aplicación. La atenuación de líneas finas se consolida a partir de los 14 días de uso continuo mañana y noche.',
      },
      {
        question: '¿El producto es apto para pieles reactivas o con rosácea?',
        answer: 'Sí, nuestra fórmula está testada dermatológicamente en pieles sensibles, libre de alcoholes irritantes, sulfatos y fragancias sintéticas.',
      },
      {
        question: '¿Qué política de envíos y devoluciones ofrecen?',
        answer: 'Envíos en 24-48 horas laborables en toda la península con gastos gratuitos en pedidos superiores a 35€. Garantía de satisfacción de 30 días.',
      },
    ],
  });

  // Add & remove FAQ pairs
  const handleAddFaq = () => {
    setFaqForm((prev) => ({
      faqs: [
        ...prev.faqs,
        { question: 'Nueva pregunta frecuente...', answer: 'Respuesta detallada y clara para el usuario...' },
      ],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setFaqForm((prev) => ({
      faqs: prev.faqs.filter((_, idx) => idx !== index),
    }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqForm((prev) => ({
      faqs: prev.faqs.map((faq, idx) => (idx === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  // JSON-LD Generators
  const generateJsonLd = (): string => {
    if (selectedSchemaType === 'Product') {
      const payload = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: productForm.name,
        image: [productForm.image],
        description: productForm.description,
        sku: productForm.sku,
        brand: {
          '@type': 'Brand',
          name: productForm.brand,
        },
        offers: {
          '@type': 'Offer',
          url: `https://${currentDomain}/productos/${productForm.sku.toLowerCase()}`,
          priceCurrency: productForm.priceCurrency,
          price: productForm.price,
          availability: productForm.availability,
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: productForm.ratingValue,
          reviewCount: productForm.reviewCount,
        },
      };
      return JSON.stringify(payload, null, 2);
    }

    if (selectedSchemaType === 'LocalBusiness') {
      const payload = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: businessForm.name,
        image: businessForm.image,
        telephone: businessForm.telephone,
        priceRange: businessForm.priceRange,
        address: {
          '@type': 'PostalAddress',
          streetAddress: businessForm.streetAddress,
          addressLocality: businessForm.addressLocality,
          postalCode: businessForm.postalCode,
          addressCountry: businessForm.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: businessForm.geoLatitude,
          longitude: businessForm.geoLongitude,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '20:00',
          },
        ],
      };
      return JSON.stringify(payload, null, 2);
    }

    // FAQPage
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqForm.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
    return JSON.stringify(payload, null, 2);
  };

  const jsonLdCode = `<script type="application/ld+json">\n${generateJsonLd()}\n</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(jsonLdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <Code2 className="w-3.5 h-3.5" />
                Schema.org Rich Snippet Generator
              </span>
              <span aria-hidden="true">·</span>
              <span>JSON-LD Conforme a Estándares Google</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Validación Instantánea</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Schema Markup Builder (Generador de Datos Estructurados JSON-LD)
            </h2>
          </div>

          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <span>Probar en Schema Validator</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        <p className="text-xs text-slate-400 pt-4 leading-relaxed">
          Crea bloques de código JSON-LD listos para insertar en el encabezado <code className="text-slate-300">&lt;head&gt;</code> de tu sitio web o tienda online. Diseñado para activar resultados enriquecidos en Google: estrellas de valoración (AggregateRating), precio, stock, mapa local y preguntas frecuentes desplegables.
        </p>

        {/* Schema Type Selector Tabs */}
        <div className="pt-4 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedSchemaType('Product')}
            className={`px-3.5 py-2 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              selectedSchemaType === 'Product'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Product & Review Stars (E-commerce)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSchemaType('LocalBusiness')}
            className={`px-3.5 py-2 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              selectedSchemaType === 'LocalBusiness'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>LocalBusiness (Negocio Local & Maps)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSchemaType('FAQPage')}
            className={`px-3.5 py-2 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              selectedSchemaType === 'FAQPage'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQPage (Preguntas Frecuentes Desplegables)</span>
          </button>
        </div>
      </section>

      {/* Main Split: Form Inputs Left, Live JSON-LD Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-amber-400" />
              Campos del Marcado: {selectedSchemaType}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Generación en tiempo real</span>
          </div>

          {/* Product Form */}
          {selectedSchemaType === 'Product' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">SKU / Identificador</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Precio</label>
                  <input
                    type="text"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Moneda</label>
                  <input
                    type="text"
                    value={productForm.priceCurrency}
                    onChange={(e) => setProductForm({ ...productForm, priceCurrency: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Disponibilidad</label>
                  <select
                    value={productForm.availability}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        availability: e.target.value as ProductSchemaForm['availability'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs"
                  >
                    <option value="https://schema.org/InStock">En Stock (InStock)</option>
                    <option value="https://schema.org/OutOfStock">Agotado (OutOfStock)</option>
                    <option value="https://schema.org/PreOrder">Reserva (PreOrder)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 mb-1">Puntuación Media (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productForm.ratingValue}
                    onChange={(e) => setProductForm({ ...productForm, ratingValue: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total de Reseñas</label>
                  <input
                    type="number"
                    value={productForm.reviewCount}
                    onChange={(e) => setProductForm({ ...productForm, reviewCount: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LocalBusiness Form */}
          {selectedSchemaType === 'LocalBusiness' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nombre Comercial de la Empresa</label>
                <input
                  type="text"
                  value={businessForm.name}
                  onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Teléfono Principal</label>
                  <input
                    type="text"
                    value={businessForm.telephone}
                    onChange={(e) => setBusinessForm({ ...businessForm, telephone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rango de Precios</label>
                  <input
                    type="text"
                    value={businessForm.priceRange}
                    onChange={(e) => setBusinessForm({ ...businessForm, priceRange: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dirección (Calle y Número)</label>
                <input
                  type="text"
                  value={businessForm.streetAddress}
                  onChange={(e) => setBusinessForm({ ...businessForm, streetAddress: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={businessForm.addressLocality}
                    onChange={(e) => setBusinessForm({ ...businessForm, addressLocality: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={businessForm.postalCode}
                    onChange={(e) => setBusinessForm({ ...businessForm, postalCode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">País (ISO)</label>
                  <input
                    type="text"
                    value={businessForm.addressCountry}
                    onChange={(e) => setBusinessForm({ ...businessForm, addressCountry: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Latitud GPS</label>
                  <input
                    type="text"
                    value={businessForm.geoLatitude}
                    onChange={(e) => setBusinessForm({ ...businessForm, geoLatitude: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Longitud GPS</label>
                  <input
                    type="text"
                    value={businessForm.geoLongitude}
                    onChange={(e) => setBusinessForm({ ...businessForm, geoLongitude: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FAQPage Form */}
          {selectedSchemaType === 'FAQPage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pares de Pregunta y Respuesta ({faqForm.faqs.length})</span>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 rounded cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Añadir Pregunta
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {faqForm.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-400 text-[11px]">Pregunta #{index + 1}</span>
                      {faqForm.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-slate-500 hover:text-red-400 cursor-pointer p-0.5"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      placeholder="¿Cuál es la pregunta?"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                    />

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      placeholder="Respuesta explicativa para el usuario..."
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Code Generator & Preview */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  Código JSON-LD Autogenerado
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Bloque &lt;script&gt;</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed h-[360px] overflow-y-auto selection:bg-blue-600 selection:text-white">
              <code>{jsonLdCode}</code>
            </pre>
          </div>

          {/* Validation & Implementation Callout */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-lg text-xs space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Directriz de Inserción Lista para Producción
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Inserta este bloque directamente dentro de la etiqueta <code className="text-slate-200 font-mono">&lt;head&gt;</code> de tu plantilla HTML o inyéctalo mediante el <strong>Staging Sandbox</strong> de la plataforma. Compatible con Google Rich Results Test y Schema Validator oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
