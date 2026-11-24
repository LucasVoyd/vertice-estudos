// ============================================================================
// PROVA OFICIAL APLICADA — CÂMARA MUNICIPAL DE CUIABÁ (EDITAL Nº 001-CMC/2020)
// Cargo: Técnico Legislativo (Nível Médio) • Banca: Instituto Selecon
// Aplicação: 29/08/2021 • Gabarito Oficial Definitivo (FGAB pós-recursos: Q44 alterada C -> B)
// Contém todas as 70 questões objetivas + 4 figuras originais + Prova Discursiva Oficial
// ============================================================================

const q10IconesWin10 = './provas/cmc2021/q10_icones_win10.png';
const q11ExcelCuiaba = './provas/cmc2021/q11_excel_cuiaba.jpg';
const q19MancheteGrilagem = './provas/cmc2021/q19_manchete_grilagem.jpg';
const q20MapaFerrograo = './provas/cmc2021/q20_mapa_ferrograo.jpg';

const TEXTO_1_AGUA_VIRTUAL = `Texto I — Água virtual e consumo consciente

Qual a quantidade de água que você acredita utilizar diariamente? Segundo a Organização das Nações Unidas (ONU), 110 litros devem ser suficientes para atender às necessidades de uma pessoa ao longo de 24 horas, mas um banho de cinco minutos já consome cerca de 60 litros de água. Entretanto, essa estimativa da ONU não considera um conceito importante: a água virtual.

Qualquer processo produtivo utiliza água, mesmo que ela não faça parte do produto final. O total do líquido empregado, desde o início da produção até o artigo chegar ao ponto de venda, é o que chamamos de água virtual. Nos produtos agrícolas, como frutas, legumes e grãos, por exemplo, entram no cálculo a água de irrigação da lavoura, a que é necessária na industrialização, na confecção da embalagem e no transporte até o mercado.

Esse conceito ainda não é muito difundido entre a maior parte das pessoas e seu cálculo não faz parte do dia a dia. Quando falamos em economia de água, nós a relacionamos a banhos mais curtos ou a escovar os dentes com a torneira fechada. São atitudes que têm importância, mas também é imprescindível pensar nos nossos hábitos gerais de consumo e como eles podem afetar a disponibilidade de recursos hídricos.

Peças empregadas na montagem de um computador, por exemplo, utilizam aproximadamente 31,5 mil litros de água. Existe mais água embutida na fabricação de produtos usados cotidianamente do que a maior parte das pessoas imagina. Uma simples camiseta de algodão consome 200 litros e um copo de cerveja, 75. Para que um litro de leite chegue até a mesa do consumidor, foram necessários mil litros de água, contando com o que foi ingerido pela vaca e utilizado no processo industrial posteriormente.

Os números envolvidos na produção de carne bovina são ainda mais altos: 15,5 mil litros de água podem ser usados na obtenção de um quilo do alimento. Para um quilo de carne de frango são consumidos 4,3 mil litros. Uma refeição simples, como uma xícara de café, um pão francês e uma fatia de queijo, exige quase 200 litros de água. Evitar o desperdício de alimentos e outros bens de consumo é uma das medidas para reduzir o gasto de água virtual. Fazer mudanças no cardápio também pode ajudar. Trocar a carne de boi pela de frango algumas vezes na semana é uma boa opção para poupar água e gastar menos.

(Guilherme Karam — Revista Planeta, 09/05/2017)`;

export const PROVA_DISCURSIVA_CMC_2021 = {
  id: 'disc_cmc_2021',
  title: 'Prova Discursiva Oficial CMC 2021: Ciclo Orçamentário no Legislativo Municipal',
  minLines: 15,
  maxLines: 25,
  maxPoints: 100,
  minPointsToPass: 50,
  contextText: `O ciclo orçamentário é um processo dinâmico e flexível onde ocorrem as etapas de elaboração da proposta, estudo e aprovação, execução orçamentária e financeira e controle ou avaliação dos programas do setor público nos aspectos físicos e financeiros.

Considere que, durante o ciclo orçamentário da Câmara Municipal de Mutuá, ocorreram, não nessa ordem, as seguintes ações:
(1) de competência do Poder Legislativo, onde o povo da cidade, através de seus representantes intervém nas suas próprias decisões para que o orçamento acertado atenda às necessidades dos bairros mais carentes;
(2) julgou-se o nível dos objetivos fixados no orçamento e as modificações nele ocorridas durante sua execução, medindo a eficiência das ações e o grau de racionalidade dos recursos utilizados;
(3) de acordo com a Lei de Diretrizes Orçamentárias, fixam-se os objetivos concretos para o período considerado;
(4) ocorre a concretização anual dos objetivos e metas determinadas para o setor público;
(5) calcula-se a quantidade necessária de recursos humanos, materiais e financeiros para concretizar o orçamento; e
(6) implica a mobilização dos recursos materiais, humanos e financeiros.`,
  promptCommand: `Do exposto, conceitue orçamento público e cite as fases na ordem cronológica em que ocorrem, bem como relacione em cada uma de suas etapas pelo menos uma das ações desenvolvidas no ciclo orçamentário da Câmara Municipal de Mutuá. (Mínimo de 15 e máximo de 25 linhas — Máximo: 100 pontos.)`,
  rubricCriteria: [
    { id: 'c1', label: 'CONTEÚDO: conceituação de orçamento público e citação correta das 4 fases em ordem cronológica', maxPts: 40 },
    { id: 'c2', label: 'RELAÇÃO DAS AÇÕES: associação correta das ações (1) a (6) às respectivas etapas do ciclo orçamentário', maxPts: 40 },
    { id: 'c3', label: 'CORREÇÃO FORMAL: ortografia, acentuação, propriedade vocabular, morfossintaxe e limite de 15 a 25 linhas', maxPts: 20 }
  ],
  modelGuide: `• Conceito de Orçamento Público: instrumento de planejamento e controle da Administração Pública que estima receitas e fixa despesas para um exercício financeiro (anual), em conformidade com o PPA e a LDO (art. 165 da CF/88).
• Fases na ordem cronológica e relação com as ações da Câmara de Mutuá:
  1ª) Elaboração da proposta orçamentária — relacionar às ações (3) fixação de objetivos concretos conforme a LDO e (5) cálculo dos recursos humanos, materiais e financeiros necessários;
  2ª) Estudo e aprovação (Discussão/Votação Legislativa) — relacionar à ação (1) competência do Poder Legislativo com participação popular via representantes;
  3ª) Execução orçamentária e financeira — relacionar às ações (4) concretização anual de objetivos e metas e (6) mobilização dos recursos materiais, humanos e financeiros;
  4ª) Controle e avaliação — relacionar à ação (2) julgamento do alcance dos objetivos, eficiência e racionalidade dos recursos utilizados.`
};

const RAW_PROVA_CMC_2021 = [
  // ==========================================================================
  // BLOCO I — CONHECIMENTOS BÁSICOS (01 a 15 • 1,00 ponto cada)
  // ==========================================================================
  {
    id: 'cmc2021_q01',
    examNumber: 1,
    subjectId: 'sub_cmc_pt',
    topicId: 'cmc_pt_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '1. Interpretação de texto: água virtual e consumo consciente (Prova CMC 2021)',
    enunciado: `${TEXTO_1_AGUA_VIRTUAL}\n\n(Questão 01 — CMC 2021) Ao discutir a ideia de economia de água introduzindo o conceito de água virtual, o autor busca ampliar o conhecimento do leitor e sua conscientização sobre:`,
    options: [
      'a quantidade de agrotóxicos envolvida na produção agrícola mundial',
      'o desperdício de embalagens de papelão na venda de legumes e grãos',
      'a fabricação de computadores e a necessidade de reciclagem das peças',
      'o consumo de água embutido nos produtos até a sua comercialização'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Logo no 2º parágrafo, o texto define água virtual como o total de água empregado em todo o processo produtivo até o artigo chegar ao ponto de venda, convidando o leitor a repensar hábitos gerais de consumo além do banho ou torneira.'
  },
  {
    id: 'cmc2021_q02',
    examNumber: 2,
    subjectId: 'sub_cmc_pt',
    topicId: 'cmc_pt_5',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '5. Textualidade e progressão temática: desenvolvimento de parágrafo (Prova CMC 2021)',
    enunciado: `${TEXTO_1_AGUA_VIRTUAL}\n\n(Questão 02 — CMC 2021) O segundo parágrafo se desenvolve a partir de:`,
    options: [
      'confirmação de todo o enunciado no primeiro parágrafo',
      'introdução à ideia de economia descrita no terceiro parágrafo',
      'explicação de uma expressão apresentada no primeiro parágrafo',
      'apresentação de dados quantitativos discutidos no terceiro parágrafo'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. O 1º parágrafo encerra citando "um conceito importante: a água virtual", e o 2º parágrafo desenvolve justamente a definição e os componentes dessa expressão.'
  },
  {
    id: 'cmc2021_q03',
    examNumber: 3,
    subjectId: 'sub_cmc_pt',
    topicId: 'cmc_pt_5',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '5. Textualidade e argumentação: relação de exemplificação (Prova CMC 2021)',
    enunciado: `(Questão 03 — CMC 2021) “Existe mais água embutida na fabricação de produtos usados cotidianamente do que a maior parte das pessoas imagina. Uma simples camiseta de algodão consome 200 litros e um copo de cerveja, 75.”\n\nNesse trecho, a segunda frase, em relação à primeira, adquire o sentido de uma:`,
    options: [
      'exemplificação',
      'generalização',
      'comparação',
      'contradição'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Após a afirmação geral sobre "produtos usados cotidianamente", a segunda frase ilustra concretamente essa tese com exemplos específicos (camiseta de algodão e copo de cerveja).'
  },
  {
    id: 'cmc2021_q04',
    examNumber: 4,
    subjectId: 'sub_cmc_pt',
    topicId: 'cmc_pt_4_3',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '4.3. Sintaxe e morfologia verbal: infinitivo impessoal (Prova CMC 2021)',
    enunciado: `${TEXTO_1_AGUA_VIRTUAL}\n\n(Questão 04 — CMC 2021) Os verbos "evitar", "fazer" e "trocar", no último parágrafo, encontram-se no infinitivo:`,
    options: [
      'pessoal, por se dirigirem aos leitores que devem ser convencidos',
      'impessoal, por não se referirem a nenhum sujeito determinado',
      'pessoal, por estarem devidamente flexionados na primeira pessoa',
      'impessoal, por não se apresentarem com pronomes indeterminados'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Nos períodos "Evitar o desperdício... é uma das medidas", "Fazer mudanças... pode ajudar" e "Trocar a carne... é uma boa opção", os verbos não possuem sujeito próprio nem flexão pessoal, caracterizando o infinitivo impessoal.'
  },
  {
    id: 'cmc2021_q05',
    examNumber: 5,
    subjectId: 'sub_cmc_pt',
    topicId: 'cmc_pt_4_3',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '4.3. Sintaxe: colocação pronominal e regência verbal (Prova CMC 2021)',
    enunciado: `(Questão 05 — CMC 2021) Em “e como eles podem afetar a disponibilidade de recursos hídricos”, o trecho em destaque ("a disponibilidade de recursos hídricos") pode ser reescrito, sem comprometer o sentido, como:`,
    options: [
      'e como eles podem afetar-lhes',
      'e como eles podem afetá-los',
      'e como eles podem afetá-la',
      'e como eles podem os afetar'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. O verbo "afetar" é transitivo direto e o núcleo do objeto direto destacado é feminino singular ("a disponibilidade"). Substituindo-o por pronome oblíquo após verbo terminado em -R, cai o R e usa-se "-la" com acento agudo no "a": "afetá-la".'
  },
  {
    id: 'cmc2021_q06',
    examNumber: 6,
    subjectId: 'sub_cmc_rlm',
    topicId: 'cmc_rlm_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '1. Operações com conjuntos: diferença e união M - (P U Q) (Prova CMC 2021)',
    enunciado: `(Questão 06 — CMC 2021) Considere-se os conjuntos:\nM = pessoas que são técnicos legislativos;\nP = pessoas que têm mais do que 50 anos;\nQ = pessoas que nasceram em Cuiabá.\n\nSe João pertence ao conjunto M – (P ∪ Q), então, necessariamente, João:`,
    options: [
      'tem 50 anos ou menos e não nasceu em Cuiabá',
      'nasceu em Cuiabá e é um técnico legislativo',
      'não é um técnico legislativo e não nasceu em Cuiabá',
      'é um técnico legislativo e possui exatamente 50 anos'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Pertencer a M – (P ∪ Q) significa pertencer a M (é técnico legislativo) e NÃO pertencer a P (não tem mais que 50 anos, logo tem 50 anos ou menos) e NÃO pertencer a Q (não nasceu em Cuiabá).'
  },
  {
    id: 'cmc2021_q07',
    examNumber: 7,
    subjectId: 'sub_cmc_rlm',
    topicId: 'cmc_rlm_3_2',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '3.2. Negação de proposições compostas: Lei de De Morgan (Prova CMC 2021)',
    enunciado: `(Questão 07 — CMC 2021) Considere-se a proposição abaixo.\n\n"Maria não é contadora ou João é analista."\n\nA negação lógica dessa proposição está corretamente indicada na seguinte opção:`,
    options: [
      'Maria não é contadora e João não é analista.',
      'Maria é contadora ou João não é analista.',
      'Maria é contadora e João não é analista.',
      'Maria é contadora ou João é analista.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Pela 1ª Lei de De Morgan, a negação de (~p ∨ q) é (p ∧ ~q): nega-se a primeira parte ("Maria é contadora"), troca-se "ou" por "e", e nega-se a segunda parte ("João não é analista").'
  },
  {
    id: 'cmc2021_q08',
    examNumber: 8,
    subjectId: 'sub_cmc_rlm',
    topicId: 'cmc_rlm_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '1. Conjuntos e diagramas: interseção de dois conjuntos (Prova CMC 2021)',
    enunciado: `(Questão 08 — CMC 2021) Sobre um grupo de 80 turistas que foi visitar pelo menos um de dois parques de Cuiabá, Parque Mãe Bonifácia e Parque das Águas, sabe-se que:\n• 50 turistas visitaram o Parque Mãe Bonifácia;\n• n turistas visitaram ambos os parques;\n• 70 turistas visitaram apenas um dos dois parques.\n\nO valor de n é igual a:`,
    options: [
      '25',
      '20',
      '15',
      '10'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Como todos os 80 turistas visitaram pelo menos um parque, o total (80) é a soma dos que visitaram apenas um parque (70) com os que visitaram ambos os parques (n). Logo, n = 80 - 70 = 10.'
  },
  {
    id: 'cmc2021_q09',
    examNumber: 9,
    subjectId: 'sub_cmc_rlm',
    topicId: 'cmc_rlm_7',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '7. Problemas de contagem: princípio multiplicativo (Prova CMC 2021)',
    enunciado: `(Questão 09 — CMC 2021) Ao digitar o CEP (Código de Endereço Postal) de sua residência, João lembrava da sequência de todos os dígitos com exceção dos três últimos, mas sabia apenas que:\n• o primeiro e o terceiro dígitos eram iguais;\n• o dígito do meio era distinto dos outros dois.\n\nO número máximo de tentativas distintas que João poderá fazer até conseguir digitar o CEP corretamente é igual a:`,
    options: [
      '100',
      '90',
      '81',
      '80'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. A trinca tem forma X-Y-X (10 dígitos possíveis de 0 a 9). Para X existem 10 possibilidades; para Y (distinto de X) restam 9 possibilidades; e o terceiro dígito fica fixado igual a X (1 possibilidade). Total = 10 × 9 × 1 = 90 tentativas.'
  },
  {
    id: 'cmc2021_q10',
    examNumber: 10,
    subjectId: 'sub_cmc_info',
    topicId: 'cmc_inf_2',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '2. Windows 10 BR: ícones da Área de Notificação (Prova CMC 2021)',
    imageUrl: q10IconesWin10,
    imageAlt: 'Dois ícones da Área de Notificação do Windows 10: primeiro ícone de ondas Wi-Fi e segundo ícone de dispositivo USB com visto de confirmação',
    enunciado: `(Questão 10 — CMC 2021) Localizada no canto inferior direito da tela de um monitor de vídeo de um notebook com sistema operacional Windows 10 BR, a Área de Notificação contém diversos ícones, cada qual com um significado bem definido. Neste contexto, os ícones exibidos na imagem abaixo devem ser acionados, respectivamente, com os seguintes objetivos:`,
    options: [
      'conectar o notebook à internet via bluetooth e remover dispositivo USB com segurança',
      'conectar o notebook à internet via bluetooth e acessar o serviço OneDrive na nuvem',
      'conectar o notebook à internet via wifi e remover dispositivo USB com segurança',
      'conectar o notebook à internet via wifi e acessar o serviço OneDrive na nuvem'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. O primeiro ícone (arcos irradiando de um ponto) representa a rede sem fio Wi-Fi; o segundo ícone (conector USB com sinal de visto) é o "Remover Hardware e Ejetar Mídia com Segurança".'
  },
  {
    id: 'cmc2021_q11',
    examNumber: 11,
    subjectId: 'sub_cmc_info',
    topicId: 'cmc_inf_3_2',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '3.2. Microsoft Excel 2019 BR: funções SE e MED (Prova CMC 2021)',
    imageUrl: q11ExcelCuiaba,
    imageAlt: 'Planilha do Excel 2019 BR com colunas Mínima (C8:C12 = 3, 12, 15, 5, 10) e Existente (D8:D12 = 3, 13, 25, 7, 6)',
    enunciado: `(Questão 11 — CMC 2021) A planilha da figura abaixo foi criada no Excel 2019 BR, tendo sido realizados os procedimentos descritos a seguir.\n• Em E8, foi inserida uma expressão usando a função SE que mostra a mensagem “REPOR” se a quantidade existente for igual ou menor que a mínima e “OK” se a quantidade existente for maior que a mínima. Em seguida, a célula E8 foi selecionada e, mediante a execução dos atalhos de teclado, a expressão em E8 foi copiada para as células E9, E10, E11 e E12.\n• Para finalizar, foi inserida a expressão =MED(C8:C12) na célula D14.\n\nNessas condições, a expressão inserida em E12 e o valor mostrado em D14 são, respectivamente:`,
    options: [
      '=SE(D12<=C12;"OK";"REPOR") e 9',
      '=SE(D12<=C12;"OK";"REPOR") e 10',
      '=SE(D12<=C12;"REPOR";"OK") e 9',
      '=SE(D12<=C12;"REPOR";"OK") e 10'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Na função =SE(teste; se_verdadeiro; se_falso), se D12<=C12 (existente <= mínima) o retorno verdadeiro é "REPOR", caso contrário "OK": =SE(D12<=C12;"REPOR";"OK"). Em D14, =MED(C8:C12) calcula a MEDIANA (não a média!) de {3, 12, 15, 5, 10}; ordenando {3, 5, 10, 12, 15}, o termo central é 10.'
  },
  {
    id: 'cmc2021_q12',
    examNumber: 12,
    subjectId: 'sub_cmc_info',
    topicId: 'cmc_inf_4',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '4. Navegador Mozilla Firefox (Downloads) e WebMail Gmail (Cópia Oculta) (Prova CMC 2021)',
    enunciado: `(Questão 12 — CMC 2021) Um funcionário da Câmara Municipal de Cuiabá está acessando os recursos da internet por meio do browser Firefox Mozilla em um microcomputador, versão desktop, com Windows 10 BR. Nesta atividade, realizou os procedimentos listados a seguir.\nI. Durante a navegação em sites, executou um atalho de teclado para verificar o andamento dos downloads realizados e em andamento.\nII. Para finalizar, ele acessou a infraestrutura conhecida por WebMail do provedor Gmail e enviou uma mensagem na modalidade cópia oculta e, para isso, digitou o endereço de e-mail do destinatário em um espaço com um indicativo específico que sinaliza sua finalidade.\n\nO atalho de teclado em I e o indicativo para o espaço são, respectivamente:`,
    options: [
      'Ctrl + J e Cco',
      'Ctrl + D e Cco',
      'Ctrl + J e Cc',
      'Ctrl + D e Cc'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. No Firefox (e Chrome/Edge), Ctrl + J abre a janela/gerenciador de Downloads (Ctrl + D adiciona aos Favoritos). No Gmail em português, Cco significa "Com Cópia Oculta" (Cc é cópia visível).'
  },
  {
    id: 'cmc2021_q13',
    examNumber: 13,
    subjectId: 'sub_cmc_leg',
    topicId: 'cmc_leg_2_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '2.1. Regimento Interno CMC (Res. 08/2016): renúncia ao mandato de vereador (Prova CMC 2021)',
    enunciado: `(Questão 13 — CMC 2021) Nuri é vereador no município X e participa de processo seletivo para exercer atividade como engenheiro em outro estado da federação. Não é possível a compatibilização entre as duas funções. Nuri resolve optar pelo cargo de engenheiro no Estado. Nos termos do Regimento Interno da Câmara Municipal de Cuiabá, a renúncia ao mandato de vereador deve ser dirigida por:`,
    options: [
      'discurso ao Presidente',
      'voto ao plenário',
      'verbalização ao partido',
      'escrito à Mesa Diretora'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Segundo o Regimento Interno da Câmara Municipal de Cuiabá (Resolução nº 08/2016), a renúncia ao mandato de vereador deve ser formalizada por escrito e dirigida à Mesa Diretora.'
  },
  {
    id: 'cmc2021_q14',
    examNumber: 14,
    subjectId: 'sub_cmc_leg',
    topicId: 'cmc_leg_2_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '2.1. Regimento Interno CMC (Res. 08/2016): escolha dos líderes partidários (Prova CMC 2021)',
    enunciado: `(Questão 14 — CMC 2021) Ômega é líder do seu partido na Câmara dos Deputados. Desejoso de articular uma base eleitoral, atua em vários municípios procurando influenciar na escolha dos líderes das câmaras municipais que estão localizadas na base territorial onde concentra o seu eleitorado. Nos termos do Regimento Interno da Câmara Municipal de Cuiabá, a escolha dos líderes partidários será feita na:`,
    options: [
      'sessão preparatória e de posse dos vereadores',
      'reunião do diretório municipal do partido',
      'plenária da Câmara que inaugura a sessão legislativa',
      'assembleia geral da agremiação política'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Nos termos do Regimento Interno da CMC (Resolução nº 08/2016), a indicação/escolha dos líderes partidários ocorre na sessão preparatória e de posse dos vereadores.'
  },
  {
    id: 'cmc2021_q15',
    examNumber: 15,
    subjectId: 'sub_cmc_leg',
    topicId: 'cmc_leg_1_1',
    area: 'Conhecimentos Básicos',
    points: 1.0,
    topicLabel: '1.1. Lei Orgânica de Cuiabá: competência tributária municipal (Prova CMC 2021)',
    enunciado: `(Questão 15 — CMC 2021) Lois é auditora fiscal do município GH e participa de comissão para ajustar o fluxo de caixa da cidade com o objetivo de liberar recursos para investimentos. Um dos pilares do debate consiste na instituição de tributos. Nos termos da Lei Orgânica do Município de Cuiabá, observadas as normas constitucionais e legais, poderá o Município instituir, através de leis, os seguintes tributos:`,
    options: [
      'contribuições de seguridade',
      'contribuições de proteção',
      'contribuições de melhorias',
      'contribuições de apoio'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Conforme a Constituição Federal (art. 145) e a Lei Orgânica do Município de Cuiabá, o Município pode instituir mediante lei: impostos municipais, taxas (em razão do poder de polícia ou serviços públicos) e contribuições de melhoria decorrentes de obras públicas.'
  },

  // ==========================================================================
  // BLOCO II — CONHECIMENTOS GERAIS (16 a 30 • 1,00 ponto cada)
  // ==========================================================================
  {
    id: 'cmc2021_q16',
    examNumber: 16,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_1_1',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '1.1. História de MT Colonial: bandeiras, missões, monções e mineração (Prova CMC 2021)',
    enunciado: `(Questão 16 — CMC 2021) Durante o período colonial da história mato-grossense, várias expedições e atividades econômicas utilizaram-se da mão de obra dos povos indígenas com diferentes propósitos. Sobre a exploração dessa mão de obra, pode-se afirmar:`,
    options: [
      'As bandeiras eram expedições exploratórias em busca de metais e pedras preciosos. Tinham, também, a missão de levar a civilização portuguesa para ajudar no desenvolvimento dos povos indígenas, respeitando seus costumes e modos de vida.',
      'As missões religiosas eram aldeamentos feitos, principalmente, pelos jesuítas, onde os povos indígenas eram protegidos. Estes não eram explorados e tinham reconhecimento de sua cultura, não sofrendo, desta maneira, o processo de aculturação.',
      'As monções eram expedições de comércio que traziam para Mato Grosso roupas, bebidas, medicamentos e alimentos variados. Os rios eram a única rota utilizada pelos sertanistas, que tiveram ajuda dos indígenas, conhecedores da navegação na região.',
      'Na mineração aurífera mato-grossense, foi utilizada em larga escala a mão de obra escravizada indígena. Além do mais, esta mão de obra era muito valorizada na povoação do território, que era utilizada para ocupar as fronteiras.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. As monções eram expedições fluviais comerciais que ligavam Porto Feliz (SP) a Cuiabá pelos rios, suprindo a região de mercadorias com auxílio dos saberes indígenas de navegação. Na mineração aurífera (D) predominou a mão de obra negra escravizada; nas bandeiras (A) e missões (B) houve aprisionamento, violência e aculturação.'
  },
  {
    id: 'cmc2021_q17',
    examNumber: 17,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_2_3',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '2.3. Quilombos em Mato Grosso: Quilombo do Piolho / Quariterê (Prova CMC 2021)',
    enunciado: `(Questão 17 — CMC 2021) “Por ordem do governador e capitão general da capitania de Mato Grosso, João de Albuquerque de Mello Pereira e Cáceres, foi realizada em 1795 uma diligência para destruir vários quilombos nas águas do Guaporé, na fronteira com a Bolívia. O diário dessa diligência é um relato minucioso dos acontecimentos e uma oportunidade rara para a abordagem das relações históricas entre os índios e os negros em Mato Grosso, que têm passado ao largo dos interesses dos historiadores, apesar das várias transcrições existentes. O objetivo deste trabalho é, a partir desse relato, fazer uma reflexão antropológica acerca das categorias caburés e cabixis utilizadas para designar os descendentes de negros e índios, especialmente Paresi e Nambiquara, que formaram em parte a tradicional população mato-grossense.”\n(Maria Fátima Roberto Machado — Quilombos, cabixis e caburés: índios e negros em Mato Grosso)\n\nDe acordo com o texto, na história de Mato Grosso encontravam-se vários quilombos. O quilombo mais representativo da história mato-grossense foi o:`,
    options: [
      'dos Palmares',
      'do Piolho',
      'do Leblon',
      'dos Kalungas'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. O Quilombo do Piolho (também chamado de Quariterê), no vale do Guaporé (MT) e liderado por Tereza de Benguela no século XVIII, foi o principal e mais emblemático quilombo de Mato Grosso.'
  },
  {
    id: 'cmc2021_q18',
    examNumber: 18,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_4_8',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '4.8. Política de colonização e estrutura fundiária em Mato Grosso (Prova CMC 2021)',
    enunciado: `(Questão 18 — CMC 2021) Desde o início da ocupação do território do Mato Grosso, em 1719, até os dias de hoje, a estrutura fundiária do estado é organizada, predominantemente, em grandes propriedades rurais, os latifúndios. A política de colonização esteve sempre presente na realidade mato-grossense no último século.\n\nNÃO faz parte da história da política de colonização do Estado de Mato Grosso a seguinte afirmativa:`,
    options: [
      'A Colônia Agrícola Nacional de Dourados, atual região da Grande Dourados – Sul do Antigo Mato Grosso –, foi criada em 1943, na ditadura do Estado Novo (1937-1945). Esta foi o marco inicial da atual política pública de colonização das terras do Mato Grosso.',
      'Durante a ditadura civil-militar no Brasil (1964-1985), foram feitos incentivos à ocupação do território mato-grossense. O Estado estimulou a colonização particular ocasionando uma imigração em massa de pequenos e médios agricultores da região sul do país.',
      'A construção da BR-163 foi de fundamental importância na colonização da Amazônia Legal. Ao longo dessa longa rodovia foram surgindo, nas suas margens, inúmeras fazendas, projetos agropecuários de colonização, os minifúndios.',
      'A estrutura fundiária do estado de Mato Grosso proporcionou ao estado tornar-se um dos maiores produtores de soja, milho, algodão e de rebanho bovino, mantendo, ao mesmo tempo, a posse das terras ancestrais dos indígenas e o bioma do Pantanal.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. A expansão dos latifúndios, do agronegócio e das frentes de colonização em Mato Grosso NÃO preservou integralmente a posse ancestral dos povos indígenas nem manteve intacto o bioma do Pantanal, sendo historicamente marcada por conflitos fundiários e impactos socioambientais.'
  },
  {
    id: 'cmc2021_q19',
    examNumber: 19,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_3_5',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '3.5. Política fundiária e tensões no campo: grilagem de terras (Prova CMC 2021)',
    imageUrl: q19MancheteGrilagem,
    imageAlt: 'Manchete: A velha grilagem de terras no Mato Grosso — Le Monde Diplomatique Brasil',
    enunciado: `(Questão 19 — CMC 2021) A manchete abaixo retrata uma situação de ocupação do território em Mato Grosso (Disponível em: diplomatique.org.br, Acesso em 08/03/21).\n\nO termo grileiro refere-se a:`,
    options: [
      'trabalhadores rurais que ocupam terras sem possuir o título de propriedade',
      'invasores de terras que conseguem obter uma falsa escritura de propriedade da terra',
      'trabalhadores diaristas e temporários que recebem de acordo com a sua produtividade',
      'arrendatários que alugam a terra de um proprietário para cultivar alimentos ou criar gado'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Grileiro é quem se apropria ilegalmente de terras públicas ou de terceiros falsificando títulos/escrituras de propriedade (o nome vem da prática histórica de colocar documentos novos em caixas com grilos para envelhecer artificialmente o papel).'
  },
  {
    id: 'cmc2021_q20',
    examNumber: 20,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_4_9',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '4.9. Economia de MT e infraestrutura logística: Ferrogrão (Prova CMC 2021)',
    imageUrl: q20MapaFerrograo,
    imageAlt: 'Mapa do corredor logístico ligando Sinop (MT) a Miritituba (PA), com principais cargas soja, milho, farelo e fertilizantes',
    enunciado: `(Questão 20 — CMC 2021) O mapa abaixo refere-se a projeto para escoamento de produção em futuro corredor logístico (Valor Econômico, 17/08/2020).\n\nO projeto, ligando Sinop (MT) a Miritituba (PA), quando finalizado, terá alta capacidade de transporte e competitividade no escoamento da produção pelo Arco Norte. O corredor logístico em análise refere-se à:`,
    options: [
      'Ferrovia Ferrogrão',
      'Ferrovia Norte-Sul',
      'Ferrovia Central do Brasil',
      'Ferrovia de Integração Oeste-Leste'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. A EF-170, conhecida como Ferrogrão, é o projeto ferroviário planejado para ligar o polo produtor de grãos em Sinop (MT) aos portos do Arco Norte em Miritituba/Itaituba (PA).'
  },
  {
    id: 'cmc2021_q21',
    examNumber: 21,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_4_2',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '4.2. Geopolítica de MT: fronteira e cidades gêmeas — Cáceres (Prova CMC 2021)',
    enunciado: `(Questão 21 — CMC 2021) "Na fronteira, Cáceres entra na lista de 'cidades gêmeas' e pode se tornar polo comercial de MT. Portaria do Ministério do Desenvolvimento Regional foi publicada em 24 de abril." (G1 MT, 02/05/2019).\n\nDentre as características das cidades gêmeas, pode-se destacar:`,
    options: [
      'a adoção oficial de uma moeda única',
      'o fraco fluxo de pessoas e mercadorias entre elas',
      'o grande potencial de integração econômica e cultural',
      'a impossibilidade do intercâmbio cultural'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Cidades gêmeas são municípios cortados pela linha de fronteira (seca ou fluvial) que apresentam intenso fluxo fronteiriço e grande potencial de integração econômica, comercial e cultural (Cáceres-MT em relação à Bolívia).'
  },
  {
    id: 'cmc2021_q22',
    examNumber: 22,
    subjectId: 'sub_cmc_hgmt',
    topicId: 'cmc_hg_4_4',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '4.4. Domínios naturais de MT: características do Cerrado (Prova CMC 2021)',
    enunciado: `(Questão 22 — CMC 2021) A formação vegetal denominada Cerrado apresenta as seguintes características:`,
    options: [
      'vegetação xerófila, adaptada ao clima semiárido',
      'constituída por palmeiras, com destaque para o babaçu e a carnaúba',
      'formações rasteiras ou herbáceas, adaptada ao clima subtropical',
      'vegetação caducifólia, adaptada ao clima tropical típico'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. O Cerrado ocorre sob clima tropical típico (verão chuvoso e inverno seco) e apresenta espécies arbóreo-arbustivas tropófilas/caducifólias (que perdem parte das folhas na estação seca), além de troncos retorcidos e casca grossa. (A refere-se à Caatinga; B à Mata dos Cocais; C aos Pampas).'
  },
  {
    id: 'cmc2021_q23',
    examNumber: 23,
    subjectId: 'sub_cmc_etica',
    topicId: 'cmc_et_1',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '1. Fundamentos da Filosofia: admiração e espanto segundo Chauí (Prova CMC 2021)',
    enunciado: `(Questão 23 — CMC 2021) Marilena Chauí (2000) considera que a filosofia diz não às crenças e aos preconceitos do senso comum quando se começa a pensar o mundo estabelecido como se nunca o tivesse visto e se tem um pensamento crítico movido pela admiração e pelo:`,
    options: [
      'espanto',
      'marasmo',
      'desinteresse',
      'ditado'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Desde Platão e Aristóteles (retomado por Marilena Chauí em "Convite à Filosofia"), a origem da atitude filosófica está no espanto (thauma) e na admiração diante do mundo, rompendo com a aceitação passiva do senso comum.'
  },
  {
    id: 'cmc2021_q24',
    examNumber: 24,
    subjectId: 'sub_cmc_etica',
    topicId: 'cmc_et_3',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '3. Consciência crítica e filosofia: busca racional da verdade (Prova CMC 2021)',
    enunciado: `(Questão 24 — CMC 2021) Ao divulgar na rede social uma informação que o transmissor sabe ser uma “fake news”, essa pessoa está tendo conduta que se opõe a um dos principais fundamentos da filosofia que é a busca racional da:`,
    options: [
      'irreflexão',
      'verdade',
      'barbaridade',
      'obstinação'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. A Filosofia fundamenta-se na busca racional e crítica da verdade, opondo-se à propagação deliberada de falsidades ou enganos.'
  },
  {
    id: 'cmc2021_q25',
    examNumber: 25,
    subjectId: 'sub_cmc_etica',
    topicId: 'cmc_et_5',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '5. Juízos de fato (realidade) vs. juízos de valor (Prova CMC 2021)',
    enunciado: `(Questão 25 — CMC 2021) Na pandemia, quando os profissionais de saúde, baseados na ciência, criticam a conduta de cidadãos(ães) que não usam máscaras para evitarem a propagação do vírus Covid-19 fazem uma crítica moral baseada em um juízo de:`,
    options: [
      'fato',
      'valor',
      'medo',
      'desdém'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Na distinção apresentada por Marilena Chauí, os juízos de fato (ou de realidade) enunciam o que as coisas são objetiva e cientificamente ("baseados na ciência": máscaras reduzem transmissão viral), servindo de base fática para a crítica.'
  },
  {
    id: 'cmc2021_q26',
    examNumber: 26,
    subjectId: 'sub_cmc_etica',
    topicId: 'cmc_et_6',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '6. Ética e cidadania: conduta ativa, consciência e responsabilidade (Prova CMC 2021)',
    enunciado: `(Questão 26 — CMC 2021) Chauí (2000) observa que a ética exige que todo cidadão compreenda a diferença entre atividade e passividade, entendendo que sua conduta pode ser ativa, sendo capaz de dialogar consigo mesmo e com os outros sobre o sentido dos valores e dos fins estabelecidos socialmente, recusando a violência contra si e contra os outros. Essa conduta é contrária à conduta do cidadão passivo, que se deixa governar pela vontade do outro, abrindo mão de sua própria consciência, vontade, liberdade e:`,
    options: [
      'passividade',
      'inferioridade',
      'incapacidade',
      'responsabilidade'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Segundo Marilena Chauí, o sujeito ético passivo abdica de consciência, vontade, liberdade e responsabilidade, deixando-se conduzir pelos impulsos ou pela vontade alheia.'
  },
  {
    id: 'cmc2021_q27',
    examNumber: 27,
    subjectId: 'sub_cmc_rel',
    topicId: 'cmc_rel_2',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '2. Comunicação interpessoal: Comunicação Não Violenta — Rosenberg (Prova CMC 2021)',
    enunciado: `(Questão 27 — CMC 2021) Rosenberg (2006) afirma que as pessoas podem aprimorar a forma como se comunicam exercitando um modelo de expressão que tem por base a fala consciente, o desejo de transmitir clareza e de oferecer uma escuta respeitosa nos diálogos cotidianos. A esse modelo, o autor deu o nome de “comunicação não violenta” por promover técnicas que tornam as relações interpessoais mais:`,
    options: [
      'conflituosas',
      'automáticas',
      'dispersivas',
      'harmoniosas'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. A Comunicação Não Violenta (CNV), sistematizada por Marshall Rosenberg, substitui reações defensivas/agressivas por observação, sentimentos, necessidades e pedidos claros, tornando as relações mais empáticas e harmoniosas.'
  },
  {
    id: 'cmc2021_q28',
    examNumber: 28,
    subjectId: 'sub_cmc_rel',
    topicId: 'cmc_rel_3',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '3. Características de um bom atendimento ao público (Prova CMC 2021)',
    enunciado: `(Questão 28 — CMC 2021) Maurício tinha orgulho de ser muito rápido ao atender o público. Se por um lado ele supervalorizava a sua atuação quantitativa de atendimento, por outro, restringia qualitativamente o tempo de fala e escuta que concedia a cada um que atendia, menosprezando a finalidade da instituição pública que é prestar um atendimento de qualidade para a população. A sua coordenadora, em uma avaliação crítica ao seu desempenho, observou que ele precisava compreender que seu trabalho também poderia ser:`,
    options: [
      'competitivo, se triplicasse as metas quantitativas',
      'gratificante, por ser atencioso e útil aos outros',
      'decepcionante, por ser muito corporativista',
      'despreocupado, frente à finalidade do serviço'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. A qualidade no atendimento público exige equilíbrio entre agilidade e escuta atenciosa/útil ao cidadão, tornando o trabalho mais humano e gratificante.'
  },
  {
    id: 'cmc2021_q29',
    examNumber: 29,
    subjectId: 'sub_cmc_rel',
    topicId: 'cmc_rel_6',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '6. Empatia nas relações interpessoais e serviço público (Prova CMC 2021)',
    enunciado: `(Questão 29 — CMC 2021) Um profissional que atua em um serviço público precisa ter competência social para lidar com a diversidade de relacionamentos interpessoais com as equipes de trabalho e com os cidadãos. Uma competência social que se tornou imprescindível desde o começo da pandemia de Covid-19 é a capacidade de sentir:`,
    options: [
      'intuição',
      'aversão',
      'empatia',
      'indiferença'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Empatia é a competência social fundamental de se colocar no lugar do outro e compreender suas necessidades e sentimentos.'
  },
  {
    id: 'cmc2021_q30',
    examNumber: 30,
    subjectId: 'sub_cmc_rel',
    topicId: 'cmc_rel_4',
    area: 'Conhecimentos Gerais',
    points: 1.0,
    topicLabel: '4. Postura profissional e liderança ética (Prova CMC 2021)',
    enunciado: `(Questão 30 — CMC 2021) Todo profissional que assume um cargo de liderança precisa ter uma autopercepção amadurecida e conhecer sua capacidade de manter padrões de:`,
    options: [
      'inaptabilidade e incoerência',
      'honestidade e integridade',
      'ambição e ganância',
      'pessimismo e acomodação'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. A liderança ética no ambiente organizacional e no setor público requer autopercepção e sustentação de padrões de honestidade e integridade.'
  },

  // ==========================================================================
  // BLOCO III — CONHECIMENTOS ESPECÍFICOS (31 a 70 • 1,75 ponto cada)
  // ==========================================================================
  {
    id: 'cmc2021_q31',
    examNumber: 31,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '1. Estado como pessoa jurídica territorial: personalidade e atuação (Prova CMC 2021)',
    enunciado: `(Questão 31 — CMC 2021) O conceito de Estado como pessoa jurídica territorial está relacionado à seguinte afirmativa, quanto à sua atuação:`,
    options: [
      'limitada ao direito público, mantendo sua personalidade de direito público',
      'limitada ao direito privado, mantendo sempre sua personalidade de direito público',
      'tanto no direito público como no direito privado, mantendo sempre sua única personalidade de direito público',
      'tanto no direito público como no direito privado, mantendo personalidade de direito público ou privado conforme o campo de sua atuação'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Na doutrina de Hely Lopes Meirelles seguida pela banca Selecon, o Estado é pessoa jurídica territorial soberana com personalidade jurídica UNA de Direito Público, embora possa atuar em relações regidas tanto pelo direito público quanto pelo direito privado (como contratos privados da Administração).'
  },
  {
    id: 'cmc2021_q32',
    examNumber: 32,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.1. Princípios administrativos: razoabilidade e proporcionalidade (Prova CMC 2021)',
    enunciado: `(Questão 32 — CMC 2021) O princípio básico da administração pública implícito na Constituição Federal (1988) e previsto na Lei nº 14.133/2021 que, segundo Hely Lopes Meirelles (2020), envolve a proporcionalidade, proibindo excesso, e que “objetiva aferir a compatibilidade entre os meios e os fins, de modo a evitar restrições desnecessárias ou abusivas por parte da Administração Pública, com lesões aos direitos fundamentais”, é o denominado princípio da:`,
    options: [
      'finalidade',
      'legalidade',
      'moralidade',
      'razoabilidade'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Trata-se da definição clássica do princípio da razoabilidade (associado à proporcionalidade e à proibição de excesso), implícito na CF/88 e expresso no art. 5º da Lei nº 14.133/2021 (Nova Lei de Licitações) e art. 2º da Lei nº 9.784/99.'
  },
  {
    id: 'cmc2021_q33',
    examNumber: 33,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '1. Elementos constitutivos do Estado: soberania (Prova CMC 2021)',
    enunciado: `(Questão 33 — CMC 2021) Os elementos constitutivos do Estado são povo, território e governo soberano. Com relação ao elemento soberania, é INCORRETO afirmar que:`,
    options: [
      'pode haver estado independente sem soberania',
      'a auto-organização do estado é emanada do povo',
      'o governo soberano detém e exerce o poder absoluto de autodeterminação e auto-organização',
      'a soberania é o poder absoluto, incontrastável de organizar-se e conduzir-se segundo a vontade livre de seu povo'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. A soberania é elemento essencial e indissociável do Estado nacional independente. Portanto, NÃO pode haver Estado independente sem governo soberano (as alternativas B, C e D reproduzem a lição clássica da doutrina).'
  },
  {
    id: 'cmc2021_q34',
    examNumber: 34,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.1. Administração Indireta: fundação pública de direito privado (Prova CMC 2021)',
    enunciado: `(Questão 34 — CMC 2021) Na organização política e administrativa brasileira, a entidade da administração indireta dotada de personalidade jurídica de direito privado, com patrimônio próprio, criação autorizada por lei, escritura pública e estatuto registrado e inscrito no Registro Civil de Pessoas Jurídicas, com objetivo de interesse coletivo e sob o amparo e controle permanente do Estado, é a:`,
    options: [
      'autarquia',
      'fundação',
      'empresa pública',
      'sociedade de economia mista'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. As fundações públicas instituídas sob personalidade de direito privado têm criação autorizada por lei (art. 37, XIX, CF/88) e adquirem personalidade mediante escritura pública e inscrição de estatuto no Registro Civil de Pessoas Jurídicas (e não na Junta Comercial).'
  },
  {
    id: 'cmc2021_q35',
    examNumber: 35,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.2. Agentes públicos: classificação — agentes políticos (Prova CMC 2021)',
    enunciado: `(Questão 35 — CMC 2021) Os chefes do executivo e seus auxiliares imediatos, os membros do Poder Judiciário, os membros do Ministério Público e do Tribunal de Contas e os representantes diplomáticos, além de outras autoridades que atuam com independência funcional no desempenho de atribuições governamentais, judiciais ou quase judiciais, estranhas ao quadro do serviço público, são os agentes públicos denominados:`,
    options: [
      'políticos',
      'delegados',
      'honoríficos',
      'administrativos'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Reprodução literal do conceito de Agentes Políticos na classificação de Hely Lopes Meirelles (junto aos membros do Poder Legislativo — senadores, deputados e vereadores).'
  },
  {
    id: 'cmc2021_q36',
    examNumber: 36,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '1. Poderes e deveres do administrador público: dever de prestar contas (Prova CMC 2021)',
    enunciado: `(Questão 36 — CMC 2021) Um contribuinte foi à Secretaria de Fazenda da Prefeitura, por discordar do valor cobrado de seu imóvel a título de IPTU, e requereu que lhe seja fornecida certidão de pagamentos já efetuados e esclarecimentos quanto à fórmula empregada para o cálculo e lançamento do tributo. O fato de exigir a certidão e a prestação dos esclarecimentos necessários ao contribuinte relaciona-se com o seguinte poder/dever do administrador público:`,
    options: [
      'dever de eficiência',
      'poder-dever de agir',
      'dever de probidade',
      'dever de prestar contas'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Na doutrina administrativista (Hely Lopes Meirelles), os quatro deveres do administrador são: poder-dever de agir, dever de eficiência, dever de probidade e dever de prestar contas (que abrange não só contas financeiras a órgãos de controle, mas todo esclarecimento e certidão sobre a gestão ao cidadão).'
  },
  {
    id: 'cmc2021_q37',
    examNumber: 37,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.2. Agentes públicos: conceito de cargo público (Prova CMC 2021)',
    enunciado: `(Questão 37 — CMC 2021) Na organização do quadro funcional da administração pública, o lugar funcional dentro da estrutura da administração direta, nas autarquias e nas fundações públicas, ocupado por servidor público com funções e remuneração especificadas por lei constitui:`,
    options: [
      'o cargo público',
      'a função pública',
      'a carreira pública',
      'o emprego público'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Cargo público é o lugar criado por lei, com denominação própria, número certo e vencimentos pagos pelos cofres públicos, para ser provido por servidor estatutário na administração direta, autárquica ou fundacional.'
  },
  {
    id: 'cmc2021_q38',
    examNumber: 38,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.2. Poderes administrativos: poder hierárquico (delegar, avocar e fiscalizar) (Prova CMC 2021)',
    enunciado: `(Questão 38 — CMC 2021) Na administração pública brasileira, o ato de delegar, avocar e fiscalizar, dentre outros, está associado ao conceito de poder:`,
    options: [
      'de polícia',
      'disciplinar',
      'hierárquico',
      'regulamentar'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. São atribuições típicas do Poder Hierárquico ordenar, coordenar, controlar/fiscalizar os órgãos e agentes subordinados, bem como delegar e avocar atribuições (atenção: aplicar sanção a servidor é do poder disciplinar).'
  },
  {
    id: 'cmc2021_q39',
    examNumber: 39,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.3. Atos administrativos: atributo da imperatividade (Prova CMC 2021)',
    enunciado: `(Questão 39 — CMC 2021) O prefeito da cidade de Porto Amigo decretou a interdição do comércio como forma de combater a proliferação do vírus da COVID-19. Essa medida foi criticada pelas mídias sociais e vários contribuintes insistiram em abrir o comércio. Porém, o prefeito, com a ajuda da guarda municipal, impôs coercitivamente seu fechamento. Nesse caso, o fato de o prefeito usar de força impositiva para o cumprimento da ordem está relacionado com o seguinte atributo do ato administrativo:`,
    options: [
      'veracidade',
      'imperatividade',
      'operatividade',
      'exequibilidade'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. A imperatividade (ou poder extroverso) é o atributo que impõe a observância obrigatória do ato administrativo a terceiros independentemente de sua concordância. Note que entre as 4 alternativas listadas (veracidade, imperatividade, operatividade, exequibilidade), a única que integra os atributos clássicos (PATI/PATI: Presunção de legitimidade, Autoexecutoriedade, Tipicidade e Imperatividade) é a imperatividade.'
  },
  {
    id: 'cmc2021_q40',
    examNumber: 40,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.3. Espécies de atos administrativos: ato discricionário (Prova CMC 2021)',
    enunciado: `(Questão 40 — CMC 2021) A espécie de ato em que a Administração, autorizada por lei, pratica ato com liberdade de escolha quanto ao conteúdo e conveniência de sua realização, denomina-se ato:`,
    options: [
      'normativo',
      'vinculado',
      'constitutivo',
      'discricionário'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. No ato discricionário, a lei confere à Administração margem de escolha segundo critérios de conveniência e oportunidade (mérito administrativo) quanto ao conteúdo, motivo ou momento da prática do ato.'
  },
  {
    id: 'cmc2021_q41',
    examNumber: 41,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.3. Extinção dos atos administrativos: anulação e revogação (Prova CMC 2021)',
    enunciado: `(Questão 41 — CMC 2021) Com relação à invalidação e revogação dos atos administrativos, é INCORRETO afirmar que:`,
    options: [
      'a revogação de um ato administrativo quanto ao mérito e oportunidade é atribuição exclusiva do judiciário',
      'a declaração de invalidade de um ato administrativo, como regra geral, gera efeitos ex tunc e a revogação, ex nunc',
      'como regra geral, a anulação dos atos administrativos tem efeitos às suas origens, não gerando direitos para as partes',
      'a anulação de um ato administrativo ilegítimo ou ilegal pode ser feita tanto pela Administração, quanto pelo poder judiciário'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. O erro está em A: a revogação (por conveniência e oportunidade — mérito administrativo) é atribuição EXCLUSIVA DA PRÓPRIA ADMINISTRAÇÃO PÚBLICA, nunca do Poder Judiciário no exercício da função jurisdicional (Súmula 473 do STF).'
  },
  {
    id: 'cmc2021_q42',
    examNumber: 42,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_4_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '4.1. Controle administrativo: recurso/representação por irregularidades (Prova CMC 2021)',
    enunciado: `(Questão 42 — CMC 2021) O controle na Administração Pública pode ser conceituado como a faculdade de vigiar, orientar e corrigir aquilo que um poder, órgão ou autoridade, exerce sobre a conduta profissional do outro. Assim, a denúncia formal e assinada relatando irregularidades internas ou abuso de poder, feita por qualquer indivíduo e dirigida à autoridade competente para conhecer e coibir a ilegalidade, está relacionada ao seguinte tipo de recurso administrativo:`,
    options: [
      'reclamação',
      'representação',
      'recurso hierárquico',
      'pedido de reconsideração'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Na classificação clássica de Hely Lopes Meirelles sobre controle administrativo, representação é a denúncia formal e assinada de irregularidades internas ou abuso de poder, feita à autoridade competente para apurar e coibir a ilegalidade.'
  },
  {
    id: 'cmc2021_q43',
    examNumber: 43,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_4_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '4.1. Controle judicial da Administração: Ação Popular (Prova CMC 2021)',
    enunciado: `(Questão 43 — CMC 2021) O instrumento de defesa dos interesses da coletividade que pode ser utilizado por eleitor para obter anulação de ato ou contrato administrativo lesivo ao patrimônio público, ou à entidade de que o Estado participe, é o instrumento de controle judiciário denominado:`,
    options: [
      'habeas data',
      'ação popular',
      'mandado de injunção',
      'mandado de segurança'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Nos termos do art. 5º, LXXIII, da CF/88 e da Lei nº 4.717/1965, qualquer cidadão (eleitor no pleno gozo dos direitos políticos) é parte legítima para propor Ação Popular visando anular ato lesivo ao patrimônio público.'
  },
  {
    id: 'cmc2021_q44',
    examNumber: 44,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.1. Organização administrativa: desconcentração entre órgãos (Alterada no Gabarito Final) (Prova CMC 2021)',
    enunciado: `(Questão 44 — CMC 2021) A prestação do serviço público que a Administração executa centralizadamente, mas o distribui entre dois ou mais órgãos da mesma entidade, para facilitar sua realização e obtenção pelos usuários, relaciona-se ao conceito de:`,
    options: [
      'serviço descentralizado',
      'serviço desconcentrado',
      'execução direta do serviço',
      'execução indireta do serviço'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B (ALTERADA PÓS-RECURSO do gabarito preliminar "C" para "B" no FGAB oficial da Selecon!). A distribuição interna de competências entre órgãos da MESMA pessoa jurídica denomina-se desconcentração (serviço desconcentrado). Descentralização pressupõe transferência para outra pessoa física ou jurídica.'
  },
  {
    id: 'cmc2021_q45',
    examNumber: 45,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.1. Órgãos públicos: classificação quanto à posição estatal — autônomos (Prova CMC 2021)',
    enunciado: `(Questão 45 — CMC 2021) Os desmembramentos da administração federal direta que não chegam a ser uma pessoa jurídica, mas gozam de certa autonomia administrativa e financeira para o desempenho de suas atribuições específicas, como o Arquivo Nacional e o Departamento de Imprensa Nacional, são órgãos do tipo:`,
    options: [
      'auxiliares',
      'dirigentes',
      'autônomos',
      'entes de cooperação'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Na classificação de Hely Lopes Meirelles quanto à posição estatal (Independentes, Autônomos, Superiores e Subalternos), órgãos autônomos localizam-se na cúpula da Administração abaixo dos independentes, possuindo ampla autonomia administrativa, financeira e técnica (embora sem personalidade jurídica).'
  },
  {
    id: 'cmc2021_q46',
    examNumber: 46,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.2. Poder de polícia: condições de validade dos atos (Prova CMC 2021)',
    enunciado: `(Questão 46 — CMC 2021) O poder de polícia é a faculdade de que a Administração Pública dispõe para condicionar e restringir o uso e o gozo de bens, atividades e direitos individuais buscando benefício da coletividade ou da própria Administração. Assim, a condição de validade para os atos de polícia são a competência, a finalidade e a forma, acrescidas da:`,
    options: [
      'celeridade e da legalidade dos meios empregados',
      'probidade administrativa e da segregação de funções',
      'razoabilidade e da proporcionalidade dos meios empregados',
      'proporcionalidade da sanção e da legalidade dos meios empregados'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Citação literal de Hely Lopes Meirelles: são condições de validade do ato de polícia a competência, a finalidade e a forma, acrescidas da proporcionalidade da sanção e da legalidade dos meios empregados.'
  },
  {
    id: 'cmc2021_q47',
    examNumber: 47,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_2_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '2.1. Descentralização e prestação de serviço público por delegação (Prova CMC 2021)',
    enunciado: `(Questão 47 — CMC 2021) A prestação do serviço público por delegação do Estado caracteriza-se pela afirmação de que o Estado:`,
    options: [
      'transfere para o particular atividade indevidamente explorada pelo setor público',
      'cria uma entidade e a ela transfere por lei determinado serviço público ou de utilidade pública',
      'presta o serviço público ou de utilidade pública por seus próprios órgãos e em seu nome e sob sua exclusiva responsabilidade',
      'transfere por contrato unicamente a execução do serviço, para que o prestador execute ao público em seu nome e por conta e risco, nas condições estabelecidas e sob controle estatal'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Na delegação contratual (concessão/permissão), o Poder Público mantém a titularidade do serviço e transfere apenas a execução ao particular, que o presta em seu próprio nome, por sua conta e risco, sob regulação e controle estatal. (B refere-se à outorga legal).'
  },
  {
    id: 'cmc2021_q48',
    examNumber: 48,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.3. Atos administrativos negociais: permissão (Prova CMC 2021)',
    enunciado: `(Questão 48 — CMC 2021) O ato administrativo negocial, discricionário e precário mediante o qual a Administração consente que o particular utilize privativamente um bem público ou execute serviço de utilidade pública, é o denominado:`,
    options: [
      'licença',
      'admissão',
      'permissão',
      'concessão'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Na lição de Hely Lopes Meirelles, a permissão (especialmente de uso de bem público) é ato administrativo negocial, discricionário e precário. Licença e admissão são atos vinculados; concessão é contrato bilateral.'
  },
  {
    id: 'cmc2021_q49',
    examNumber: 49,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.3. Contratos administrativos: características — bilateralidade vs unilateralidade (Prova CMC 2021)',
    enunciado: `(Questão 49 — CMC 2021) O contrato administrativo, segundo Hely Lopes Meirelles, é o ajuste que a Administração Pública, agindo nessa qualidade, firma com o particular ou outra entidade tendo como objeto uma atividade que traduza interesse público, nas condições estabelecidas pela própria Administração. Assim é INCORRETO afirmar que contrato administrativo é:`,
    options: [
      'formal',
      'unilateral',
      'oneroso',
      'comutativo'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Todo contrato administrativo é consensual (depende de acordo de vontades), formal, oneroso, comutativo e intuitu personae — NÃO é unilateral (embora possa ser alterado ou rescindido unilateralmente mediante cláusulas exorbitantes).'
  },
  {
    id: 'cmc2021_q50',
    examNumber: 50,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.1. Princípio da continuidade e exceção do contrato não cumprido (Prova CMC 2021)',
    enunciado: `(Questão 50 — CMC 2021) A peculiaridade do contrato administrativo que admite a Administração exigir do particular o cumprimento de obrigação, mesmo sem ter cumprido com a sua, entendendo que a continuidade do serviço público é mais importante que o interesse do particular, relaciona-se a:`,
    options: [
      'alteração e rescisão unilateral',
      'aplicação de penalidades contratuais',
      'exceção do contrato não cumprido',
      'interpretação do contrato administrativo'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Trata-se da restrição à "exceptio non adimpleti contractus" (exceção do contrato não cumprido) nos contratos administrativos, pela qual o particular não pode suspender de imediato a execução sem aguardar o prazo legal (Lei 14.133/2021: atraso superior a 2 meses).'
  },
  {
    id: 'cmc2021_q51',
    examNumber: 51,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_3_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '3.2. Regime jurídico administrativo: cláusulas exorbitantes (Prova CMC 2021)',
    enunciado: `(Questão 51 — CMC 2021) As cláusulas comuns em contratos administrativos que colocam a Administração Pública em posição superior à outra parte, denominam-se cláusulas:`,
    options: [
      'pétreas',
      'essenciais',
      'necessárias',
      'exorbitantes'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Cláusulas exorbitantes são prerrogativas que exorbitam do direito privado e colocam a Administração em posição de supremacia contratual em defesa do interesse público (alteração/rescisão unilateral, fiscalização, penalidades e ocupação provisória).'
  },
  {
    id: 'cmc2021_q52',
    examNumber: 52,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.1. Direitos e garantias fundamentais (Art. 5º CF/88): liberdade de associação (Prova CMC 2021)',
    enunciado: `(Questão 52 — CMC 2021) O Art. 5º da Constituição Federal/1988 afirma que todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade. Sobre esse tema, é correto afirmar que:`,
    options: [
      'a criação de associações e, na forma da lei, de cooperativas depende de autorização, sendo necessária a interferência estatal para regular seu funcionamento',
      'ninguém poderá ser compelido a associar-se ou a permanecer associado',
      'é plena a liberdade de associação para fins lícitos, incluída a de caráter paramilitar',
      'é assegurado a todos o acesso à informação, não sendo resguardado o sigilo da fonte, mesmo quando necessário ao exercício profissional'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Art. 5º, XX, CF/88 ("ninguém poderá ser compelido a associar-se ou a permanecer associado"). Erros nas demais: (A) independe de autorização e é vedada interferência estatal (inc. XVIII); (C) vedada a de caráter paramilitar (inc. XVII); (D) resguardado o sigilo da fonte (inc. XIV).'
  },
  {
    id: 'cmc2021_q53',
    examNumber: 53,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.1. Direitos sociais (Art. 6º da CF/88) (Prova CMC 2021)',
    enunciado: `(Questão 53 — CMC 2021) São direitos sociais, na forma da Constituição Federal/1988, a saúde, a educação, a alimentação, o trabalho, o lazer e, dentre outros, mais os seguintes:`,
    options: [
      'proteção à maternidade e previdência privada',
      'assistência aos desamparados e porte de arma',
      'previdência privada e assistência aos desamparados',
      'assistência aos desamparados e proteção à maternidade'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Art. 6º, caput, da CF/88: educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social (não privada!), proteção à maternidade e à infância e assistência aos desamparados.'
  },
  {
    id: 'cmc2021_q54',
    examNumber: 54,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.2. Administração Pública na CF (Art. 37): sindicalização e exceção militar (Prova CMC 2021)',
    enunciado: `(Questão 54 — CMC 2021) A Administração Pública direta e indireta de qualquer dos poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá aos princípios previstos no Caput do Art. 37 da Constituição Federal/1988, com EXCEÇÃO do seguinte:`,
    options: [
      'é garantido ao servidor público civil e ao militar o direito à livre associação sindical',
      'o direito de greve será exercido nos termos e nos limites definidos em lei específica',
      'o prazo de validade do concurso público será de até dois anos, prorrogável uma vez, por igual período',
      'os cargos, empregos e funções públicas são acessíveis aos brasileiros que preencham os requisitos estabelecidos em lei, assim como aos estrangeiros na forma da lei'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. O art. 37, VI, da CF/88 garante a livre associação sindical exclusivamente ao servidor público CIVIL; ao militar são proibidas a sindicalização e a greve (art. 142, § 3º, IV, da CF/88).'
  },
  {
    id: 'cmc2021_q55',
    examNumber: 55,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.2. Acumulação remunerada de cargos públicos (Art. 37, XVI CF/88) (Prova CMC 2021)',
    enunciado: `(Questão 55 — CMC 2021) Um servidor efetivo da Câmara Municipal de Cuiabá, contratado no cargo de técnico legislativo devidamente registrado no CRA, deseja, de acordo com a lei, acumular seu cargo atual com outro cargo público em que seja possível a compatibilidade de horário. De acordo com o Inciso XVI do Art. 37 da Constituição Federal/1988, é permitido acumular um cargo técnico com o seguinte cargo público:`,
    options: [
      'um cargo de policial militar',
      'um cargo de técnico em uma estatal',
      'um cargo de professor',
      'um cargo científico no Instituto Federal de Tecnologia'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. O art. 37, XVI, "b", da CF/88 permite a acumulação remunerada de "um cargo de professor com outro técnico ou científico" (desde que haja compatibilidade de horários e respeito ao teto).'
  },
  {
    id: 'cmc2021_q56',
    examNumber: 56,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.2. Direitos aplicáveis aos servidores públicos (Art. 39, § 3º c/c Art. 7º CF/88) (Prova CMC 2021)',
    enunciado: `(Questão 56 — CMC 2021) De acordo com o Art. 39 (§ 3º) da Constituição Federal/1988, aplica-se aos servidores ocupantes de cargo público, conforme o disposto no Art. 7º da Carta Magna:`,
    options: [
      'seguro-desemprego, em caso de desemprego involuntário',
      'piso salarial proporcional à extensão e à complexidade do trabalho',
      'irredutibilidade do salário, salvo o disposto em convenção ou acordo coletivo',
      'proteção do mercado de trabalho da mulher, mediante incentivos específicos, nos termos da lei'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. O art. 39, § 3º, da CF/88 remete expressamente ao art. 7º, XX ("proteção do mercado de trabalho da mulher, mediante incentivos específicos, nos termos da lei"), mas NÃO remete ao seguro-desemprego (inc. II), nem ao piso proporcional (inc. V), nem à irredutibilidade sujeita a acordo coletivo (inc. VI).'
  },
  {
    id: 'cmc2021_q57',
    examNumber: 57,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_5_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '5.1. Nacionalidade (Art. 12, § 3º CF/88): cargos privativos de brasileiro nato (Prova CMC 2021)',
    enunciado: `(Questão 57 — CMC 2021) São privativos de brasileiros natos, de acordo com o § 3º do Art. 12 da Constituição Federal/1988, os seguintes cargos:`,
    options: [
      'carreira diplomática e praças das Forças Armadas',
      'presidente da Câmara dos Deputados e oficial das Forças Armadas',
      'ministro de estado da defesa e deputado federal',
      'ministro do Supremo Tribunal Federal e presidente da Câmara de Vereadores'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Art. 12, § 3º, CF/88: são privativos de brasileiro nato Presidente/Vice-Presidente da República, Presidente da Câmara dos Deputados, Presidente do Senado, Ministro do STF, carreira diplomática, oficial das Forças Armadas e Ministro de Estado da Defesa. Praças, deputado federal comum e presidente de Câmara Municipal não estão no rol.'
  },
  {
    id: 'cmc2021_q58',
    examNumber: 58,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade e Orçamento Público (Lei nº 4.320/64): inversões financeiras (Prova CMC 2021)',
    enunciado: `(Questão 58 — CMC 2021) Classificam-se como inversões financeiras, de acordo com a Lei nº 4.320/64, as dotações destinadas a:`,
    options: [
      'aquisição de imóveis, ou de bens de capital já em utilização',
      'subvenções sociais que se destinem a instituições públicas ou privadas de caráter assistencial ou cultural, sem finalidade lucrativa',
      'manutenção de serviços anteriormente criados, inclusive quando para atender a obras de conservação e adaptação de bens imóveis',
      'subvenções econômicas que se destinem a empresas públicas ou privadas de caráter industrial, comercial, agrícola ou pastoril'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Literalidade do art. 12, § 5º, I, da Lei nº 4.320/1964: classificam-se como Inversões Financeiras as dotações destinadas à aquisição de imóveis ou de bens de capital já em utilização. (B e D são transferências correntes; C é despesa de custeio).'
  },
  {
    id: 'cmc2021_q59',
    examNumber: 59,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Pública (Lei nº 4.320/64, art. 51): exceções à anterioridade orçamentária (Prova CMC 2021)',
    enunciado: `(Questão 59 — CMC 2021) Nenhum tributo será exigido ou aumentado sem que a lei o estabeleça, nenhum será cobrado em cada exercício sem prévia autorização orçamentária, de acordo com o Art. 51 da Lei nº 4.320/64, com as exceções do imposto lançado por motivo de guerra e:`,
    options: [
      'a tarifa aduaneira',
      'a contribuição de melhoria',
      'o imposto predial e territorial urbano',
      'o imposto sobre serviços de qualquer natureza'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Literalidade do art. 51 da Lei nº 4.320/1964: "Nenhum tributo será exigido ou aumentado sem que a lei o estabeleça, nenhum será cobrado em cada exercício sem prévia autorização orçamentária, ressalvados a tarifa aduaneira e o imposto lançado por motivo de guerra." (Obs.: o princípio da anualidade orçamentária para tributos não foi recepcionado como regra geral pela CF/88, mas a questão cobrou a letra literal do art. 51 da Lei 4.320/64).'
  },
  {
    id: 'cmc2021_q60',
    examNumber: 60,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Pública (Lei nº 4.320/64, art. 53): estágio do lançamento da receita (Prova CMC 2021)',
    enunciado: `(Questão 60 — CMC 2021) O ato da repartição competente, que verifica a procedência do crédito fiscal e a pessoa que lhe é devedora e inscreve o débito desta, denomina-se:`,
    options: [
      'recolhimento',
      'arrecadação',
      'lançamento',
      'previsão'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Definição literal do art. 53 da Lei nº 4.320/1964: "O lançamento da receita é ato da repartição competente, que verifica a procedência do crédito fiscal e a pessoa que lhe é devedora e inscreve o débito desta."'
  },
  {
    id: 'cmc2021_q61',
    examNumber: 61,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Pública (Lei nº 4.320/64, art. 58): empenho da despesa (Prova CMC 2021)',
    enunciado: `(Questão 61 — CMC 2021) O ato emanado de autoridade competente, que cria para o Estado obrigação de pagamento pendente ou não de implemento de condição, é:`,
    options: [
      'o pregão',
      'o empenho',
      'o pagamento',
      'a liquidação'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Definição literal do art. 58 da Lei nº 4.320/1964: "O empenho de despesa é o ato emanado de autoridade competente que cria para o Estado obrigação de pagamento pendente ou não de implemento de condição."'
  },
  {
    id: 'cmc2021_q62',
    examNumber: 62,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Pública (Lei nº 4.320/64, art. 105): Balanço Patrimonial — Ativo Permanente (Prova CMC 2021)',
    enunciado: `(Questão 62 — CMC 2021) Os resultados gerais do exercício demonstrados no Balanço Patrimonial de um ente público que compreendem os bens, créditos e valores, cuja mobilização ou alienação dependa de autorização legislativa denominam-se:`,
    options: [
      'ativo financeiro',
      'passivo financeiro',
      'ativo permanente',
      'passivo permanente'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Art. 105, § 2º, da Lei nº 4.320/1964: "O Ativo Permanente compreenderá os bens, créditos e valores, cuja mobilização ou alienação dependa de autorização legislativa."'
  },
  {
    id: 'cmc2021_q63',
    examNumber: 63,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Pública (Lei nº 4.320/64, art. 106): avaliação de bens móveis e imóveis (Prova CMC 2021)',
    enunciado: `(Questão 63 — CMC 2021) A avaliação do elemento patrimonial “bens móveis e imóveis”, de acordo com a Lei nº 4.320/64, obedecerá à norma que determina sua avaliação pelo:`,
    options: [
      'preço médio ponderado das compras',
      'valor de aquisição ou pelo custo de produção ou de construção',
      'preço de aquisição da última unidade a integrar o patrimônio da empresa',
      'valor nominal, feita a conversão ou atualização monetária, quando em moeda estrangeira, à taxa de câmbio vigente na data do balanço'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Art. 106, II, da Lei nº 4.320/1964: "os bens móveis e imóveis, pelo valor de aquisição ou pelo custo de produção ou de construção" (A refere-se a almoxarifado/bens em estoque; D a débitos/créditos e valores em espécie).'
  },
  {
    id: 'cmc2021_q64',
    examNumber: 64,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Finanças Públicas (LRF LC 101/2000, art. 2º, II): empresa controlada (Prova CMC 2021)',
    enunciado: `(Questão 64 — CMC 2021) A sociedade cuja maioria do capital social com direito a voto pertença, direta ou indiretamente, ao Município é a:`,
    options: [
      'fundação pública',
      'fundação privada',
      'empresa controlada',
      'empresa estatal dependente'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito Oficial Definitivo: C. Literalidade do art. 2º, inciso II, da Lei de Responsabilidade Fiscal (LC nº 101/2000): "empresa controlada: sociedade cuja maioria do capital social com direito a voto pertença, direta ou indiretamente, a ente da Federação."'
  },
  {
    id: 'cmc2021_q65',
    examNumber: 65,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Finanças Públicas (LRF LC 101/2000, art. 17): despesa obrigatória de caráter continuado (Prova CMC 2021)',
    enunciado: `(Questão 65 — CMC 2021) A Câmara Municipal classifica como de caráter continuado a despesa corrente derivada de lei ou ato administrativo normativo que fixe para si a obrigação legal de sua execução por certo período, conforme determina a Lei nº 101/2000. Assim, NÃO se classifica como de caráter continuado a seguinte despesa:`,
    options: [
      'a concessão de progressão funcional a um servidor',
      'o aluguel de um imóvel para período superior a dois anos',
      'o aumento de vencimento dos funcionários para repor perdas salariais',
      'o pagamento em dobro de férias pagas no prazo legal e não usufruídas pelo empregado'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Conforme o art. 17 da LRF (LC 101/2000), despesa obrigatória de caráter continuado exige obrigação legal por período superior a 2 exercícios. Uma indenização eventual/pontual de férias em dobro não configura obrigação contínua permanente.'
  },
  {
    id: 'cmc2021_q66',
    examNumber: 66,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Finanças Públicas (LRF LC 101/2000, art. 18 e 19): despesa total com pessoal (Prova CMC 2021)',
    enunciado: `(Questão 66 — CMC 2021) A despesa total com pessoal, em cada período de apuração e em cada ente da Federação, não poderá exceder os percentuais da receita corrente líquida, conforme fixadas no Caput do Art. 19 da Lei nº 101/2000. Na verificação do atendimento dos limites definidos neste artigo, serão computadas as despesas:`,
    options: [
      'relativas a incentivos à demissão voluntária',
      'com salários devidos aos empregados em cargos em comissão',
      'com indenização por demissão de servidores ou empregados',
      'com inativos e pensionistas custeadas com recursos vinculados ao regime próprio da previdência do servidor'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Nos termos do art. 18 c/c art. 19, § 1º, da LRF (LC 101/2000), computam-se na despesa total com pessoal os vencimentos e vantagens de cargos efetivos, eletivos e em comissão (B); enquanto indenizações por demissão (C), PDV (A) e inativos custeados por recursos vinculados/contribuições do RPPS (D) são deduzidos/excluídos na apuração do limite.'
  },
  {
    id: 'cmc2021_q67',
    examNumber: 67,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial: pronome de tratamento ao Presidente da Câmara Municipal (Prova CMC 2021)',
    enunciado: `(Questão 67 — CMC 2021) De acordo com o Manual de Correspondência da Presidência da República e do Tribunal de Contas do Estado de Mato Grosso, o pronome empregado no trato com o Presidente da Câmara Municipal é o seguinte:`,
    options: [
      'Digníssimo Senhor',
      'Caro Senhor',
      'Ilustríssimo Senhor',
      'Vossa Excelência'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito Oficial Definitivo: D. Conforme o Manual de Redação da Presidência da República (3ª ed.) e normas de cerimonial público, o Presidente da Câmara Municipal recebe o tratamento "Vossa Excelência" (enquanto vereadores em geral usam "Vossa Senhoria", salvo exceções regimentais locais — e lembre que "Digníssimo" e "Ilustríssimo" foram abolidos no Padrão Ofício).'
  },
  {
    id: 'cmc2021_q68',
    examNumber: 68,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_4_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '4.1. Controle Interno e Auditoria Interna: conceito (Prova CMC 2021)',
    enunciado: `(Questão 68 — CMC 2021) O tipo de auditoria realizada por funcionários da própria empresa, que fazem parte de um departamento de auditoria da empresa cujo objetivo principal é avaliação, monitoramento da adequação e efetividade dos controles utilizados pela organização, é a denominada auditoria:`,
    options: [
      'interna',
      'independente',
      'externa',
      'no fornecedor'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Auditoria interna é realizada por equipe vinculada à própria estrutura da entidade, voltada à avaliação contínua e ao aperfeiçoamento dos processos de governança, gerenciamento de riscos e controles internos.'
  },
  {
    id: 'cmc2021_q69',
    examNumber: 69,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_4_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '4.1. Controle Interno: finalidade da auditoria interna (Prova CMC 2021)',
    enunciado: `(Questão 69 — CMC 2021) O fato de agregar valor ao resultado da organização, apresentando subsídios para o aperfeiçoamento dos processos, da gestão e dos controles internos, por meio da recomendação de soluções para as não conformidades apontadas nos relatórios está relacionado com:`,
    options: [
      'o objetivo do controle interno',
      'a finalidade da auditoria interna',
      'a finalidade da auditoria externa',
      'o objetivo da auditoria de trabalho'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito Oficial Definitivo: B. Segundo a NBC TI 01 (CFC), a Auditoria Interna compreende os exames e levantamentos estruturados para agregar valor à organização e apresentar subsídios ao aperfeiçoamento dos processos, da gestão e dos controles internos.'
  },
  {
    id: 'cmc2021_q70',
    examNumber: 70,
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_11',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '11. Contabilidade Aplicada ao Setor Público (NBC PG 100 R1): princípio da objetividade (Prova CMC 2021)',
    enunciado: `(Questão 70 — CMC 2021) O princípio fundamental da ética para os profissionais de contabilidade, de acordo com a NBC nº PG 100 (R1), através do qual busca-se evitar que o profissional tenha comportamentos tendenciosos em decorrência de conflitos de interesses e influências indevidas é:`,
    options: [
      'a objetividade',
      'a integridade',
      'a confidencialidade',
      'o profissionalismo'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito Oficial Definitivo: A. Na NBC PG 100 (R1) do CFC, o princípio da Objetividade impõe ao profissional da contabilidade não comprometer seu julgamento profissional ou comercial por comportamento tendencioso, conflito de interesses ou influência indevida de terceiros.'
  }
];

export const QUESTS_PROVA_CMC_2021 = RAW_PROVA_CMC_2021.map((q) => ({
  ...q,
  banca: 'Instituto Selecon',
  year: 2021,
  cargo: 'Técnico Legislativo — Câmara Municipal de Cuiabá (Edital 001-CMC/2020)',
  origem: 'Prova Oficial Real Selecon — Câmara de Cuiabá 2021 (Gabarito Definitivo)',
  sourceType: 'Prova Oficial Real Selecon — Câmara de Cuiabá 2021 (Gabarito Definitivo)'
}));
