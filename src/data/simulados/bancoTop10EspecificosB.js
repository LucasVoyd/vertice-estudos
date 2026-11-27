// ============================================================================
// BANCO INÉDITO NÍVEL TOP 10 (PADRÃO INSTITUTO SELECON 2026) — ESPECÍFICOS B
// Itens 6 a 8 do Edital Nº 001/2026-CMC (Técnico Legislativo — 74 Questões × 1,75 pt)
// Distribuição:
//   - cmc_esp_6_1: 10 questões (top10_espb_001 a top10_espb_010)
//   - cmc_esp_6_2: 10 questões (top10_espb_011 a top10_espb_020)
//   - cmc_esp_7:   14 questões (top10_espb_021 a top10_espb_034)
//   - cmc_esp_8_1: 14 questões (top10_espb_035 a top10_espb_048)
//   - cmc_esp_8_2: 13 questões (top10_espb_049 a top10_espb_061)
//   - cmc_esp_8_3: 13 questões (top10_espb_062 a top10_espb_074)
// ============================================================================

export const QUESTS_TOP10_ESP_B = [
  // ==========================================================================
  // 6.1 CÂMARA MUNICIPAL, MESA DIRETORA E PLENÁRIO (10 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_001',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Tetos constitucionais de despesa e folha de pagamento (Art. 29-A CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um Município com população oficial de 650.000 habitantes realiza o planejamento orçamentário anual de sua Câmara Municipal para o exercício financeiro subsequente. Considerando rigorosamente as balizas do art. 29-A da Constituição Federal de 1988 quanto ao total de despesas do Legislativo local e à despesa com pessoal, assinale a afirmativa correta:',
    options: [
      'O teto global da Câmara equivale a 6% da receita tributária e transferências prevista na LOA corrente, incluídos os gastos com inativos.',
      'A despesa total do Legislativo, incluídos subsídios e excluídos inativos e pensionistas, limita-se a 4,5% da receita realizada no ano anterior e 70% de folha.',
      'O teto de 70% de folha abrange exclusivamente servidores efetivos e comissionados, excluindo os subsídios dos Vereadores e encargos patronais.',
      'Em Municípios acima de quinhentos mil habitantes, os 4,5% aplicam-se somente ao custeio administrativo, fora da base global do art. 29-A.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Nos termos do art. 29-A, inciso IV e § 1º, da CF/88: em Municípios com população entre 500.001 e 3.000.000 de habitantes (faixa de Cuiabá), o total da despesa do Legislativo (incluídos subsídios dos Vereadores e excluídos os gastos com inativos e pensionistas) limita-se a 4,5% do somatório da receita tributária e das transferências constitucionais efetivamente realizado no exercício anterior (não na previsão do corrente). Ademais, pelo § 1º, a Câmara não gastará mais de 70% de sua receita com folha de pagamento, incluído o gasto com o subsídio de seus Vereadores.'
  },
  {
    id: 'top10_espb_002',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Repasse do duodécimo e crimes de responsabilidade (Art. 29-A §§ 2º e 3º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante a execução financeira mensal do Município, o Prefeito alega queda momentânea de arrecadação tributária no bimestre e decide transferir o duodécimo da Câmara Municipal apenas no dia 28 de cada mês, em valor inferior à proporção fixada na Lei Orçamentária Anual. Em paralelo, o Presidente da Câmara autoriza reajustes que elevam a folha de pagamento do Legislativo para 74% de sua receita. À luz dos §§ 2º e 3º do art. 29-A da CF/88, verifica-se que:',
    options: [
      'A conduta do Prefeito é legítima se amparada em decreto de contingenciamento, respondendo apenas o Presidente da Câmara por improbidade se exceder 75% com pessoal.',
      'Somente o atraso superior ao último dia útil do mês configura crime de responsabilidade do Prefeito, admitindo-se repasse acima do limite mediante acordo.',
      'A omissão no repasse até o dia 20 gera apenas responsabilidade civil do Tesouro Municipal, sem tipificação de crime de responsabilidade para nenhum dos gestores.',
      'Ambos incorrem em crime de responsabilidade: o Prefeito por atrasar além do dia 20 e enviar a menor, e o Presidente da Câmara por exceder o limite de 70% da receita com folha.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. O art. 29-A, § 2º, da CF/88 tipifica como crime de responsabilidade do Prefeito: (I) efetuar repasse que supere os limites definidos no artigo; (II) não enviar o repasse até o dia 20 de cada mês; ou (III) enviá-lo a menor em relação à proporção fixada na Lei Orçamentária. Já o § 3º do mesmo dispositivo estabelece que constitui crime de responsabilidade do Presidente da Câmara Municipal o desrespeito ao teto de 70% de folha previsto no § 1º.'
  },
  {
    id: 'top10_espb_003',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Subsídios dos Vereadores e anterioridade de legislatura (Art. 29 VI e VII CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'No último semestre da legislatura em curso, um grupo de Vereadores de Município com 650.000 habitantes propõe aumentar os próprios subsídios com eficácia imediata no mesmo mandato, fixando-os em 80% do subsídio percebido pelos Deputados Estaduais. Considerando os incisos VI e VII do art. 29 da Constituição Federal, essa iniciativa viola múltiplas normas constitucionais porque o subsídio dos Vereadores:',
    options: [
      'Deve ser fixado pela Câmara em cada legislatura para a subsequente, limitado a 75% do subsídio dos Deputados Estaduais e a 5% da receita do Município.',
      'Deve ser fixado por decreto do Prefeito no início do mandato, limitado em capitais estaduais a 60% do subsídio dos Deputados Federais e a 4% da receita corrente.',
      'Pode vigorar na mesma legislatura mediante emenda à Lei Orgânica aprovada por dois terços, limitado a 75% do subsídio dos Senadores e a 6% da receita local.',
      'Tem como parâmetro exclusivo 50% do subsídio dos Deputados Estaduais nessa faixa populacional, inexistindo teto percentual sobre a receita total municipal.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Segundo o art. 29, VI e VII, da CF/88: (1) vigora a regra da anterioridade da legislatura — os subsídios dos Vereadores são fixados pelas respectivas Câmaras em cada legislatura para vigorarem na subsequente; (2) nos Municípios com mais de 500.000 habitantes (art. 29, VI, "f"), o teto máximo do subsídio é de 75% daquele estabelecido em espécie para os Deputados Estaduais; (3) pelo inciso VII, o total da despesa com a remuneração dos Vereadores não poderá ultrapassar 5% da receita do Município.'
  },
  {
    id: 'top10_espb_004',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Inviolabilidade material de Vereadores e limites territoriais (Art. 29 VIII CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante viagem particular a outro Estado da Federação, um Vereador concede entrevista a programa televisivo nacional proferindo acusações injuriosas contra um empresário local por desavença societária alheia às atividades da Câmara. Acionado judicialmente por danos morais e crime contra a honra, o parlamentar invoca imunidade parlamentar absoluta. Conforme o art. 29, inciso VIII, da Constituição Federal e o entendimento firmado pelo Supremo Tribunal Federal no Tema 469, a tese defensiva não prospera porque:',
    options: [
      'Os Vereadores detêm imunidade material válida em todo o território estadual, porém perdem a prerrogativa quando se manifestam fora da sala de sessões plenárias ou sem autorização prévia da Mesa Diretora.',
      'Os Vereadores possuem imunidade formal idêntica à dos Deputados Federais para impedir a instauração de ação penal sem licença da Câmara, mas não gozam de inviolabilidade material na esfera cível.',
      'A inviolabilidade dos Vereadores por suas opiniões, palavras e votos exige cumulativamente nexo com o exercício do mandato e ocorrência na circunscrição do respectivo Município, não ostentando esses parlamentares imunidade formal contra prisão ou processo penal na CF/88.',
      'A Constituição Federal assegura imunidade material irrestrita aos Vereadores em todo o país para opiniões proferidas durante o mandato, ressalvando apenas os crimes dolosos contra a vida julgados pelo Tribunal do Júri.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Conforme o art. 29, VIII, da CF/88 e o Tema 469 de repercussão geral do STF (RE 600.063): os Vereadores são invioláveis por suas opiniões, palavras e votos NO EXERCÍCIO DO MANDATO e NA CIRCUNSCRIÇÃO DO MUNICÍPIO. Faltando a vinculação funcional com o mandato ou sendo a ofensa proferida fora dos limites territoriais do Município, não incide a imunidade material. Além disso, a CF/88 não confere aos Vereadores imunidade formal (processual ou prisional).'
  },
  {
    id: 'top10_espb_005',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Incompatibilidades desde a diplomação e desde a posse (Art. 29 IX c/c Art. 54 CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Eleito em outubro e diplomado pela Justiça Eleitoral em 18 de dezembro, determinado candidato a Vereador pretende, ainda antes da posse em 1º de janeiro, celebrar contrato de prestação de serviços técnicos por inexigibilidade (sem cláusulas uniformes) com uma autarquia municipal e, logo após tomar posse, assumir a direção de empresa privada beneficiada por contrato administrativo com o Município. Aplicando-se as proibições e incompatibilidades do art. 54 da CF/88, extensíveis aos Vereadores por força do art. 29, inciso IX, da Constituição Federal, ambos os atos são vedados porque:',
    options: [
      'Desde a diplomação é proibido firmar contrato público sem cláusulas uniformes e, desde a posse, dirigir empresa favorecida por contrato com ente público.',
      'Todas as incompatibilidades iniciam-se apenas após a posse solene, não gerando a diplomação eleitoral qualquer impedimento para contratar com autarquia.',
      'A vedação a contratos sem cláusulas uniformes só começa após a posse, e a proibição de exercer cargo demissível ad nutum limita-se à esfera federal.',
      'As restrições do art. 54 da CF aplicam-se apenas a parlamentares federais e estaduais, não alcançando Vereadores diante da Administração Indireta municipal.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Pelo art. 29, IX, da CF/88 aplicam-se aos Vereadores as proibições e incompatibilidades do art. 54 da CF/88 (no que couber aos membros da Câmara Municipal): (1) DESDE A EXPEDIÇÃO DO DIPLOMA (art. 54, I): não podem firmar/manter contrato com pessoa jurídica de direito público, autarquia, EP, SEM ou concessionária (salvo cláusulas uniformes), nem aceitar/exercer cargo, função ou emprego remunerado demissível ad nutum nessas entidades; (2) DESDE A POSSE (art. 54, II): não podem ser proprietários, controladores ou diretores de empresa favorecida por contrato com pessoa jurídica de direito público, patrocinar causa contra ela, nem exercer outro cargo/mandato eletivo.'
  },
  {
    id: 'top10_espb_006',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Acumulação de cargo efetivo e hipóteses de perda do mandato (Arts. 38 III e 55 CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor público efetivo do Poder Executivo estadual toma posse no cargo de Vereador em Município vizinho. Constatada a compatibilidade de horários entre a jornada do cargo efetivo e as sessões da Câmara, ele passa a acumular os vencimentos de ambos. Meses depois, sem justificativa ou licença, o parlamentar deixa de comparecer a 40% das sessões ordinárias daquela sessão legislativa anual. À luz dos arts. 38, inciso III, e 55 da CF/88 (por simetria), é correto afirmar que:',
    options: [
      'A acumulação remunerada é proibida mesmo havendo compatibilidade de horários, e a perda do mandato exige voto secreto de dois terços do Plenário.',
      'Com horários compatíveis acumula os ganhos de ambos os vínculos; porém, faltar sem justificativa à terça parte das sessões acarreta perda do mandato pela Mesa.',
      'Sem compatibilidade o servidor é exonerado de ofício na diplomação, e a cassação por faltas só incide se ultrapassar metade das sessões da legislatura.',
      'Constatadas faltas acima de um terço das sessões ordinárias, a perda do mandato independe de ampla defesa e é decretada diretamente pelo Juiz Eleitoral.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme o art. 38, III, da CF/88: investido no mandato de Vereador, havendo compatibilidade de horários, o servidor percebe as vantagens de seu cargo/emprego/função sem prejuízo da remuneração do cargo eletivo; não havendo compatibilidade, afasta-se do cargo e pode optar pela remuneração. Quanto à perda do mandato (art. 55, III e § 3º, por simetria): deixar de comparecer, em cada sessão legislativa, à terça parte das sessões ordinárias (salvo licença ou missão autorizada) acarreta perda do mandato declarada pela Mesa, de ofício ou mediante provocação, assegurada ampla defesa.'
  },
  {
    id: 'top10_espb_007',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Direção administrativa, polícia interna e reserva de lei para remuneração',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante sessão plenária ordinária, manifestantes invadem as galerias do Plenário portando artefatos ruidosos e impedindo a continuidade da Ordem do Dia. Na mesma semana, a Mesa Diretora pretende editar Resolução aumentando em 12% o vencimento básico dos cargos efetivos da estrutura administrativa da Câmara. Sob a ótica das competências da Mesa Diretora e do disposto nos arts. 37, inciso X, e 51, inciso IV, da CF/88 (por simetria e jurisprudência do STF), conclui-se que:',
    options: [
      'A Mesa Diretora pode majorar vencimentos de servidores mediante Resolução sem sanção, mas não tem poder de polícia para retirar invasores do Plenário.',
      'Tanto a manutenção da ordem nas galerias quanto a alteração de remuneração do quadro da Casa exigem decreto autorizativo prévio do Prefeito Municipal.',
      'O poder de polícia interna autoriza a Mesa a aplicar multa penal aos invasores e a alterar por ato administrativo próprio os vencimentos do quadro efetivo.',
      'A Mesa exerce poder de polícia interna para suspender a sessão e manter a ordem, mas a alteração remuneratória exige lei formal de iniciativa da Câmara.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. A Mesa Diretora dirige os trabalhos legislativos e os serviços administrativos, detendo poder de polícia interna no edifício da Câmara para manter a ordem e segurança das sessões (art. 51, IV, por simetria). Todavia, após a EC nº 19/1998, a jurisprudência do STF consolidou que o art. 37, X, c/c art. 51, IV e art. 52, XIII, exige LEI ESPECÍFICA (de iniciativa privativa do Legislativo, mas submetida à sanção/veto do Executivo) para fixar ou alterar a remuneração dos servidores das Casas Legislativas — não podendo ser feita por mera Resolução.'
  },
  {
    id: 'top10_espb_008',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Quóruns constitucionais comparados em Câmara de 27 Vereadores',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Em determinada Câmara Municipal composta por 27 Vereadores, encontram-se presentes na Ordem do Dia exatamente 17 parlamentares. Analise os itens a seguir acerca do quórum exigido para deliberação das proposições pautadas:\nI. Para aprovação de Projeto de Lei Ordinária, basta o voto favorável de 9 Vereadores (maioria simples dos presentes), uma vez satisfeito o quórum de instalação deliberativa de maioria absoluta (14 presentes).\nII. Para aprovação de Projeto de Lei Complementar ou rejeição de veto do Prefeito, exigem-se no mínimo 14 votos favoráveis (maioria absoluta dos membros da Câmara).\nIII. Para aprovação de Proposta de Emenda à Lei Orgânica Municipal ou para fazer deixar de prevalecer o parecer prévio do Tribunal de Contas sobre as contas do Prefeito, a sessão com apenas 17 presentes não alcança o quórum mínimo de aprovação de dois terços (18 votos).\nEstá correto o que se afirma em:',
    options: [
      'I e II, apenas.',
      'II e III, apenas.',
      'I, II e III.',
      'I e III, apenas.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Todos os três itens estão rigorosamente corretos para uma Câmara de 27 membros: (I) Art. 47 CF: presente a maioria absoluta (14 — e há 17 presentes), aprova-se Lei Ordinária por maioria simples dos presentes (metade de 17 + fração = 9 votos); (II) Art. 69 e art. 66, § 4º CF: Lei Complementar e rejeição de veto exigem maioria absoluta dos membros (14 votos); (III) Art. 29, caput, e art. 31, § 2º, CF: Emenda à LOM e rejeição do parecer prévio do TCE sobre as contas do Prefeito exigem 2/3 dos membros da Câmara (2/3 de 27 = 18 votos), razão pela qual 17 presentes não bastam.'
  },
  {
    id: 'top10_espb_009',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Sessão legislativa extraordinária e vedação de indenização (Art. 57 § 7º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante o recesso parlamentar de janeiro, a Câmara Municipal é extraordinariamente convocada para apreciar exclusivamente um projeto de lei de crédito adicional destinado a calamidade pública. Um Vereador requer a inclusão de dois projetos antigos na pauta da convocação e solicita o pagamento de verba indenizatória pela sessão extraordinária. Nos termos do art. 57, § 7º, da Constituição Federal (com a redação da EC nº 50/2006, aplicável por simetria), verifica-se que:',
    options: [
      'A pauta da convocação extraordinária admite a inclusão livre de projetos já instruídos pelas comissões, sendo devido auxílio-comparecimento limitado a 25% do subsídio mensal.',
      'Na sessão legislativa extraordinária, a Câmara Municipal somente deliberará sobre a matéria para a qual foi convocada, sendo expressamente vedado o pagamento de parcela indenizatória em razão da convocação.',
      'A vedação ao pagamento de parcela indenizatória aplica-se apenas ao Congresso Nacional, podendo as Leis Orgânicas municipais instituir gratificação extraordinária por sessão durante o recesso.',
      'A convocação extraordinária suspende as deliberações sobre o crédito emergencial até que a Comissão Representativa aprove previamente a pauta residual da sessão ordinária anterior.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme o art. 57, § 7º, da CF/88 (redação da EC nº 50/2006), aplicável por simetria às Casas Legislativas subnacionais: na sessão legislativa extraordinária, o Poder Legislativo somente deliberará sobre a matéria para a qual foi convocado (ressalvada, na esfera federal, a apreciação de medidas provisórias em vigor), vedado o pagamento de parcela indenizatória em razão da convocação.'
  },
  {
    id: 'top10_espb_010',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.1. Câmara Municipal e Mesa Diretora: Controle externo municipal e julgamento de contas do Prefeito (Art. 31 CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'O Tribunal de Contas do Estado emite parecer prévio pela rejeição das contas anuais de determinado Prefeito Municipal, inclusive quanto a despesas em que este atuou diretamente como ordenador. Recebido o parecer pela Câmara Municipal, o Plenário pretende deliberar sobre o julgamento definitivo das contas, enquanto contribuintes locais solicitam acesso aos balanços anuais. À luz do art. 31 da Constituição Federal e da tese firmada pelo STF no RE 848.826, é correto afirmar que:',
    options: [
      'A Câmara julga as contas de governo e de gestão do Prefeito, prevalecendo o parecer do TCE salvo voto contrário de 2/3, com exame público anual por 60 dias.',
      'As contas de gestão do Prefeito são julgadas definitivamente pelo Tribunal de Contas estadual, cabendo à Câmara apenas o parecer sobre as contas de governo.',
      'O parecer prévio do Tribunal de Contas pode ser afastado por maioria simples dos Vereadores presentes, vedado o exame direto das contas por contribuintes.',
      'Municípios com mais de quinhentos mil habitantes podem instituir por Lei Orgânica um Tribunal de Contas municipal próprio auxiliar do controle legislativo.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. O art. 31 da CF/88 determina que: (§ 1º) o controle externo da Câmara Municipal será exercido com auxílio do Tribunal de Contas do Estado; (§ 2º) o parecer prévio do TCE sobre as contas que o Prefeito deve anualmente prestar só deixará de prevalecer por decisão de 2/3 dos membros da Câmara (e no RE 848.826, Tema 835, o STF decidiu que a competência para julgar contas de Prefeito — tanto de governo quanto de gestão — é exclusiva da Câmara Municipal); (§ 3º) as contas ficam 60 dias anualmente à disposição de qualquer contribuinte para exame e apreciação; (§ 4º) é vedada a criação de novos Tribunais, Conselhos ou órgãos de Contas Municipais.'
  },

  // ==========================================================================
  // 6.2 COMISSÕES PERMANENTES E TEMPORÁRIAS (10 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_011',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Princípio da proporcionalidade partidária e blocos parlamentares (Art. 58 § 1º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'No início da nova legislatura, três partidos minoritários com dois Vereadores cada formalizam um bloco parlamentar para somar representatividade, enquanto a coligação governista majoritária propõe alteração regimental para ocupar integralmente todas as vagas titulares da Comissão de Constituição, Justiça e Redação e da Comissão de Orçamento, excluindo a oposição. Considerando o art. 58, § 1º, da Constituição Federal (aplicável por simetria às Câmaras Municipais), a medida pretendida pela maioria é inconstitucional porque:',
    options: [
      'As comissões permanentes devem ser compostas por número idêntico de representantes de cada partido com assento na Casa, independentemente do tamanho de sua bancada parlamentar.',
      'Somente partidos isolados possuem direito a assento em comissões permanentes, não sendo admitido o cômputo de blocos parlamentares para cálculo de representação.',
      'Na constituição da Mesa e de cada comissão, é assegurada, tanto quanto possível, a representação proporcional dos partidos ou dos blocos parlamentares que participam da respectiva Casa, resguardando o pluralismo político e a participação das minorias.',
      'A distribuição das vagas nas comissões temáticas compete discricionariamente ao Presidente da Câmara por critério de afinidade profissional dos Vereadores, sem vinculação à força numérica partidária.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. O art. 58, § 1º, da CF/88 consagra o princípio da proporcionalidade partidária e dos blocos parlamentares na constituição da Mesa Diretora e de cada comissão permanente ou temporária ("tanto quanto possível, a representação proporcional dos partidos ou dos blocos parlamentares que participam da respectiva Casa"). Isso impede a monopolização das comissões pela maioria e tutela a efetiva participação das minorias parlamentares no processo legislativo e fiscalizatório.'
  },
  {
    id: 'top10_espb_012',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Caráter terminativo das Comissões e recurso ao Plenário (Art. 58 § 2º I CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Em Câmara Municipal composta por 27 Vereadores cujo Regimento Interno prevê o poder conclusivo (terminativo) das Comissões Permanentes na forma do art. 58, § 2º, inciso I, da CF/88, determinada comissão aprova em caráter terminativo um projeto de lei ordinária sobre denominação de logradouro público, dispensando a deliberação do Plenário. Discordando do mérito aprovado, um grupo de Vereadores deseja levar a matéria à apreciação soberana do Plenário. Nos termos da norma constitucional referida, esse recurso exigirá o apoio mínimo de:',
    options: [
      'Um terço (1/3) dos membros da Casa, equivalente a 9 Vereadores, devendo ser aprovado previamente pela Mesa Diretora.',
      'Maioria absoluta dos membros da Câmara, equivalente a 14 Vereadores, sob pena de promulgação automática pela comissão.',
      'Maioria simples dos Vereadores presentes na sessão ordinária imediatamente posterior à publicação do parecer terminativo.',
      'Um décimo (1/10) dos membros da Casa, o que corresponde ao mínimo de 3 Vereadores em uma Câmara com 27 parlamentares.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. O art. 58, § 2º, I, da CF/88 autoriza que as comissões, em razão da matéria de sua competência, discutam e votem projeto de lei que dispensar, na forma do regimento, a competência do Plenário, SALVO se houver recurso de um décimo (1/10) dos membros da Casa. Em uma Câmara de 27 Vereadores, 1/10 corresponde a 2,7 -> mínimo de 3 Vereadores! Pegadinha frequente: confundir o quórum de 1/10 (recurso contra decisão terminativa de comissão) com 1/3 (criação de CPI ou propositura de Emenda à LOM).'
  },
  {
    id: 'top10_espb_013',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: CPI municipal e limites de quebra de sigilo na jurisprudência do STF',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma Comissão Parlamentar de Inquérito (CPI) regularmente instalada na Câmara Municipal para apurar fraude em licitação de transporte escolar aprova três deliberações por maioria de seus membros: (1) requisitar cópias integrais de processos licitatórios da Prefeitura e ouvir servidores sob compromisso; (2) decretar diretamente, sem ordem judicial, a quebra dos sigilos bancário e fiscal das empresas suspeitas; e (3) determinar a busca e apreensão domiciliar de computadores na residência de ex-secretário. À luz da jurisprudência do STF sobre a reserva de jurisdição e as restrições próprias às CPIs municipais (ACO 730 e precedentes correlatos), assinale a análise jurídica correta:',
    options: [
      'Apenas a medida (1) é válida por ato próprio; a quebra de sigilo bancário e fiscal por CPI municipal exige ordem judicial, e a busca domiciliar é vedada.',
      'As medidas (1) e (2) são válidas por ato próprio da CPI municipal, sendo vedada somente a medida (3) pela proteção constitucional da inviolabilidade domiciliar.',
      'Todas as três medidas são válidas por ato próprio, pois a CPI municipal detém integralmente os poderes instrutórios das autoridades judiciais do art. 58, § 3º.',
      'Nenhuma das três medidas pode ser adotada por CPI municipal, que deve requerer ao Ministério Público todas as oitivas, requisições documentais e diligências.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Distinção cirúrgica de nível Top 10: (1) A CPI municipal PODE ouvir testemunhas/autoridades, realizar vistorias em repartições públicas municipais e requisitar documentos administrativos públicos; (2) Embora o STF tenha reconhecido na ACO 730 o poder de CPI ESTADUAL (além da federal) quebrar diretamente sigilo bancário, a jurisprudência constitucional restringe esse poder no âmbito das CPIs MUNICIPAIS (porque os Municípios não possuem Poder Judiciário próprio nem idêntica estatura federativa para afastar diretamente sigilos bancário/fiscal/telefônico sem ordem judicial); (3) NENHUMA CPI (nem federal) pode decretar busca e apreensão domiciliar, interceptação telefônica ou prisão preventiva (reserva de jurisdição).'
  },
  {
    id: 'top10_espb_014',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Testemunha vs. investigado em CPI e privilégio contra autoincriminação',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Perante CPI municipal instalada para apurar desvio de verbas públicas, comparecem duas pessoas regularmente convocadas: um servidor técnico chamado na condição de testemunha e um ex-gestor formalmente arrolado como investigado. Durante a sessão de oitiva, ambos recusam-se a responder a perguntas diretamente relacionadas a eventual participação própria nos ilícitos, recusando-se o investigado também a assinar termo de compromisso de dizer a verdade. Segundo a jurisprudência consolidada do Supremo Tribunal Federal, é correto afirmar que:',
    options: [
      'Ambos devem sofrer prisão preventiva decretada pelo Presidente da CPI por desobediência, pois o direito ao silêncio restringe-se ao interrogatório penal judicial.',
      'O investigado tem direito amplo ao silêncio sem compromisso legal; a testemunha presta compromisso sobre fatos alheios, podendo calar quanto à autoincriminação.',
      'A testemunha deve responder inclusive sobre fatos que a incriminem sob pena de prisão cautelar pela comissão, enquanto o investigado depende de habeas corpus.',
      'Caso o investigado permaneça em silêncio após a leitura de seus direitos, a CPI poderá decretar a indisponibilidade de seus bens e reter seu passaporte.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme consolidado pelo STF (HC 79.812, HC 89.269 e ADI 5.803): a garantia contra a autoincriminação (art. 5º, LXIII, CF) aplica-se às oitivas perante CPIs. O investigado não é obrigado a assinar termo de compromisso de dizer a verdade nem a responder perguntas incriminadoras; a testemunha tem o dever legal de comparecer e dizer a verdade sobre fatos de terceiros que saiba, mas também pode invocar o direito ao silêncio sempre que a resposta puder expô-la à incriminação. Nenhuma CPI decreta prisão preventiva ou bloqueio de bens.'
  },
  {
    id: 'top10_espb_015',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Fato determinado, aditamento de fatos conexos e prorrogação de prazo da CPI',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma CPI instaurada regularmente na Câmara Municipal para investigar supostas irregularidades em contrato emergencial de limpeza urbana depara-se, no curso das oitivas, com aditivos celebrados no mesmo contrato envolvendo empresa do mesmo grupo econômico. Além disso, aproxima-se o término do prazo inicial de 90 dias fixado no ato de criação sem que os trabalhos tenham sido concluídos. Diante desse cenário, à luz do art. 58, § 3º, da CF/88 e da jurisprudência do STF, é correto afirmar que:',
    options: [
      'A comissão é proibida de apurar aditivos conexos e deve encerrar-se impreterivelmente aos 90 dias, pois o prazo certo constitucional veda qualquer prorrogação.',
      'Qualquer CPI pode ampliar livremente seu objeto para devassa genérica contra toda a gestão executiva durante a legislatura, dispensando aditamento formal.',
      'Embora proibida a CPI genérica, admite-se investigar fatos conexos mediante aditamento e prorrogar sucessivamente o prazo dentro da mesma legislatura.',
      'A prorrogação do prazo de CPI municipal só produz efeitos após sanção expressa do Prefeito e aprovação em dois turnos pelo quórum de dois terços.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Conforme o STF (HC 71.039 e MS 26.441): (1) "fato determinado" impede CPIs genéricas ("devassas" sem objeto delimitado), mas não impede que, durante a apuração, fatos conexos relacionados ao objeto original sejam incorporados por meio de aditamento formal; (2) "prazo certo" não significa prazo único e improrrogável — são lícitas sucessivas prorrogações na forma regimental, tendo como limite temporal máximo o encerramento da respectiva legislatura.'
  },
  {
    id: 'top10_espb_016',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Natureza das conclusões da CPI e encaminhamento ao Ministério Público',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Após seis meses de instrução, uma Comissão Parlamentar de Inquérito municipal aprova seu relatório final concluindo pela existência de fortes indícios de peculato e fraude licitatória praticados por ex-diretor de autarquia municipal e empresários privados. Considerando os efeitos jurídicos e os limites constitucionais da atuação das CPIs (art. 58, § 3º, CF/88), cabe ao referido colegiado:',
    options: [
      'Proferir diretamente sentença condenatória de ressarcimento com inscrição imediata do débito em dívida ativa municipal executável em 15 dias.',
      'Decretar a demissão imediata de servidores estáveis envolvidos e impor pena de inabilitação eleitoral por oito anos mediante resolução interna.',
      'Determinar o sequestro definitivo dos bens imóveis dos empresários investigados e remetê-los diretamente a leilão pela Mesa Diretora.',
      'Encaminhar suas conclusões e provas ao Ministério Público, para que promova a responsabilidade civil ou criminal dos infratores e demais medidas.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. A CPI exerce função investigatória e fiscalizadora, não jurisdicional nem punitiva direta. Conforme literalidade do art. 58, § 3º, da CF/88, "sendo suas conclusões, se for o caso, encaminhadas ao Ministério Público, para que promova a responsabilidade civil ou criminal dos infratores". A comissão não condena, não demite diretamente servidores nem decreta indisponibilidade/sequestro de bens (reserva de jurisdição).'
  },
  {
    id: 'top10_espb_017',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Competências da CCJR e da Comissão de Finanças e Orçamento',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um projeto de lei de iniciativa parlamentar que institui programa municipal de isenção tributária parcial de ISSQN ingressa na Câmara Municipal e é distribuído às Comissões Permanentes competentes antes de eventual votação em Plenário. Sobre a atuação técnica da Comissão de Constituição, Justiça e Redação (CCJR) e da Comissão responsável por Finanças e Orçamento nesse processo, assinale a afirmativa correta:',
    options: [
      'A CCJR examina exclusivamente o mérito político-administrativo da isenção, cabendo somente ao Judiciário o controle prévio de legalidade.',
      'A CCJR exerce o controle preventivo de constitucionalidade e técnica legislativa, e a de Orçamento analisa a adequação financeira e fiscal.',
      'A Comissão de Finanças possui competência exclusiva para declarar inconstitucionalidade formal vinculando o arquivamento sem recurso.',
      'Em projetos tributários, o parecer da CCJR somente é emitido após a aprovação em dois turnos e antes do envio para sanção do Prefeito.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Na divisão funcional das Comissões Permanentes das Câmaras Municipais (como a CMC): a CCJR aprecia os aspectos constitucional, legal, jurídico, regimental e de técnica legislativa (controle político-legislativo preventivo), ao passo que a Comissão de Fiscalização e Acompanhamento da Execução Orçamentária / Finanças e Orçamento analisa a compatibilidade e adequação financeira e orçamentária (PPA, LDO, LOA e impacto da LRF, como o art. 14 para renúncia de receita), sempre antes da deliberação plenária.'
  },
  {
    id: 'top10_espb_018',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Comissão Especial vs. Comissão Representativa de recesso',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'No âmbito das espécies de comissões temporárias que integram a estrutura parlamentar municipal, não raro confundem-se as atribuições de uma Comissão Especial com as de uma Comissão Representativa de recesso (prevista por simetria ao art. 58, § 4º, da CF/88). Assinale a alternativa que distingue corretamente esses dois órgãos colegiados:',
    options: [
      'A Comissão Especial é criada para objeto determinado (como emenda à LOM) e extingue-se após cumpri-lo; a Representativa atua apenas no recesso parlamentar.',
      'A Comissão Representativa substitui integralmente o Plenário durante todo o recesso para aprovar leis complementares e emendas orgânicas por maioria simples.',
      'A Comissão Especial subsiste por múltiplas legislaturas sucessivas como órgão permanente, enquanto a Representativa equivale a uma CPI de iniciativa popular.',
      'Ambas as comissões prescindem da observância da proporcionalidade partidária em sua formação, sendo livremente designadas pelo Líder do governo.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Distinção clássica entre comissões temporárias: (1) Comissão Especial: criada para objeto determinado que não caiba exclusivamente em comissão permanente (ex.: exame de Emenda à LOM, código municipal, estudo de assunto relevante), extinguindo-se com a conclusão do objeto, expiração do prazo ou término da legislatura; (2) Comissão Representativa (simetria com o art. 58, § 4º, CF/88): funciona durante o recesso parlamentar com atribuições delimitadas para representar a Casa e deliberar sobre matérias administrativas ou urgentes previstas regimentalmente, sem jamais substituir o Plenário na aprovação de leis ordinárias/complementares ou emendas orgânicas.'
  },
  {
    id: 'top10_espb_019',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Convocação de Secretários e pedidos escritos de informações no prazo de 30 dias (Art. 50 CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma Comissão Permanente da Câmara Municipal aprova requerimento convocando o Secretário Municipal de Obras Públicas, o próprio Prefeito Municipal e um Juiz de Direito da comarca para prestarem esclarecimentos presenciais sobre contratos de drenagem urbana. Paralelamente, a Mesa Diretora encaminha pedido escrito de informações ao mesmo Secretário, que permanece silente por 40 dias consecutivos sem justificativa. Aplicando-se o art. 50 da Constituição Federal por simetria, é correto afirmar que:',
    options: [
      'Tanto o Prefeito quanto o Juiz de Direito são obrigados a comparecer sob pena de crime de responsabilidade, com prazo de 60 dias para resposta escrita.',
      'A comissão pode convocar o Prefeito Municipal e o Secretário de Obras, mas não o juiz; além disso, o prazo constitucional para resposta escrita é de 15 dias.',
      'A ausência injustificada do Secretário convocado não gera infração se ele enviar resumo escrito em 45 dias, dispensando seu comparecimento pessoal.',
      'São inválidas as convocações do Prefeito e do Juiz, mas é válida a do Secretário; a omissão ao pedido escrito após 30 dias importa crime de responsabilidade.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Pelo art. 50 da CF/88 (simetria municipal): (1) A Câmara ou qualquer de suas Comissões pode convocar Secretários Municipais ou quaisquer titulares de órgãos diretamente subordinados ao Prefeito para prestar, pessoalmente, informações sobre assunto previamente determinado, importando crime de responsabilidade (ou infração político-administrativa conforme DL 201/67 e LOM) a ausência sem justificação adequada — jamais podendo convocar o próprio Chefe do Executivo (Prefeito) nem membros do Judiciário/MP; (2) Pelo § 2º, a Mesa da Câmara pode encaminhar pedidos escritos de informação, com prazo de 30 dias para atendimento, importando infração a recusa, o não atendimento no prazo ou informações falsas.'
  },
  {
    id: 'top10_espb_020',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_6_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '6.2. Comissões Legislativas: Participação popular e competências materiais das Comissões (Art. 58 § 2º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Considerando o art. 58, § 2º, da Constituição Federal (aplicável por simetria à organização legislativa municipal) acerca das atribuições típicas das comissões em razão da matéria de sua competência, avalie os itens seguintes:\nI. Realizar audiências públicas com entidades da sociedade civil para instruir matérias legislativas ou debater políticas públicas locais.\nII. Receber petições, reclamações, representações ou queixas de qualquer pessoa contra atos ou omissões das autoridades ou entidades públicas.\nIII. Solicitar depoimento de qualquer autoridade ou cidadão e apreciar programas de obras e planos municipais de desenvolvimento, emitindo parecer.\nEstá correto o que consta em:',
    options: [
      'I e II, apenas.',
      'II e III, apenas.',
      'I, II e III.',
      'I, apenas.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Todos os itens reproduzem fielmente as atribuições constitucionais das comissões previstas no art. 58, § 2º, da CF/88: inciso II (realizar audiências públicas com entidades da sociedade civil); inciso IV (receber petições, reclamações, representações ou queixas de qualquer pessoa contra atos ou omissões das autoridades ou entidades públicas); inciso V (solicitar depoimento de qualquer autoridade ou cidadão); e inciso VI (apreciar programas de obras, planos nacionais, regionais e setoriais de desenvolvimento e sobre eles emitir parecer).'
  },

  // ==========================================================================
  // 7. PROCESSO LEGISLATIVO E TÉCNICA LEGISLATIVA (14 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_021',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Tema 917 do STF e iniciativa parlamentar que acarreta despesa',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um Vereador apresenta Projeto de Lei Ordinária determinando a instalação de câmeras de monitoramento eletrônico nas áreas comuns e acessos das escolas da rede pública municipal, bem como a publicação mensal de dados consolidados sobre filas em creches municipais. A assessoria jurídica do Prefeito sustenta a inconstitucionalidade formal do projeto por vício de iniciativa sob o argumento de que qualquer lei parlamentar geradora de despesa ao erário usurpa a competência privativa do Executivo. À luz do Tema 917 de repercussão geral do STF (ARE 878.911), essa impugnação é improcedente porque:',
    options: [
      'Não usurpa a competência privativa do Chefe do Poder Executivo lei que, embora crie despesa para a Administração, não trata da sua estrutura ou da atribuição de seus órgãos nem do regime jurídico de servidores públicos.',
      'A iniciativa concorrente dos Vereadores autoriza o Legislativo a criar novas Secretarias Municipais e reestruturar carreiras de servidores da educação, desde que preveja compensação tributária na própria lei.',
      'Projetos de iniciativa parlamentar que acarretem aumento de despesa tornam-se constitucionalmente válidos sempre que o Prefeito apuser sanção expressa ou tácita no prazo de quinze dias úteis.',
      'A reserva de iniciativa do Prefeito restringe-se exclusivamente às leis orçamentárias anuais, podendo o Vereador dispor livremente sobre criação de cargos e atribuições de órgãos do Executivo.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Tese vinculante do Tema 917 de repercussão geral do STF (ARE 878.911, caso concreto justamente de câmeras de segurança em escolas municipais!): "Não usurpa competência privativa do Chefe do Poder Executivo lei que, embora crie despesa para a Administração, não trata da sua estrutura ou da atribuição de seus órgãos nem do regime jurídico de servidores públicos (art. 61, § 1º, II, a, c e e, da Constituição Federal)." Atenção às armadilhas: a sanção NÃO convalida vício de iniciativa quando este realmente existe (Súmula 5 superada), e cargos/órgãos/regime jurídico continuam sendo reserva do Executivo!'
  },
  {
    id: 'top10_espb_022',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Emendas parlamentares em projeto de iniciativa reservada e pertinência temática',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'O Prefeito Municipal encaminha à Câmara Projeto de Lei de sua iniciativa privativa reestruturando o plano de cargos e vencimentos dos servidores da fiscalização tributária municipal. Durante a tramitação nas comissões, um Vereador apresenta duas emendas ao projeto: a Emenda nº 1 eleva em 20% a gratificação de produtividade proposta pelo Executivo; a Emenda nº 2 inclui artigo alterando o Código de Posturas para regulamentar o horário de funcionamento de feiras livres. Sob o crivo do art. 63, inciso I, da CF/88 e da jurisprudência do STF sobre o poder de emenda parlamentar, verifica-se que:',
    options: [
      'Ambas as emendas são constitucionalmente admissíveis em razão do princípio da soberania do Plenário legislativo e da amplitude do poder de emendar.',
      'Apenas a Emenda nº 1 é inconstitucional por gerar aumento de despesa, sendo plenamente válida a Emenda nº 2 por tratar de matéria de interesse local.',
      'Ambas são inconstitucionais, pois projetos privativos do Executivo vedam aumento de despesa (art. 63, I) e exigem pertinência temática nas emendas.',
      'Os Vereadores não possuem poder de emenda em nenhum projeto de iniciativa do Executivo, devendo aprovar ou rejeitar em bloco o texto original.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Nos projetos de iniciativa privativa do Chefe do Executivo (art. 61, § 1º, CF por simetria), os parlamentares PODEM apresentar emendas, porém sob duas limitações cumulativas consolidadas pelo STF: (1) não pode haver aumento da despesa prevista (art. 63, I, CF, ressalvadas emendas orçamentárias do art. 166, §§ 3º e 4º); e (2) deve existir estrita pertinência temática com o objeto da proposição original (vedado o chamado "contrabando legislativo", ADI 5.127).'
  },
  {
    id: 'top10_espb_023',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Iniciativa popular municipal versus iniciativa popular federal (Art. 29 XIII e Art. 61 § 2º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma associação comunitária de Cuiabá mobiliza moradores para apresentar projeto de lei de iniciativa popular dispondo sobre a criação de corredores verdes e ciclovias em bairros da região leste. Comparando-se o regramento constitucional da iniciativa popular municipal (art. 29, inciso XIII, da CF/88) com a iniciativa popular federal (art. 61, § 2º, da CF/88), assinale a afirmativa correta:',
    options: [
      'A iniciativa municipal exige 1% do eleitorado local, enquanto a federal requer 5% do eleitorado nacional com vinculação obrigatória do Plenário.',
      'A iniciativa popular municipal exige 5% do eleitorado local (art. 29, XIII), enquanto a federal requer 1% em pelo menos cinco Estados (mínimo de 0,3% cada).',
      'Tanto no Município quanto na União, o projeto popular exige 5% do eleitorado e pode criar cargos ou majorar vencimentos de servidores do Executivo.',
      'Os projetos de iniciativa popular municipal somente podem ser rejeitados pelo Plenário por voto de dois terços seguido de referendo popular.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Literalidade constitucional comparada: (1) Iniciativa popular MUNICIPAL (art. 29, XIII, CF/88): "iniciativa popular de projetos de lei de interesse específico do Município, da cidade ou de bairros, através de manifestação de, pelo menos, cinco por cento do eleitorado"; (2) Iniciativa popular FEDERAL (art. 61, § 2º, CF/88): subscrito por, no mínimo, 1% do eleitorado nacional, distribuído pelo menos por cinco Estados, com não menos de três décimos por cento (0,3%) dos eleitores de cada um deles. Ademais, o projeto popular segue o processo legislativo normal (pode ser emendado ou rejeitado) e não usurpa iniciativa privativa reservada.'
  },
  {
    id: 'top10_espb_024',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Relação entre Lei Complementar e Lei Ordinária na jurisprudência do STF',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma Lei Complementar municipal, aprovada por maioria absoluta há dez anos, disciplinou em seu art. 12 determinada isenção administrativa cujo tema não constava no rol de matérias reservadas à lei complementar pela Constituição Federal ou pela Lei Orgânica. Recentemente, a Câmara aprovou uma Lei Ordinária (por maioria simples) revogando exatamente esse art. 12. Questionada judicialmente a validade da revogação, à luz da jurisprudência pacífica do Supremo Tribunal Federal sobre a relação entre lei complementar e lei ordinária, conclui-se que a revogação é:',
    options: [
      'Inconstitucional por violar a hierarquia normativa rígida, segundo a qual toda lei complementar é hierarquicamente superior à lei ordinária em qualquer tema.',
      'Nula de pleno direito por vício formal de quórum, pois todo dispositivo inserido em lei complementar só pode ser revogado por outra lei complementar ou emenda.',
      'Inconstitucional na esfera municipal, salvo se ratificada por referendo popular ou decreto legislativo da Mesa Diretora dentro do mesmo exercício financeiro.',
      'Constitucionalmente válida, pois não há hierarquia ontológica entre LC e LO; norma de conteúdo ordinário inserida em LC pode ser revogada por lei ordinária posterior.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Jurisprudência consolidada do STF (RE 377.457, RE 381.964 e ADI 4.071): NÃO há hierarquia ontológica entre Lei Complementar (LC) e Lei Ordinária (LO). Ambas retiram seu fundamento de validade diretamente da Constituição/Lei Orgânica, distinguindo-se pelo quórum (maioria absoluta na LC vs. maioria simples na LO) e pelo âmbito material reservado. Se uma LC disciplinar matéria não reservada à LC, esse dispositivo é apenas formalmente complementar, mas materialmente ordinário, podendo ser modificado ou revogado por Lei Ordinária posterior.'
  },
  {
    id: 'top10_espb_025',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Decreto Legislativo, Resolução e Lei Formal na competência da Câmara',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Para formalizar três deliberações distintas na Câmara Municipal — (I) aprovar ou rejeitar as contas anuais do Prefeito ou sustar ato normativo do Executivo que exorbite do poder regulamentar; (II) reformar o Regimento Interno ou instituir comissão especial interna; e (III) criar novos cargos efetivos de Técnico Legislativo no quadro administrativo da Câmara — os instrumentos normativos constitucional e regimentalmente adequados são, respectivamente:',
    options: [
      'Decreto Legislativo (sem sanção executiva), Resolução (sem sanção executiva) e Lei em sentido formal (com iniciativa privativa da Câmara e submissão à sanção ou veto do Prefeito).',
      'Resolução (com sanção executiva), Decreto Legislativo (sem sanção executiva) e Resolução administrativa da Mesa Diretora (sem sanção executiva).',
      'Decreto Legislativo (com sanção do Prefeito), Lei Ordinária (sem sanção) e Portaria Conjunta da Mesa Diretora e da Secretaria de Fazenda.',
      'Lei Complementar (sem sanção), Decreto Legislativo (com sanção) e Emenda à Lei Orgânica (promulgada pelo Prefeito).'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Distinção técnica essencial: (I) DECRETO LEGISLATIVO veicula matéria de competência exclusiva da Câmara com efeitos EXTERNOS (ex.: julgamento das contas do Prefeito, sustação de atos exorbitantes do Executivo, concessão de títulos honoríficos/licenças), sem sanção do Prefeito; (II) RESOLUÇÃO regula matéria de competência privativa de efeitos INTERNOS político-administrativos (ex.: alteração do Regimento Interno, criação de comissões especiais/CPIs), sem sanção do Prefeito; (III) após a EC 19/98 e jurisprudência do STF (art. 37, X c/c art. 51, IV CF), a criação de cargos, empregos e fixação/alteração remuneratória dos servidores das Casas Legislativas exige LEI formal (de iniciativa do Legislativo, sujeita a sanção/veto).'
  },
  {
    id: 'top10_espb_026',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Sanção tácita, contagem de prazo e limites materiais do veto parcial (Art. 66 CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Aprovado pela Câmara Municipal, determinado autógrafo de Projeto de Lei é protocolado no gabinete do Prefeito Municipal em 2 de março. No dia 12 de março, o Prefeito pretende vetar apenas a expressão "em caráter gratuito" contida no meio de um inciso, para alterar o sentido econômico da norma; além disso, em outro projeto distinto recebido na mesma data, permanece inerte por 20 dias úteis sem qualquer manifestação formal. Aplicando-se as regras constitucionais do art. 66 da CF/88 por simetria, é correto afirmar que:',
    options: [
      'O veto parcial pode recair sobre expressões ou palavras isoladas mediante motivação financeira, e a inércia por 15 dias corridos gera veto tácito.',
      'Após comunicar o veto ao Presidente da Câmara, o Prefeito pode retratar-se antes da Ordem do Dia, e a parte não vetada aguarda a votação do veto.',
      'O veto parcial só abrange texto integral de artigo, parágrafo, inciso ou alínea, e a inércia por 15 dias úteis gera sanção tácita sujeita à promulgação.',
      'O prazo para sanção ou veto é de 15 dias corridos contados da votação plenária, comunicando-se os motivos do veto à Câmara no prazo de 72 horas.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Regras do art. 66, §§ 1º, 2º, 3º e 7º, da CF/88 (por simetria): (1) O prazo de análise é de 15 DIAS ÚTEIS contados do recebimento; (2) O silêncio no prazo importa SANÇÃO TÁCITA (nunca existe veto tácito!); (3) O veto parcial só pode abranger texto integral de artigo, parágrafo, inciso ou alínea (art. 66, § 2º), jamais palavras soltas; (4) Comunicado o veto em 48 horas ao Presidente da Câmara, é irretratável; (5) Se o Prefeito não promulgar a lei em 48h nos casos de sanção tácita ou rejeição de veto, o Presidente da Câmara a promulgará (e se não o fizer em igual prazo, caberá ao Vice-Presidente).'
  },
  {
    id: 'top10_espb_027',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Apreciação plenária do veto, voto aberto e promulgação substitutiva (Art. 66 §§ 4º a 7º CF)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Em Câmara Municipal integrada por 27 Vereadores, o Prefeito apõe veto jurídico por inconstitucionalidade a determinado artigo de projeto de lei ordinária de autoria parlamentar e comunica os motivos à Presidência da Casa em 48 horas. Colocado o veto em apreciação plenária com a presença de 22 Vereadores, registram-se 13 votos pela rejeição do veto e 9 votos pela sua manutenção. Considerando as disposições constitucionais aplicáveis após a Emenda Constitucional nº 76/2013, conclui-se que o veto foi:',
    options: [
      'Rejeitado pela maioria simples dos Vereadores presentes à sessão (13 votos contra 9), devendo o Presidente da Câmara promulgar imediatamente o dispositivo independentemente de envio ao Prefeito.',
      'Mantido, pois a rejeição do veto exige voto ostensivo (aberto) da maioria absoluta dos membros da Câmara (14 votos em 27); caso tivesse sido rejeitado, o texto seria enviado ao Prefeito para promulgação em 48 horas.',
      'Rejeitado automaticamente, tendo em vista que vetos jurídicos baseados em inconstitucionalidade exigem maioria simples, reservando-se a maioria absoluta apenas para vetos políticos por contrariedade ao interesse público.',
      'Anulado por vício formal de procedimento, visto que a apreciação de veto do Prefeito deve ocorrer obrigatoriamente por escrutínio secreto no prazo máximo de 15 dias úteis.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme o art. 66, §§ 4º e 5º, da CF/88 (com redação da EC nº 76/2013, que aboliu o voto secreto na apreciação de vetos): o veto (seja jurídico ou político) somente é rejeitado pelo voto da MAIORIA ABSOLUTA dos membros do Legislativo (14 votos em 27), em votação aberta/ostensiva. Como houve apenas 13 votos pela derrubada, o veto foi MANTIDO. Se rejeitado fosse, o projeto seria enviado para promulgação do Prefeito (que teria 48 horas antes da promulgação supletiva pelo Presidente da Câmara).'
  },
  {
    id: 'top10_espb_028',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Processo Legislativo: Irrepetibilidade relativa de projetos de lei vs. irrepetibilidade absoluta de emendas orgânicas',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Na mesma sessão legislativa anual de uma Câmara Municipal, o Plenário rejeita no mérito: (1) um Projeto de Lei Ordinária de iniciativa parlamentar sobre arborização urbana; e (2) uma Proposta de Emenda à Lei Orgânica subscrita por um terço dos Vereadores. Sobre a possibilidade de reapresentação das matérias rejeitadas ainda na mesma sessão legislativa anual (princípio da irrepetibilidade no processo legislativo constitucional), assinale a alternativa correta:',
    options: [
      'Tanto o Projeto de Lei quanto a Proposta de Emenda orgânica rejeitados jamais podem ser reapresentados na mesma sessão legislativa, nem pela totalidade dos Vereadores.',
      'O Projeto de Lei Ordinária rejeitado pode ser reapresentado livremente na semana seguinte por qualquer Vereador isolado, exigindo maioria absoluta apenas na aprovação.',
      'A Proposta de Emenda orgânica rejeitada pode ser reapresentada na mesma sessão mediante apoio da maioria absoluta, enquanto o Projeto de Lei é irrepetível de forma absoluta.',
      'O projeto de lei rejeitado admite reapresentação na mesma sessão mediante proposta da maioria absoluta dos membros; já a emenda constitucional/orgânica segue irrepetibilidade absoluta.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Distinção clássica de processo legislativo constitucional: (1) Art. 67 CF (irrepetibilidade RELATIVA de projetos de lei): a matéria constante de projeto de lei rejeitado somente poderá constituir objeto de novo projeto, na mesma sessão legislativa, mediante proposta da MAIORIA ABSOLUTA dos membros de qualquer das Casas (ou da Câmara Municipal); (2) Art. 60, § 5º CF (irrepetibilidade ABSOLUTA de PEC — reproduzida por simetria nas Constituições Estaduais e Leis Orgânicas quando prevista para Emenda à LOM): a matéria constante de proposta de emenda rejeitada ou havida por prejudicada não pode ser objeto de nova proposta na mesma sessão legislativa.'
  },
  {
    id: 'top10_espb_029',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998): Estruturação tripartite da lei e vedação de cláusula genérica de revogação',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao revisar a minuta final de um projeto de lei municipal antes da votação de redação final, o Técnico Legislativo verifica o cumprimento das regras estruturais da Lei Complementar nº 95/1998. De acordo com os arts. 3º e 9º da referida norma de técnica legislativa, a lei estrutura-se em três partes básicas e deve observar regra rigorosa quanto à revogação de normas anteriores. Assinale a alternativa correta:',
    options: [
      'Divide-se em parte preliminar, parte normativa e parte final, devendo a cláusula de revogação enumerar expressamente as leis ou disposições revogadas.',
      'A parte preliminar restringe-se à epígrafe e assinatura, sendo obrigatória na parte final a fórmula genérica "Revogam-se as disposições em contrário".',
      'As disposições transitórias e a cláusula de vigência integram a parte preliminar da lei, antecedendo o preâmbulo e o enunciado do objeto normativo.',
      'A cláusula de revogação compõe a parte normativa substantiva e dispensa a enumeração das leis anteriores quando houver revogação tácita parcial.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Conforme o art. 3º da LC nº 95/1998, a lei será estruturada em três partes básicas: (I) parte preliminar (epígrafe, ementa, preâmbulo, enunciado do objeto e indicação do âmbito de aplicação das disposições normativas); (II) parte normativa (texto das normas de conteúdo substantivo relacionadas com a matéria regulada); (III) parte final (disposições pertinentes às medidas necessárias à implementação das normas, disposições transitórias, cláusula de vigência e cláusula de revogação). E segundo o art. 9º (redação da LC 107/2001): "A cláusula de revogação deverá enumerar, expressamente, as leis ou disposições legais revogadas" (banindo a fórmula genérica "revogam-se as disposições em contrário").'
  },
  {
    id: 'top10_espb_030',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998): Articulação dos artigos, parágrafos, incisos, alíneas, itens e agrupamentos',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Considerando as regras de articulação e formatação dos textos legais fixadas no art. 10 da Lei Complementar nº 95/1998, analise as assertivas relativas à grafia correta de dispositivos normativos:\nI. Os artigos são a unidade básica de articulação, indicados pela abreviatura "Art." seguida de numeração ordinal até o nono ("Art. 1º" a "Art. 9º") e cardinal a partir deste ("Art. 10", "Art. 11"), desdobrando-se em parágrafos ou em incisos.\nII. Os parágrafos são representados pelo sinal gráfico "§" seguido de numeração ordinal até o nono e cardinal a partir deste; havendo apenas um parágrafo no artigo, emprega-se a expressão "parágrafo único" por extenso.\nIII. Os incisos são representados por algarismos romanos, as alíneas por letras minúsculas seguidas de parêntese ("a)", "b)") e os itens por algarismos arábicos ("1.", "2."); no agrupamento de artigos, os Capítulos, Títulos, Livros e Partes são grafados em letras maiúsculas e identificados por algarismos romanos.\nAssinale a alternativa correta:',
    options: [
      'Apenas I e II estão corretas.',
      'Apenas II e III estão corretas.',
      'I, II e III estão corretas.',
      'Apenas I e III estão corretas.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Todas as três assertivas reproduzem literalmente o art. 10, incisos I a V, da LC nº 95/1998: artigos ("Art. 1º" a "Art. 9º" ordinais; "Art. 10" em diante cardinais), parágrafos ("§ 1º" a "§ 9º", "§ 10" em diante, ou "parágrafo único" por extenso quando único), incisos (algarismos romanos), alíneas (letras minúsculas), itens (algarismos arábicos), e o agrupamento em Subseções e Seções (minúsculas em negrito/realce) e Capítulos, Títulos, Livros e Partes (maiúsculas com algarismos romanos).'
  },
  {
    id: 'top10_espb_031',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998): Alteração de normas vigentes, acréscimo de dispositivos e uso de "(NR)"',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um Projeto de Lei Ordinária modifica o Estatuto Municipal vigente para: (a) inserir um novo artigo entre o art. 14 e o art. 15; (b) substituir integralmente o conteúdo do antigo art. 20, que fora expressamente revogado anos atrás por outra lei; e (c) dar nova redação ao caput do art. 25. Aplicando-se as diretrizes do art. 12, inciso III, da Lei Complementar nº 95/1998, o redator legislativo deve:',
    options: [
      'Renumeração dos artigos a partir do art. 15, aproveitamento do número do art. 20 revogado para abrigar a nova regra e inserção da expressão "(NR)" apenas ao final do novo artigo acrescentado.',
      'Manter a numeração existente e identificar o dispositivo acrescentado como "Art. 14-A" (vedada a renumeração de artigos), manter o art. 20 com a indicação "(revogado)" sem reaproveitar seu número para o novo conteúdo, e apor "(NR)" ao final do art. 25 alterado.',
      'Identificar o dispositivo intercalado como "Art. 14-a" em letra minúscula, reutilizar o número do art. 20 mediante justificativa na ementa e empregar "(NR)" tanto nos dispositivos alterados quanto nos dispositivos novos e revogados.',
      'Reorganizar os Capítulos e artigos em sequência numérica ininterrupta a cada alteração legislativa, suprimindo integralmente os números de artigos revogados em edições anteriores.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme o art. 12, inciso III, da LC nº 95/1998: (a) é vedada a renumeração de artigos e de unidades superiores ao artigo, utilizando-se o mesmo número do artigo imediatamente anterior seguido de letras maiúsculas em ordem alfabética ("Art. 14-A"); (b) é vedado o aproveitamento do número de dispositivo revogado, vetado, declarado inconstitucional pelo STF ou de execução suspensa pelo Senado, mantendo-se a indicação seguida de "(revogado)"; (c) a sigla "(NR)" (Nova Redação) identifica os dispositivos cuja redação foi alterada, aposta entre parênteses uma única vez ao final, não se aplicando aos dispositivos inteiramente novos ou revogados.'
  },
  {
    id: 'top10_espb_032',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998): Epígrafe, ementa, preâmbulo e unidade temática do objeto da lei',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Nos termos dos arts. 4º a 7º da Lei Complementar nº 95/1998, a elaboração da parte preliminar e a definição material do texto legal obedecem a critérios específicos de forma e unidade temática. Sobre esses elementos, assinale a alternativa incorreta (ou seja, aquela que contraria a LC nº 95/1998):',
    options: [
      'A epígrafe, grafada em caracteres maiúsculos, propicia qualificação à lei na ordem jurídica e a situa no tempo, mediante a indicação do título designativo da espécie normativa e da respectiva numeração e ano de promulgação.',
      'A ementa será grafada por meio de caracteres que a realcem e explicitará, de modo conciso e sob a forma de título, o objeto da lei.',
      'O primeiro artigo do texto indicará o objeto da lei e o respectivo âmbito de aplicação, devendo cada lei, excetuadas as codificações, tratar de um único objeto sem conter matéria estranha ou não vinculada por afinidade, pertinência ou conexão.',
      'O preâmbulo substitui o primeiro artigo na fixação da vigência do diploma normativo e dispensa a indicação do órgão ou instituição competente para a prática do ato quando se tratar de lei municipal.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D (incorreta). Segundo o art. 6º da LC nº 95/1998: "O preâmbulo indicará o órgão ou instituição competente para a prática do ato e sua base legal" (ex.: "O PREFEITO MUNICIPAL DE CUIABÁ: Faço saber que a Câmara Municipal aprovou e eu sanciono a seguinte Lei:"). Ele NÃO substitui o art. 1º na definição do objeto/âmbito de aplicação (art. 7º), tampouco fixa a vigência (que consta na parte final, art. 8º). As alternativas A, B e C reproduzem fielmente os arts. 4º, 5º e 7º da LC 95/1998.'
  },
  {
    id: 'top10_espb_033',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998 e LINDB): Vacatio legis legal e contagem do prazo de entrada em vigor',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma lei municipal ordinária é publicada oficialmente em 1º de abril (quarta-feira) contendo em seu artigo final a cláusula "Esta Lei entra em vigor após decorridos 10 (dez) dias de sua publicação oficial". Outra lei municipal, publicada na mesma data, omite integralmente qualquer cláusula de vigência. Aplicando-se conjugadamente o art. 8º, § 1º, da Lei Complementar nº 95/1998 e o art. 1º da Lei de Introdução às Normas do Direito Brasileiro (LINDB), conclui-se que:',
    options: [
      'A primeira inclui a data da publicação e o último dia, vigorando em 11 de abril (sábado); a segunda, silente, vigora em 45 dias no país e 3 meses no exterior.',
      'A primeira exclui o dia da publicação e prorroga o termo final de sábado para segunda-feira; a segunda entra em vigor na data da publicação oficial.',
      'Ambas as leis vigoram somente após 45 dias úteis no país, pois vacatio inferior a trinta dias aplica-se unicamente a decretos regulamentares municipais.',
      'A primeira vigora no 10º dia útil contado após a publicação oficial; a segunda torna-se nula por omissão de cláusula de vigência nos termos da LC nº 95/1998.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Combinação clássica de provas Selecon de alto nível: (1) Art. 8º, § 1º, da LC nº 95/1998: a contagem do prazo para entrada em vigor das leis que estabeleçam período de vacância far-se-á com a INCLUSÃO da data da publicação e do último dia do prazo, entrando em vigor no DIA SUBSEQUENTE à sua consumação integral (não se prorroga para o 1º dia útil se cair em sábado, domingo ou feriado!). Logo, 1º a 10 de abril = 10 dias -> entra em vigor em 11 de abril; (2) Art. 1º e § 1º da LINDB (DL 4.657/1942): salvo disposição contrária, a lei começa a vigorar em todo o país 45 dias depois de oficialmente publicada (e 3 meses nos Estados estrangeiros, quando admitida).'
  },
  {
    id: 'top10_espb_034',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_7',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '7. Técnica Legislativa (LC 95/1998): Consolidação legislativa e sistema de numeração das leis',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Com o objetivo de racionalizar o acervo normativo municipal disperso em doze diplomas distintos editados ao longo de vinte anos sobre postura urbana, a Câmara analisa projeto de consolidação dessas normas nos moldes da Lei Complementar nº 95/1998. Acerca do instituto da consolidação das leis e do regime de numeração das espécies normativas previstos na LC nº 95/1998, é correto afirmar que:',
    options: [
      'A consolidação autoriza alterar alíquotas e criar sanções novas nos dispositivos reunidos sem necessidade de tramitação legislativa ordinária prévia.',
      'A numeração das leis complementares e ordinárias reinicia anualmente todo 1º de janeiro com o número 001, utilizando uma única série sequencial.',
      'Integra as leis da matéria num único diploma, revogando-as formalmente sem alterar seu alcance; leis ordinárias e complementares têm numeração contínua distinta.',
      'Na consolidação legislativa, as leis incorporadas permanecem em vigor paralelamente ao novo texto consolidado, vedada sua revogação formal expressa.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Conforme o art. 13, § 1º, da LC nº 95/1998: a consolidação consiste na integração de todas as leis pertinentes a determinada matéria num único diploma legal, revogando-se formalmente as leis incorporadas à consolidação, SEM MODIFICAÇÃO DO ALCANCE NEM INTERRUPÇÃO DA FORÇA NORMATIVA dos dispositivos consolidados (admitindo-se apenas ajustes estritamente formais listados no § 2º). E, conforme o art. 2º, § 1º, da LC 95/98, leis complementares e leis ordinárias têm numeração sequencial em séries distintas e contínuas (não reiniciam anualmente, ao contrário de emendas/decretos/portarias em muitos entes).'
  },

  // ==========================================================================
  // 8.1 REDAÇÃO OFICIAL — PADRÃO OFÍCIO E ATRIBUTOS (14 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_035',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Unificação de Aviso, Ofício e Memorando na 3ª ed. do MRPR',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor recém-empossado da Diretoria Legislativa redige um comunicado interno endereçado ao setor de patrimônio utilizando o modelo antigo de "Memorando" da edição de 2002 do Manual de Redação da Presidência da República (MRPR), com formatação distinta de um ofício externo. Ao revisar o documento com base na 3ª edição do MRPR (2018), a chefia orienta a adequação correta do expediente, fundamentada no fato de que a edição vigente:',
    options: [
      'Manteve três modelos diagramáticos incompatíveis: Aviso (exclusivo entre autoridades municipais), Memorando (comunicação externa com cidadãos) e Ofício (comunicação interna entre chefias).',
      'Extinguiu a distinção formal entre Aviso, Ofício e Memorando, unificando todos os expedientes sob a denominação e a diagramação única do Padrão Ofício (utilizando-se o termo "Ofício"), mantendo características próprias apenas para a Exposição de Motivos e a Mensagem.',
      'Substituiu integralmente o Ofício e a Exposição de Motivos pelo formato único de Memorando Eletrônico, preservando o Aviso apenas para correspondências dirigidas a chefes de Estado estrangeiros.',
      'Manteve a obrigatoriedade do Memorando para comunicações entre órgãos do mesmo Poder e aboliu apenas o Aviso no âmbito da Administração Direta federal, estadual e municipal.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Marco central da 3ª edição do Manual de Redação da Presidência da República (2018): visando à uniformidade e simplificação administrativa, foram abolidas as distinções formais entre Aviso, Ofício e Memorando (que antes variavam conforme remetente/destinatário interno ou externo). Passou-se a adotar uma diagramação única denominada Padrão Ofício, empregando-se o termo "Ofício" para essas comunicações oficiais, preservando-se peculiaridades formais apenas para a Exposição de Motivos e a Mensagem.'
  },
  {
    id: 'top10_espb_036',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Clareza, precisão, concisão e formalidade versus prolixidade',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Considere o seguinte trecho extraído de uma minuta de ofício administrativo: "Outrossim, cumpre-nos, através da presente missiva oficial, mui respeitosamente rogar à conspícua apreciação de Vossa Excelência que se digne a autorizar a liberação dos supramencionados recursos financeiros no mais breve lapso temporal possível." À luz dos atributos da redação oficial descritos na 3ª edição do MRPR (2018), a principal crítica técnica a esse trecho reside na:',
    options: [
      'Ausência de emprego do pretérito mais-que-perfeito composto para atenuar a força imperativa da solicitação administrativa encaminhada à autoridade superior.',
      'Inadequação do registro culto, uma vez que a redação oficial contemporânea recomenda linguagem coloquial para aproximar o Estado do destinatário.',
      'Violação do princípio da publicidade por não indicar expressamente o montante financeiro exato da dotação no vocativo inicial do expediente oficial.',
      'Prolixidade e emprego de jargões arcaicos ("outrossim", "se digne", "através da presente"), confundindo formalidade com empolamento em prejuízo da concisão.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. A 3ª edição do MRPR enfatiza que formalidade e padronização NÃO se confundem com prolixidade, rebuscamento vocabular, "burocratês" ou fórmulas arcaicas de subserviência ("mui respeitosamente rogar", "dignar-se", "através da presente"). A redação oficial exige clareza (compreensão imediata), precisão (articulação semântica sem ambiguidade), objetividade (ir direto ao ponto) e concisão (máximo de informação com o mínimo de palavras), mantendo o padrão culto da língua.'
  },
  {
    id: 'top10_espb_037',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: A impessoalidade sob os três prismas do MRPR',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Na 3ª edição do Manual de Redação da Presidência da República, a impessoalidade é tratada como um atributo estruturante decorrente do art. 37 da Constituição Federal, projetando-se sob três prismas simultâneos na elaboração do texto oficial. Assinale a alternativa que contempla exatamente esses três aspectos da impessoalidade:',
    options: [
      'Ausência de marcas individuais de quem comunica (o serviço público fala), impessoalidade diante de quem recebe e caráter público do assunto tratado.',
      'Ocultação absoluta da identificação nominal do signatário ao final, vedação da primeira pessoa verbal e substituição de destinatários por números.',
      'Exclusividade de comunicação por correio eletrônico institucional, proibição de pronomes de tratamento e supressão dos cargos públicos no endereçamento.',
      'Redação obrigatória na voz passiva sintética em todo o texto, proibição de citar leis municipais e vedação de resposta direta a cidadãos particulares.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Literalmente conforme o capítulo I da 3ª edição do MRPR (2018), a impessoalidade da redação oficial decorre de três aspectos: (1) ausência de impressões individuais de quem comunica (embora assinada por uma autoridade, a comunicação é sempre feita em nome do serviço público); (2) impessoalidade de quem recebe a comunicação (pode dirigir-se a um cidadão ou a outro órgão público de modo uniforme e isonômico); (3) caráter impessoal do próprio assunto tratado (que diz respeito sempre ao interesse público, sendo vedada a promoção pessoal de autoridades ou servidores — art. 37, § 1º, CF).'
  },
  {
    id: 'top10_espb_038',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Coesão, coerência e eliminação de ambiguidade em expedientes',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Em um ofício elaborado pela assessoria legislativa lê-se o período: "O Diretor Administrativo comunicou ao Coordenador de Compras que seu relatório anual já havia sido auditado, razão pela qual o processo foi devolvido sem ressalvas, embora não tenham sido apresentados os comprovantes exigidos no edital." Sob os critérios de precisão, coesão e coerência da 3ª ed. do MRPR, identifica-se dupla impropriedade na redação porque:',
    options: [
      'A oração inicial deveria empregar "comunicou o Coordenador" como objeto direto e substituir "razão pela qual" pela expressão informal "por conta disso".',
      'Falta o uso do gerúndio composto "tendo sido comunicado" para respeitar rigorosamente a ordem cronológica da ação administrativa relatada no texto.',
      'Ambiguidade no pronome "seu" (sem clareza sobre o titular do relatório) e incoerência lógica entre devolver "sem ressalvas" e faltar os comprovantes.',
      'O conectivo concessivo "embora" jamais pode ser empregado em documentos do Padrão Ofício por gerar subjetividade contrária ao padrão culto oficial.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. A 3ª edição do MRPR incorporou expressamente a "coesão e coerência" aos atributos essenciais da redação oficial, além da "precisão" (que inclui evitar ambiguidades). No trecho dado: (1) "seu relatório" gera anfibologia/ambiguidade referencial (do Diretor ou do Coordenador?); (2) devolver um processo "sem ressalvas" quando "não foram apresentados os comprovantes exigidos" produz evidente contradição lógica (quebra de coerência interna).'
  },
  {
    id: 'top10_espb_039',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Tipografia oficial e tamanhos de fonte (Calibri/Carlito, 12/11/10 pt)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao configurar o modelo-padrão de Ofícios no editor de textos da Câmara Municipal, um servidor consulta a 3ª edição do Manual de Redação da Presidência da República (2018) para padronizar a família tipográfica e os tamanhos de letra aplicáveis ao corpo do texto, às citações recuadas e às notas de rodapé. A configuração que atende integralmente às especificações técnicas do Manual vigente é:',
    options: [
      'Fonte Times New Roman ou Arial, tamanho 12 pt no corpo do texto, 10 pt nas citações recuadas e 9 pt nas notas de rodapé.',
      'Fonte Calibri ou Carlito, tamanho 12 pt no texto em geral, 11 pt nas citações e 10 pt nas notas de rodapé.',
      'Fonte Calibri exclusivamente, tamanho 11 pt no corpo do texto corrido, 12 pt nos títulos de assunto e 8 pt nas notas de rodapé.',
      'Fonte Carlito ou Garamond, tamanho 12 pt em todo o expediente, sendo vedado o uso de citações recuadas ou notas de rodapé no Padrão Ofício.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Na 3ª edição do MRPR (2018), a antiga recomendação da fonte Times New Roman foi substituída pelas fontes Calibri ou Carlito (esta última compatível com softwares livres/abertos, preservando a mesma métrica da Calibri), devendo ser usado tamanho 12 pt no texto em geral, 11 pt nas citações (recuadas) e 10 pt nas notas de rodapé.'
  },
  {
    id: 'top10_espb_040',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Margens, recuo, alinhamento, espaçamento e numeração de páginas',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Acerca das especificações de diagramação de página, margens, parágrafos e paginação fixadas na 3ª edição do Manual de Redação da Presidência da República (2018) para documentos no Padrão Ofício, assinale a alternativa integralmente correta:',
    options: [
      'Margens de 2,5 cm em todos os lados, alinhamento à esquerda, espaçamento duplo entre linhas e paginação obrigatória a partir da primeira página.',
      'Margem esquerda de 2,0 cm, direita de 2,0 cm, recuo de 1,25 cm, alinhamento justificado e dispensa de numeração em textos de até cinco folhas.',
      'Margem esquerda de 3,0 cm e direita de 1,5 cm sem inversão frente e verso, recuo de parágrafo de 4,0 cm e espaçamento de 1,5 entre linhas.',
      'Margem esquerda mínima de 3,0 cm, direita de 1,5 cm, superior e inferior de 2,0 cm (espelho em frente/verso), recuo de 2,5 cm, simples/6 pt e paginação desde a 2ª página.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Especificações exatas da Seção de Diagramação do Padrão Ofício na 3ª edição do MRPR (2018): margens esquerda de no mínimo 3,0 cm (para furação/encadernação), direita de 1,5 cm, superior e inferior de 2,0 cm (invertendo esquerda/direita em páginas pares se impresso frente e verso — margem espelho); texto justificado; recuo de parágrafo de 2,5 cm; espaçamento simples entre linhas e 6 pt após cada parágrafo; paginação obrigatória a partir da segunda página.'
  },
  {
    id: 'top10_espb_041',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Cabeçalho institucional e NUP (Número Único de Protocolo)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante a implantação do sistema eletrônico de protocolos em um órgão público, um técnico avalia a inserção do cabeçalho e do NUP (Número Único de Protocolo) na primeira página dos ofícios expedidos. Considerando as orientações da 3ª edição do MRPR (2018) e as normas de padronização documental da Administração Pública, é correto afirmar que:',
    options: [
      'O cabeçalho figura apenas na 1ª página com o Brasão oficial e cadeia hierárquica sem slogans; quando aplicável, o NUP posiciona-se abaixo da identificação.',
      'O cabeçalho completo com Brasão e slogan de governo repete-se no topo de todas as páginas, substituindo integralmente a numeração de folhas e o NUP.',
      'O NUP é exclusivo de atos normativos do Diário Oficial, sendo vedada sua menção no preâmbulo de ofícios entre órgãos legislativos e executivos.',
      'No cabeçalho do Padrão Ofício, o nome da unidade setorial subalterna antecede, em fonte de maior destaque, o nome do Poder ou órgão principal.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Segundo a 3ª ed. do MRPR: (1) o cabeçalho é utilizado apenas na primeira página do documento (centralizado no topo, com o Brasão oficial e a cadeia hierárquica do órgão principal até a unidade emissora, sem símbolos ou slogans de governo — art. 37, § 1º, CF); (2) o NUP (Número Único de Protocolo), quando o expediente integra processo ou protocolo oficial, posiciona-se alinhado à esquerda logo abaixo da identificação do expediente.'
  },
  {
    id: 'top10_espb_042',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Identificação do expediente e grafia oficial de local e data',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Observe as quatro propostas de registro da identificação do expediente e da linha de local e data na abertura de um documento no Padrão Ofício, elaboradas para envio no dia 5 de maio de 2026 na capital mato-grossense. Assinale a alternativa em que ambos os elementos estão grafados em rigorosa conformidade com a 3ª edição do Manual de Redação da Presidência da República:',
    options: [
      'À esquerda: "Ofício nº 084/26-DL"; à direita logo abaixo: "Cuiabá-MT, 05 de Maio de 2.026".',
      'À direita: "MEMORANDO Nº 84/2026"; à esquerda abaixo: "Cuiabá, 05 de maio de 2.026.".',
      'À esquerda: "OFÍCIO Nº 84/2026/DL/CMC"; à direita: "Cuiabá, 5 de maio de 2026.".',
      'À esquerda: "OFÍCIO 0084/2026"; justificado abaixo do Assunto: "Cuiabá, 5/05/2026".'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Regras exatas da 3ª edição do MRPR: (1) Identificação do expediente: alinhada à margem esquerda, com tipo do documento, número, ano completo com 4 dígitos e sigla da(s) unidade(s) emissora(s); (2) Local e data: alinhados à margem DIREITA (logo abaixo da identificação do expediente/NUP e antes do endereçamento), nome da cidade (sem necessidade de repetir a UF quando já identificável ou conforme padrão do órgão), vírgula, dia SEM zero à esquerda (salvo "1º" para o primeiro dia do mês), mês por extenso com inicial minúscula, ano SEM ponto separador de milhar ("2026", nunca "2.026"), e ponto final após o ano.'
  },
  {
    id: 'top10_espb_043',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Posicionamento, destaque e pontuação do campo Assunto',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um estagiário do setor legislativo redigiu a epígrafe temática de um ofício da seguinte forma, posicionando-a logo acima do endereçamento: "ASSUNTO: Solicitação." Na revisão técnica baseada na 3ª edição do Manual de Redação da Presidência da República (2018), o Técnico Legislativo corrige três falhas simultaneamente presentes nesse registro, aplicando a regra correta de que o campo Assunto:',
    options: [
      'Posiciona-se entre o cabeçalho e a data, com a palavra "ASSUNTO:" em caixa alta e itálico encerrando-se com ponto final.',
      'Posiciona-se após o endereçamento, com "Assunto:" em negrito e síntese específica do teor do documento sem ponto final.',
      'Deve ser suprimido quando o expediente tiver até dois parágrafos, iniciando-se o texto diretamente pelo vocativo inicial.',
      'Fica alinhado à margem direita após o vocativo, sem destaque em negrito, encerrado obrigatoriamente com ponto e vírgula.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Na 3ª edição do MRPR: (1) Posição: o campo Assunto vem APÓS o endereçamento e ANTES do vocativo/texto, alinhado à esquerda; (2) Formatação e conteúdo: grafa-se "Assunto:" em negrito (com inicial maiúscula e não todo em caixa alta), seguido de dois-pontos e de um resumo claro e específico do conteúdo (nunca apenas "Solicitação" ou "Encaminhamento" genéricos); (3) Pontuação: o texto do Assunto NÃO leva ponto final!'
  },
  {
    id: 'top10_espb_044',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Critérios de numeração dos parágrafos e suas exceções no texto oficial',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao estruturar o corpo do texto de expedientes administrativos no Padrão Ofício, o redator precisa decidir quando e como numerar os parágrafos. Considerando as diretrizes consolidadas de redação oficial do Manual da Presidência da República sobre numeração de parágrafos e elementos excluídos dessa contagem, assinale a afirmativa correta:',
    options: [
      'O vocativo inicial e o fecho de cortesia devem receber numeração sequencial arábica sempre que o ofício possuir anexos técnicos encadernados.',
      'Os parágrafos do texto são numerados exclusivamente com algarismos romanos seguidos de travessão, dispensando a numeração apenas no último parágrafo conclusivo.',
      'A numeração de parágrafos é obrigatória inclusive quando o texto corrido possui apenas um parágrafo único ou quando todo o conteúdo estiver estruturado sob a forma de títulos e subtítulos.',
      'Quando cabível a numeração no corpo do texto, utilizam-se algarismos arábicos seguidos de ponto; jamais se numeram o vocativo, o fecho nem textos muito breves (ou aqueles organizados em itens, títulos e subtítulos).'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Segundo o MRPR (3ª ed.), utilizam-se algarismos arábicos seguidos de ponto para numerar parágrafos do texto corrido (nunca romanos ou letras), com exclusão absoluta do vocativo, do fecho ("Respeitosamente," / "Atenciosamente,"), de textos curtos sem subdivisão (1 ou 2 parágrafos na sistemática da 3ª ed., e o 1º parágrafo de introdução na praxe tradicional anterior) e dos casos em que o conteúdo esteja organizado em itens ou títulos e subtítulos.'
  },
  {
    id: 'top10_espb_045',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Bloco de assinatura, vedação de traço sobre o nome e quebra de página',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao finalizar a diagramação de um ofício de três páginas, o Técnico Legislativo nota que o último parágrafo e o fecho encerraram-se na última linha da página 2, ficando apenas o espaço da assinatura, o nome completo e o cargo do Presidente da Câmara isolados no topo da página 3, com uma linha horizontal traçada acima do nome. À luz da 3ª edição do MRPR (2018), há duas incorreções formais nessa página final, porque:',
    options: [
      'Não se insere linha horizontal sobre o nome do signatário, nem se deixa a assinatura e o cargo isolados em página nova sem texto precedente.',
      'A linha acima do nome só é dispensada em papel timbrado colorido, sendo obrigatório que o nome e o cargo fiquem isolados na página final.',
      'Na 3ª edição do MRPR, a identificação do signatário vem alinhada à margem esquerda logo acima do cabeçalho inicial e separada por traço duplo.',
      'Apenas o fecho pode figurar sozinho em nova página; o nome do signatário deve ser abreviado para iniciais seguido do CPF funcional.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Regras literais de diagramação do MRPR (3ª ed.): (1) Na identificação do signatário, deixa-se espaço em branco para a assinatura (ou marca de assinatura eletrônica), SEM inserir linha horizontal (traço) sobre o nome; (2) Regra anti-isolamento: deve-se evitar que a assinatura (com o nome e cargo — e o fecho) fique isolada sozinha em uma página nova sem texto algum precedendo-a; quando isso ocorrer, ajusta-se o texto ou desloca-se parte das últimas linhas para a página final.'
  },
  {
    id: 'top10_espb_046',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Uso institucional do correio eletrônico (e-mail oficial)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor envia mensagem pelo e-mail institucional da Câmara Municipal a uma Secretaria Estadual com o campo Assunto preenchido apenas como "Urgente", utilizando no texto abreviaturas como "vc" e "att." e anexando planilha editável sem mencioná-la no corpo da mensagem. Confrontando essa conduta com as orientações da 3ª edição do MRPR sobre correio eletrônico oficial, assinale a alternativa correta:',
    options: [
      'Por visar à celeridade administrativa, admitem-se abreviações informais internas e assuntos genéricos para priorização na caixa postal.',
      'O correio eletrônico não possui reconhecimento algum como expediente oficial no MRPR de 2018, restringindo o órgão ao papel impresso.',
      'Deve manter norma-padrão, clareza e impessoalidade (sem abreviações coloquiais), usar assunto específico, citar anexos e adotar os fechos oficiais.',
      'Nos e-mails dirigidos a autoridades estaduais, a saudação substitui o vocativo por "Caro colega," e o fecho oficial é abreviado para "Abs.".'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Na 3ª edição do MRPR (Seção de Correio Eletrônico): embora o e-mail tenha formato mais flexível, sua linguagem continua vinculada aos atributos da redação oficial (formalidade, padrão culto, clareza, concisão e impessoalidade — proibidos "vc", "att", gírias e emojis). O campo Assunto deve ser claro e específico (jamais vago como "Urgente"), o texto deve indicar os arquivos anexados (preferencialmente em formato não editável/portável como PDF) e usar os fechos oficiais ("Respeitosamente," / "Atenciosamente,"). Para valor documental jurídico pleno, exige-se certificação/assinatura digital ou confirmação formal.'
  },
  {
    id: 'top10_espb_047',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Norma-padrão, gerundismo, vícios sintáticos e precisão lexical',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Assinale a alternativa cuja redação atende integralmente aos padrões de clareza, concisão, impessoalidade e norma-padrão culta recomendados pela 3ª edição do Manual de Redação da Presidência da República (2018), sem gerundismo, pleonasmos viciosos ou impropriedades preposicionais:',
    options: [
      '"Venho por meio desta informar que esta Diretoria vai estar encaminhando, anexo junto ao presente expediente, a cópia xerox da ata."',
      '"Encaminho a Vossa Senhoria, para análise e manifestação, a cópia da Ata da 12ª Sessão Ordinária, anexa a este ofício."',
      '"Através do presente expediente, estamos comunicando que houveram divergências no balanço financeiro entregue há dois meses atrás."',
      '"Face ao exposto, solicito à Vossa Excelência que proceda a revisão do contrato em anexo anexo, haja visto o prazo expirar amanhã."'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Análise dos desvios nos distratores: (A) clichê "Venho por meio desta", gerundismo ("vai estar encaminhando") e pleonasmo ("anexo junto"); (C) impropriedade de "através" (indica travessia, e não meio/instrumento -> usar "por meio de"), erro de concordância com verbo impessoal ("houveram" -> "houve") e redundância ("há dois meses atrás"); (D) crase indevida antes de pronome de tratamento ("à Vossa Excelência"), ausência de crase em "proceda à revisão" e erro de concordância em "haja visto" (correto: "haja vista"). A opção B é enxuta, culta, impessoal e com concordância correta de "anexa" com "a cópia".'
  },
  {
    id: 'top10_espb_048',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_1',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.1. Redação Oficial — Padrão Ofício: Ordem sequencial das partes estruturais do Padrão Ofício',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Na montagem de um expediente administrativo conforme o modelo gráfico da 3ª edição do Manual de Redação da Presidência da República (2018), a disposição vertical dos blocos estruturais obedece a uma ordem padronizada que sofreu ajustes em relação às versões anteriores. Assinale a alternativa que apresenta a sequência correta, de cima para baixo, das partes do Padrão Ofício:',
    options: [
      'Cabeçalho -> Assunto -> Local e data -> Identificação do expediente -> Endereçamento -> Vocativo e Texto -> Identificação do signatário -> Fecho.',
      'Identificação do expediente -> Cabeçalho -> Endereçamento -> Local e data -> Vocativo -> Assunto -> Texto e Fecho -> Assinatura.',
      'Cabeçalho -> Endereçamento -> Assunto -> Identificação do expediente -> Texto com Vocativo -> Local e data ao final -> Fecho e Assinatura.',
      'Cabeçalho -> Identificação do expediente (e NUP) -> Local e data -> Endereçamento -> Assunto -> Texto (vocativo, parágrafos e fecho) -> Signatário.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Ordem estrutural exata do Padrão Ofício na 3ª edição do MRPR (2018): (1) Cabeçalho; (2) Identificação do expediente (e NUP, quando houver); (3) Local e data (alinhados à direita); (4) Endereçamento; (5) Assunto (em negrito, sem ponto final); (6) Texto do documento (composto pelo vocativo, parágrafos do texto e fecho); e (7) Identificação do signatário (nome e cargo abaixo do espaço da assinatura).'
  },

  // ==========================================================================
  // 8.2 PRONOMES DE TRATAMENTO, VOCATIVOS E ENDEREÇAMENTO (13 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_049',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Vocativos oficiais e abolição de Digníssimo e Ilustríssimo',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor da Câmara Municipal prepara três ofícios distintos na mesma manhã: o primeiro dirigido ao Presidente da República; o segundo dirigido ao Prefeito Municipal; e o terceiro dirigido a uma Vereadora membro da Mesa Diretora. Aplicando-se estritamente as normas da 3ª edição do Manual de Redação da Presidência da República (2018) sobre vocativos e qualificativos abolidos, os vocativos corretos para a abertura do texto desses três ofícios são, respectivamente:',
    options: [
      '"Ilustríssimo Senhor Presidente da República,", "Digníssimo Senhor Prefeito," e "Excelentíssima Senhora Vereadora,".',
      '"Excelentíssimo Senhor Presidente da República,", "Excelentíssimo Senhor Prefeito," e "Ilustríssima Senhora Vereadora,".',
      '"Excelentíssimo Senhor Presidente da República,", "Senhor Prefeito," e "Senhora Vereadora,".',
      '"Vossa Excelência Presidente da República,", "Senhor Doutor Prefeito," e "Digníssima Senhora Vereadora,".'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Regra expressa da 3ª edição do MRPR (2018): (1) Foram abolidos os adjetivos "Digníssimo (DD.)" e "Ilustríssimo (Ilmo.)"; (2) No VOCATIVO, a expressão "Excelentíssimo Senhor" seguida do cargo é empregada EXCLUSIVAMENTE para os Chefes de Poder (Presidente da República, Presidente do Congresso Nacional e Presidente do STF); (3) Para todas as demais autoridades tratadas por Vossa Excelência — incluindo Ministros, Governadores, Prefeitos, Senadores, Deputados, Vereadores e Magistrados — o vocativo oficial é "Senhor" (ou "Senhora") seguido do cargo respectivo ("Senhor Prefeito,", "Senhora Vereadora,").'
  },
  {
    id: 'top10_espb_050',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Alternância entre Vossa e Sua no texto e no endereçamento',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao redigir um ofício dirigido diretamente ao Presidente da Câmara Municipal para relatar uma solicitação feita na véspera pelo Secretário de Fazenda, o Técnico Legislativo deve empregar os pronomes de tratamento adequados tanto no bloco de endereçamento quanto no corpo do texto. Assinale a alternativa em que o emprego de "Vossa" e "Sua" está integralmente correto:',
    options: [
      'Endereçamento: "A Sua Excelência o Senhor..."; Texto: "Comunico a Vossa Excelência que Sua Excelência o Secretário (ou o Senhor Secretário) solicitou a devolução dos autos."',
      'Endereçamento: "A Vossa Excelência o Senhor..."; Texto: "Comunico a Vossa Excelência que Vossa Excelência o Secretário solicitou a devolução dos autos."',
      'Endereçamento: "À Sua Excelência o Senhor..."; Texto: "Comunico a Sua Excelência que Vossa Excelência o Secretário solicitou a devolução dos autos."',
      'Endereçamento: "A Sua Senhoria o Senhor..."; Texto: "Comunico a Sua Excelência que Sua Senhoria o Secretário solicitou a devolução dos autos."'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Distinção gramatical e protocolar fundamental: (1) No bloco de ENDEREÇAMENTO usa-se sempre a 3ª pessoa "A Sua Excelência o Senhor..." (sem crase antes de Sua, nunca "Vossa"); (2) No corpo do texto, ao dirigir-se DIRETAMENTE ao destinatário (com quem se fala), emprega-se "Vossa Excelência"; (3) Ao fazer referência a uma terceira autoridade (de quem se fala), emprega-se "Sua Excelência" (ou a designação direta do cargo).'
  },
  {
    id: 'top10_espb_051',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Concordância verbal, pronominal e silepse de gênero',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma comunicação oficial é dirigida diretamente à Prefeita Municipal, comunicando que o projeto de lei enviado pelo Executivo já foi autuado e aguarda sua manifestação final. Assinale a alternativa em que a concordância verbal, pronominal e nominal (silepse de gênero) observa rigorosamente a norma-padrão e o Manual de Redação da Presidência da República:',
    options: [
      '"Vossa Excelência fostes devidamente notificada acerca de vosso projeto, aguardando-se que devolvais o processo assinado."',
      '"Vossa Excelência foi devidamente notificado acerca de vosso projeto e deverá se pronunciar quando estiver pronto."',
      '"Sua Excelência foi devidamente notificada acerca de sua proposta, razão pela qual vos solicitamos urgente manifestação."',
      '"Vossa Excelência foi devidamente notificada acerca de seu projeto e deverá enviar sua manifestação quando estiver pronta."'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Três regras simultâneas da concordância com pronomes de tratamento: (1) Verbo sempre na 3ª pessoa ("foi", "apresente" — nunca "fostes" ou "devolvais"); (2) Pronomes possessivos e oblíquos sempre na 3ª pessoa ("seu projeto", "sua manifestação" — nunca "vosso" ou "vos"); (3) Adjetivos e particípios concordam com o sexo biológico/social do destinatário (silepse de gênero): tratando-se de Prefeita (mulher), grafa-se "notificada" (e não "notificado" ou "pronto").'
  },
  {
    id: 'top10_espb_052',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Emprego da palavra "Doutor" como título acadêmico',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao revisar um ofício que seria expedido a um Delegado de Polícia e a um advogado contratado pelo Município — ambos bacharéis em Direito sem pós-graduação stricto sensu —, o Técnico Legislativo elimina o termo "Doutor" inserido no endereçamento e no vocativo. De acordo com a 3ª edição do Manual de Redação da Presidência da República (2018), essa supressão está correta porque "Doutor":',
    options: [
      'É pronome de tratamento privativo exclusivamente de membros do Poder Judiciário e do Ministério Público estadual ou federal.',
      'Não é forma de tratamento, mas sim título acadêmico, devendo seu emprego restringir-se às comunicações dirigidas a pessoas que tenham obtido o grau acadêmico de doutorado.',
      'Foi convertido pelo MRPR em vocativo obrigatório para bacharéis em Direito, médicos e ocupantes de cargos efetivos de nível superior.',
      'Substitui o tratamento de Vossa Excelência apenas quando o destinatário acumular simultaneamente funções advocatícias e legislativas.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Conforme expressamente consignado na 3ª edição do MRPR (2018): "Doutor não é forma de tratamento, e sim título acadêmico". Portanto, recomenda-se evitar o uso indiscriminado dessa qualificação nas correspondências oficiais, empregando-a apenas em relação a quem efetivamente concluiu curso universitário de doutorado (e ainda assim privilegiando o tratamento oficial correspondente ao cargo público exercido).'
  },
  {
    id: 'top10_espb_053',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Rol oficial de "Vossa Excelência" versus "Vossa Senhoria"',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'De acordo com o quadro sistemático de pronomes de tratamento consolidado na 3ª edição do Manual de Redação da Presidência da República (2018), assinale a alternativa que agrupa exclusivamente autoridades às quais se aplica o tratamento de "Vossa Excelência":',
    options: [
      'Prefeitos Municipais, Diretores de Departamentos Administrativos, Vereadores e Presidentes de Empresas Privadas.',
      'Juízes de Direito, Chefes de Gabinete de Secretarias Municipais, Auditores Fiscais e Reitores de Universidades.',
      'Vereadores, Prefeitos Municipais, Conselheiros de Tribunais de Contas, Membros do Ministério Público, Juízes de Direito e Deputados Estaduais.',
      'Governadores de Estado, Oficiais Subalternos da Polícia Militar, Secretários Municipais e Cidadãos Particulares.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Segundo a 3ª edição do MRPR, recebem o tratamento de Vossa Excelência as altas autoridades dos três Poderes e órgãos constitucionais autônomos, incluindo: Presidente/Vice da República, Ministros, Governadores/Vice, Secretários de Estado, Prefeitos Municipais, Senadores, Deputados Federais/Estaduais/Distritais, VEREADORES (membros de Câmaras Municipais), Magistrados, Membros do Ministério Público, Ministros/Conselheiros dos Tribunais de Contas, Oficiais-Generais e Embaixadores. Já Reitores recebem Vossa Magnificência, e diretores de departamento/chefes de seção/particulares recebem Vossa Senhoria.'
  },
  {
    id: 'top10_espb_054',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Crase, abreviação e correção do bloco de endereçamento',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor elabora quatro minutas de endereçamento para ofícios da Câmara Municipal dirigidos, respectivamente, a um Juiz de Direito, a uma Diretora Administrativa de órgão parceiro (sem pronome de tratamento especial) e a um Secretário Municipal. Assinale a alternativa em que o bloco de endereçamento atende rigorosamente às regras de crase e vedação de abreviaturas da 3ª edição do MRPR:',
    options: [
      '"A Sua Excelência o Senhor\nFULANO DE TAL\nJuiz de Direito" — e para a Diretora sem pronome especial: "À Senhora\nFULANA DE TAL\nDiretora Administrativa".',
      '"À Sua Excelência o Senhor\nFULANO DE TAL\nJuiz de Direito" — e para a Diretora sem pronome especial: "À Vossa Senhoria\nFULANA DE TAL\nDiretora Administrativa".',
      '"A S. Ex.ª o Sr.\nFULANO DE TAL\nSecretário Municipal" — e para a Diretora sem pronome especial: "A Senhora\nFULANA DE TAL\nDiretora Administrativa".',
      '"À Vossa Excelência o Senhor\nFULANO DE TAL\nSecretário Municipal" — e para a Diretora sem pronome especial: "À Ilma. Sra.\nFULANA DE TAL\nDiretora Administrativa".'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Atenção às três regras cirúrgicas do MRPR 3ª ed.: (1) Não ocorre crase antes de "Sua Excelência" / "Sua Senhoria", pois esses pronomes repelem artigo definido ("A Sua Excelência...", sem crase); (2) Quando se endereça diretamente a "Senhora" (sem pronome "Sua"), ocorre crase normalmente pela fusão da preposição "a" com o artigo "a" ("À Senhora..."); (3) No endereçamento e no vocativo NÃO se abreviam pronomes de tratamento (escreve-se por extenso, vedado "A S. Ex.ª").'
  },
  {
    id: 'top10_espb_055',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Abreviaturas e flexão plural dos pronomes de tratamento',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Embora a 3ª edição do Manual de Redação da Presidência da República recomende dar preferência à grafia por extenso dos pronomes de tratamento, admite-se excepcionalmente sua abreviatura no corpo do texto corrido (nunca no vocativo ou no endereçamento). Assinale a alternativa que apresenta integralmente corretas as abreviaturas no singular e no plural, conforme as normas ortográficas e do MRPR:',
    options: [
      '"V. Exª." (plural "V. Exªs."), "V. S.ª" (plural "V. S.\'s") e "V. Mag.ª" (para Prefeitos).',
      '"V. Ex.ª" (plural "V. Ex.as"), "V. S.ª" (plural "V. S.as"), "V. Mag.ª" (para Reitores de Universidades) e "V. S." (para o Papa).',
      '"V. Exa." (plural "V. Exas"), "V. S." (para Vossa Senhoria) e "V. Em.ª" (para Bispos diocesanos).',
      '"V. Ex.ª" (plural "V. Ex.ªs"), "V. Sr.ª" (plural "V. Sr.as") e "V. Sant." (para o Papa).'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Quadro oficial de abreviaturas: Vossa Excelência -> V. Ex.ª (plural V. Ex.as — a letra "a" sobrescrita recebe o "s" antes de fechar, nunca "V. Ex.ªs" nem apóstrofo); Vossa Senhoria -> V. S.ª (plural V. S.as); Vossa Magnificência -> V. Mag.ª (Reitores de Universidades); Vossa Santidade -> V. S. (Papa — não confundir com Vossa Senhoria, que é V. S.ª!); Vossa Eminência -> V. Em.ª (Cardeais).'
  },
  {
    id: 'top10_espb_056',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Pontuação do vocativo e tratamento dirigido a particulares',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao expedir ofício em resposta a requerimento apresentado por um cidadão particular (sem cargo público), o Técnico Legislativo deve observar as regras de pontuação e adequação vocabular para o vocativo na 3ª edição do MRPR. Assinale a alternativa correta:',
    options: [
      'O vocativo deve ser encerrado por dois-pontos ou ponto de exclamação, adotando-se para particulares a fórmula afetiva "Caro cidadão:".',
      'Para particulares, utiliza-se o vocativo "Ilustríssimo Senhor Cidadão." encerrado obrigatoriamente por ponto final.',
      'Em comunicações dirigidas a particulares, dispensa-se o vocativo, iniciando-se o expediente diretamente pelo corpo do primeiro parágrafo.',
      'O vocativo em comunicações oficiais deve terminar com vírgula; para destinatários particulares, adota-se preferencialmente "Prezado Senhor," ou "Prezada Senhora,".'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Segundo a 3ª edição do MRPR (2018): (1) O vocativo inicia a parte do texto e deve ser sempre seguido de VÍRGULA (e não de dois-pontos ou ponto de exclamação); (2) Para particulares (ou quando não houver cargo específico), adota-se "Prezado Senhor," / "Prezada Senhora,", evitando intimidade inadequada ("Caro amigo") ou adjetivos abolidos ("Ilustríssimo").'
  },
  {
    id: 'top10_espb_057',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Autoridades universitárias, eclesiásticas e judiciárias',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'A Câmara Municipal organiza sessão solene e expede convites oficiais em Padrão Ofício para três personalidades: o Reitor de uma universidade pública federal, um Arcebispo católico e um Juiz de Direito titular da comarca. Os pronomes de tratamento e respectivos vocativos adequados segundo a 3ª edição do Manual de Redação da Presidência da República são:',
    options: [
      'Reitor: "Vossa Excelência" / "Senhor Reitor,"; Arcebispo: "Vossa Santidade" / "Santíssimo Arcebispo,"; Juiz: "Vossa Senhoria" / "Meritíssimo Senhor,". ',
      'Reitor: "Vossa Senhoria" / "Ilustríssimo Reitor,"; Arcebispo: "Vossa Eminência" / "Eminentíssimo Bispo,"; Juiz: "Vossa Excelência" / "Excelentíssimo Senhor Juiz,". ',
      'Reitor: "Vossa Magnificência" / "Magnífico Reitor,"; Arcebispo: "Vossa Excelência Reverendíssima" / "Excelentíssimo e Reverendíssimo Senhor Arcebispo,"; Juiz: "Vossa Excelência" / "Senhor Juiz,". ',
      'Reitor: "Vossa Magnificência" / "Magnânimo Reitor,"; Arcebispo: "Vossa Reverendíssima" / "Reverendo Arcebispo,"; Juiz: "Vossa Meritíssima" / "Meritíssimo Juiz,". '
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Tabela de autoridades especiais no MRPR (3ª ed.): (1) Reitor de Universidade = Vossa Magnificência (vocativo "Magnífico Reitor,"); (2) Bispos e Arcebispos = Vossa Excelência Reverendíssima (vocativo "Excelentíssimo e Reverendíssimo Senhor Bispo/Arcebispo,"; note que Vossa Eminência é para Cardeais, Vossa Santidade para o Papa e Vossa Reverendíssima para sacerdotes/demais religiosos); (3) Juiz de Direito = Vossa Excelência (na 3ª ed. do MRPR, o vocativo uniformizado para autoridades com tratamento de Excelência que não sejam Chefes de Poder é "Senhor + cargo", logo "Senhor Juiz,").'
  },
  {
    id: 'top10_espb_058',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Emprego residual de Vossa Senhoria e vedação a redundâncias',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Acerca do emprego do pronome de tratamento "Vossa Senhoria" e das diretrizes para evitar sobreposições reverenciais nas comunicações oficiais da 3ª edição do MRPR (2018), assinale a afirmativa correta:',
    options: [
      '"Vossa Senhoria" deve ser empregado para Vereadores e Secretários Municipais sempre que a comunicação tiver caráter estritamente financeiro ou contábil.',
      '"Vossa Senhoria" destina-se às demais autoridades e aos particulares, vedado acumular adjetivos abolidos como "Ilustríssima" ou "Digníssimo".',
      'Quando o servidor subalterno escreve para seu chefe imediato de divisão administrativa, deve utilizar "Excelentíssima Vossa Senhoria" por deferência.',
      'A 3ª edição do MRPR tornou "Vossa Senhoria" superior a "Vossa Excelência" no Legislativo municipal, reservando este último ao Poder Judiciário.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Na 3ª edição do MRPR: "Vossa Senhoria" destina-se às demais autoridades administrativas (que não integrem o rol de Vossa Excelência nem dos tratamentos eclesiásticos/universitários especiais) e aos particulares. É tecnicamente incorreto e expressamente afastado acumular o pronome com expressões laudatórias abolidas como "Ilustríssimo", "Digníssimo" ou "Mui Digno".'
  },
  {
    id: 'top10_espb_059',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Pronomes oblíquos e reflexivos com Vossa Excelência',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um erro frequente na redação de ofícios consiste em misturar pronomes oblíquos e reflexivos de segunda pessoa com o pronome de tratamento "Vossa Excelência". Assinale a alternativa em que todos os pronomes e formas verbais estão gramaticalmente corretos:',
    options: [
      '"Caso Vossa Excelência traga consigo o processo original, entregar-lhe-emos imediatamente o recibo e o convidaremos para a audiência."',
      '"Caso Vossa Excelência traga convosco o processo original, vos entregaremos imediatamente o recibo e vos convidaremos para a audiência."',
      '"Caso Vossa Excelência tragas contigo o processo original, entregar-te-emos imediatamente o recibo e o convidaremos para a audiência."',
      '"Caso Vossa Excelência traga consigo o processo original, entregar-vos-emos imediatamente o recibo e convidá-lo-emos para a audiência."'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Todos os pronomes pessoais retos, oblíquos, reflexivos e possessivos que retomam "Vossa Excelência" (ou qualquer pronome de tratamento) pertencem obrigatoriamente à 3ª pessoa: "consigo" (e nunca "convosco"/"contigo"), "lhe" (objeto indireto de 3ª pessoa, e nunca "vos"/"te"), "o" (objeto direto de 3ª pessoa, ou "a" se mulher). A mistura de 3ª pessoa ("traga consigo") com 2ª pessoa ("entregar-vos-emos") constitui erro clássico de uniformidade de tratamento.'
  },
  {
    id: 'top10_espb_060',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Pluralização no endereçamento, vocativo e texto coletivo',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'A Secretaria de Finanças encaminha um único ofício endereçado simultaneamente aos três Vereadores integrantes de determinada Comissão Permanente da Câmara Municipal. Assinale a alternativa em que o endereçamento, o vocativo e a concordância no plural estão todos corretos:',
    options: [
      'Endereçamento: "À Suas Excelências os Senhores..."; Vocativo: "Excelentíssimos Vereadores:"; Texto: "Vossas Excelências apresentareis vossos relatórios até sexta-feira."',
      'Endereçamento: "A Vossas Excelências os Senhores..."; Vocativo: "Senhores Vereadores."; Texto: "Suas Excelências apresentarão seus relatórios até sexta-feira."',
      'Endereçamento: "Aos Senhores Excelências..."; Vocativo: "Ilustríssimos Senhores Vereadores,"; Texto: "Vossas Excelências apresentará seus relatórios até sexta-feira."',
      'Endereçamento: "A Suas Excelências os Senhores..."; Vocativo: "Senhores Vereadores,"; Texto: "Vossas Excelências apresentarão seus relatórios até sexta-feira."'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Quando há múltiplos destinatários tratados por Excelência: (1) Endereçamento em 3ª pessoa no plural e sem crase: "A Suas Excelências os Senhores..."; (2) Vocativo no plural terminado com vírgula: "Senhores Vereadores,"; (3) No corpo do texto dirigido diretamente a eles, emprega-se "Vossas Excelências" (nunca "Suas Excelências" na comunicação direta!) com verbo e possessivo na 3ª pessoa do plural ("apresentarão seus relatórios").'
  },
  {
    id: 'top10_espb_061',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_2',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.2. Redação Oficial — Tratamento e Endereçamento: Preposição pura sem artigo antes de pronomes de tratamento',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao revisar um relatório oficial com referências a autoridades, o Técnico Legislativo identifica erro sintático recorrente na contração de preposições com artigo definido antes de pronomes de tratamento. Assinale a alternativa em que a regência e o emprego das preposições diante dos pronomes de tratamento estão inteiramente corretos:',
    options: [
      '"A decisão da Vossa Excelência repercutiu favoravelmente na Sua Senhoria o Diretor."',
      '"Encaminho pela Vossa Excelência os autos que se encontravam sob a guarda da Sua Excelência o Presidente."',
      '"A manifestação de Vossa Excelência foi anexada ao despacho proferido por Sua Excelência o Prefeito Municipal."',
      '"Submeto à Vossa Excelência o parecer elaborado em conjunto com a Vossa Senhoria o Coordenador."'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Os pronomes de tratamento ("Vossa Excelência", "Sua Excelência", "Vossa Senhoria", "Sua Senhoria") repelem a anteposição do artigo definido feminino "a". Consequentemente, as preposições permanecem em sua forma pura, sem contração nem crase: "de Vossa Excelência" (nunca "da Vossa Excelência"), "em Sua Senhoria" (nunca "na Sua Senhoria"), "por Sua Excelência" (nunca "pela Sua Excelência") e "a Vossa Excelência" (nunca "à Vossa Excelência").'
  },

  // ==========================================================================
  // 8.3 FECHOS OFICIAIS E DOCUMENTOS ADMINISTRATIVOS (13 QUESTÕES)
  // ==========================================================================
  {
    id: 'top10_espb_062',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Fechos oficiais segundo a hierarquia intra e interpoderes',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Observe quatro comunicações expedidas no mesmo dia na esfera municipal:\n1. Técnico Legislativo escreve ao Presidente da Câmara Municipal.\n2. Presidente da Câmara Municipal escreve ao Prefeito Municipal (Chefes de Poderes distintos).\n3. Diretor Legislativo escreve a um Coordenador de Seção subordinado.\n4. Prefeito Municipal escreve ao Presidente da República.\nDe acordo com a 3ª edição do Manual de Redação da Presidência da República (2018), os fechos corretos para os casos 1, 2, 3 e 4 são, respectivamente:',
    options: [
      'Respeitosamente, / Atenciosamente, / Atenciosamente, / Respeitosamente,',
      'Respeitosamente, / Respeitosamente, / Atenciosamente, / Respeitosamente,',
      'Atenciosamente, / Atenciosamente, / Cordialmente, / Respeitosamente,',
      'Respeitosamente, / Atenciosamente, / Sem mais para o momento, / Atenciosamente,'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Regra rigorosa da 3ª edição do MRPR (com apenas dois fechos válidos): (1) Técnico -> Presidente da Câmara (superior hierárquico): "Respeitosamente,"; (2) Presidente da Câmara -> Prefeito Municipal (Chefes de Poderes independentes, sem subordinação hierárquica, mesma estatura institucional entre Poderes locais): "Atenciosamente,"; (3) Diretor -> Coordenador subordinado (hierarquia inferior): "Atenciosamente,"; (4) Prefeito -> Presidente da República (autoridade superior, inclusive expressamente citado no MRPR): "Respeitosamente,".'
  },
  {
    id: 'top10_espb_063',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Pontuação, recuo e abolição de fórmulas de encerramento obsoletas',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um servidor conclui o corpo de um ofício administrativo acrescentando após o último parágrafo: "Sem mais para o momento, renovo protestos de elevada estima e consideração. 4. Cordialmente." Avaliando o trecho segundo a 3ª edição do Manual de Redação da Presidência da República (2018), estão presentes múltiplas violações às normas de redação oficial porque o fecho:',
    options: [
      'Deve ser numerado em sequência com o último parágrafo do texto, encerrando-se com ponto final e acompanhado da expressão "Subscrevo-me".',
      'Limita-se exclusivamente a "Respeitosamente," ou "Atenciosamente,", sem numeração de parágrafo, com recuo de 2,5 cm e vírgula ao final.',
      'Deve ser centralizado em caixa alta acima da linha da assinatura e encerrado com dois-pontos quando dirigido a autoridade superior.',
      'Pode empregar "Cordialmente," apenas em mensagens eletrônicas internas e em ofícios dirigidos a particulares que não possuam cargo público.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. A 3ª edição do MRPR manteve e reforçou a simplificação dos fechos em apenas duas fórmulas ("Respeitosamente," e "Atenciosamente,"), que: (1) nunca recebem numeração de parágrafo; (2) terminam obrigatoriamente com VÍRGULA (e não ponto final); (3) posicionam-se com recuo de 2,5 cm da margem esquerda; e (4) substituem definitivamente fórmulas antiquadas e prolixas como "Sem mais para o momento", "Cordialmente", "Saudações" e "Renovo protestos de elevada estima e distinta consideração".'
  },
  {
    id: 'top10_espb_064',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Lavratura formal da ata e prevenção contra adulterações',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Encerrada uma reunião extraordinária da Comissão de Orçamento da Câmara Municipal, o Técnico Legislativo é incumbido de lavrar a respectiva ata. Considerando a natureza probatória e as técnicas formais tradicionais que regem a elaboração de atas administrativas e legislativas, assinale a alternativa correta:',
    options: [
      'Deve conter múltiplos parágrafos com linhas em branco entre as intervenções dos participantes e adotar exclusivamente algarismos arábicos sem extenso.',
      'Na qualidade de redator, o Técnico Legislativo deve inserir comentários avaliativos sobre o desempenho argumentativo dos Vereadores presentes.',
      'Registra fielmente data, local, presenças e deliberações em texto contínuo sem espaços em branco ou rasuras, com assinaturas ao final.',
      'Só adquire validade jurídica após reconhecimento de firma em tabelionato de notas dentro de vinte e quatro horas do encerramento da reunião.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Por constituir documento fidedigno com valor jurídico e histórico-probatório dos atos de um colegiado, a ata possui técnica rigorosa de lavratura: texto contínuo (sem quebras de parágrafo espaçadas ou espaços em branco que permitam inserções fraudulentas), numerais por extenso (ou acompanhados do extenso), relato objetivo e impessoal (proibido juízo de valor do redator), menção a hora, data, local, participantes e deliberações, e fecho formal seguido das assinaturas competentes.'
  },
  {
    id: 'top10_espb_065',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Retificação de erros na ata em três momentos distintos',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Durante o expediente de secretaria das comissões, um servidor depara-se com três situações de equívoco material em atas distintas: (1) percebe erro de data no exato instante em que redige o texto; (2) nota omissão de um nome após encerrar o texto, mas antes da coleta das assinaturas; e (3) descobre erro de valor numérico semanas depois, quando a ata já fora lida, aprovada e assinada por todos. Os procedimentos tecnicamente corretos para as situações 1, 2 e 3 são, respectivamente:',
    options: [
      'Aplicar corretivo líquido / inserir nota de rodapé / substituir a folha intermediária do livro oficial.',
      'Riscar o trecho errado com traço simples / abrir "digo," no verso / cancelar integralmente o livro.',
      'Empregar "Em tempo:" na linha seguinte / escrever entrelinhas acima / retificar apenas por e-mail.',
      'Usar "digo," imediatamente no ato / lançar "Em tempo:" antes das assinaturas / retificar na ata seguinte.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Técnica clássica e infalível de retificação de atas (zero rasuras, entrelinhas ou corretivos): (1) Erro notado imediatamente durante a escrita -> usa-se "digo," seguido da forma exata; (2) Erro ou omissão notado após concluir a redação, antes das assinaturas -> abre-se a cláusula "Em tempo:" antes das assinaturas; (3) Erro constatado após encerrada e assinada a ata -> jamais se altera o documento já assinado; a correção é registrada formalmente na ata da sessão subsequente (ou mediante termo de retificação aprovado).'
  },
  {
    id: 'top10_espb_066',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Conceito e função institucional da Sinopse legislativa',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Ao término de cada sessão plenária ou semana legislativa, o setor de apoio parlamentar elabora um documento de consulta célere contendo o resumo cronológico das proposições protocoladas, suas ementas, a distribuição às comissões e os resultados sintéticos das votações ocorridas, sem transcrever os discursos da tribuna nem emitir pareceres opinativos. Esse expediente denomina-se:',
    options: [
      'Sinopse, espécie documental de síntese objetiva destinada a condensar os elementos essenciais de atos, sessões ou tramitações para consulta rápida.',
      'Exposição de Motivos, expediente privativo do Presidente da Câmara para encaminhar projetos ao Executivo.',
      'Ata circunstanciada, documento que reproduz integral e literalmente todas as intervenções orais e apartes proferidos em Plenário.',
      'Despacho interlocutório, ato administrativo decisório que resolve questões de ordem pendentes nas comissões temáticas.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. A Sinopse (ou súmula/síntese resumida) tem como finalidade oferecer uma visão condensada, clara e objetiva de matérias, fatos, proposições, tramitações ou eventos, permitindo consulta ágil aos pontos essenciais sem reproduzir a integralidade dos debates (como as notas taquigráficas/ata circunstanciada) e sem emitir juízos opinativos ou recomendações técnicas (próprias do relatório/parecer).'
  },
  {
    id: 'top10_espb_067',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Estrutura e finalidade do Relatório administrativo e técnico',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Uma comissão especial de sindicância ou gestão patrimonial conclui os levantamentos de inventário do exercício e precisa apresentar o resultado do trabalho à Mesa Diretora, detalhando a metodologia aplicada, os bens faltantes apurados e as medidas corretivas recomendadas. O documento oficial indicado e sua estrutura clássica correspondem ao:',
    options: [
      'Atestado, composto de cabeçalho institucional, listagem corrida de patrimônio e carimbo simples de conferência pelo almoxarifado.',
      'Relatório, estruturado em introdução (objeto), desenvolvimento (exposição fática e técnica) e conclusão (resultados e recomendações).',
      'Requerimento ordinatório, redigido em texto contínuo sem parágrafos e sem conclusão para preservar a neutralidade administrativa.',
      'Ofício-circular de mérito, elaborado sem cabeçalho e sem síntese analítica, destinado apenas a notificar terceiros externos ao órgão.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. O Relatório é a peça expositiva (e frequentemente analítica) por meio da qual uma autoridade, comissão ou servidor presta contas de atividades, apurações ou inspeções à instância competente. Diferencia-se da ata (mero registro histórico de reunião) e da sinopse (resumo sintético) porque desenvolve pormenorizadamente os fatos/dados apurados (em introdução, desenvolvimento e conclusão) e apresenta resultados ou recomendações fundamentadas.'
  },
  {
    id: 'top10_espb_068',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Requerimento administrativo versus requerimento legislativo',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Na rotina da Câmara Municipal coexistem requerimentos formulados por cidadãos ou servidores no protocolo geral e requerimentos apresentados por Vereadores no âmbito do processo legislativo. Acerca da natureza, estrutura e tramitação dos requerimentos, assinale a alternativa correta:',
    options: [
      'O protocolo geral pode recusar o recebimento de requerimento escrito de cidadão que não esteja assinado por advogado ou pareça improcedente.',
      'Todo requerimento legislativo formulado por Vereador em Plenário depende de sanção expressa do Prefeito no prazo de quinze dias úteis.',
      'No requerimento administrativo, a ausência de indicação do destinatário e dos fatos é suprida tacitamente pelo protocolo em sete dias.',
      'O requerimento administrativo dispensa advogado e não pode ter o protocolo recusado; já o legislativo é proposição regimental interna.'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Distinção exata entre as duas esferas: (1) Requerimento administrativo: manifestação do direito de petição (art. 5º, XXXIV, CF) ou pedido funcional do servidor, composto de autoridade destinatária, qualificação, exposição dos fatos/direito, pedido objetivo, fecho ("Nestes termos, pede deferimento."), data e assinatura — dispensa advogado (Súmula Vinculante 5 STF) e o protocolo não pode recusar seu recebimento (eventual inviabilidade se resolve em despacho fundamentado); (2) Requerimento legislativo: proposição regimental de parlamentar/comissão (v.g., informação, urgência, retirada de pauta, voto de pesar), decidida pelo Presidente ou Plenário, sem sanção do Prefeito.'
  },
  {
    id: 'top10_espb_069',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Despachos administrativos (ordinatório, interlocutório e decisório)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Em um processo administrativo de concessão de adicional funcional na Câmara Municipal, são lançados três atos sucessivos nos autos: primeiro, a chefia de protocolo escreve "Ao Setor de Recursos Humanos para instrução cadastral"; em seguida, a diretoria registra "Intime-se o interessado para juntar comprovante complementar em dez dias"; por fim, o Presidente lança o ato indeferindo o benefício por ausência de previsão legal, sem expor os fundamentos fáticos ou jurídicos da negativa. Sobre a classificação dos despachos e a validade do ato final (Lei nº 9.784/1999 por aplicação subsidiária/princípio da motivação), é correto afirmar que:',
    options: [
      'Os três atos constituem despachos ordinatórios de mero expediente, dispensando motivação escrita inclusive no ato final de indeferimento.',
      'Apenas o segundo ato exige motivação escrita aprofundada, pois despachos decisórios têm fundamentação implícita no poder hierárquico.',
      'São, em ordem, despacho ordinatório, interlocutório e decisório, sendo o último inválido por negar direito sem motivação explícita.',
      'Despacho decisório somente pode ser proferido em documento avulso separado do processo, jamais nos próprios autos administrativos.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Os despachos são decisões ou impulsos lançados nos autos pela autoridade competente: (1) Despacho ordinatório / de mero expediente: apenas movimenta o processo entre setores ("Ao RH para instrução"); (2) Despacho interlocutório: determina providência instrutória ou saneia questão incidental sem encerrar o feito; (3) Despacho decisório / conclusivo: acolhe ou rejeita o mérito do pedido. Pelo art. 50 da Lei nº 9.784/1999 (e princípio constitucional da motivação administrativa), atos que neguem, limitem ou afetem direitos ou interesses exigem motivação explícita, clara e congruente.'
  },
  {
    id: 'top10_espb_070',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Exposição de Motivos (modalidades e anexos na 3ª ed. MRPR)',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Segundo a 3ª edição do Manual de Redação da Presidência da República (2018), a Exposição de Motivos (EM) é expediente dirigido ao Chefe do Executivo por Ministro de Estado (ou autoridade equivalente nos entes subnacionais, conforme simetria organizacional) e assume duas modalidades principais conforme sua finalidade. Sobre essas modalidades e exigências instrutórias, assinale a alternativa correta:',
    options: [
      'Pode ser apenas informativa ou de submissão de ato normativo, devendo nesta última apontar o problema, a solução, pareceres e impactos.',
      'Destina-se exclusivamente à comunicação do Chefe do Executivo ao Presidente do Poder Legislativo para encaminhar vetos a projetos de lei.',
      'Quando submete projeto de ato normativo, dispensa o acompanhamento da minuta do texto legal e de qualquer estimativa de impacto financeiro.',
      'Substituiu integralmente as Portarias ministeriais e os Decretos regulamentares na esfera administrativa a partir da 3ª edição do MRPR.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Conforme o capítulo correspondente da 3ª ed. do MRPR: a Exposição de Motivos (EM) é o expediente pelo qual Ministros (ou Secretários) submetem assunto ao Chefe do Executivo, dividindo-se em duas finalidades clássicas: (1) informativa (para informar sobre determinado assunto ou submeter medida administrativa); e (2) propositiva de ato normativo (quando encaminha anteprojeto de lei, medida provisória ou decreto, devendo vir instruída com fundamentação objetiva do problema, da solução jurídica/técnica, dos custos/impactos e dos pareceres exigidos).'
  },
  {
    id: 'top10_espb_071',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Exposição de Motivos Interministerial e fecho obrigatório',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Quando uma proposta de decreto regulamentar ou anteprojeto de lei envolve simultaneamente as áreas de competência de duas ou mais Pastas (por exemplo, Fazenda e Planejamento), a 3ª edição do Manual de Redação da Presidência da República estabelece procedimento específico quanto à autoria, assinatura e fecho do expediente de encaminhamento ao Chefe do Executivo. Nessa hipótese, adota-se:',
    options: [
      'Uma Mensagem Intersetorial assinada apenas pelo titular da Pasta de menor orçamento, com o fecho "Atenciosamente," em razão da igualdade entre as Secretarias.',
      'Uma Exposição de Motivos Interministerial (ou conjunta), assinada por todos os titulares das Pastas envolvidas e encerrada obrigatoriamente com o fecho "Respeitosamente,".',
      'Dois ofícios individuais separados sem vinculação processual, encerrados com o fecho "Cordialmente," por se tratar de ato compartilhado.',
      'Um Aviso Conjunto assinado exclusivamente pela assessoria jurídica de cada órgão, utilizando-se o fecho "Atenciosamente," dirigido ao Chefe do Executivo.'
    ],
    gabarito: 'B',
    explicacao: 'Gabarito: B. Na sistemática da 3ª edição do MRPR (2018), quando o assunto tratado na Exposição de Motivos envolve a competência de mais de um Ministério (ou órgão equivalente), expede-se Exposição de Motivos Interministerial (EMI / conjunta), subscrita conjuntamente pelos respectivos titulares. Por ser sempre endereçada ao Chefe do Executivo (autoridade hierarquicamente superior aos signatários), seu fecho é obrigatoriamente "Respeitosamente,".'
  },
  {
    id: 'top10_espb_072',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Mensagem oficial e suas peculiaridades estruturais na 3ª ed. MRPR',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'No relacionamento institucional entre o Chefe do Poder Executivo e o Poder Legislativo — como no encaminhamento de projeto de lei, na abertura da sessão legislativa ou na comunicação das razões de veto — utiliza-se o expediente denominado "Mensagem". De acordo com as peculiaridades formais da Mensagem previstas na 3ª edição do Manual de Redação da Presidência da República (2018), é correto afirmar que:',
    options: [
      'Reproduz integralmente o Padrão Ofício comum, trazendo local e data no topo à direita e identificação completa do signatário sob a assinatura.',
      'É expediente utilizado exclusivamente por chefes de departamento interno da Câmara para solicitar material de expediente ao almoxarifado.',
      'Inicia-se com "MENSAGEM Nº ..." à esquerda, traz local e data ao final à direita e dispensa cargo abaixo da assinatura do Chefe do Executivo.',
      'Exige o emprego do fecho "Respeitosamente," seguido de duas testemunhas sempre que encaminhar razões de veto ao Presidente da Casa Legislativa.'
    ],
    gabarito: 'C',
    explicacao: 'Gabarito: C. Seção 6.3 da 3ª ed. do MRPR (2018): a Mensagem é o instrumento de comunicação oficial entre Chefes dos Poderes Públicos (notadamente do Chefe do Executivo ao Legislativo para enviar projetos de lei, vetos, abertura de sessão legislativa e informações de governo). Possui forma simplificada própria: identificação com "MENSAGEM Nº ..." à esquerda; texto com vocativo coletivo aos membros do Legislativo; local e data posicionados AO FINAL do texto (à direita); e não traz a identificação nominal/cargo do signatário abaixo da assinatura do Chefe do Executivo.'
  },
  {
    id: 'top10_espb_073',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Certidão, atestado, declaração e apostila administrativa',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'Um cidadão solicita gratuitamente ao setor competente da Câmara Municipal documento oficial que transcreva literalmente os registros funcionais constantes dos livros de posse e frequência de determinado exercício para defesa de direitos e esclarecimento de situação de interesse pessoal. Em paralelo, um fornecedor pede comprovação de desempenho anterior satisfatório na execução de serviço prestado à Casa. Os instrumentos jurídicos e documentais adequados a cada pedido são, respectivamente:',
    options: [
      'Atestado (por reproduzir livro permanente) e Apostila (por comprovar execução técnica contratual anterior).',
      'Declaração verbal (isenta de registro escrito) e Sinopse administrativa (para atestar capacidade operacional).',
      'Relatório de sindicância (assegurado pelo art. 5º, XXXIV, da CF) e Despacho ordinatório de protocolo.',
      'Certidão (cópia fiel de registros públicos permanentes) e Atestado (comprovação de fato de ciência funcional).'
    ],
    gabarito: 'D',
    explicacao: 'Gabarito: D. Distinção clássica entre atos enunciativos/declaratórios administrativos: (1) CERTIDÃO: cópia ou relato fiel extraído de livros, registros ou processos públicos preexistentes (cuja obtenção gratuita para defesa de direitos e esclarecimento de situações de interesse pessoal é garantia fundamental no art. 5º, XXXIV, "b", da CF); (2) ATESTADO: declaração escrita de autoridade que afirma a veracidade de fato ou situação (muitas vezes transitória ou técnica, ex.: atestado de capacidade técnica ou comparecimento) de que tem conhecimento direto em razão do cargo; (3) APOSTILA: averbação acessória de atualização em título ou contrato sem modificar sua substância.'
  },
  {
    id: 'top10_espb_074',
    subjectId: 'sub_cmc_esp',
    topicId: 'cmc_esp_8_3',
    area: 'Conhecimentos Específicos',
    points: 1.75,
    topicLabel: '8.3. Redação Oficial — Fechos e Documentos: Ofício circular, ofício conjunto, portaria e ordem de serviço',
    banca: 'Instituto Selecon',
    year: 2026,
    origem: 'Simulado Top 10 Selecon CMC 2026',
    sourceType: 'Inédita Nível Top 10 (Padrão Selecon 2026)',
    enunciado: 'No expediente ordinário de uma Câmara Municipal, quatro necessidades surgem simultaneamente: (1) expedir a mesma comunicação oficial de alerta de fechamento de sistema a todos os 27 gabinetes parlamentares; (2) expedir um único ofício assinado simultaneamente pelo Presidente da Câmara e pelo Prefeito Municipal ao Governador do Estado; (3) designar três servidores efetivos para compor comissão de inventário patrimonial; e (4) orientar diretamente a equipe de manutenção quanto à ordem diária de execução das tarefas internas. Os instrumentos próprios para os casos 1, 2, 3 e 4 são, respectivamente:',
    options: [
      'Ofício Circular, Ofício Conjunto, Portaria e Ordem de Serviço.',
      'Ofício Conjunto, Ofício Circular, Despacho Interlocutório e Sinopse.',
      'Memorando Único, Exposição de Motivos, Decreto Legislativo e Ata.',
      'Mensagem Circular, Resolução Plenária, Certidão de Serviço e Relatório.'
    ],
    gabarito: 'A',
    explicacao: 'Gabarito: A. Taxonomia precisa dos documentos e atos internos/externos: (1) OFÍCIO CIRCULAR: expediente de teor idêntico dirigido simultaneamente a diversos destinatários sob o Padrão Ofício; (2) OFÍCIO CONJUNTO: ofício subscrito simultaneamente por mais de uma autoridade remetente; (3) PORTARIA: ato administrativo ordinatório/normativo interno pelo qual a chefia expede determinações gerais ou especiais, designa comissões/servidores ou instaura sindicâncias/PADs; (4) ORDEM DE SERVIÇO: determinação administrativa direta sobre execução de rotinas ou tarefas operacionais internas.'
  }
];
