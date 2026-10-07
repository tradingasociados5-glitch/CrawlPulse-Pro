import React, { useState } from 'react';
import {
  FileText,
  Download,
  Building2,
  Check,
  Palette,
  Image as ImageIcon,
  DollarSign,
  TrendingDown,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export interface AuditReportItem {
  id: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  impact: string;
  fixTime: string;
  technicalCode?: string;
  revenueRiskUsd?: number;
}

interface ExportReportModuleProps {
  auditedDomain: string;
  issues: AuditReportItem[];
}

export const ExportReportModule: React.FC<ExportReportModuleProps> = ({
  auditedDomain,
  issues,
}) => {
  const [agencyName, setAgencyName] = useState('Nexus Digital & SEO Partners');
  const [consultantName, setConsultantName] = useState('Senior Technical SEO Architect');
  const [clientName, setClientName] = useState('Aura Cosmética & Retail Group');
  const [selectedTheme, setSelectedTheme] = useState<'blue' | 'slate' | 'emerald' | 'purple'>('blue');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState('Executive SEO Audit & Growth Acceleration Report');
  const [includeRoiSummary, setIncludeRoiSummary] = useState(true);

  // Preset Color Palettes for White-Labeling (RGB values for jsPDF)
  const THEMES = {
    blue: {
      name: 'Executive Navy',
      primaryRgb: [29, 78, 216], // #1d4ed8
      secondaryRgb: [30, 41, 59], // #1e293b
      accentHex: '#2563eb',
    },
    slate: {
      name: 'Monochrome Slate',
      primaryRgb: [15, 23, 42], // #0f172a
      secondaryRgb: [71, 85, 105], // #475569
      accentHex: '#0f172a',
    },
    emerald: {
      name: 'Growth Emerald',
      primaryRgb: [4, 120, 87], // #047857
      secondaryRgb: [20, 83, 45], // #14532d
      accentHex: '#059669',
    },
    purple: {
      name: 'Modern Indigo',
      primaryRgb: [109, 40, 217], // #6d28d9
      secondaryRgb: [76, 29, 149], // #4c1d95
      accentHex: '#7c3aed',
    },
  };

  const currentTheme = THEMES[selectedTheme];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePdf = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor = currentTheme.primaryRgb;
      const secondaryColor = currentTheme.secondaryRgb;

      // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---
      // Decorative Header Bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 24, 'F');

      // Agency Name in White on Header
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(agencyName.toUpperCase(), 14, 15);

      // Sub-header metadata
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('CONFIDENTIAL EXECUTIVE AUDIT', 196, 15, { align: 'right' });

      // Embed Agency Custom Logo if uploaded
      if (logoPreview) {
        try {
          doc.addImage(logoPreview, 'PNG', 14, 30, 32, 16);
        } catch {
          // If unsupported image format, fallback gracefully
        }
      }

      // Title & Target Domain Lockup
      const titleY = logoPreview ? 54 : 38;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(reportTitle, 14, titleY);

      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Prepared for: ${clientName} | Domain: ${auditedDomain}`, 14, titleY + 7);
      doc.text(`Lead Auditor: ${consultantName} | Date: ${new Date().toLocaleDateString('en-US')}`, 14, titleY + 13);

      // Section 1: Executive KPI Highlight Boxes
      const kpiBoxY = titleY + 22;
      doc.setDrawColor(226, 232, 240);

      // Box 1: Overall Health Score
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, kpiBoxY, 58, 26, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text('OVERALL TECHNICAL HEALTH', 18, kpiBoxY + 8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('84 / 100', 18, kpiBoxY + 20);

      // Box 2: Total Revenue at Risk
      doc.roundedRect(76, kpiBoxY, 58, 26, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('ESTIMATED REVENUE AT RISK', 80, kpiBoxY + 8);
      doc.setTextColor(220, 38, 38); // Red
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('-$18,420 / mo', 80, kpiBoxY + 20);

      // Box 3: Total Issues Identified
      doc.roundedRect(138, kpiBoxY, 58, 26, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('CRITICAL / HIGH ISSUES', 142, kpiBoxY + 8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${issues.length} Items`, 142, kpiBoxY + 20);

      // Section 2: Executive Commentary
      const execSummaryY = kpiBoxY + 36;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Executive Summary & Commercial Impact', 14, execSummaryY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const summaryText =
        `During the automated technical crawl and Core Web Vitals audit conducted on ${auditedDomain}, our system identified significant traffic leakage caused by faceted filter indexation and mobile Largest Contentful Paint (LCP) delays. By resolving the critical issues itemized below via Staging sandbox testing, we estimate a 15-22% organic traffic recovery within 60 days of deployment.`;
      doc.text(doc.splitTextToSize(summaryText, 182), 14, execSummaryY + 6);

      // Section 3: Detailed Audited Issues List
      const tableStartY = execSummaryY + 28;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Audited Technical Issues & Remediation Action Plan', 14, tableStartY);

      let currentY = tableStartY + 8;

      issues.forEach((issue, index) => {
        // Prevent overflow onto new page
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }

        // Issue Card Background
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, currentY, 182, 25, 2, 2, 'FD');

        // Severity indicator bar on left
        if (issue.severity === 'critical') {
          doc.setFillColor(220, 38, 38);
        } else if (issue.severity === 'warning') {
          doc.setFillColor(217, 119, 6);
        } else {
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        }
        doc.rect(14, currentY, 3, 25, 'F');

        // Issue title & category
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${issue.title}`, 20, currentY + 6);

        // Category Tag & Severity
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Category: ${issue.category}  |  Severity: ${issue.severity.toUpperCase()}  |  Est. Fix Time: ${issue.fixTime}`,
          20,
          currentY + 12
        );

        // Impact Description
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8.5);
        doc.text(doc.splitTextToSize(issue.impact, 170), 20, currentY + 18);

        currentY += 28;
      });

      // Footer Note & Page Number
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated by ${agencyName} using SEO Flow Studio  ·  All rights reserved`,
        14,
        287
      );
      doc.text('Page 1 of 1', 196, 287, { align: 'right' });

      // Save and Download
      const fileName = `SEO_Audit_Report_${auditedDomain.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>White-Label Report Engine</span>
              <span aria-hidden="true">·</span>
              <span>jsPDF Client-Side Generation</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Ready to Export</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Generador de Informes Ejecutivos PDF (White-Label)
            </h2>
          </div>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating PDF...' : 'Export Audit Report (PDF)'}
          </button>
        </div>

        <p className="text-xs text-slate-400 pt-4 leading-relaxed">
          Transforma las incidencias detectadas en una propuesta de consultoría formal en formato PDF (A4) lista para entregar a clientes o directivos de marketing, personalizada con los colores y el logotipo de tu agencia.
        </p>
      </section>

      {/* White-Label Customization Settings & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Left Column */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Configuración de Marca Blanca (Agency White-Label)
          </h3>

          <div>
            <label className="block text-slate-400 mb-1">Nombre de tu Agencia</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Consultor Responsable / Cargo</label>
            <input
              type="text"
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Nombre del Cliente / Empresa Auditada</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Título del Informe</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
            />
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-slate-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              Paleta Cromática del PDF
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((key) => {
                const item = THEMES[key];
                const isSelected = selectedTheme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTheme(key)}
                    className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.accentHex }}
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Uploader */}
          <div>
            <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Subir Logotipo de la Agencia (PNG o JPEG)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleLogoUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
            />
            {logoPreview && (
              <div className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                <span className="text-slate-400">Logotipo cargado</span>
                <button
                  type="button"
                  onClick={() => setLogoPreview(null)}
                  className="text-red-400 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Document Preview Right Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Vista Previa del Documento A4
            </span>
            <span className="text-slate-400 font-mono">
              {issues.length} incidencias preparadas
            </span>
          </div>

          {/* Paper Mockup */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 shadow-2xl space-y-5 text-xs">
            {/* Header Strip */}
            <div
              className="p-3.5 rounded text-white flex items-center justify-between"
              style={{ backgroundColor: currentTheme.accentHex }}
            >
              <span className="font-bold tracking-wider">{agencyName.toUpperCase()}</span>
              <span className="text-[10px] opacity-80">CONFIDENTIAL EXECUTIVE AUDIT</span>
            </div>

            {/* Document Title & Meta */}
            <div className="space-y-1">
              <div className="text-lg font-bold text-white">{reportTitle}</div>
              <div className="text-slate-400">
                Prepared for: <strong className="text-slate-200">{clientName}</strong> ({auditedDomain})
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Lead Auditor: {consultantName} · Generated: {new Date().toLocaleDateString('en-US')}
              </div>
            </div>

            {/* Simulated KPI Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-[10px] text-slate-500 block">HEALTH SCORE</span>
                <span className="text-base font-bold text-emerald-400">84 / 100</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-[10px] text-slate-500 block">REVENUE AT RISK</span>
                <span className="text-base font-bold text-red-400">-$18,420 / mo</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-[10px] text-slate-500 block">ISSUES AUDITED</span>
                <span className="text-base font-bold text-slate-200">{issues.length} Items</span>
              </div>
            </div>

            {/* Issues Sample Snippets */}
            <div className="space-y-2 pt-1">
              <span className="font-semibold text-slate-300 block text-[11px]">
                Incidencias a Imprimir en el PDF:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {issues.map((iss, index) => (
                  <div
                    key={iss.id}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">
                        {index + 1}. {iss.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{iss.impact}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                      {iss.fixTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ready for download via jsPDF</span>
              <button
                type="button"
                onClick={handleGeneratePdf}
                className="text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                Descargar Informe Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
