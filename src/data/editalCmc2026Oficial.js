// ANEXO V OFICIAL — EDITAL Nº 001/2026-CMC (CONSOLIDADO COM A RETIFICAÇÃO Nº 01/2026 DE 04/11/2026)
// Fonte Oficial Verificada: https://selecon-mt.selecao.net.br/informacoes/102/
// - Data da Prova Objetiva e Discursiva (Retificação Nº 01/2026): 20/12/2026 (domingo)
// - Exclusão do item 13 ("Noções de fotografia aplicada às atividades institucionais") de Técnico Legislativo conforme item 3 da Retificação Nº 01/2026.
// - Quadro de Provas (Item 9.1.2 e 9.1.3):
//   * Conhecimentos Básicos: 15 questões x 1,00 pt = 15 pontos (15% da prova objetiva)
//   * Conhecimentos Gerais:  15 questões x 1,00 pt = 15 pontos (15% da prova objetiva)
//   * Conhecimentos Específicos: 40 questões x 1,75 pt = 70 pontos (70% da prova objetiva) + Prova Discursiva (100 pontos, 20 a 30 linhas)

import { CURRICULUM } from './curriculum.js';

// Mapa rápido dos 40 nós de teoria/questões Selecon por ID para enriquecer os tópicos oficiais do Edital
const NODES_BY_ID = new Map();
for (const chapter of CURRICULUM) {
  for (const node of chapter.nodes || []) {
    NODES_BY_ID.set(node.id, node);
  }
}

function attachNodeContent(...nodeIds) {
  const validNodes = nodeIds.map(id => NODES_BY_ID.get(id)).filter(Boolean);
  if (!validNodes.length) return { teoria: null, questions: [] };

  const resumo = validNodes.flatMap(n => n.teoria?.resumo || []);
  const puloDoGato = validNodes.map(n => n.teoria?.puloDoGato).filter(Boolean).join(' • ');
  const mnemonico = validNodes.map(n => n.teoria?.mnemonico).filter(Boolean).join(' | ');
  const questions = validNodes.flatMap(n => n.questions || []);

  return {
    teoria: resumo.length ? { resumo, puloDoGato, mnemonico } : null,
    questions
  };
}

function makeTopic(id, number, label, depth = 0, parentId = null, nodeIds = []) {
  const { teoria, questions } = attachNodeContent(...nodeIds);
  return {
    id,
    number,
    label,
    name: `${number}. ${label}`,
    depth,
    parentId,
    finished: false,
    finishedAt: null,
    questionsHit: 0,
    questionsMiss: 0,
    studiedMinutes: 0,
    lastStudiedAt: null,
    teoria,
    questions
  };
}

/**
 * Constrói as 8 disciplinas oficiais do cargo de Técnico Legislativo (Nível Médio - CNM 01)
 * exatamente na ordem e com a redação literal do Anexo V do Edital Nº 001/2026-CMC (Retificado).
 *
 * Calibração padrão personalizada para o perfil do usuário:
 * - Conhecimentos Básicos (Português, RLM, Informática): knowledge = 3.5 ("Boa base / Só uma olhada"), importance = 1.0 (1,0 pt/q)
 * - Conhecimentos Gerais (História/Geo MT, Ética/Filosofia, Relações Interpessoais): knowledge = 3.5 ("Só uma olhada"), importance = 1.0 (1,0 pt/q)
 * - Legislação (Câmara e Município de Cuiabá): knowledge = 1.5 ("Foco Total"), importance = 4.0 (Cai em Básicos + itens 6 e 7 de Específicos)
 * - Conhecimentos Específicos (Técnico Legislativo): knowledge = 1.5 ("Foco Total"), importance = 8.5 (40 questões x 1,75 pt = 70% da prova + Discursiva)
 */
export function buildOfficialTecnicoLegislativoSubjects() {
  return [
    // =========================================================================
    // ÁREA I: CONHECIMENTOS BÁSICOS (15 questões x 1,00 ponto = 15 pontos)
    // =========================================================================
    {
      id: 'sub_cmc_pt',
      name: 'Língua Portuguesa',
      area: 'Conhecimentos Básicos',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#10b981', // Emerald
      knowledge: 3.5,   // Já possui boa noção -> "Só dar uma olhada" (1 bloco de 30min no ciclo)
      importance: 1.0,  // Peso 1,0 ponto por questão
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_pt_1',
          '1',
          'Leitura e interpretação de textos de variados gêneros discursivos',
          0,
          null,
          ['c1-n1']
        ),
        makeTopic(
          'cmc_pt_2',
          '2',
          'As condições de produção de um texto e as marcas composicionais de gêneros textuais diversos',
          0,
          null,
          ['c1-n2']
        ),
        makeTopic(
          'cmc_pt_3',
          '3',
          'Linguagem e adequação social',
          0,
          null
        ),
        makeTopic(
          'cmc_pt_3_1',
          '3.1',
          'Variedades linguísticas e seus determinantes sociais, regionais, históricos e individuais',
          1,
          'cmc_pt_3'
        ),
        makeTopic(
          'cmc_pt_3_2',
          '3.2',
          'Registros formal e informal da linguagem',
          1,
          'cmc_pt_3'
        ),
        makeTopic(
          'cmc_pt_4',
          '4',
          'Aspectos linguísticos na construção do texto',
          0,
          null
        ),
        makeTopic(
          'cmc_pt_4_1',
          '4.1',
          'Fonética: prosódia, ortografia',
          1,
          'cmc_pt_4',
          ['c1-n3']
        ),
        makeTopic(
          'cmc_pt_4_2',
          '4.2',
          'Morfologia: formação, classificação e flexão das palavras',
          1,
          'cmc_pt_4'
        ),
        makeTopic(
          'cmc_pt_4_3',
          '4.3',
          'Sintaxe: concordâncias verbal e nominal, regências verbal e nominal, colocação pronominal, emprego de nomes, pronomes, conjunções, advérbios, modos e tempos verbais',
          1,
          'cmc_pt_4',
          ['c3-n3', 'c3-n4']
        ),
        makeTopic(
          'cmc_pt_4_4',
          '4.4',
          'Semântica: polissemia, paronímia, homonímia, denotação e conotação',
          1,
          'cmc_pt_4'
        ),
        makeTopic(
          'cmc_pt_5',
          '5',
          'Textualidade: coesão, coerência, intertextualidade, argumentação',
          0,
          null
        ),
        makeTopic(
          'cmc_pt_6',
          '6',
          'Pontuação',
          0,
          null,
          ['c3-n5']
        ),
        makeTopic(
          'cmc_pt_7',
          '7',
          'Tipos de discurso: direto e indireto',
          0,
          null
        )
      ]
    },

    {
      id: 'sub_cmc_rlm',
      name: 'Raciocínio Lógico e Matemático',
      area: 'Conhecimentos Básicos',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#f59e0b', // Amber
      knowledge: 3.5,   // "Só dar uma olhada"
      importance: 1.0,
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_rlm_1',
          '1',
          'Operações com conjuntos',
          0,
          null
        ),
        makeTopic(
          'cmc_rlm_2',
          '2',
          'Raciocínio lógico numérico: problemas envolvendo operações com números reais e raciocínio sequencial',
          0,
          null,
          ['c4-n9']
        ),
        makeTopic(
          'cmc_rlm_3',
          '3',
          'Conceito de proposição: valores lógicos das proposições. Conectivos e negação',
          0,
          null,
          ['c1-n7', 'c3-n1']
        ),
        makeTopic(
          'cmc_rlm_3_1',
          '3.1',
          'Valores lógicos das proposições e conectivos lógicos',
          1,
          'cmc_rlm_3',
          ['c1-n7']
        ),
        makeTopic(
          'cmc_rlm_3_2',
          '3.2',
          'Negação de proposições compostas (Regra do MANÉ e De Morgan)',
          1,
          'cmc_rlm_3',
          ['c3-n1']
        ),
        makeTopic(
          'cmc_rlm_4',
          '4',
          'Argumentação lógica e diagramas lógicos',
          0,
          null
        ),
        makeTopic(
          'cmc_rlm_5',
          '5',
          'Equivalências e implicações lógicas',
          0,
          null,
          ['c3-n2']
        ),
        makeTopic(
          'cmc_rlm_6',
          '6',
          'Quantificadores universal e existencial',
          0,
          null
        ),
        makeTopic(
          'cmc_rlm_7',
          '7',
          'Problemas de contagem: princípios aditivo e multiplicativo',
          0,
          null
        )
      ]
    },

    {
      id: 'sub_cmc_info',
      name: 'Noções de Informática',
      area: 'Conhecimentos Básicos',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#06b6d4', // Cyan
      knowledge: 3.5,   // "Só dar uma olhada"
      importance: 1.0,
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_inf_1',
          '1',
          'Microinformática: conceitos, hardware, software, dispositivos de entrada, saída e armazenamento',
          0,
          null
        ),
        makeTopic(
          'cmc_inf_2',
          '2',
          'Sistemas operacionais: conceitos, recursos e uso do Windows 10 e 11 e de distribuições Linux',
          0,
          null,
          ['c3-n6']
        ),
        makeTopic(
          'cmc_inf_3',
          '3',
          'Pacotes de escritório: Microsoft Office/Microsoft 365 (Word, Excel e PowerPoint) e LibreOffice 7 ou superior (Writer, Calc e Impress): conceitos, recursos, atalhos de teclado e uso',
          0,
          null,
          ['c3-n7', 'c3-n8']
        ),
        makeTopic(
          'cmc_inf_3_1',
          '3.1',
          'Editores de texto: Microsoft Word e LibreOffice Writer (recursos, formatação e atalhos)',
          1,
          'cmc_inf_3',
          ['c3-n7']
        ),
        makeTopic(
          'cmc_inf_3_2',
          '3.2',
          'Planilhas eletrônicas: Microsoft Excel e LibreOffice Calc (fórmulas, funções e referências)',
          1,
          'cmc_inf_3',
          ['c3-n8']
        ),
        makeTopic(
          'cmc_inf_3_3',
          '3.3',
          'Apresentações: Microsoft PowerPoint e LibreOffice Impress',
          1,
          'cmc_inf_3'
        ),
        makeTopic(
          'cmc_inf_4',
          '4',
          'Redes de computadores e internet: conceitos, protocolos, arquitetura TCP/IP, navegadores (Microsoft Edge, Mozilla Firefox e Google Chrome), correio eletrônico e ferramentas de colaboração',
          0,
          null
        ),
        makeTopic(
          'cmc_inf_5',
          '5',
          'Computação em nuvem, armazenamento e serviços online. Redes sociais e comunicação digital',
          0,
          null
        ),
        makeTopic(
          'cmc_inf_6',
          '6',
          'Segurança da informação: conceitos, ameaças (vírus, malware, phishing e engenharia social), backup, firewall, antivírus e autenticação em dois fatores',
          0,
          null,
          ['c3-n9']
        ),
        makeTopic(
          'cmc_inf_7',
          '7',
          'Noções da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais)',
          0,
          null
        )
      ]
    },

    {
      id: 'sub_cmc_leg',
      name: 'Legislação (Câmara e Município de Cuiabá)',
      area: 'Conhecimentos Básicos & Base de Específicos',
      examPointsPerQuestion: 1.75,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#8b5cf6', // Violet
      knowledge: 1.5,   // Foco Total (alimenta Básicos + itens 6 e 7 de Específicos + Discursiva)
      importance: 4.0,
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_leg_1',
          '1',
          'Lei Orgânica do Município de Cuiabá-MT',
          0,
          null,
          ['c1-n5', 'c2-n1']
        ),
        makeTopic(
          'cmc_leg_1_1',
          '1.1',
          'Autonomia municipal, fundamentos e competências do Município de Cuiabá',
          1,
          'cmc_leg_1',
          ['c1-n5']
        ),
        makeTopic(
          'cmc_leg_1_2',
          '1.2',
          'Poder Legislativo Municipal e competências privativas e exclusivas da Câmara Municipal',
          1,
          'cmc_leg_1',
          ['c2-n1']
        ),
        makeTopic(
          'cmc_leg_2',
          '2',
          'Regimento Interno da Câmara Municipal de Cuiabá (Resolução nº 08, de 15 de dezembro de 2016)',
          0,
          null,
          ['c2-n2', 'c2-n3']
        ),
        makeTopic(
          'cmc_leg_2_1',
          '2.1',
          'Mesa Diretora, Presidência, Plenário e Sessões Legislativas da Câmara Municipal',
          1,
          'cmc_leg_2',
          ['c2-n2']
        ),
        makeTopic(
          'cmc_leg_2_2',
          '2.2',
          'Comissões Permanentes, Temporárias, Especiais e Parlamentares de Inquérito (CPI)',
          1,
          'cmc_leg_2',
          ['c2-n3']
        ),
        makeTopic(
          'cmc_leg_3',
          '3',
          'Lei Complementar nº 93, de 23 de junho de 2003 (Estatuto dos Servidores)',
          0,
          null,
          ['c2-n5', 'c2-n6', 'c2-n7', 'c2-n8', 'c2-n9']
        ),
        makeTopic(
          'cmc_leg_3_1',
          '3.1',
          'Provimento, nomeação, posse, exercício e jornada de trabalho',
          1,
          'cmc_leg_3',
          ['c2-n5']
        ),
        makeTopic(
          'cmc_leg_3_2',
          '3.2',
          'Estágio probatório, estabilidade, readaptação, reversão, reintegração e recondução',
          1,
          'cmc_leg_3',
          ['c2-n6']
        ),
        makeTopic(
          'cmc_leg_3_3',
          '3.3',
          'Vencimento, remuneração, vantagens pecuniárias, gratificações e adicionais',
          1,
          'cmc_leg_3',
          ['c2-n7']
        ),
        makeTopic(
          'cmc_leg_3_4',
          '3.4',
          'Licenças, afastamentos e concessões legais',
          1,
          'cmc_leg_3',
          ['c2-n8']
        ),
        makeTopic(
          'cmc_leg_3_5',
          '3.5',
          'Regime disciplinar: deveres, proibições, penalidades e Processo Administrativo Disciplinar (PAD)',
          1,
          'cmc_leg_3',
          ['c2-n9']
        ),
        makeTopic(
          'cmc_leg_4',
          '4',
          'Lei Complementar nº 235, de 3 de junho de 2011 (Plano de Cargos, Carreiras e Vencimentos da Câmara Municipal), com as alterações da Lei Complementar nº 609/2026',
          0,
          null
        )
      ]
    },

    // =========================================================================
    // ÁREA II: CONHECIMENTOS GERAIS (15 questões x 1,00 ponto = 15 pontos)
    // =========================================================================
    {
      id: 'sub_cmc_hgmt',
      name: 'História e Geografia de Mato Grosso',
      area: 'Conhecimentos Gerais',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#ec4899', // Pink
      knowledge: 3.5,   // "Só dar uma olhada"
      importance: 1.0,
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_hg_1',
          '1',
          'História de Mato Grosso — Período Colonial',
          0,
          null,
          ['c1-n8']
        ),
        makeTopic(
          'cmc_hg_1_1',
          '1.1',
          'Os bandeirantes: escravidão indígena e exploração do ouro',
          1,
          'cmc_hg_1',
          ['c1-n8']
        ),
        makeTopic(
          'cmc_hg_1_2',
          '1.2',
          'A fundação de Cuiabá: Tensões políticas entre os fundadores e a administração colonial',
          1,
          'cmc_hg_1',
          ['c1-n8']
        ),
        makeTopic(
          'cmc_hg_1_3',
          '1.3',
          'A fundação de Vila Bela da Santíssima Trindade e a criação da Capitania de Mato Grosso',
          1,
          'cmc_hg_1'
        ),
        makeTopic(
          'cmc_hg_1_4',
          '1.4',
          'A escravidão negra em Mato Grosso',
          1,
          'cmc_hg_1'
        ),
        makeTopic(
          'cmc_hg_2',
          '2',
          'História de Mato Grosso — Período Imperial',
          0,
          null
        ),
        makeTopic(
          'cmc_hg_2_1',
          '2.1',
          'A crise da mineração e as alternativas econômicas da Província',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_2',
          '2.2',
          'A Rusga',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_3',
          '2.3',
          'Os quilombos em Mato Grosso',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_4',
          '2.4',
          'Os Presidentes de Província e suas realizações',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_5',
          '2.5',
          'A Guerra da Tríplice Aliança contra o Paraguai e a participação de Mato Grosso',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_6',
          '2.6',
          'A economia de Mato Grosso após a Guerra da Tríplice Aliança contra o Paraguai',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_2_7',
          '2.7',
          'O fim do Império em Mato Grosso',
          1,
          'cmc_hg_2'
        ),
        makeTopic(
          'cmc_hg_3',
          '3',
          'História de Mato Grosso — Período Republicano',
          0,
          null
        ),
        makeTopic(
          'cmc_hg_3_1',
          '3.1',
          'O coronelismo em Mato Grosso',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_2',
          '3.2',
          'Economia de Mato Grosso na Primeira República: usinas de açúcar e criação de gado',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_3',
          '3.3',
          'Relações de trabalho em Mato Grosso na Primeira República',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_4',
          '3.4',
          'Mato Grosso durante a Era Vargas: política e economia',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_5',
          '3.5',
          'Política fundiária e as tensões sociais no campo',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_6',
          '3.6',
          'Os governadores estaduais e suas realizações',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_3_7',
          '3.7',
          'Tópicos relevantes e atuais de política, economia, sociedade, educação, tecnologia, energia, relações internacionais, desenvolvimento sustentável, segurança, ecologia e suas vinculações históricas',
          1,
          'cmc_hg_3'
        ),
        makeTopic(
          'cmc_hg_4',
          '4',
          'Geografia de Mato Grosso',
          0,
          null,
          ['c1-n9']
        ),
        makeTopic(
          'cmc_hg_4_1',
          '4.1',
          'Mato Grosso e a região Centro-Oeste',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_2',
          '4.2',
          'Geopolítica de Mato Grosso',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_3',
          '4.3',
          'Ocupação do território',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_4',
          '4.4',
          'Aspectos físicos e domínios naturais do espaço mato-grossense',
          1,
          'cmc_hg_4',
          ['c1-n9']
        ),
        makeTopic(
          'cmc_hg_4_5',
          '4.5',
          'Aspectos político-administrativos',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_6',
          '4.6',
          'Aspectos socioeconômicos de Mato Grosso',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_7',
          '4.7',
          'Formação étnica',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_8',
          '4.8',
          'Programas governamentais e fronteira agrícola mato-grossense',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_9',
          '4.9',
          'A economia do Estado no contexto nacional',
          1,
          'cmc_hg_4'
        ),
        makeTopic(
          'cmc_hg_4_10',
          '4.10',
          'A urbanização do Estado',
          1,
          'cmc_hg_4'
        )
      ]
    },

    {
      id: 'sub_cmc_etica',
      name: 'Noções de Ética e Filosofia',
      area: 'Conhecimentos Gerais',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#84cc16', // Lime
      knowledge: 3.5,   // "Só dar uma olhada"
      importance: 1.0,
      includeInCycle: true,
      topics: [
        makeTopic('cmc_et_1', '1', 'Fundamentos da Filosofia', 0, null),
        makeTopic('cmc_et_2', '2', 'Filosofia moral: Ética ou filosofia moral', 0, null, ['c4-n8']),
        makeTopic('cmc_et_3', '3', 'Consciência crítica e filosofia', 0, null),
        makeTopic('cmc_et_4', '4', 'A relação entre os valores éticos ou morais e a cultura', 0, null),
        makeTopic('cmc_et_5', '5', 'Juízos de fato ou de realidade e juízos de valor', 0, null),
        makeTopic('cmc_et_6', '6', 'Ética e cidadania', 0, null, ['c4-n8']),
        makeTopic('cmc_et_7', '7', 'Racionalismo ético', 0, null),
        makeTopic('cmc_et_8', '8', 'Ética e liberdade', 0, null)
      ]
    },

    {
      id: 'sub_cmc_rel',
      name: 'Relações Interpessoais',
      area: 'Conhecimentos Gerais',
      examPointsPerQuestion: 1.0,
      areaQuestions: 15,
      areaTotalPoints: 15,
      color: '#3b82f6', // Blue
      knowledge: 3.5,   // "Só dar uma olhada"
      importance: 1.0,
      includeInCycle: true,
      topics: [
        makeTopic('cmc_rel_1', '1', 'Relações Humanas/interpessoal', 0, null, ['c4-n7']),
        makeTopic('cmc_rel_2', '2', 'Comunicação Interpessoal', 0, null),
        makeTopic('cmc_rel_3', '3', 'Característica de um bom atendimento', 0, null, ['c4-n7']),
        makeTopic('cmc_rel_4', '4', 'Postura Profissional', 0, null),
        makeTopic('cmc_rel_5', '5', 'Integração', 0, null),
        makeTopic('cmc_rel_6', '6', 'Empatia', 0, null),
        makeTopic('cmc_rel_7', '7', 'Capacidade de ouvir', 0, null),
        makeTopic('cmc_rel_8', '8', 'Argumentação Flexível', 0, null)
      ]
    },

    // =========================================================================
    // ÁREA III: CONHECIMENTOS ESPECÍFICOS (40 questões x 1,75 pt = 70 pontos + Discursiva 100 pts)
    // =========================================================================
    {
      id: 'sub_cmc_esp',
      name: 'Conhecimentos Específicos — Técnico Legislativo',
      area: 'Conhecimentos Específicos (70% da Objetiva + Discursiva)',
      examPointsPerQuestion: 1.75,
      areaQuestions: 40,
      areaTotalPoints: 70,
      color: '#f43f5e', // Rose (Destaque Principal)
      knowledge: 1.5,   // Foco Total / Prioridade Máxima
      importance: 8.5,  // Representa 70 pontos da prova objetiva + 100 pontos da prova discursiva
      includeInCycle: true,
      topics: [
        makeTopic(
          'cmc_esp_1',
          '1',
          'Estado, governo e Administração Pública: conceitos, elementos, organização e princípios da Administração Pública',
          0,
          null,
          ['c1-n4']
        ),
        makeTopic(
          'cmc_esp_2',
          '2',
          'Organização administrativa do Estado. Administração Direta e Indireta. Órgãos públicos. Agentes públicos: cargo, emprego e função pública',
          0,
          null
        ),
        makeTopic(
          'cmc_esp_2_1',
          '2.1',
          'Organização administrativa do Estado: Administração Direta e Indireta e Órgãos públicos',
          1,
          'cmc_esp_2'
        ),
        makeTopic(
          'cmc_esp_2_2',
          '2.2',
          'Agentes públicos: cargo, emprego e função pública',
          1,
          'cmc_esp_2'
        ),
        makeTopic(
          'cmc_esp_3',
          '3',
          'Noções de Direito Administrativo: princípios administrativos; poderes administrativos; atos administrativos (conceito, requisitos, atributos e espécies)',
          0,
          null,
          ['c1-n4', 'c1-n6']
        ),
        makeTopic(
          'cmc_esp_3_1',
          '3.1',
          'Princípios administrativos expressos e implícitos',
          1,
          'cmc_esp_3',
          ['c1-n4']
        ),
        makeTopic(
          'cmc_esp_3_2',
          '3.2',
          'Poderes administrativos: vinculado, discricionário, hierárquico, disciplinar, regulamentar e de polícia',
          1,
          'cmc_esp_3',
          ['c1-n6']
        ),
        makeTopic(
          'cmc_esp_3_3',
          '3.3',
          'Atos administrativos: conceito, requisitos, atributos e espécies',
          1,
          'cmc_esp_3'
        ),
        makeTopic(
          'cmc_esp_4',
          '4',
          'Controle da Administração Pública: controle administrativo, legislativo e judicial. Responsabilidade civil da Administração Pública',
          0,
          null
        ),
        makeTopic(
          'cmc_esp_4_1',
          '4.1',
          'Controle da Administração Pública: controle administrativo, legislativo e judicial',
          1,
          'cmc_esp_4'
        ),
        makeTopic(
          'cmc_esp_4_2',
          '4.2',
          'Responsabilidade civil da Administração Pública',
          1,
          'cmc_esp_4'
        ),
        makeTopic(
          'cmc_esp_5',
          '5',
          'Direitos e garantias fundamentais. Direitos e deveres individuais e coletivos. Direitos sociais. Cidadania. Administração Pública (arts. 37 a 41 da Constituição Federal)',
          0,
          null
        ),
        makeTopic(
          'cmc_esp_5_1',
          '5.1',
          'Direitos e garantias fundamentais: direitos e deveres individuais e coletivos, direitos sociais e cidadania',
          1,
          'cmc_esp_5'
        ),
        makeTopic(
          'cmc_esp_5_2',
          '5.2',
          'Administração Pública na Constituição Federal (arts. 37 a 41 da CF/1988)',
          1,
          'cmc_esp_5'
        ),
        makeTopic(
          'cmc_esp_6',
          '6',
          'Organização e funcionamento do Poder Legislativo Municipal. Câmara Municipal. Mesa Diretora. Plenário. Comissões Permanentes e Temporárias',
          0,
          null,
          ['c2-n1', 'c2-n2', 'c2-n3']
        ),
        makeTopic(
          'cmc_esp_6_1',
          '6.1',
          'Câmara Municipal, Mesa Diretora e Plenário',
          1,
          'cmc_esp_6',
          ['c2-n2']
        ),
        makeTopic(
          'cmc_esp_6_2',
          '6.2',
          'Comissões Permanentes e Temporárias',
          1,
          'cmc_esp_6',
          ['c2-n3']
        ),
        makeTopic(
          'cmc_esp_7',
          '7',
          'Processo Legislativo e técnica legislativa',
          0,
          null,
          ['c2-n4']
        ),
        makeTopic(
          'cmc_esp_8',
          '8',
          'Redação oficial: comunicações oficiais, ofícios, memorandos, requerimentos, atas, sinopses, relatórios e correspondências administrativas',
          0,
          null,
          ['c4-n4', 'c4-n5', 'c4-n6']
        ),
        makeTopic(
          'cmc_esp_8_1',
          '8.1',
          'Padrão Ofício, atributos da redação oficial e comunicações oficiais',
          1,
          'cmc_esp_8',
          ['c4-n4']
        ),
        makeTopic(
          'cmc_esp_8_2',
          '8.2',
          'Pronomes de tratamento, vocativos e endereçamento',
          1,
          'cmc_esp_8',
          ['c4-n5']
        ),
        makeTopic(
          'cmc_esp_8_3',
          '8.3',
          'Fechos oficiais, ofícios, memorandos, requerimentos, atas, sinopses e relatórios',
          1,
          'cmc_esp_8',
          ['c4-n6']
        ),
        makeTopic(
          'cmc_esp_9',
          '9',
          'Arquivologia: protocolo, classificação, organização, guarda, conservação e arquivamento de documentos',
          0,
          null,
          ['c4-n1', 'c4-n2', 'c4-n3']
        ),
        makeTopic(
          'cmc_esp_9_1',
          '9.1',
          'Classificação e ciclo vital dos documentos (Teoria das Três Idades: corrente, intermediário e permanente)',
          1,
          'cmc_esp_9',
          ['c4-n1']
        ),
        makeTopic(
          'cmc_esp_9_2',
          '9.2',
          'Métodos de arquivamento, organização, guarda e conservação de documentos',
          1,
          'cmc_esp_9',
          ['c4-n2']
        ),
        makeTopic(
          'cmc_esp_9_3',
          '9.3',
          'Rotinas de protocolo: recebimento, registro, autuação, tramitação e expedição',
          1,
          'cmc_esp_9',
          ['c4-n3']
        ),
        makeTopic(
          'cmc_esp_10',
          '10',
          'Atendimento ao público, recepção e relações interpessoais no ambiente de trabalho',
          0,
          null,
          ['c4-n7']
        ),
        makeTopic(
          'cmc_esp_11',
          '11',
          'Noções de contabilidade aplicada ao setor público: receita, despesa e orçamento público',
          0,
          null
        ),
        makeTopic(
          'cmc_esp_12',
          '12',
          'Noções de higiene e segurança do trabalho',
          0,
          null
        )
      ]
    }
  ];
}
