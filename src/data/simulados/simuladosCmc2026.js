// ============================================================================
// ORQUESTRADOR DE SIMULADOS E BANCO DE QUESTÕES — CÂMARA MUNICIPAL DE CUIABÁ 2026
// Edital Nº 001/2026-CMC consolidado com a Retificação Nº 01/2026 (Banca: Instituto Selecon)
// Cargo: Técnico Legislativo (Nível Médio - CNM 01)
// Estrutura Oficial: 70 Questões (A, B, C, D) = 100,00 pontos + Prova Discursiva (100,00 pontos)
// ============================================================================

import { QUESTS_BLOCO_BASICOS } from './blocoBasicos.js';
import { QUESTS_BLOCO_GERAIS } from './blocoGerais.js';
import { QUESTS_ESPECIFICOS_SIM_01 } from './blocoEspecificosSim1.js';
import { QUESTS_ESPECIFICOS_SIM_02 } from './blocoEspecificosSim2.js';
import { QUESTS_ESPECIFICOS_SIM_03 } from './blocoEspecificosSim3.js';
import { buildOfficialTecnicoLegislativoSubjects } from '../editalCmc2026Oficial.js';

export const OFFICIAL_CMC_SUBJECTS = buildOfficialTecnicoLegislativoSubjects();

// Questões extras reais do Instituto Selecon (100% autocontidas e revisadas)
export const QUESTS_EXTRAS_SELECON = [
  {
    id: 'extra_sel_01',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_2',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    sourceType: 'Questão Real Selecon — Prefeitura de Cuiabá/MT',
    banca: 'Instituto Selecon',
    year: 2023,
    cargo: 'Prefeitura Municipal de Cuiabá/MT',
    enunciado: 'A invasão paraguaia ao sul da Província de Mato Grosso, em dezembro de 1864, marcou o início das operações militares da Guerra da Tríplice Aliança em território brasileiro. Um dos episódios mais emblemáticos da resistência mato-grossense ocorreu na Colônia Militar dos Dourados, sob o comando do:',
    options: [
      'Tenente Antônio João Ribeiro, oficial que recusou a rendição frente às tropas de Martín Urbieta e enviou a célebre mensagem histórica ao Comandante Dias da Silva.',
      'Marechal Luís Alves de Lima e Silva (Duque de Caxias), comandante-em-chefe que nasceu em Vila Bela da Santíssima Trindade e liderou a Retirada da Laguna.',
      'Capitão-General Luís de Albuquerque de Melo Pereira e Cáceres, governador colonial responsável pela edificação do Forte de Coimbra e do Forte Príncipe da Beira.',
      'Almirante Augusto Leverger (Barão de Melgaço), oficial de marinha francês naturalizado brasileiro que comandou o destacamento de cavalaria na Colônia de Dourados.'
    ],
    answer: 0,
    explanation: 'Gabarito: A. Em 29 de dezembro de 1864, na Colônia Militar dos Dourados, o Tenente Antônio João Ribeiro recusou a rendição frente às tropas paraguaias do Major Martín Urbieta, enviando o célebre bilhete ("Sei que morro, mas o meu sangue e o dos meus companheiros servirá de protesto solene contra a invasão do solo de minha Pátria") ao Comandante Dias da Silva antes de tombar em combate.'
  },
  {
    id: 'extra_sel_02',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_3',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    sourceType: 'Questão Real Selecon — Seduc/MT',
    banca: 'Instituto Selecon',
    year: 2022,
    cargo: 'Secretaria de Estado de Educação (SEDUC/MT)',
    enunciado: 'A divisão político-territorial do antigo Estado de Mato Grosso, que resultou na criação do Estado de Mato Grosso do Sul, foi formalizada durante o governo do Presidente Ernesto Geisel por meio da:',
    options: [
      'Promulgação do Ato das Disposições Constitucionais Transitórias da Constituição Federal de 5 de outubro de 1988, após plebiscito estadual.',
      'Lei Complementar Federal nº 31, sancionada em 11 de outubro de 1977, com instalação oficial do novo Estado em 1º de janeiro de 1979.',
      'Convenção separatista decorrente da Revolta da Rusga Cuiabana de 30 de maio de 1834, ratificada pela Regência Trina Permanente.',
      'Expedição Roncador-Xingu e do Decreto-Lei da Marcha para o Oeste, assinados por Getúlio Vargas durante o Estado Novo em 1938.'
    ],
    answer: 1,
    explanation: 'Gabarito: B. A divisão territorial de Mato Grosso ocorreu pela Lei Complementar nº 31, de 11 de outubro de 1977, assinada pelo Presidente Ernesto Geisel, tendo o novo Estado de Mato Grosso do Sul sido instalado oficialmente em 1º de janeiro de 1979.'
  },
  {
    id: 'extra_sel_03',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_leg',
    topicId: 'cmc_leg_4',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    sourceType: 'Padrão Selecon — LC nº 235/2011 c/c LC nº 609/2026 (Carreira e Desenvolvimento Funcional)',
    banca: 'Instituto Selecon',
    year: 2026,
    cargo: 'Técnico Legislativo — Câmara de Cuiabá',
    enunciado: 'A Lei Complementar Municipal nº 235/2011 (atualizada até a Lei Complementar nº 609/2026) estrutura a carreira dos servidores efetivos da Câmara Municipal de Cuiabá. Acerca da progressão horizontal e da progressão vertical na carreira legislativa municipal, assinale a alternativa CORRETA:',
    options: [
      'A progressão funcional independe de avaliação de desempenho ou de tempo de efetivo exercício, ocorrendo por livre indicação política da Mesa Diretora.',
      'O servidor em estágio probatório já ingressa diretamente na última classe e no último padrão salarial da tabela de vencimentos do Poder Legislativo.',
      'O desenvolvimento do servidor efetivo na carreira ocorre mediante progressão funcional baseada em critérios objetivos de tempo de efetivo exercício (interstício legal), avaliação periódica de desempenho satisfatória e qualificação profissional.',
      'A conclusão de curso de pós-graduação transforma automaticamente o cargo de Técnico Legislativo (Nível Médio) no cargo de Analista ou Procurador Legislativo (Nível Superior).'
    ],
    answer: 2,
    explanation: 'Gabarito: C. O Plano de Cargos, Carreiras e Vencimentos da Câmara Municipal de Cuiabá (LC 235/2011 e alterações até a LC 609/2026) estrutura o desenvolvimento funcional em classes e níveis/padrões mediante interstício de efetivo exercício, avaliação de desempenho e qualificação/capacitação, respeitada a vedação constitucional de transposição de cargos (Súmula Vinculante 43 do STF).'
  },
  {
    id: 'extra_sel_04',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    sourceType: 'Padrão Selecon — Regimento Interno da Câmara de Cuiabá (Res. 008/2016 — Questão de Ordem)',
    banca: 'Instituto Selecon',
    year: 2026,
    cargo: 'Técnico Legislativo — Câmara de Cuiabá',
    enunciado: 'Nos termos do Regimento Interno da Câmara Municipal de Cuiabá (Resolução nº 008/2016), toda dúvida sobre a interpretação do Regimento, na sua prática exclusiva ou relacionada com a Lei Orgânica ou a Constituição, considera-se "Questão de Ordem". Sobre a formulação e decisão das Questões de Ordem em Plenário, é CORRETO afirmar que:',
    options: [
      'A Questão de Ordem pode tratar de meras opiniões pessoais ou críticas políticas à gestão municipal, mesmo sem relação com dispositivos regimentais.',
      'Qualquer cidadão presente nas galerias pode interromper a votação na Ordem do Dia para levantar Questão de Ordem ao microfone do Plenário.',
      'Suscitada uma Questão de Ordem em sessão ordinária, os trabalhos plenários são obrigatoriamente suspensos por cinco dias úteis para consulta externa.',
      'A Questão de Ordem deve ser formulada com clareza e indicação precisa das disposições regimentais ou constitucionais que se pretende elucidar, cabendo ao Presidente da Câmara resolvê-la (admitido recurso ao Plenário).'
    ],
    answer: 3,
    explanation: 'Gabarito: D. Segundo o Regimento Interno da CMC (Resolução nº 008/2016), a Questão de Ordem é privativa de Vereador, deve indicar objetivamente o dispositivo regimental/constitucional controvertido e é decidida pelo Presidente da Câmara, cabendo recurso da decisão presidencial ao Plenário.'
  },
  {
    id: 'extra_sel_05',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    sourceType: 'Questão Real Selecon — Direito Administrativo (Elementos / Requisitos de Validade do Ato Administrativo)',
    banca: 'Instituto Selecon',
    year: 2024,
    cargo: 'Câmara Municipal / Administração Pública',
    enunciado: 'Segundo a doutrina clássica de Direito Administrativo adotada pelo Instituto Selecon, o ato administrativo possui cinco elementos ou requisitos de validade: competência, finalidade, forma, motivo e objeto. Dentre esses cinco elementos, aqueles que constituem o binômio onde reside o "mérito administrativo" nos atos discricionários são:',
    options: [
      'A competência e a finalidade em sentido amplo, que podem ser livremente alteradas pelo agente público segundo critérios de conveniência pessoal.',
      'A forma legal e a competência exclusiva, que admitem juízo subjetivo de oportunidade por parte dos órgãos subalternos de execução.',
      'O motivo e o objeto (conteúdo), nos quais a lei confere margem de liberdade para o administrador valorar a oportunidade e a conveniência diante do interesse público.',
      'A finalidade pública e a forma escrita, elementos sempre discricionários que dispensam previsão normativa para a prática de atos punitivos.'
    ],
    answer: 2,
    explanation: 'Gabarito: C. Nos atos administrativos, Competência, Finalidade e Forma são elementos sempre vinculados (regra geral). Já o Motivo e o Objeto formam o núcleo do mérito administrativo nos atos discricionários, permitindo ao gestor valorar a conveniência e a oportunidade dentro dos limites da lei.'
  },
  {
    id: 'extra_sel_06',
    simuladoIndex: 4,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_9_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    sourceType: 'Questão Real Selecon — Arquivologia (Grau de Sigilo e Acesso)',
    banca: 'Instituto Selecon',
    year: 2023,
    cargo: 'Técnico Administrativo / Legislativo',
    enunciado: 'Quanto à natureza do assunto, os documentos de arquivo podem ser classificados em ostensivos ou sigilosos. Considera-se documento OSTENSIVO aquele:',
    options: [
      'Cuja divulgação não prejudica a administração nem a segurança da sociedade e do Estado, sendo seu acesso franqueado como regra geral de transparência.',
      'Que exige autorização expressa do Chefe do Poder Executivo para ser consultado pelos servidores efetivos do próprio setor de arquivo corrente.',
      'Que permanece custodiado em cofre de segurança máxima pelo prazo mínimo improrrogável de vinte e cinco anos a contar de sua produção.',
      'Que contém dados estratégicos cuja divulgação irrestrita ponha em risco a soberania nacional e a integridade territorial do País.'
    ],
    answer: 0,
    explanation: 'Gabarito: A. Na Arquivologia e na Lei de Acesso à Informação (LAI), documentos ostensivos são aqueles cuja divulgação não acarreta prejuízo à administração ou à segurança do Estado/sociedade, constituindo a regra geral no serviço público ("publicidade como preceito geral e sigilo como exceção").'
  }
];

// Mapa auxiliar de nomes de disciplinas e tópicos a partir do Edital Oficial
const SUBJECT_ALIAS = {
  lingua_portuguesa: 'sub_cmc_pt',
  raciocinio_logico: 'sub_cmc_rlm',
  informatica: 'sub_cmc_info',
  legislacao_basica: 'sub_cmc_leg',
  historia_geografia_mt: 'sub_cmc_hgmt',
  etica_filosofia: 'sub_cmc_etica',
  relacoes_interpessoais: 'sub_cmc_rel',
  conhecimentos_especificos: 'sub_cmc_esp'
};

const TOPIC_ALIAS = {
  lp_1: 'cmc_pt_1',
  lp_2: 'cmc_pt_4_2',
  lp_3: 'cmc_pt_4_3',
  lp_4: 'cmc_pt_6',
  lp_5: 'cmc_pt_4_4',
  rlm_1: 'cmc_rlm_3',
  rlm_2: 'cmc_rlm_5',
  rlm_3: 'cmc_rlm_4',
  rlm_4: 'cmc_rlm_7',
  inf_1: 'cmc_inf_2',
  inf_2: 'cmc_inf_3',
  inf_3: 'cmc_inf_4',
  inf_4: 'cmc_inf_6',
  leg_1: 'cmc_leg_1',
  leg_2: 'cmc_leg_2',
  leg_3: 'cmc_leg_3',
  leg_4: 'cmc_leg_4',
  hg_1: 'cmc_hg_1',
  hg_2: 'cmc_hg_2',
  hg_3: 'cmc_hg_3',
  hg_4: 'cmc_hg_4',
  hg_5: 'cmc_hg_4_6',
  ef_1: 'cmc_et_1',
  ef_2: 'cmc_et_2',
  ef_3: 'cmc_et_5',
  ef_4: 'cmc_et_6',
  ri_1: 'cmc_rel_1',
  ri_2: 'cmc_rel_2',
  ri_3: 'cmc_rel_6',
  ri_4: 'cmc_rel_3'
};

const SUBJECT_MAP = {};
const TOPIC_MAP = {};
(OFFICIAL_CMC_SUBJECTS || []).forEach((subj) => {
  SUBJECT_MAP[subj.id] = subj;
  (subj.topics || []).forEach((t) => {
    TOPIC_MAP[t.id] = { ...t, subjectId: subj.id, subjectName: subj.name };
  });
});

/**
 * Verifica se uma questão pertence a um tópico ou a qualquer subtópico filho na árvore do Anexo V.
 * Ex.: filtrar por 'cmc_esp_6' encontra 'cmc_esp_6', 'cmc_esp_6_1' e 'cmc_esp_6_2'.
 */
export function questionMatchesTopicFilter(q, filterTopicId) {
  if (!filterTopicId || filterTopicId === 'all') return true;
  if (!q || !q.topicId) return false;
  return q.topicId === filterTopicId || q.topicId.startsWith(`${filterTopicId}_`);
}

function normalizeQuestion(q) {
  const canonicalSubjectId = SUBJECT_ALIAS[q.subjectId] || q.subjectId;
  const canonicalTopicId = TOPIC_ALIAS[q.topicId] || q.topicId;
  const subj = SUBJECT_MAP[canonicalSubjectId] || {};
  const topic = TOPIC_MAP[canonicalTopicId] || {};
  const rawOptions = Array.isArray(q.options) ? q.options : Array.isArray(q.alternativas) ? q.alternativas : [];
  const rawAnswer =
    typeof q.answer === 'number'
      ? q.answer
      : ['A', 'B', 'C', 'D'].indexOf(String(q.gabarito || '').trim().toUpperCase());
  const rawExplanation = q.explanation || q.explicacao || '';
  const rawSource = q.sourceType || q.origem || 'Padrão Selecon CMC 2026';
  const isReal = rawSource.toLowerCase().includes('real selecon');

  return {
    ...q,
    options: rawOptions,
    answer: rawAnswer >= 0 ? rawAnswer : 0,
    explanation: rawExplanation,
    sourceType: rawSource,
    year: q.year || 2026,
    origSubjectId: q.subjectId,
    origTopicId: q.topicId,
    subjectId: canonicalSubjectId,
    topicId: canonicalTopicId,
    subjectName: subj.name || q.subjectName || q.area,
    shortSubjectName: subj.name || q.area,
    subjectColor: subj.color || '#06b6d4',
    topicCode: topic.number || '',
    topicTitle: topic.label || q.topicLabel || topic.name || 'Conteúdo Programático Oficial CMC 2026',
    isRealSelecon: isReal,
    badgeLabel: isReal ? 'Questão Real Selecon' : 'Inédita Padrão Selecon CMC 2026'
  };
}

// Todos os bancos normalizados
const NORM_BASICOS = QUESTS_BLOCO_BASICOS.map(normalizeQuestion);
const NORM_GERAIS = QUESTS_BLOCO_GERAIS.map(normalizeQuestion);
const NORM_ESP_1 = QUESTS_ESPECIFICOS_SIM_01.map(normalizeQuestion);
const NORM_ESP_2 = QUESTS_ESPECIFICOS_SIM_02.map(normalizeQuestion);
const NORM_ESP_3 = QUESTS_ESPECIFICOS_SIM_03.map(normalizeQuestion);
const NORM_EXTRAS = QUESTS_EXTRAS_SELECON.map(normalizeQuestion);

// Montagem rigorosa dos 3 Simulados Oficiais Completos (70 questões cada = 100,00 pontos)
// Cada Simulado Oficial possui:
// - 15 Conhecimentos Básicos (5 Português + 4 RLM + 3 Informática + 3 Legislação Básica = 15,00 pts)
// - 15 Conhecimentos Gerais (6 Hist/Geo MT + 5 Ética/Filosofia + 4 Relações Interpessoais = 15,00 pts)
// - 40 Conhecimentos Específicos (Itens 1 a 12 do Anexo V × 1,75 pt = 70,00 pts)
export const QUESTIONS_SIMULADO_01 = [
  ...NORM_BASICOS.filter((q) => q.simuladoIndex === 1),
  ...NORM_GERAIS.filter((q) => q.simuladoIndex === 1),
  ...NORM_ESP_1
];

export const QUESTIONS_SIMULADO_02 = [
  ...NORM_BASICOS.filter((q) => q.simuladoIndex === 2),
  ...NORM_GERAIS.filter((q) => q.simuladoIndex === 2),
  ...NORM_ESP_2
];

export const QUESTIONS_SIMULADO_03 = [
  ...NORM_BASICOS.filter((q) => q.simuladoIndex === 3),
  ...NORM_GERAIS.filter((q) => q.simuladoIndex === 3),
  ...NORM_ESP_3
];

// Banco Completo Unificado (216 questões sem nenhuma repetição)
export const ALL_SIMULADO_QUESTIONS = [
  ...QUESTIONS_SIMULADO_01,
  ...QUESTIONS_SIMULADO_02,
  ...QUESTIONS_SIMULADO_03,
  ...NORM_EXTRAS
];

// ============================================================================
// TEMAS DE PROVA DISCURSIVA PADRÃO SELECON (20 A 30 LINHAS — 100,00 PONTOS)
// ============================================================================
export const PROVA_DISCURSIVA_TEMAS = {
  disc_01: {
    id: 'disc_01',
    title: 'Tema Discursivo #01: Transparência Legislativa, Controle Social e Proteção de Dados (LAI vs. LGPD) no Poder Legislativo Municipal',
    minLines: 20,
    maxLines: 30,
    maxPoints: 100,
    minPointsToPass: 50,
    contextText: `A Constituição Federal de 1988 e a Lei de Acesso à Informação (Lei nº 12.527/2011) consagram a publicidade como preceito geral e o sigilo como exceção na Administração Pública, determinando que as Câmaras Municipais mantenham transparência ativa e passiva sobre o processo legislativo, a presença e as votações nominais dos Vereadores, bem como sobre a execução orçamentária e a folha de pagamento. Paralelamente, a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) impõe deveres estritos de proteção à privacidade e aos dados pessoais sensíveis de servidores e cidadãos que se relacionam com o Parlamento Municipal.`,
    promptCommand: `Redija um texto dissertativo-argumentativo, em norma-padrão da língua portuguesa, entre 20 (vinte) e 30 (trinta) linhas, abordando obrigatoriamente os seguintes aspectos:
1. O papel constitucional da Câmara Municipal de Cuiabá na promoção da transparência ativa e do controle social (Ouvidoria, audiências públicas e portais de dados abertos);
2. A harmonização prática, na rotina do Técnico Legislativo, entre o dever de publicidade (Lei nº 12.527/2011) e a proteção de dados pessoais e informações restritas (Lei nº 13.709/2018 e art. 31 da LAI);
3. Propostas concretas de modernização da gestão documental e eletrônica para fortalecer a cidadania no Município de Cuiabá.`,
    rubricCriteria: [
      { id: 'c1', label: 'Abordagem do papel constitucional da Câmara, transparência ativa/passiva e controle social', maxPts: 30 },
      { id: 'c2', label: 'Harmonização técnica entre a LAI (publicidade como regra) e a LGPD (proteção de dados pessoais/sensíveis)', maxPts: 30 },
      { id: 'c3', label: 'Coerência, coesão, progressão temática e propostas concretas de gestão documental/eletrônica', maxPts: 20 },
      { id: 'c4', label: 'Domínio da modalidade escrita formal da Língua Portuguesa (ortografia, concordância, regência e pontuação)', maxPts: 20 }
    ],
    modelGuide: `Parágrafo 1 (Introdução - linhas 1 a 7): Contextualizar a soberania popular e o princípio da publicidade (art. 37, caput, da CF/88) no Poder Legislativo Municipal, apresentando a tese de que a transparência ativa da Câmara de Cuiabá e a proteção de dados pessoais (LGPD) não são antagônicas, mas complementares.
Parágrafo 2 (Desenvolvimento I - linhas 8 a 15): Explicar os mecanismos de transparência ativa (divulgação espontânea de pautas, votações nominais, execução orçamentária e remuneração) e passiva (SIC e Ouvidoria Parlamentar), fundamentais para o controle social cuiabano.
Parágrafo 3 (Desenvolvimento II - linhas 16 a 23): Analisar a atuação do Técnico Legislativo na compatibilização entre a LAI (art. 31 — restrição de informações pessoais relativas à intimidade/vida privada) e a LGPD (princípio da necessidade e ocultação/tarjamento de CPF, endereço residencial e dados médicos em processos públicos).
Parágrafo 4 (Conclusão - linhas 24 a 30): Sintetizar os argumentos e propor a adoção de processo legislativo eletrônico integrado com governança de dados abertos e capacitação contínua dos servidores efetivos da CMC.`
  },
  disc_02: {
    id: 'disc_02',
    title: 'Tema Discursivo #02: Eficiência Administrativa, Controle da Administração Pública e Ética Funcional no Parlamento Municipal',
    minLines: 20,
    maxLines: 30,
    maxPoints: 100,
    minPointsToPass: 50,
    contextText: `A governança pública contemporânea exige que o Poder Legislativo Municipal não apenas exerça com independência suas funções típicas de legislar e fiscalizar o Poder Executivo (art. 31 da CF/88 e Lei Orgânica de Cuiabá), mas também gerencie suas próprias rotinas administrativas, patrimoniais e orçamentárias com integridade, controle interno efetivo e respeito aos princípios constitucionais do art. 37 da Carta Magna. Nesse cenário, a Lei Complementar Municipal nº 093/2003 (Estatuto dos Servidores de Cuiabá) impõe deveres éticos e funcionais inafastáveis ao servidor público efetivo.`,
    promptCommand: `Redija um texto dissertativo-argumentativo, de 20 (vinte) a 30 (trinta) linhas, contemplando necessariamente:
1. A importância do princípio da eficiência (art. 37 da CF/88) e da atuação integrada entre os controles interno e externo na Câmara Municipal de Cuiabá;
2. A relevância da atuação técnica de servidores efetivos (como o Técnico Legislativo) para a continuidade do serviço público, a instrução regular dos atos administrativos e a garantia da impessoalidade;
3. A relação entre ética pública, deveres funcionais previstos na LC Municipal nº 093/2003, prestação de contas (accountability) e fortalecimento da confiança da população cuiabana nas instituições democráticas.`,
    rubricCriteria: [
      { id: 'c1', label: 'Análise do princípio da eficiência (art. 37 da CF/88) e dos mecanismos de controle interno e externo no Legislativo', maxPts: 30 },
      { id: 'c2', label: 'Papel do quadro técnico efetivo na impessoalidade, continuidade administrativa e regularidade dos atos', maxPts: 30 },
      { id: 'c3', label: 'Articulação com a ética pública, deveres e proibições da LC nº 093/2003 e legitimidade democrática', maxPts: 20 },
      { id: 'c4', label: 'Correção gramatical, estrutura dissertativo-argumentativa e respeito à margem de 20 a 30 linhas', maxPts: 20 }
    ],
    modelGuide: `Parágrafo 1 (Introdução - linhas 1 a 7): Apresentar a correlação entre eficiência administrativa (art. 37, caput, da CF/88), controle da Administração Pública e integridade funcional na gestão das Casas Legislativas Municipais.
Parágrafo 2 (Desenvolvimento I - linhas 8 a 15): Discutir a complementaridade entre o controle interno (autotutela, Súmula 473 do STF e fiscalização contábil/orçamentária da Lei 4.320/1964) e o controle externo exercido com auxílio do TCE-MT como barreira contra desvios e desperdício do erário.
Parágrafo 3 (Desenvolvimento II - linhas 16 a 23): Destacar o papel do servidor efetivo concursado (Técnico Legislativo) na memória institucional, no zelo pelo patrimônio público, na instrução formal de processos e na observância dos deveres éticos da LC nº 093/2003.
Parágrafo 4 (Conclusão - linhas 24 a 30): Concluir demonstrando como a gestão ética, eficiente e transparente eleva a credibilidade da Câmara Municipal de Cuiabá perante a sociedade.`
  },
  disc_03: {
    id: 'disc_03',
    title: 'Tema Discursivo #03: Processo Legislativo Municipal, Técnica Legislativa (LC 95/1998) e Preservação da Memória Institucional',
    minLines: 20,
    maxLines: 30,
    maxPoints: 100,
    minPointsToPass: 50,
    contextText: `A qualidade da democracia local depende diretamente da clareza, precisão e constitucionalidade das leis aprovadas pela Câmara Municipal, bem como da conservação e organização de seu acervo arquivístico. O Técnico Legislativo atua na linha de frente do assessoramento regimental, da padronização redacional segundo a Lei Complementar nº 95/1998 e o Manual de Redação da Presidência da República, e da gestão documental (Teoria das Três Idades).`,
    promptCommand: `Elabore um texto dissertativo-argumentativo, entre 20 (vinte) e 30 (trinta) linhas, respondendo aos seguintes pontos:
1. Como o respeito ao devido processo legislativo (Lei Orgânica de Cuiabá e Resolução nº 008/2016) e à técnica legislativa (LC nº 95/1998) assegura a segurança jurídica dos cidadãos cuiabanos;
2. A função da gestão documental e arquivística (arquivos corrente, intermediário e permanente) na eficiência administrativa e na preservação da história de Cuiabá;
3. O impacto do atendimento humanizado, prioritário e inclusivo na aproximação entre o Poder Legislativo e a comunidade local.`,
    rubricCriteria: [
      { id: 'c1', label: 'Domínio sobre o devido processo legislativo municipal e a técnica legislativa (LC 95/1998)', maxPts: 30 },
      { id: 'c2', label: 'Abordagem técnica da gestão documental (ciclo vital dos documentos) e memória histórica de Cuiabá', maxPts: 30 },
      { id: 'c3', label: 'Articulação com o atendimento público inclusivo/prioritário e aproximação Parlamento-cidadão', maxPts: 20 },
      { id: 'c4', label: 'Norma-padrão culta, coesão referencial/sequencial e adequação à extensão exigida', maxPts: 20 }
    ],
    modelGuide: `Parágrafo 1 (Introdução - linhas 1 a 7): Introduzir a Câmara Municipal como "Casa do Povo" e guardiã da ordem jurídica e histórica local, ressaltando o suporte técnico especializado.
Parágrafo 2 (Desenvolvimento I - linhas 8 a 15): Abordar a importância do rito regimental (Resolução 008/2016), do controle preventivo pela CCJR e da redação legislativa clara e precisa (LC 95/1998) para evitar leis inconstitucionais ou ambíguas.
Parágrafo 3 (Desenvolvimento II - linhas 16 a 23): Explicar como a gestão arquivística (Plano de Classificação e Tabela de Temporalidade) agiliza a recuperação da informação no arquivo corrente e preserva o patrimônio histórico tricentenário de Cuiabá no arquivo permanente.
Parágrafo 4 (Conclusão - linhas 24 a 30): Fechar unindo a excelência documental ao atendimento prioritário e urbanidade (Lei 10.048/2000 e Lei 13.460/2017) para consolidar um Parlamento aberto e eficiente.`
  }
};

const QUESTIONS_LEGISLACAO_CUIABA = [
  ...NORM_BASICOS.filter((q) => q.subjectId === 'sub_cmc_leg'),
  ...NORM_ESP_1.filter((q) => questionMatchesTopicFilter(q, 'cmc_esp_6') || questionMatchesTopicFilter(q, 'cmc_esp_7')),
  ...NORM_ESP_2.filter((q) => questionMatchesTopicFilter(q, 'cmc_esp_6') || questionMatchesTopicFilter(q, 'cmc_esp_7')),
  ...NORM_ESP_3.filter((q) => questionMatchesTopicFilter(q, 'cmc_esp_6') || questionMatchesTopicFilter(q, 'cmc_esp_7')),
  ...NORM_EXTRAS.filter((q) => q.subjectId === 'sub_cmc_leg' || questionMatchesTopicFilter(q, 'cmc_esp_6') || questionMatchesTopicFilter(q, 'cmc_esp_7'))
];
const LEGISLACAO_CUIABA_PTS = Number(
  QUESTIONS_LEGISLACAO_CUIABA.reduce((acc, q) => acc + (Number(q.points) || 1), 0).toFixed(2)
);

const QUESTIONS_REAIS_SELECON = ALL_SIMULADO_QUESTIONS.filter((q) => q.isRealSelecon);
const REAIS_SELECON_PTS = Number(
  QUESTIONS_REAIS_SELECON.reduce((acc, q) => acc + (Number(q.points) || 1), 0).toFixed(2)
);

// ============================================================================
// CATÁLOGO OFICIAL DE SIMULADOS E CADERNOS TÁTICOS CMC 2026
// ============================================================================
export const SIMULADOS_CATALOG = [
  {
    id: 'sim_oficial_01',
    code: 'SIMULADO OFICIAL #01',
    title: '1º Simulado Oficial Completo CMC 2026 — Técnico Legislativo',
    subtitle: 'Espelho fiel do Anexo V (70 questões objetivas + Prova Discursiva • 100,00 pts)',
    category: 'oficial_70',
    badge: 'Padrão Oficial Selecon • 70 Questões',
    badgeColor: 'cyan',
    durationMinutes: 270, // 4h30min
    totalPoints: 100,
    minPassPoints: 50,
    discursiva: PROVA_DISCURSIVA_TEMAS.disc_01,
    description: 'Simulado inaugural com a exata distribuição e pontuação da prova da Câmara de Cuiabá: 15 Básicos (1,00 pt), 15 Gerais (1,00 pt) e 40 Específicos cobrindo todos os 12 itens do Anexo V (1,75 pt). Inclui questões reais da Selecon e questões inéditas de alto rigor.',
    questions: QUESTIONS_SIMULADO_01
  },
  {
    id: 'sim_oficial_02',
    code: 'SIMULADO OFICIAL #02',
    title: '2º Simulado Oficial Completo CMC 2026 — Técnico Legislativo',
    subtitle: '100% de questões inéditas em relação ao Simulado #01 (70 questões • 100,00 pts)',
    category: 'oficial_70',
    badge: 'Padrão Oficial Selecon • 70 Questões',
    badgeColor: 'emerald',
    durationMinutes: 270,
    totalPoints: 100,
    minPassPoints: 50,
    discursiva: PROVA_DISCURSIVA_TEMAS.disc_02,
    description: 'Segundo simulado completo sem nenhuma questão repetida do Simulado #01. Aprofunda quóruns qualificados do Regimento Interno (Res. 008/2016), LOM Cuiabá, LC 093/2003, Direito Administrativo e Constitucional, Redação Oficial/LC 95/1998, Arquivologia, Orçamento (Lei 4.320/1964) e Segurança do Trabalho.',
    questions: QUESTIONS_SIMULADO_02
  },
  {
    id: 'sim_oficial_03',
    code: 'SIMULADO OFICIAL #03',
    title: '3º Simulado Oficial Completo CMC 2026 — Técnico Legislativo',
    subtitle: 'Bateria Avançada de Casos Práticos e Pegadinhas Selecon (70 questões • 100,00 pts)',
    category: 'oficial_70',
    badge: 'Padrão Oficial Selecon • 70 Questões',
    badgeColor: 'purple',
    durationMinutes: 270,
    totalPoints: 100,
    minPassPoints: 50,
    discursiva: PROVA_DISCURSIVA_TEMAS.disc_03,
    description: 'Terceiro simulado completo com mais 70 questões exclusivas (totalizando 210 questões inéditas entre os 3 simulados oficiais). Ideal para testar resistência mental de 4h30min e blindar contra distratores sutis da banca Selecon.',
    questions: QUESTIONS_SIMULADO_03
  },
  {
    id: 'sim_sprint_35',
    code: 'SPRINT TÁTICO #04',
    title: 'Sprint Meio-Edital Proporcional (Treino Rápido de 35 Questões)',
    subtitle: 'Exatamente metade da prova oficial na mesma proporção de pesos (50,00 pts)',
    category: 'tatico',
    badge: 'Sprint 35 Questões • 50,00 pts',
    badgeColor: 'amber',
    durationMinutes: 135,
    totalPoints: 50,
    minPassPoints: 25,
    discursiva: null,
    description: 'Perfeito para dias de semana com tempo reduzido: 8 questões de Conhecimentos Básicos (1,00 pt), 7 de Conhecimentos Gerais (1,00 pt) e 20 de Conhecimentos Específicos (1,75 pt = 35,00 pts), somando 50,00 pontos.',
    questions: [
      ...NORM_BASICOS.filter((_, i) => i % 6 === 0).slice(0, 8),
      ...NORM_GERAIS.filter((_, i) => i % 6 === 1).slice(0, 7),
      ...NORM_ESP_1.filter((_, i) => i % 4 === 0).slice(0, 10),
      ...NORM_ESP_2.filter((_, i) => i % 4 === 1).slice(0, 10)
    ]
  },
  {
    id: 'sim_especificos_40',
    code: 'BATERIA ESPECÍFICOS #05',
    title: 'Imersão Peso Máximo: 40 Questões Só de Conhecimentos Específicos (70% da Prova)',
    subtitle: 'Foco cirúrgico no Bloco III onde cada questão vale 1,75 ponto (Total: 70,00 pts)',
    category: 'tatico',
    badge: 'Peso 1,75x • 40 Questões',
    badgeColor: 'rose',
    durationMinutes: 150,
    totalPoints: 70,
    minPassPoints: 35,
    discursiva: null,
    description: 'Bateria intensiva combinando as questões mais exigentes dos Itens 1 a 12 do Anexo V (Administração Pública, Direito Administrativo e Constitucional, Regimento Interno, LOM, Processo Legislativo, Redação Oficial/LC 95, Arquivologia, Atendimento, Orçamento e Higiene/Segurança do Trabalho).',
    questions: [
      ...NORM_ESP_1.slice(0, 14),
      ...NORM_ESP_2.slice(14, 27),
      ...NORM_ESP_3.slice(27, 40)
    ]
  },
  {
    id: 'sim_legislacao_cuiaba',
    code: 'BATERIA LEGISLAÇÃO #06',
    title: 'Dominando Cuiabá: LOM, Regimento Interno (Res. 008/2016), Estatuto e Processo Legislativo',
    subtitle: `${QUESTIONS_LEGISLACAO_CUIABA.length} questões focadas exclusivamente no coração legislativo de Cuiabá`,
    category: 'tatico',
    badge: `Legislação Cuiabá • ${QUESTIONS_LEGISLACAO_CUIABA.length} Questões`,
    badgeColor: 'cyan',
    durationMinutes: 130,
    totalPoints: LEGISLACAO_CUIABA_PTS,
    minPassPoints: Number((LEGISLACAO_CUIABA_PTS * 0.5).toFixed(2)),
    discursiva: null,
    description: 'Reúne todas as questões de Legislação Básica Municipal (LOM Cuiabá, Res. 008/2016, LC 093/2003, LC 235/2011 c/c LC 609/2026) e os Itens 6 e 7 de Conhecimentos Específicos (Organização do Poder Legislativo Municipal, Mesa Diretora, Plenário, Comissões e Processo Legislativo).',
    questions: QUESTIONS_LEGISLACAO_CUIABA
  },
  {
    id: 'sim_reais_selecon',
    code: 'PROVAS REAIS SELECON #07',
    title: `Caderno Questões Reais Aplicadas pela Banca Instituto Selecon (${QUESTIONS_REAIS_SELECON.length} Questões)`,
    subtitle: 'Questões oficiais de concursos anteriores da Selecon (Cuiabá, Seduc-MT, Câmaras)',
    category: 'tatico',
    badge: `100% Questões Reais Selecon • ${QUESTIONS_REAIS_SELECON.length}q`,
    badgeColor: 'emerald',
    durationMinutes: 140,
    totalPoints: REAIS_SELECON_PTS,
    minPassPoints: Number((REAIS_SELECON_PTS * 0.5).toFixed(2)),
    discursiva: null,
    description: 'Seleção de questões reais aplicadas pelo Instituto Selecon em provas de Cuiabá/MT e órgãos públicos, revisadas e comentadas alternativa por alternativa para você sentir a assinatura exata da banca.',
    questions: QUESTIONS_REAIS_SELECON
  }
];

// ============================================================================
// MOTOR DE CÁLCULO DE NOTA OFICIAL SELECON (PESOS 1,00 E 1,75)
// ============================================================================
export function computeOfficialSimuladoScore(questions = [], answers = {}) {
  let totalPointsPossible = 0;
  let earnedPoints = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let blankCount = 0;

  const byArea = {
    'Conhecimentos Básicos': { totalQ: 0, correct: 0, wrong: 0, blank: 0, maxPts: 0, earnedPts: 0 },
    'Conhecimentos Gerais': { totalQ: 0, correct: 0, wrong: 0, blank: 0, maxPts: 0, earnedPts: 0 },
    'Conhecimentos Específicos': { totalQ: 0, correct: 0, wrong: 0, blank: 0, maxPts: 0, earnedPts: 0 }
  };

  const bySubject = {};
  const byTopic = {};
  const wrongQuestions = [];

  questions.forEach((q, idx) => {
    const pts = Number(q.points) || (q.subjectId === 'sub_cmc_esp' ? 1.75 : 1.0);
    totalPointsPossible += pts;

    const areaKey = q.area || (q.subjectId === 'sub_cmc_esp' ? 'Conhecimentos Específicos' : 'Conhecimentos Básicos');
    if (!byArea[areaKey]) {
      byArea[areaKey] = { totalQ: 0, correct: 0, wrong: 0, blank: 0, maxPts: 0, earnedPts: 0 };
    }
    byArea[areaKey].totalQ += 1;
    byArea[areaKey].maxPts += pts;

    if (!bySubject[q.subjectId]) {
      bySubject[q.subjectId] = {
        subjectId: q.subjectId,
        subjectName: q.subjectName || q.shortSubjectName || q.subjectId,
        shortName: q.shortSubjectName || q.subjectName || q.subjectId,
        color: q.subjectColor || '#06b6d4',
        area: areaKey,
        pointsPerQ: pts,
        totalQ: 0,
        correct: 0,
        wrong: 0,
        blank: 0,
        maxPts: 0,
        earnedPts: 0
      };
    }
    bySubject[q.subjectId].totalQ += 1;
    bySubject[q.subjectId].maxPts += pts;

    if (!byTopic[q.topicId]) {
      byTopic[q.topicId] = {
        topicId: q.topicId,
        topicCode: q.topicCode || '',
        topicTitle: q.topicTitle || q.topicId,
        subjectId: q.subjectId,
        subjectName: q.subjectName,
        totalQ: 0,
        correct: 0,
        wrong: 0,
        blank: 0,
        maxPts: 0,
        earnedPts: 0
      };
    }
    byTopic[q.topicId].totalQ += 1;
    byTopic[q.topicId].maxPts += pts;

    const userAns = answers[q.id];
    const isAnswered = userAns !== undefined && userAns !== null;

    if (!isAnswered) {
      blankCount += 1;
      byArea[areaKey].blank += 1;
      bySubject[q.subjectId].blank += 1;
      byTopic[q.topicId].blank += 1;
    } else if (Number(userAns) === Number(q.answer)) {
      correctCount += 1;
      earnedPoints += pts;
      byArea[areaKey].correct += 1;
      byArea[areaKey].earnedPts += pts;
      bySubject[q.subjectId].correct += 1;
      bySubject[q.subjectId].earnedPts += pts;
      byTopic[q.topicId].correct += 1;
      byTopic[q.topicId].earnedPts += pts;
    } else {
      wrongCount += 1;
      byArea[areaKey].wrong += 1;
      bySubject[q.subjectId].wrong += 1;
      byTopic[q.topicId].wrong += 1;
      wrongQuestions.push({ ...q, questionNumber: idx + 1, userAnswer: Number(userAns) });
    }
  });

  const percentagePoints = totalPointsPossible > 0 ? (earnedPoints / totalPointsPossible) * 100 : 0;
  const percentageQuestions = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
  const approvedMinimum50 = percentagePoints >= 50;

  return {
    totalQuestions: questions.length,
    answeredCount: correctCount + wrongCount,
    correctCount,
    wrongCount,
    blankCount,
    totalPointsPossible: Number(totalPointsPossible.toFixed(2)),
    earnedPoints: Number(earnedPoints.toFixed(2)),
    percentagePoints: Number(percentagePoints.toFixed(1)),
    percentageQuestions: Number(percentageQuestions.toFixed(1)),
    approvedMinimum50,
    byArea,
    bySubject: Object.values(bySubject),
    byTopic: Object.values(byTopic),
    wrongQuestions
  };
}

// ============================================================================
// GERADOR DE CADERNOS PERSONALIZADOS ("MODO APP DE QUESTÕES")
// ============================================================================
export function buildCustomQuestionNotebook(filters = {}, questionHistory = {}) {
  const {
    subjectIds = [],
    subjectId = null,
    topicIds = [],
    topicId = null,
    sourceFilter = 'all', // 'all' | 'real_only' | 'ineditas_only'
    statusFilter = 'all', // 'all' | 'unanswered' | 'wrong_only' | 'correct_only'
    limit = 20,
    shuffle = true
  } = filters;

  const effectiveSubjectIds =
    Array.isArray(subjectIds) && subjectIds.length > 0
      ? subjectIds
      : subjectId && subjectId !== 'all'
      ? [subjectId]
      : [];
  const effectiveTopicIds =
    Array.isArray(topicIds) && topicIds.length > 0
      ? topicIds
      : topicId && topicId !== 'all'
      ? [topicId]
      : [];

  let pool = [...ALL_SIMULADO_QUESTIONS];

  if (effectiveSubjectIds.length > 0) {
    pool = pool.filter((q) => effectiveSubjectIds.includes(q.subjectId));
  }

  if (effectiveTopicIds.length > 0) {
    pool = pool.filter((q) => effectiveTopicIds.some((tid) => questionMatchesTopicFilter(q, tid)));
  }

  if (sourceFilter === 'real_only') {
    pool = pool.filter((q) => q.isRealSelecon);
  } else if (sourceFilter === 'ineditas_only') {
    pool = pool.filter((q) => !q.isRealSelecon);
  }

  if (statusFilter === 'unanswered') {
    pool = pool.filter((q) => !questionHistory[q.id]);
  } else if (statusFilter === 'wrong_only') {
    pool = pool.filter((q) => questionHistory[q.id]?.lastResult === 'wrong');
  } else if (statusFilter === 'correct_only') {
    pool = pool.filter((q) => questionHistory[q.id]?.lastResult === 'correct');
  }

  if (shuffle) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  const selected = pool.slice(0, Math.max(1, Number(limit) || 20));
  const totalPts = selected.reduce((acc, q) => acc + (Number(q.points) || 1), 0);

  return {
    id: `custom_nb_${Date.now()}`,
    code: 'CADERNO PERSONALIZADO',
    title: `Caderno Tático (${selected.length} Questões)`,
    subtitle: `${selected.length} questões selecionadas • ${totalPts.toFixed(2)} pts`,
    category: 'custom',
    badge: 'Modo App de Questões',
    badgeColor: 'cyan',
    durationMinutes: Math.max(15, selected.length * 3),
    totalPoints: Number(totalPts.toFixed(2)),
    minPassPoints: Number((totalPts * 0.5).toFixed(2)),
    discursiva: null,
    questions: selected
  };
}
