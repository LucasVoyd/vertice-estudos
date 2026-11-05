// Utilitários de Data com Fuso Horário Local (Anti-UTC Offset)
// Garante que operações de data no navegador (Cuiabá UTC-4 ou qualquer outro fuso brasileiro)
// nunca troquem o dia ao converter para strings 'YYYY-MM-DD'.

export function getLocalDateIso(dateObj = new Date()) {
  if (!dateObj) return '';
  if (typeof dateObj === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObj.trim())) {
    return dateObj.trim();
  }
  const d =
    typeof dateObj === 'string' && dateObj.includes('-') && dateObj.length <= 10
      ? new Date(dateObj + 'T12:00:00')
      : dateObj instanceof Date
      ? dateObj
      : new Date(dateObj);

  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatBrazilianDate(isoDateStr) {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDateStr;
}

/**
 * Retorna os 7 dias da semana corrente (Domingo a Sábado) no fuso local do usuário.
 */
export function getCurrentWeekDays(baseDate = new Date()) {
  const d = baseDate instanceof Date ? baseDate : new Date(baseDate);
  const currentDayOfWeek = d.getDay(); // 0 = Domingo, 1 = Segunda, ...
  const startOfWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate() - currentDayOfWeek, 0, 0, 0);

  const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  return labels.map((label, idx) => {
    const dayDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + idx);
    const iso = getLocalDateIso(dayDate);
    return { label, iso, dayDate };
  });
}

/**
 * Retorna os últimos N dias anteriores a partir de hoje no fuso local.
 */
export function getLastNDays(n = 7, baseDate = new Date()) {
  const d = baseDate instanceof Date ? baseDate : new Date(baseDate);
  return Array.from({ length: n }, (_, i) => {
    const dayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - (n - 1 - i));
    const iso = getLocalDateIso(dayDate);
    return {
      iso,
      dayDate,
      isToday: i === n - 1,
      dayLabel: `${String(dayDate.getDate()).padStart(2, '0')}/${String(dayDate.getMonth() + 1).padStart(2, '0')}`
    };
  });
}
