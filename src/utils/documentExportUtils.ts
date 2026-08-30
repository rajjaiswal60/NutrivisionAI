import { DeliverableSuite } from '../types';
import pptxgen from 'pptxgenjs';

/**
 * Exports a Deliverable Suite as a beautifully formatted Microsoft Word Document (.doc / XML HTML document)
 */
export function exportSuiteToWord(suite: DeliverableSuite, country: string = 'Global') {
  const content = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${suite.title} - Executive Strategic Blueprint</title>
  <style>
    body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; }
    h1 { color: #0f172a; font-size: 24pt; border-bottom: 2pt solid #d97706; padding-bottom: 6pt; margin-top: 18pt; }
    h2 { color: #1e3a8a; font-size: 16pt; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 16pt; }
    h3 { color: #b45309; font-size: 13pt; margin-top: 12pt; }
    p { margin: 6pt 0; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    th { background-color: #f1f5f9; color: #0f172a; border: 1pt solid #cbd5e1; padding: 8pt; text-align: left; font-weight: bold; }
    td { border: 1pt solid #e2e8f0; padding: 7pt; }
    .badge { background-color: #fef3c7; color: #92400e; padding: 2pt 6pt; border-radius: 4pt; font-weight: bold; font-size: 9pt; }
    .callout { background-color: #f8fafc; border-left: 4pt solid #d97706; padding: 10pt; margin: 12pt 0; }
    .footer { font-size: 9pt; color: #64748b; margin-top: 30pt; border-top: 1pt solid #e2e8f0; padding-top: 8pt; text-align: center; }
  </style>
</head>
<body>
  <div class="callout">
    <span class="badge">VYUHA AI STRATEGIC VENTURE BLUEPRINT</span>
    <h1>${suite.title}</h1>
    <p><strong>Tagline:</strong> ${suite.tagline}</p>
    <p><strong>Target Market Base:</strong> ${country} | <strong>Generated:</strong> ${new Date(suite.createdAt).toLocaleDateString()}</p>
  </div>

  <h2>1. Executive Summary & Market Arbitrage</h2>
  <p><strong>Vision:</strong> ${suite.executiveSummary.vision}</p>
  <p><strong>Problem Statement:</strong> ${suite.executiveSummary.problemStatement}</p>
  <p><strong>Solution Architecture:</strong> ${suite.executiveSummary.solutionOverview}</p>
  <p><strong>Market Arbitrage Thesis:</strong> ${suite.executiveSummary.marketArbitrageThesis}</p>

  <h3>Financial Model Target</h3>
  <table>
    <thead>
      <tr>
        <th>Year 1 Target</th>
        <th>Year 2 Target</th>
        <th>Year 3 Target</th>
        <th>Break-Even</th>
        <th>EBITDA Margin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${suite.executiveSummary.financialModel.year1Revenue}</td>
        <td>${suite.executiveSummary.financialModel.year2Revenue}</td>
        <td>${suite.executiveSummary.financialModel.year3Revenue}</td>
        <td>${suite.executiveSummary.financialModel.breakEvenMonth}</td>
        <td>${suite.executiveSummary.financialModel.ebitdaMargin}</td>
      </tr>
    </tbody>
  </table>

  <h3>Structural Moats & Competitive Defensibility</h3>
  <ul>
    ${suite.executiveSummary.competitiveMoats.map(m => `<li>${m}</li>`).join('')}
  </ul>

  <h2>2. Pin-to-Plane Execution Architecture</h2>
  <h3>Phase 1: 0–30 Days (Pilot Sprint)</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.phase1_30Days.map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h3>Phase 2: 30–90 Days (Scale & GTM Expansion)</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.phase2_90Days.map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h3>Phase 3: 90–180 Days (Autonomous Scale)</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.phase3_180Days.map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h3>Operational SOPs & Protocols</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.operationalSOPs.map(sop => `<li>${sop}</li>`).join('')}
  </ul>

  <h2>3. Operational Skills & Hiring Profiles</h2>
  <table>
    <thead>
      <tr>
        <th>Role</th>
        <th>Candidate Profile & Competency</th>
        <th>Target Compensation</th>
        <th>Talent Source Pool</th>
      </tr>
    </thead>
    <tbody>
      ${suite.skillsEBook.coreRoles.map(r => `
        <tr>
          <td><strong>${r.role}</strong></td>
          <td>${r.profile}</td>
          <td>${r.salaryRange}</td>
          <td>${r.sourcePool}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3>Execution KPI Cadence</h3>
  <ul>
    ${suite.skillsEBook.kpiCadence.map(k => `<li><strong>[${k.frequency}] ${k.metric}:</strong> ${k.target}</li>`).join('')}
  </ul>

  ${suite.videoDeliverable ? `
  <h2>4. Commercial AI Video Script & Storyboard</h2>
  <p><strong>Narrator:</strong> ${suite.videoDeliverable.characterName} (${suite.videoDeliverable.characterRole})</p>
  <p><strong>Hook:</strong> "${suite.videoDeliverable.adHook}"</p>
  <p><strong>Full Voiceover Script:</strong><br>${suite.videoDeliverable.fullScript}</p>
  ` : ''}

  ${suite.legalFramework ? `
  <h2>5. Statutory Legal, Compliance & Corporate Governance Framework</h2>
  <p><strong>Jurisdiction Base:</strong> ${suite.legalFramework.jurisdiction}</p>
  <p><em>${suite.legalFramework.frameworkSummary}</em></p>

  ${suite.legalFramework.levels.map(lvl => `
    <h3>${lvl.title}</h3>
    <p><strong>Statutory Authorities:</strong> ${lvl.statutoryBodies.join(', ')}</p>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Statutory Clause / Covenant</th>
          <th style="width: 50%;">Enforceable Legal Provision</th>
          <th style="width: 20%;">Statutory Act</th>
        </tr>
      </thead>
      <tbody>
        ${lvl.keyClauses.map(c => `
          <tr>
            <td><strong>${c.clauseTitle}</strong></td>
            <td>${c.content}</td>
            <td><em>${c.enforceableAct}</em></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p><strong>Action Checklist:</strong></p>
    <ul>
      ${lvl.actionChecklist.map(a => `<li>${a}</li>`).join('')}
    </ul>
  `).join('')}
  ` : ''}

  <div class="footer">
    Synthesized by Vyuha AI — Autonomous Strategic Advisor & Venture Factory • Confidential
  </div>
</body>
</html>
`;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `VyuhaAI_${suite.title.replace(/[^a-zA-Z0-9]/g, '_')}_BusinessDocument.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a Deliverable Suite as a genuine, native Microsoft PowerPoint Presentation (.pptx)
 * 100% compatible with PowerPoint, Google Slides, Apple Keynote, and LibreOffice.
 */
export async function exportSuiteToPowerPoint(suite: DeliverableSuite, country: string = 'Global') {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Vyuha AI';
  pptx.company = 'Vyuha AI Venture Factory';
  pptx.title = `${suite.title} - Pitch Deck`;

  const BG_DARK = '09090B';
  const CARD_BG = '18181B';
  const GOLD = 'F59E0B';
  const TEXT_WHITE = 'FFFFFF';
  const TEXT_MUTED = '94A3B8';

  // ----------------------------------------------------
  // Slide 1: Cover Slide
  // ----------------------------------------------------
  const slide1 = pptx.addSlide();
  slide1.background = { color: BG_DARK };
  
  slide1.addText('VYUHA AI • VENTURE FACTORY', {
    x: 0.8,
    y: 1.2,
    w: 4.2,
    h: 0.45,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: GOLD,
    fill: { color: '27272A' },
    align: 'center'
  });

  slide1.addText(suite.title, {
    x: 0.8,
    y: 1.9,
    w: 11.5,
    h: 1.4,
    fontSize: 32,
    fontFace: 'Arial',
    bold: true,
    color: TEXT_WHITE,
    breakLine: true
  });

  slide1.addText(suite.tagline, {
    x: 0.8,
    y: 3.5,
    w: 11.5,
    h: 0.9,
    fontSize: 18,
    fontFace: 'Arial',
    color: GOLD,
    italic: true
  });

  slide1.addText(`Target Market Base: ${country}  |  Generated: ${new Date(suite.createdAt).toLocaleDateString()}  |  Confidential Strategic Memo`, {
    x: 0.8,
    y: 6.2,
    w: 11.5,
    h: 0.5,
    fontSize: 11,
    fontFace: 'Arial',
    color: TEXT_MUTED
  });

  // ----------------------------------------------------
  // Slide 2: Problem Statement & Arbitrage Moat
  // ----------------------------------------------------
  const slide2 = pptx.addSlide();
  slide2.background = { color: BG_DARK };
  slide2.addText('MARKET OPPORTUNITY & ARBITRAGE MOAT', {
    x: 0.8, y: 0.5, w: 11.5, h: 0.6,
    fontSize: 22, fontFace: 'Arial', bold: true, color: GOLD
  });

  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.3, w: 5.5, h: 2.3,
    fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
  });
  slide2.addText('Problem Statement & Market Friction', {
    x: 1.0, y: 1.45, w: 5.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide2.addText(suite.executiveSummary.problemStatement, {
    x: 1.0, y: 1.85, w: 5.1, h: 1.6,
    fontSize: 10, fontFace: 'Arial', color: 'E2E8F0'
  });

  slide2.addShape(pptx.ShapeType.rect, {
    x: 6.8, y: 1.3, w: 5.5, h: 2.3,
    fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
  });
  slide2.addText('Strategic Arbitrage Thesis', {
    x: 7.0, y: 1.45, w: 5.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide2.addText(suite.executiveSummary.marketArbitrageThesis, {
    x: 7.0, y: 1.85, w: 5.1, h: 1.6,
    fontSize: 10, fontFace: 'Arial', color: 'E2E8F0'
  });

  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 3.9, w: 11.5, h: 2.7,
    fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
  });
  slide2.addText('Defensibility & Competitive Moats', {
    x: 1.0, y: 4.05, w: 11.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  const moatsBullets = suite.executiveSummary.competitiveMoats.map(m => `• ${m}`).join('\n\n');
  slide2.addText(moatsBullets, {
    x: 1.0, y: 4.45, w: 11.1, h: 1.9,
    fontSize: 10, fontFace: 'Arial', color: 'E2E8F0'
  });

  // ----------------------------------------------------
  // Slide 3: Financial Targets & Unit Economics
  // ----------------------------------------------------
  const slide3 = pptx.addSlide();
  slide3.background = { color: BG_DARK };
  slide3.addText('FINANCIAL MODEL & UNIT ECONOMICS', {
    x: 0.8, y: 0.5, w: 11.5, h: 0.6,
    fontSize: 22, fontFace: 'Arial', bold: true, color: GOLD
  });

  const kpis = [
    { label: 'Year 1 Target', val: suite.executiveSummary.financialModel.year1Revenue },
    { label: 'Year 2 Target', val: suite.executiveSummary.financialModel.year2Revenue },
    { label: 'Break-Even', val: suite.executiveSummary.financialModel.breakEvenMonth },
    { label: 'EBITDA Margin', val: suite.executiveSummary.financialModel.ebitdaMargin }
  ];

  kpis.forEach((kpi, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide3.addShape(pptx.ShapeType.rect, {
      x: xPos, y: 1.3, w: 2.75, h: 1.7,
      fill: { color: '1E1B4B' }, line: { color: '4338CA', width: 1 }
    });
    slide3.addText(kpi.val, {
      x: xPos + 0.1, y: 1.45, w: 2.55, h: 0.8,
      fontSize: 15, fontFace: 'Arial', bold: true, color: '818CF8', align: 'center'
    });
    slide3.addText(kpi.label, {
      x: xPos + 0.1, y: 2.25, w: 2.55, h: 0.5,
      fontSize: 11, fontFace: 'Arial', color: 'C7D2FE', align: 'center'
    });
  });

  slide3.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 3.3, w: 11.5, h: 3.3,
    fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
  });
  slide3.addText('Year 3 Target & Commercial Vision', {
    x: 1.0, y: 3.45, w: 11.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide3.addText(`Year 3 Revenue Potential: ${suite.executiveSummary.financialModel.year3Revenue}\n\nStrategic Vision:\n${suite.executiveSummary.vision}`, {
    x: 1.0, y: 3.9, w: 11.1, h: 2.5,
    fontSize: 11, fontFace: 'Arial', color: 'E2E8F0'
  });

  // ----------------------------------------------------
  // Slide 4: Pin-to-Plane 180-Day Architecture
  // ----------------------------------------------------
  const slide4 = pptx.addSlide();
  slide4.background = { color: BG_DARK };
  slide4.addText('PIN-TO-PLANE EXECUTION ARCHITECTURE', {
    x: 0.8, y: 0.5, w: 11.5, h: 0.6,
    fontSize: 22, fontFace: 'Arial', bold: true, color: GOLD
  });

  const phases = [
    { title: 'Phase 1: 0–30 Days (Pilot Sprint)', items: suite.pinToPlaneArchitecture.phase1_30Days },
    { title: 'Phase 2: 30–90 Days (Scale & GTM)', items: suite.pinToPlaneArchitecture.phase2_90Days },
    { title: 'Phase 3: 90–180 Days (Automate)', items: suite.pinToPlaneArchitecture.phase3_180Days }
  ];

  phases.forEach((ph, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide4.addShape(pptx.ShapeType.rect, {
      x: xPos, y: 1.3, w: 3.75, h: 5.3,
      fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
    });
    slide4.addText(ph.title, {
      x: xPos + 0.15, y: 1.45, w: 3.45, h: 0.5,
      fontSize: 12, fontFace: 'Arial', bold: true, color: GOLD
    });
    const bullets = ph.items.map(i => `• ${i}`).join('\n\n');
    slide4.addText(bullets, {
      x: xPos + 0.15, y: 2.05, w: 3.45, h: 4.3,
      fontSize: 9.5, fontFace: 'Arial', color: 'CBD5E1'
    });
  });

  // ----------------------------------------------------
  // Slide 5: Core Team Roles & KPIs
  // ----------------------------------------------------
  const slide5 = pptx.addSlide();
  slide5.background = { color: BG_DARK };
  slide5.addText('OPERATIONAL ROLES & CADENCE KPIS', {
    x: 0.8, y: 0.5, w: 11.5, h: 0.6,
    fontSize: 22, fontFace: 'Arial', bold: true, color: GOLD
  });

  const tableData: any[][] = [
    [
      { text: 'Role Title', options: { bold: true, color: GOLD, fill: { color: '27272A' } } },
      { text: 'Compensation', options: { bold: true, color: GOLD, fill: { color: '27272A' } } },
      { text: 'Candidate Profile & Source', options: { bold: true, color: GOLD, fill: { color: '27272A' } } }
    ]
  ];

  suite.skillsEBook.coreRoles.forEach(r => {
    tableData.push([
      { text: r.role, options: { bold: true, color: 'FFFFFF' } },
      { text: r.salaryRange, options: { color: '818CF8' } },
      { text: `${r.profile} (Source: ${r.sourcePool})`, options: { color: 'CBD5E1' } }
    ]);
  });

  slide5.addTable(tableData, {
    x: 0.8, y: 1.3, w: 11.5,
    colW: [3.2, 2.8, 5.5],
    fontSize: 10,
    border: { pt: 1, color: '3F3F46' },
    fill: { color: CARD_BG }
  });

  // KPIs Box
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 4.4, w: 11.5, h: 2.2,
    fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
  });
  slide5.addText('Execution Cadence & Benchmarks', {
    x: 1.0, y: 4.55, w: 11.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: GOLD
  });
  const kpiText = suite.skillsEBook.kpiCadence.map(k => `• [${k.frequency}] ${k.metric} -> Target: ${k.target}`).join('\n');
  slide5.addText(kpiText, {
    x: 1.0, y: 4.95, w: 11.1, h: 1.5,
    fontSize: 10.5, fontFace: 'Arial', color: 'E2E8F0'
  });

  // ----------------------------------------------------
  // Slide 6: Corporate Governance & Statutory Legal Framework
  // ----------------------------------------------------
  const slide6 = pptx.addSlide();
  slide6.background = { color: BG_DARK };

  slide6.addText('05 / LEGAL & GOVERNANCE', {
    x: 0.8, y: 0.5, w: 5.0, h: 0.3,
    fontSize: 10, fontFace: 'Arial', bold: true, color: GOLD
  });
  slide6.addText('Corporate Governance, Statutory Compliance & Legal Moats', {
    x: 0.8, y: 0.8, w: 11.5, h: 0.55,
    fontSize: 20, fontFace: 'Arial', bold: true, color: TEXT_WHITE
  });

  const legalJurisdiction = suite.legalFramework?.jurisdiction || country;
  slide6.addText(`Jurisdiction & Sovereign Compliance Architecture: ${legalJurisdiction}`, {
    x: 0.8, y: 1.4, w: 11.5, h: 0.3,
    fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED
  });

  const levelsToRender = suite.legalFramework?.levels || [];
  const levelColWidth = 2.25;
  const levelGap = 0.15;
  const startX = 0.8;

  levelsToRender.slice(0, 5).forEach((lvl, idx) => {
    const cardX = startX + idx * (levelColWidth + levelGap);
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: cardX, y: 1.85, w: levelColWidth, h: 4.8,
      rectRadius: 0.08,
      fill: { color: CARD_BG }, line: { color: '3F3F46', width: 1 }
    });

    slide6.addText(`L${lvl.levelNumber}`, {
      x: cardX + 0.1, y: 1.95, w: levelColWidth - 0.2, h: 0.3,
      fontSize: 12, fontFace: 'Arial', bold: true, color: GOLD
    });

    slide6.addText(lvl.title.replace(/^Level \d+: /, ''), {
      x: cardX + 0.1, y: 2.3, w: levelColWidth - 0.2, h: 0.7,
      fontSize: 10, fontFace: 'Arial', bold: true, color: TEXT_WHITE
    });

    const authorities = `Statutory:\n${lvl.statutoryBodies.slice(0, 2).join('\n')}`;
    slide6.addText(authorities, {
      x: cardX + 0.1, y: 3.05, w: levelColWidth - 0.2, h: 0.65,
      fontSize: 8.5, fontFace: 'Arial', color: 'A1A1AA'
    });

    const mainClause = lvl.keyClauses[0]?.content || '';
    slide6.addText(mainClause.length > 150 ? mainClause.slice(0, 147) + '...' : mainClause, {
      x: cardX + 0.1, y: 3.75, w: levelColWidth - 0.2, h: 2.75,
      fontSize: 8, fontFace: 'Arial', color: 'E2E8F0', lineSpacingMultiple: 1.1
    });
  });

  // Write genuine .pptx file
  const cleanTitle = suite.title.replace(/[^a-zA-Z0-9]/g, '_');
  await pptx.writeFile({ fileName: `VyuhaAI_${cleanTitle}_PitchDeck.pptx` });
}

/**
 * Exports Deliverable Suite formatted for PDF Printing
 */
export function exportSuiteToPDF(suite: DeliverableSuite, country: string = 'Global') {
  // Create an iframe or printable window to trigger precise styled PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${suite.title} - Executive Strategic Blueprint</title>
  <style>
    @media print {
      @page { margin: 1.5cm; size: A4; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 24px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #d97706; padding-bottom: 16px; margin-bottom: 24px; }
    .badge { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { font-size: 24px; font-weight: 800; margin: 12px 0 6px 0; color: #0f172a; }
    .tagline { font-size: 14px; color: #475569; font-style: italic; }
    h2 { font-size: 16px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; text-transform: uppercase; }
    h3 { font-size: 13px; font-weight: 700; color: #b45309; margin-top: 14px; }
    p, li { font-size: 12px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
    th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-weight: bold; }
    td { border: 1px solid #e2e8f0; padding: 8px; }
    .moats { background: #f8fafc; border-left: 3px solid #f59e0b; padding: 10px 14px; margin: 12px 0; }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">VYUHA AI • INSTITUTIONAL STRATEGIC BLUEPRINT</span>
    <h1>${suite.title}</h1>
    <div class="tagline">${suite.tagline}</div>
    <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
      Target Base: ${country} | Generated: ${new Date(suite.createdAt).toLocaleDateString()}
    </div>
  </div>

  <h2>1. Executive Summary & Market Arbitrage</h2>
  <p><strong>Vision:</strong> ${suite.executiveSummary.vision}</p>
  <p><strong>Problem Statement:</strong> ${suite.executiveSummary.problemStatement}</p>
  <p><strong>Solution Architecture:</strong> ${suite.executiveSummary.solutionOverview}</p>
  <p><strong>Arbitrage Thesis:</strong> ${suite.executiveSummary.marketArbitrageThesis}</p>

  <h3>Target Financial Model</h3>
  <table>
    <thead>
      <tr>
        <th>Year 1 Target</th>
        <th>Year 2 Target</th>
        <th>Year 3 Target</th>
        <th>Break-Even</th>
        <th>EBITDA Margin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${suite.executiveSummary.financialModel.year1Revenue}</strong></td>
        <td><strong>${suite.executiveSummary.financialModel.year2Revenue}</strong></td>
        <td><strong>${suite.executiveSummary.financialModel.year3Revenue}</strong></td>
        <td><strong>${suite.executiveSummary.financialModel.breakEvenMonth}</strong></td>
        <td><strong>${suite.executiveSummary.financialModel.ebitdaMargin}</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>2. 90-Day Execution Roadmap</h2>
  <h3>Phase 1: 0–30 Days (Pilot Sprint)</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.phase1_30Days.map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h3>Phase 2: 30–90 Days (Scale & GTM Expansion)</h3>
  <ul>
    ${suite.pinToPlaneArchitecture.phase2_90Days.map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h2>3. Core Team Profiles & KPIs</h2>
  <table>
    <thead>
      <tr>
        <th>Role</th>
        <th>Profile</th>
        <th>Compensation</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody>
      ${suite.skillsEBook.coreRoles.map(r => `
        <tr>
          <td><strong>${r.role}</strong></td>
          <td>${r.profile}</td>
          <td>${r.salaryRange}</td>
          <td>${r.sourcePool}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${suite.legalFramework ? `
  <h2>5. Statutory Legal & Corporate Governance Framework</h2>
  <div class="moats">
    <strong>Jurisdiction Base:</strong> ${suite.legalFramework.jurisdiction}<br>
    <em>${suite.legalFramework.frameworkSummary}</em>
  </div>

  ${suite.legalFramework.levels.map(lvl => `
    <h3>${lvl.title}</h3>
    <p><strong>Statutory Bodies:</strong> ${lvl.statutoryBodies.join(', ')}</p>
    <table>
      <thead>
        <tr>
          <th style="width: 35%;">Clause & Covenant</th>
          <th style="width: 45%;">Statutory Text</th>
          <th style="width: 20%;">Enforceable Act</th>
        </tr>
      </thead>
      <tbody>
        ${lvl.keyClauses.map(c => `
          <tr>
            <td><strong>${c.clauseTitle}</strong></td>
            <td>${c.content}</td>
            <td><em>${c.enforceableAct}</em></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p><strong>Action Checklist:</strong></p>
    <ul>
      ${lvl.actionChecklist.map(a => `<li>${a}</li>`).join('')}
    </ul>
  `).join('')}
  ` : ''}

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `);
  printWindow.document.close();
}

/**
 * Exports a Deliverable Suite as a formatted Markdown file (.md)
 */
export function exportSuiteToMarkdown(suite: DeliverableSuite, country: string = 'Global') {
  const mdContent = `# ${suite.title} — Executive Strategic Blueprint
**Tagline:** ${suite.tagline}
**Generated Date:** ${new Date(suite.createdAt).toLocaleString()}
**Engine:** Vyuha AI Autonomous Strategic Advisor & Venture Factory
**Regional Market Base:** ${country}

---

## 1. EXECUTIVE SUMMARY & ARBITRAGE MOAT
- **Executive Vision:** ${suite.executiveSummary.vision}
- **Problem Statement:** ${suite.executiveSummary.problemStatement}
- **Solution Overview:** ${suite.executiveSummary.solutionOverview}
- **Market Arbitrage Thesis:** ${suite.executiveSummary.marketArbitrageThesis}

### Financial Projections
- **Year 1 Target:** ${suite.executiveSummary.financialModel.year1Revenue}
- **Year 2 Target:** ${suite.executiveSummary.financialModel.year2Revenue}
- **Year 3 Target:** ${suite.executiveSummary.financialModel.year3Revenue}
- **Break-Even:** ${suite.executiveSummary.financialModel.breakEvenMonth}
- **Steady-State EBITDA Margin:** ${suite.executiveSummary.financialModel.ebitdaMargin}

### Structural Moats
${suite.executiveSummary.competitiveMoats.map(m => `- ${m}`).join('\n')}

---

## 2. PIN-TO-PLANE EXECUTION ARCHITECTURE

### Phase 1: 0–30 Days (Pilot Sprint)
${suite.pinToPlaneArchitecture.phase1_30Days.map(p => `- ${p}`).join('\n')}

### Phase 2: 30–90 Days (Scale & GTM)
${suite.pinToPlaneArchitecture.phase2_90Days.map(p => `- ${p}`).join('\n')}

### Phase 3: 90–180 Days (Automate & Expand)
${suite.pinToPlaneArchitecture.phase3_180Days.map(p => `- ${p}`).join('\n')}

### Technology Stack
${suite.pinToPlaneArchitecture.techStack.map(t => `- ${t}`).join('\n')}

### Operational SOPs
${suite.pinToPlaneArchitecture.operationalSOPs.map(sop => `- ${sop}`).join('\n')}

### Legal & Regulatory Safeguards
${suite.pinToPlaneArchitecture.complianceLegal.map(c => `- ${c}`).join('\n')}

---

## 3. OPERATIONAL SKILLS & HIRING E-BOOK

### Core Roles & Target Compensation
${suite.skillsEBook.coreRoles.map(r => `#### ${r.role} (${r.salaryRange})\n- **Profile:** ${r.profile}\n- **Sourcing:** ${r.sourcePool}`).join('\n\n')}

### Critical Capabilities
${suite.skillsEBook.criticalSkills.map(s => `- ${s}`).join('\n')}

### KPI Cadence
${suite.skillsEBook.kpiCadence.map(k => `- **${k.metric}** (${k.frequency}): Target ${k.target}`).join('\n')}

---

## 4. COMMERCIAL AI VIDEO COMMERCIAL SCRIPT
${suite.videoDeliverable ? `
- **Title:** ${suite.videoDeliverable.title}
- **Narrator:** ${suite.videoDeliverable.characterName} (${suite.videoDeliverable.characterRole})
- **Duration:** ${suite.videoDeliverable.durationSeconds} seconds

### Storyboard:
${suite.videoDeliverable.storyboard.map(s => `#### Scene ${s.sceneNumber} [${s.timecode}]\n- **Voiceover:** "${s.voiceoverScript}"\n- **Visual Prompt:** ${s.visualPrompt}\n- **Overlay:** ${s.onScreenText}`).join('\n\n')}
` : 'No AI video deliverable attached.'}

${suite.legalFramework ? `
---

## 5. STATUTORY LEGAL, COMPLIANCE & CORPORATE GOVERNANCE FRAMEWORK (5 LEVELS)
**Jurisdiction Base:** ${suite.legalFramework.jurisdiction}
*${suite.legalFramework.frameworkSummary}*

${suite.legalFramework.levels.map(lvl => `
### ${lvl.title}
- **Subtitle:** ${lvl.subtitle}
- **Statutory Bodies:** ${lvl.statutoryBodies.join(', ')}

#### Key Statutory Clauses & Enforceable Provisions:
${lvl.keyClauses.map(c => `##### ${c.clauseTitle}
- **Statutory Provision:** ${c.content}
- **Enforceable Act / Legal Grounding:** ${c.enforceableAct}
`).join('\n')}

#### Statutory Action Checklist:
${lvl.actionChecklist.map(a => `- [ ] ${a}`).join('\n')}
`).join('\n')}
` : ''}
`;

  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${suite.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Executive_Blueprint.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

