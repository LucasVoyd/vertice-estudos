// Reconstrução limpa e determinística dos algoritmos extraídos na Fase 1 (REA)
// 1. Parser de Editais Verticalizados ("Colar conteúdo do edital" - baseado no módulo 8174)
// 2. Pesos de Disciplinas e Gerador de Ciclo (WeightSubject)
// 3. Metas Semanais e Alerta de Ritmo (goalAlert)

export const DEFAULT_PARSE_OPTIONS = {
  stripMarker: true,
  ignoreDuplicates: true,
  splitBySeparator: false,
  splitByNumbering: false,
  maxDepth: 4
};

const MARKER_REGEX = /^\s*(?:(\d+(?:[.)]\d+)*)[.)]?|([IVXLCDM]+)\s*[.)\u2013-]|([a-zA-Z])\s*[.)]|([-\u2013\u2022*]))\s*[-\u2013]?\s+/;

const BOILERPLATE_PATTERNS = [
  /^anexo\b/i,
  /^conhecimentos\s+(espec[íi]ficos|b[áa]sicos|gerais)\s*:?\s*$/i,
  /^cargo\s*:/i,
  /^p[áa]gina\s+\d+/i,
  /^\d+\s*$/,
  /^(conte[úu]do\s+program[áa]tico)\s*:?\s*$/i
];

const INLINE_NUMBERING_REGEX = /(^|[^\d.])(\d+(?:\.\d+)*)\s+(?=[A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ])/g;

export function normalizeTopicName(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^\s*(?:\d+(?:[.)]\d+)*[.)]?|[ivxlcdm]+[.)]|[a-z][.)]|[-\u2013\u2022*])\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function suggestsInlineNumbering(text) {
  const lines = (text || '').split('\n').filter(l => l.trim());
  return lines.some(line => {
    const matches = line.match(INLINE_NUMBERING_REGEX);
    return (matches ? matches.length : 0) >= 2;
  });
}

export function suggestsInlineSeparator(text) {
  const lines = (text || '').split('\n').filter(l => l.trim());
  return lines.some(line => {
    const matches = line.match(/[;/]/g);
    return (matches ? matches.length : 0) >= 3;
  });
}

function getIndentWidth(rawLine) {
  const match = (rawLine || '').match(/^[\t ]*/);
  return (match ? match[0] : '').replace(/\t/g, '    ').length;
}

/**
 * Analisa um texto colado de edital e organiza em tópicos e subtópicos (depth 0..maxDepth).
 */
export function parseEditalText(text, customOptions = {}) {
  const rawText = text || '';
  const autoNumbering = customOptions.splitByNumbering ?? suggestsInlineNumbering(rawText);
  const autoSeparator = customOptions.splitBySeparator ?? (!autoNumbering && suggestsInlineSeparator(rawText));

  const options = {
    ...DEFAULT_PARSE_OPTIONS,
    ...customOptions,
    splitByNumbering: autoNumbering,
    splitBySeparator: autoSeparator,
    existingNames: customOptions.existingNames || []
  };

  // 1. Dividir o texto em partes (linhas + expansão inline linha a linha quando aplicável)
  const rawLines = rawText.split('\n');
  let parts = rawLines;
  let splitStrategy = 'newline';

  if (options.splitByNumbering) {
    parts = rawLines.flatMap(line => {
      const matches = line.match(INLINE_NUMBERING_REGEX);
      if ((matches ? matches.length : 0) >= 2) {
        splitStrategy = 'numbering';
        return line.replace(INLINE_NUMBERING_REGEX, '$1\n$2 ').split('\n');
      }
      return [line];
    });
  } else if (options.splitBySeparator) {
    parts = rawLines.flatMap(line => {
      const matches = line.match(/[;/]/g);
      if ((matches ? matches.length : 0) >= 3) {
        splitStrategy = 'separator';
        return line.split(/\s*[;/]\s*/);
      }
      return [line];
    });
  }

  const nonEmpty = parts
    .map(raw => ({ raw, trimmed: raw.trim() }))
    .filter(item => item.trimmed.length > 0);

  const counts = {
    'depth-clamped': 0,
    duplicate: 0,
    'too-long': 0,
    boilerplate: 0
  };

  // 2. Classificar marcador e calcular rawDepth de cada linha
  const classified = nonEmpty.map(({ raw, trimmed }) => {
    const m = trimmed.match(MARKER_REGEX);
    if (!m) {
      return { raw, trimmed, kind: 'none', rawDepth: 0, body: trimmed };
    }
    const [fullMatch, numGroup, romanGroup, letterGroup, bulletGroup] = m;
    const body = trimmed.slice(fullMatch.length).trim();

    if (numGroup) {
      const dots = numGroup.match(/[.)]/g);
      return {
        raw,
        trimmed,
        label: numGroup,
        kind: 'numeric',
        rawDepth: dots ? dots.length : 0,
        body
      };
    }
    if (romanGroup) {
      return { raw, trimmed, label: romanGroup, kind: 'roman', rawDepth: 1, body };
    }
    if (letterGroup) {
      return { raw, trimmed, label: letterGroup, kind: 'letter', rawDepth: 1, body };
    }
    return { raw, trimmed, label: bulletGroup, kind: 'bullet', rawDepth: 0, body };
  });

  const kinds = classified.map(c => c.kind);
  let markerKind = 'none';
  if (kinds.includes('numeric')) markerKind = 'numeric';
  else if (kinds.includes('roman')) markerKind = 'roman';
  else if (kinds.includes('letter')) markerKind = 'letter';
  else if (kinds.includes('bullet')) markerKind = 'bullet';

  let indentLevels = [];
  if (markerKind === 'none' || markerKind === 'bullet') {
    indentLevels = [...new Set(nonEmpty.map(item => getIndentWidth(item.raw)))].sort((a, b) => a - b);
    if (indentLevels.length > 1) {
      markerKind = 'indent';
    }
  }

  const seenSet = new Set(options.existingNames.map(normalizeTopicName));
  const lines = [];
  let prevDepth = -1;

  classified.forEach((item, index) => {
    let depth = item.rawDepth;
    if (markerKind === 'indent') {
      depth = Math.max(0, indentLevels.indexOf(getIndentWidth(item.raw)));
    } else if (item.kind === 'none' && markerKind === 'numeric') {
      depth = Math.max(0, prevDepth);
    }

    if (depth > options.maxDepth) {
      counts['depth-clamped'] += 1;
      depth = options.maxDepth;
    }

    // Impede salto de profundidade maior que +1 em relação ao item anterior
    depth = Math.min(depth, prevDepth + 1);
    prevDepth = depth;

    // Se numeração é estrutural (1 / 1.1), preservamos ou limpamos conforme opção
    let cleanName = options.stripMarker ? item.body : item.trimmed;
    cleanName = cleanName.replace(/[.;:]+$/, '').replace(/\s+/g, ' ').trim();
    if (!cleanName) cleanName = item.trimmed;

    let issue = null;
    let include = true;
    const norm = normalizeTopicName(cleanName);

    if (BOILERPLATE_PATTERNS.some(rx => rx.test(cleanName))) {
      issue = 'boilerplate';
      include = false;
      counts.boilerplate += 1;
    } else if (seenSet.has(norm)) {
      issue = 'duplicate';
      include = !options.ignoreDuplicates;
      counts.duplicate += 1;
    } else if (cleanName.length > 255) {
      issue = 'too-long';
      counts['too-long'] += 1;
    }

    if (include && !issue) {
      seenSet.add(norm);
    }

    lines.push({
      index,
      raw: item.raw,
      name: cleanName,
      depth,
      sourceLabel: item.label || null,
      include,
      issue
    });
  });

  return {
    lines,
    markerKind,
    counts,
    splitStrategy
  };
}

/**
 * Converte as linhas aprovadas do parser em uma lista hierárquica de tópicos numerados (1, 1.1, 1.2, 2...)
 */
export function linesToTopicsTree(approvedLines, existingRootCount = 0) {
  const counters = [existingRootCount];
  const stack = [];
  const result = [];

  approvedLines.forEach((line, idx) => {
    const depth = Math.min(line.depth || 0, counters.length);
    counters.length = depth + 1;
    counters[depth] = (counters[depth] || 0) + 1;

    const numberStr = counters.slice(0, depth + 1).join('.');
    const id = `t_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`;

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    const parentId = stack.length ? stack[stack.length - 1].id : null;
    stack.push({ depth, id });

    result.push({
      id,
      number: numberStr,
      label: line.name.trim(),
      name: `${numberStr}. ${line.name.trim()}`,
      depth,
      parentId,
      finished: false,
      finishedAt: null,
      questionsHit: 0,
      questionsMiss: 0,
      studiedMinutes: 0,
      lastStudiedAt: null,
      teoria: line.teoria || null,
      questions: line.questions || []
    });
  });

  return result;
}

/**
 * Fórmula exata do Estudei (WeightSubject em 266.*.js @207941):
 * weightAbsolute = 2^(-knowledge) * importance
 * Onde knowledge: 1.5 (Iniciante/Novo), 2.5 (Intermediário/Estudando), 3.5 (Avançado/Concluído)
 * E importance: 1 a 5 (padrão 2.5)
 */
export function calculateSubjectWeight(knowledge = 1.5, importance = 2.5) {
  return Math.pow(2, -1 * Number(knowledge)) * Number(importance);
}

/**
 * Gera os blocos do Ciclo de Estudos (Roda + Sequência) distribuindo o tempo semanal proporcionalmente aos pesos
 * e intercalando as disciplinas em blocos de 30 a 90 minutos.
 */
export function generateStudyCycle(subjects, totalCycleHours = 12) {
  const active = (subjects || []).filter(s => s && s.includeInCycle !== false);
  if (!active.length) return [];

  const totalMinutes = Math.max(60, Math.round(Number(totalCycleHours) * 60));
  const withWeights = active.map(s => {
    const wAbs = calculateSubjectWeight(s.knowledge ?? 1.5, s.importance ?? 2.5);
    return { ...s, weightAbsolute: wAbs };
  });

  const sumWeights = withWeights.reduce((acc, s) => acc + s.weightAbsolute, 0) || 1;

  // Aloca minutos por disciplina (arredondado em múltiplos de 30 min, mínimo 30 min)
  const buckets = withWeights.map(s => {
    const rawMins = (s.weightAbsolute / sumWeights) * totalMinutes;
    const rounded = Math.max(30, Math.round(rawMins / 30) * 30);
    // Quebra em sessões de 30 min ou 60 min
    const sessions = [];
    let rem = rounded;
    while (rem > 0) {
      const slot = rem >= 60 ? 60 : 30;
      sessions.push(slot);
      rem -= slot;
    }
    return {
      subject: s,
      sessions
    };
  });

  // Intercala (Round-Robin) para não estudar a mesma matéria várias vezes seguidas
  const cycleItems = [];
  let maxLen = Math.max(...buckets.map(b => b.sessions.length));
  let seq = 1;
  for (let i = 0; i < maxLen; i++) {
    for (const b of buckets) {
      if (i < b.sessions.length) {
        cycleItems.push({
          id: `cyc_${seq++}_${b.subject.id}`,
          subjectId: b.subject.id,
          subjectName: b.subject.name,
          subjectColor: b.subject.color,
          duration: b.sessions[i], // em minutos
          durationStudied: 0,
          suggestedTopic: null
        });
      }
    }
  }

  return cycleItems;
}

/**
 * Fórmula exata do Alerta de Ritmo Semanal (goalAlert em 197.*.js):
 * Calcula quanto era esperado até o dia atual da semana e arredonda a sugestão diária em blocos de 5 min.
 */
export function computeWeeklyGoalAlert(targetMinutes, achievedMinutes, currentDayOfWeek1to7 = null) {
  if (!targetMinutes || targetMinutes <= 0) return null;
  const dayIndex = currentDayOfWeek1to7 ?? (new Date().getDay() + 1); // 1 = Dom .. 7 = Sab
  const daysElapsed = Math.min(7, Math.max(1, dayIndex));
  const daysRemaining = 7 - daysElapsed + 1;
  const expectedSoFar = (targetMinutes * daysElapsed) / 7;
  const remainingMinutes = Math.max(0, targetMinutes - achievedMinutes);
  const perDayRaw = daysRemaining > 0 ? remainingMinutes / daysRemaining : remainingMinutes;
  const perDayRounded5Min = 5 * Math.ceil(perDayRaw / 5);

  const fmt = mins => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0 && m > 0) return `${h}h ${m.toString().padStart(2, '0')}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  };

  if (remainingMinutes === 0) {
    return {
      tone: 'success',
      title: 'Meta da semana batida!',
      text: 'Você já cumpriu as horas planejadas. O que vier agora é bônus.'
    };
  }

  if (achievedMinutes >= 0.9 * expectedSoFar) {
    return {
      tone: 'success',
      title: 'Você está num ótimo ritmo!',
      text: `Faltam ${fmt(remainingMinutes)} para sua meta semanal. Mantendo ${fmt(perDayRounded5Min)} por dia, você fecha a semana no alvo.`
    };
  }

  return {
    tone: 'warning',
    title: 'Atenção ao ritmo da semana!',
    text: `Você estudou menos do que o esperado até agora. Faltam ${fmt(remainingMinutes)}: que tal ${fmt(perDayRounded5Min)} por dia até o fim da semana?`
  };
}
