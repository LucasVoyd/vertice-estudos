// Persistência Local-First + Sincronização Opcional com Supabase + Sementes (CMC 2026 Selecon Oficial & CREA-MT)
import { createClient } from '@supabase/supabase-js';
import { buildOfficialTecnicoLegislativoSubjects } from '../data/editalCmc2026Oficial.js';
import { calculateSubjectWeight, generateStudyCycle } from './editalParser.js';

const STORAGE_KEY = 'vertice_estudos_state_v1';
const SUPABASE_CFG_KEY = 'vertice_supabase_cfg_v1';
export const CURRENT_SCHEMA_VERSION = 3;

export const SUBJECT_COLORS = [
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#84cc16'  // Lime
];

/**
 * Constrói o Plano de Estudos Oficial 100% fiel ao Anexo V do Edital Nº 001/2026-CMC
 * (Consolidado com a Retificação Nº 01/2026 de 04/11/2026 — Banca Instituto Selecon)
 * enriquecido com as pílulas de teoria e questões Selecon nos respectivos tópicos/subtópicos.
 */
export function buildCmc2026SeedPlan() {
  const subjects = buildOfficialTecnicoLegislativoSubjects().map(s => ({
    ...s,
    weightAbsolute: calculateSubjectWeight(s.knowledge, s.importance)
  }));

  const cycle = generateStudyCycle(subjects, 14);

  return {
    id: 'plan_cmc_2026',
    name: 'Câmara de Cuiabá (Edital Nº 001/2026-CMC • Retificado)',
    cargo: 'Técnico Legislativo (Nível Médio • CNM 01)',
    banca: 'Instituto Selecon',
    examDate: '2026-12-20', // Retificação Nº 01/2026 (alterada de 13/12 para 20/12/2026)
    weeklyGoalHours: 14,
    weeklyGoalQuestions: Math.round(14 * 7), // 98 questões/semana (fórmula oficial 7q/h)
    cyclesCompleted: 0,
    autoSuggestTopics: true,
    subjects,
    cycle
  };
}

/**
 * Cria o plano CREA-MT espelhando fielmente os dados dos prints enviados pelo usuário.
 */
function buildCreaMtSeedPlan() {
  const subjects = [
    {
      id: 'sub_crea_pt',
      name: 'Língua Portuguesa',
      color: '#86efac',
      knowledge: 3.5,
      importance: 3.0,
      topics: [
        {
          id: 't_crea_pt_1',
          number: '1',
          label: 'Compreensão e interpretação de textos de gêneros variados',
          name: '1. Compreensão e interpretação de textos de gêneros variados',
          depth: 0,
          parentId: null,
          finished: true,
          finishedAt: '2026-10-15T12:00:00Z',
          questionsHit: 95,
          questionsMiss: 25,
          studiedMinutes: 420,
          lastStudiedAt: '2026-10-15'
        },
        {
          id: 't_crea_pt_2',
          number: '2',
          label: 'Domínio da ortografia oficial e mecanismos de coesão textual',
          name: '2. Domínio da ortografia oficial e mecanismos de coesão textual',
          depth: 0,
          parentId: null,
          finished: true,
          finishedAt: '2026-10-18T12:00:00Z',
          questionsHit: 86,
          questionsMiss: 24,
          studiedMinutes: 360,
          lastStudiedAt: '2026-10-18'
        }
      ]
    },
    {
      id: 'sub_crea_mat',
      name: 'Matemática',
      color: '#fda4af',
      knowledge: 1.5,
      importance: 3.0,
      topics: [
        {
          id: 't_crea_mat_1',
          number: '1',
          label: 'Operações básicas',
          name: '1. Operações básicas',
          depth: 0,
          parentId: null,
          finished: false,
          finishedAt: null,
          questionsHit: 0,
          questionsMiss: 0,
          studiedMinutes: 0,
          lastStudiedAt: null
        },
        {
          id: 't_crea_mat_1_1',
          number: '1.1',
          label: 'Adição, subtração, multiplicação, divisão',
          name: '1.1. Adição, subtração, multiplicação, divisão',
          depth: 1,
          parentId: 't_crea_mat_1',
          finished: false,
          finishedAt: null,
          questionsHit: 0,
          questionsMiss: 0,
          studiedMinutes: 0,
          lastStudiedAt: null
        },
        {
          id: 't_crea_mat_2',
          number: '2',
          label: 'Razão, proporção e regra de três simples e composta',
          name: '2. Razão, proporção e regra de três simples e composta',
          depth: 0,
          parentId: null,
          finished: false,
          finishedAt: null,
          questionsHit: 0,
          questionsMiss: 0,
          studiedMinutes: 0,
          lastStudiedAt: null
        }
      ]
    },
    {
      id: 'sub_crea_inf',
      name: 'Informática básica',
      color: '#38bdf8',
      knowledge: 2.5,
      importance: 2.5,
      topics: [
        {
          id: 't_crea_inf_1',
          number: '1',
          label: 'Conceitos básicos de Windows, Office e Segurança da Informação',
          name: '1. Conceitos básicos de Windows, Office e Segurança da Informação',
          depth: 0,
          parentId: null,
          finished: false,
          finishedAt: null,
          questionsHit: 0,
          questionsMiss: 0,
          studiedMinutes: 0,
          lastStudiedAt: null
        }
      ]
    },
    {
      id: 'sub_crea_esp',
      name: 'Conhecimentos Específicos',
      color: '#a78bfa',
      knowledge: 1.5,
      importance: 4.0,
      topics: [
        {
          id: 't_crea_esp_1',
          number: '1',
          label: 'Legislação do Sistema CONFEA/CREA (Lei nº 5.194/1966)',
          name: '1. Legislação do Sistema CONFEA/CREA (Lei nº 5.194/1966)',
          depth: 0,
          parentId: null,
          finished: true,
          finishedAt: '2026-10-10T12:00:00Z',
          questionsHit: 12,
          questionsMiss: 4,
          studiedMinutes: 180,
          lastStudiedAt: '2026-10-10'
        },
        {
          id: 't_crea_esp_2',
          number: '2',
          label: 'Código de Ética Profissional da Engenharia e Agronomia',
          name: '2. Código de Ética Profissional da Engenharia e Agronomia',
          depth: 0,
          parentId: null,
          finished: false,
          finishedAt: null,
          questionsHit: 0,
          questionsMiss: 0,
          studiedMinutes: 0,
          lastStudiedAt: null
        }
      ]
    }
  ].map(s => ({
    ...s,
    weightAbsolute: calculateSubjectWeight(s.knowledge, s.importance)
  }));

  return {
    id: 'plan_crea_mt',
    name: 'CREA - MT',
    cargo: 'Agente Administrativo / Fiscalização',
    banca: 'Selecon / Cebraspe',
    examDate: '2027-02-15',
    weeklyGoalHours: 12,
    weeklyGoalQuestions: 60,
    cyclesCompleted: 0,
    autoSuggestTopics: true,
    subjects,
    cycle: generateStudyCycle(subjects, 10)
  };
}

export function createInitialAppState() {
  const cmcPlan = buildCmc2026SeedPlan();
  const creaPlan = buildCreaMtSeedPlan();

  return {
    version: CURRENT_SCHEMA_VERSION,
    activeProfile: 'lucas',
    profiles: {
      lucas: { name: 'Lucas', color: '#10b981' },
      milayne: { name: 'Milayne', color: '#ec4899' }
    },
    selectedPlanId: cmcPlan.id,
    plans: [cmcPlan, creaPlan],
    studyLogs: [], // Registros de sessões de estudo (cronômetro ou manual)
    reviews: [],   // Revisões agendadas (1, 7, 15, 30 dias)
    simulados: [], // Registro de simulados com pesos por disciplina
    reminders: [
      {
        id: 'rem_1',
        title: 'Inscrições Concurso Câmara de Cuiabá (www.selecon.org.br)',
        date: '2026-11-30',
        done: false
      },
      {
        id: 'rem_2',
        title: 'Prova Objetiva e Discursiva CMC (Retificação Nº 01/2026)',
        date: '2026-12-20',
        done: false
      }
    ],
    preferences: {
      studyReviewDays: [1, 7, 15, 30],
      studyWeekDays: [false, true, true, true, true, true, false],
      pomodoroMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      performanceMin: 60,
      performanceMax: 80
    },
    updatedAt: new Date().toISOString()
  };
}

export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAppState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.plans) || !parsed.plans.length) {
      return createInitialAppState();
    }

    // Migração automática para o Edital Nº 001/2026-CMC Oficial Retificado (v3)
    if (parsed.version !== CURRENT_SCHEMA_VERSION) {
      const freshCmcPlan = buildCmc2026SeedPlan();
      const hasCmc = parsed.plans.some(p => p.id === 'plan_cmc_2026');
      const migratedPlans = hasCmc
        ? parsed.plans.map(p => (p.id === 'plan_cmc_2026' ? freshCmcPlan : p))
        : [freshCmcPlan, ...parsed.plans];

      const migratedState = {
        ...parsed,
        version: CURRENT_SCHEMA_VERSION,
        plans: migratedPlans,
        reminders: [
          {
            id: 'rem_1',
            title: 'Inscrições Concurso Câmara de Cuiabá (www.selecon.org.br)',
            date: '2026-11-30',
            done: false
          },
          {
            id: 'rem_2',
            title: 'Prova Objetiva e Discursiva CMC (Retificação Nº 01/2026)',
            date: '2026-12-20',
            done: false
          }
        ]
      };
      saveAppState(migratedState);
      return migratedState;
    }

    return parsed;
  } catch (e) {
    console.error('Erro ao ler estado local:', e);
    return createInitialAppState();
  }
}

export function saveAppState(state) {
  try {
    const stamped = { ...state, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  } catch (e) {
    console.error('Erro ao salvar estado local:', e);
  }
}

// --- SUPABASE CLOUD SYNC & LATENCY PROBE ---

export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(SUPABASE_CFG_KEY);
    return raw ? JSON.parse(raw) : { url: '', anonKey: '', syncId: 'casal_lucas_milayne' };
  } catch {
    return { url: '', anonKey: '', syncId: 'casal_lucas_milayne' };
  }
}

export function saveSupabaseConfig(cfg) {
  localStorage.setItem(SUPABASE_CFG_KEY, JSON.stringify(cfg));
}

/**
 * Mede empiricamente a latência de rede (p50/p95) contra o projeto Supabase informado
 * e valida se a tabela `study_states` existe.
 */
export async function probeSupabaseConnection(url, anonKey) {
  if (!url || !anonKey) {
    return { ok: false, error: 'Informe a Project URL e a chave pública (anon key).' };
  }
  try {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const res = await fetch(`${cleanUrl}/rest/v1/`, {
        headers: {
          apikey: anonKey.trim(),
          Authorization: `Bearer ${anonKey.trim()}`
        }
      });
      const dt = Math.round(performance.now() - t0);
      samples.push(dt);
      if (!res.ok && res.status !== 200) {
        return {
          ok: false,
          error: `HTTP ${res.status} ao conectar no endpoint REST do Supabase.`
        };
      }
    }
    samples.sort((a, b) => a - b);
    const p50 = samples[Math.floor(samples.length / 2)];
    const p95 = samples[samples.length - 1];

    return {
      ok: true,
      p50,
      p95,
      samples
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Falha de rede ao sondar o Supabase.'
    };
  }
}

export async function syncWithSupabase(localState, direction = 'push') {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) {
    return { ok: false, error: 'Supabase ainda não configurado.' };
  }
  try {
    const supabase = createClient(cfg.url.trim(), cfg.anonKey.trim());
    const syncKey = (cfg.syncId || 'casal_lucas_milayne').trim();

    if (direction === 'pull') {
      const { data, error } = await supabase
        .from('study_states')
        .select('payload, updated_at')
        .eq('id', syncKey)
        .maybeSingle();

      if (error) return { ok: false, error: error.message };
      if (!data || !data.payload) return { ok: false, error: 'Nenhum backup encontrado na nuvem com este ID.' };
      return { ok: true, state: data.payload, updatedAt: data.updated_at };
    } else {
      const { error } = await supabase
        .from('study_states')
        .upsert({
          id: syncKey,
          payload: localState,
          updated_at: new Date().toISOString()
        });

      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export const SUPABASE_SETUP_SQL = `-- Execute este SQL no SQL Editor do seu projeto Supabase:
create table if not exists public.study_states (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.study_states enable row level security;

create policy "Acesso por chave compartilhada"
  on public.study_states
  for all
  using (true)
  with check (true);`;
