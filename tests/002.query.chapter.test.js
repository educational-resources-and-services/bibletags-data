const { doQuery } = require('./testUtils')

describe('Query: chapter', async () => {

  it('Genesis 1', async () => {
    const chapter = await doQuery(`
      chapter(bookId: 1, chapter: 1, versionId: "uhb") {
        id
        usfm
      }
    `)

    chapter.should.eql([
      {
        id: '01001001-uhb',
        usfm: '\\p\n' +
          '\\c 1\n' +
          '\\v 1\n' +
          '\\w בְּ⁠רֵאשִׁ֖ית|lemma="רֵאשִׁית" strong="b:H72250" x-morph="He,R:Ncfsa" x-id="01h7N"\\w*\n' +
          '\\w בָּרָ֣א|lemma="בָּרָא" strong="H12541" x-morph="He,Vqp3ms" x-id="01RAp"\\w*\n' +
          '\\w אֱלֹהִ֑ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01cuO"\\w*\n' +
          '\\w אֵ֥ת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01XDl"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֖יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01vvO"\\w*\n' +
          '\\w וְ⁠אֵ֥ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01Q4j"\\w*\n' +
          '\\w הָ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01VFX"\\w*׃'
      },
      {
        id: '01001002-uhb',
        usfm: '\\v 2\n' +
          '\\w וְ⁠הָ⁠אָ֗רֶץ|lemma="אֶרֶץ" strong="c:d:H07760" x-morph="He,C:Td:Ncbsa" x-id="01SU2"\\w*\n' +
          '\\w הָיְתָ֥ה|lemma="הָיָה" strong="H19610" x-morph="He,Vqp3fs" x-id="01tJr"\\w*\n' +
          '\\w תֹ֨הוּ֙|lemma="תֹּהוּ" strong="H84140" x-morph="He,Ncmsa" x-id="01kYH"\\w*\n' +
          '\\w וָ⁠בֹ֔הוּ|lemma="בֹּהוּ" strong="c:H09220" x-morph="He,C:Ncmsa" x-id="01Aud"\\w*\n' +
          '\\w וְ⁠חֹ֖שֶׁךְ|lemma="חֹשֶׁךְ" strong="c:H28220" x-morph="He,C:Ncmsa" x-id="018H0"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01R3M"\\w*־\\w פְּנֵ֣י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01wdx"\\w*\n' +
          '\\w תְה֑וֹם|lemma="תְּהוֹם" strong="H84150" x-morph="He,Ncbsa" x-id="01NjL"\\w*\n' +
          '\\w וְ⁠ר֣וּחַ|lemma="רוּחַ" strong="c:H73070" x-morph="He,C:Ncbsc" x-id="01FbN"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01AyJ"\\w*\n' +
          '\\w מְרַחֶ֖פֶת|lemma="רָחַף" strong="H73632" x-morph="He,Vprfsa" x-id="01NN8"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="0107l"\\w*־\\w פְּנֵ֥י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01MyZ"\\w*\n' +
          '\\w הַ⁠מָּֽיִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="019DZ"\\w*׃'
      },
      {
        id: '01001003-uhb',
        usfm: '\\v 3\n' +
          '\\w וַ⁠יֹּ֥אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01UIu"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01RZO"\\w*\n' +
          '\\w יְהִ֣י|lemma="הָיָה" strong="H19610" x-morph="He,Vqj3ms" x-id="01XlI"\\w*\n' +
          '\\w א֑וֹר|lemma="אוֹר" strong="H02160" x-morph="He,Ncbsa" x-id="01w2J"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01lLB"\\w*־\\w אֽוֹר|lemma="אוֹר" strong="H02160" x-morph="He,Ncbsa" x-id="01WWH"\\w*׃'
      },
      {
        id: '01001004-uhb',
        usfm: '\\v 4\n' +
          '\\w וַ⁠יַּ֧רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="01AnW"\\w*\n' +
          '\\w אֱלֹהִ֛ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01rzL"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="013RB"\\w*־\\w הָ⁠א֖וֹר|lemma="אוֹר" strong="d:H02160" x-morph="He,Td:Ncbsa" x-id="01lTA"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01NCs"\\w*־\\w ט֑וֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="019qr"\\w*\n' +
          '\\w וַ⁠יַּבְדֵּ֣ל|lemma="בָּדַל" strong="c:H09140" x-morph="He,C:Vhw3ms" x-id="01FJ6"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="010gJ"\\w*\n' +
          '\\w בֵּ֥ין|lemma="בֵּין" strong="H09960" x-morph="He,R" x-id="016Mj"\\w*\n' +
          '\\w הָ⁠א֖וֹר|lemma="אוֹר" strong="d:H02160" x-morph="He,Td:Ncbsa" x-id="01V9U"\\w*\n' +
          '\\w וּ⁠בֵ֥ין|lemma="בֵּין" strong="c:H09960" x-morph="He,C:R" x-id="013jC"\\w*\n' +
          '\\w הַ⁠חֹֽשֶׁךְ|lemma="חֹשֶׁךְ" strong="d:H28220" x-morph="He,Td:Ncmsa" x-id="01EmI"\\w*׃'
      },
      {
        id: '01001005-uhb',
        usfm: '\\v 5\n' +
          '\\w וַ⁠יִּקְרָ֨א|lemma="קָרָא" strong="c:H71210" x-morph="He,C:Vqw3ms" x-id="016jD"\\w*\n' +
          '\\w אֱלֹהִ֤ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Ba4"\\w* ׀\n' +
          '\\w לָ⁠אוֹר֙|lemma="אוֹר" strong="l:H02160" x-morph="He,Rd:Ncbsa" x-id="01ee6"\\w*\n' +
          '\\w י֔וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="01ukF"\\w*\n' +
          '\\w וְ⁠לַ⁠חֹ֖שֶׁךְ|lemma="חֹשֶׁךְ" strong="c:l:H28220" x-morph="He,C:Rd:Ncmsa" x-id="017ja"\\w*\n' +
          '\\w קָ֣רָא|lemma="קָרָא" strong="H71210" x-morph="He,Vqp3ms" x-id="017q7"\\w*\n' +
          '\\w לָ֑יְלָה|lemma="לַיִל" strong="H39150" x-morph="He,Ncmsa" x-id="01g1F"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01cmI"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="019yc"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01c1b"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="01CMl"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="019kR"\\w*\n' +
          '\\w אֶחָֽד|lemma="אֶחָד" strong="H02590" x-morph="He,Acmsa" x-id="019BK"\\w*׃פ'
      },
      {
        id: '01001006-uhb',
        usfm: '\\p\n' +
          '\\v 6\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01OAf"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01dJL"\\w*\n' +
          '\\w יְהִ֥י|lemma="הָיָה" strong="H19610" x-morph="He,Vqj3ms" x-id="014dF"\\w*\n' +
          '\\w רָקִ֖יעַ|lemma="רָקִיעַ" strong="H75490" x-morph="He,Ncmsa" x-id="01KO8"\\w*\n' +
          '\\w בְּ⁠ת֣וֹךְ|lemma="תָּוֶךְ" strong="b:H84320" x-morph="He,R:Ncmsc" x-id="01Q2u"\\w*\n' +
          '\\w הַ⁠מָּ֑יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01WmG"\\w*\n' +
          '\\w וִ⁠יהִ֣י|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqj3ms" x-id="01heL"\\w*\n' +
          '\\w מַבְדִּ֔יל|lemma="בָּדַל" strong="H09140" x-morph="He,Vhrmsa" x-id="01ibU"\\w*\n' +
          '\\w בֵּ֥ין|lemma="בֵּין" strong="H09960" x-morph="He,R" x-id="01NwS"\\w*\n' +
          '\\w מַ֖יִם|lemma="מַיִם" strong="H43250" x-morph="He,Ncmpa" x-id="01pt8"\\w*\n' +
          '\\w לָ⁠מָֽיִם|lemma="מַיִם" strong="l:H43250" x-morph="He,R:Ncmpa" x-id="01xvA"\\w*׃'
      },
      {
        id: '01001007-uhb',
        usfm: '\\v 7\n' +
          '\\w וַ⁠יַּ֣עַשׂ|lemma="עָשָׂה" strong="c:H62131" x-morph="He,C:Vqw3ms" x-id="01v3P"\\w*\n' +
          '\\w אֱלֹהִים֮|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Yfq"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="018TW"\\w*־\\w הָ⁠רָקִיעַ֒|lemma="רָקִיעַ" strong="d:H75490" x-morph="He,Td:Ncmsa" x-id="01E3E"\\w*\n' +
          '\\w וַ⁠יַּבְדֵּ֗ל|lemma="בָּדַל" strong="c:H09140" x-morph="He,C:Vhw3ms" x-id="01Fy2"\\w*\n' +
          '\\w בֵּ֤ין|lemma="בֵּין" strong="H09960" x-morph="He,R" x-id="01XjI"\\w*\n' +
          '\\w הַ⁠מַּ֨יִם֙|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01wAu"\\w*\n' +
          '\\w אֲשֶׁר֙|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="019c8"\\w*\n' +
          '\\w מִ⁠תַּ֣חַת|lemma="תַּחַת" strong="m:H84780" x-morph="He,R:R" x-id="01hTG"\\w*\n' +
          '\\w לָ⁠רָקִ֔יעַ|lemma="רָקִיעַ" strong="l:H75490" x-morph="He,Rd:Ncmsa" x-id="0109p"\\w*\n' +
          '\\w וּ⁠בֵ֣ין|lemma="בֵּין" strong="c:H09960" x-morph="He,C:R" x-id="01UQ4"\\w*\n' +
          '\\w הַ⁠מַּ֔יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="0101M"\\w*\n' +
          '\\w אֲשֶׁ֖ר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01Laz"\\w*\n' +
          '\\w מֵ⁠עַ֣ל|lemma="עַל" strong="m:H59211" x-morph="He,R:R" x-id="01AFe"\\w*\n' +
          '\\w לָ⁠רָקִ֑יעַ|lemma="רָקִיעַ" strong="l:H75490" x-morph="He,Rd:Ncmsa" x-id="01A1T"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01He0"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="01V2u"\\w*׃'
      },
      {
        id: '01001008-uhb',
        usfm: '\\v 8\n' +
          '\\w וַ⁠יִּקְרָ֧א|lemma="קָרָא" strong="c:H71210" x-morph="He,C:Vqw3ms" x-id="01Fxp"\\w*\n' +
          '\\w אֱלֹהִ֛ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Yun"\\w*\n' +
          '\\w לָֽ⁠רָקִ֖יעַ|lemma="רָקִיעַ" strong="l:H75490" x-morph="He,Rd:Ncmsa" x-id="01gZf"\\w*\n' +
          '\\w שָׁמָ֑יִם|lemma="שָׁמַיִם" strong="H80640" x-morph="He,Ncmpa" x-id="01dpe"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01Q9d"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="01sDq"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01fbb"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="01NuD"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="0167w"\\w*\n' +
          '\\w שֵׁנִֽי|lemma="שֵׁנִי" strong="H81450" x-morph="He,Aomsa" x-id="01uxw"\\w*׃פ'
      },
      {
        id: '01001009-uhb',
        usfm: '\\p\n' +
          '\\v 9\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01kxD"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01S9q"\\w*\n' +
          '\\w יִקָּו֨וּ|lemma="קָוָה" strong="H69602" x-morph="He,VNj3mp" x-id="01agC"\\w*\n' +
          '\\w הַ⁠מַּ֜יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01WB1"\\w*\n' +
          '\\w מִ⁠תַּ֤חַת|lemma="תַּחַת" strong="m:H84780" x-morph="He,R:R" x-id="01Gcr"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֨יִם֙|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="018kA"\\w*\n' +
          '\\w אֶל|lemma="אֵל" strong="H04130" x-morph="He,R" x-id="0179R"\\w*־\\w מָק֣וֹם|lemma="מָקוֹם" strong="H47250" x-morph="He,Ncmsa" x-id="01Ddq"\\w*\n' +
          '\\w אֶחָ֔ד|lemma="אֶחָד" strong="H02590" x-morph="He,Acmsa" x-id="01HwF"\\w*\n' +
          '\\w וְ⁠תֵרָאֶ֖ה|lemma="רָאָה" strong="c:H72000" x-morph="He,C:VNi3fs" x-id="01y7E"\\w*\n' +
          '\\w הַ⁠יַּבָּשָׁ֑ה|lemma="יַבָּשָׁה" strong="d:H30040" x-morph="He,Td:Ncfsa" x-id="01AcR"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01flp"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="015sU"\\w*׃'
      },
      {
        id: '01001010-uhb',
        usfm: '\\v 10\n' +
          '\\w וַ⁠יִּקְרָ֨א|lemma="קָרָא" strong="c:H71210" x-morph="He,C:Vqw3ms" x-id="01MW5"\\w*\n' +
          '\\w אֱלֹהִ֤ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="010Ra"\\w* ׀\n' +
          '\\w לַ⁠יַּבָּשָׁה֙|lemma="יַבָּשָׁה" strong="l:H30040" x-morph="He,Rd:Ncfsa" x-id="01O5B"\\w*\n' +
          '\\w אֶ֔רֶץ|lemma="אֶרֶץ" strong="H07760" x-morph="He,Ncbsa" x-id="01jTS"\\w*\n' +
          '\\w וּ⁠לְ⁠מִקְוֵ֥ה|lemma="מִקְוֶה" strong="c:l:H47233" x-morph="He,C:R:Ncmsc" x-id="01KUt"\\w*\n' +
          '\\w הַ⁠מַּ֖יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01wK4"\\w*\n' +
          '\\w קָרָ֣א|lemma="קָרָא" strong="H71210" x-morph="He,Vqp3ms" x-id="01fQb"\\w*\n' +
          '\\w יַמִּ֑ים|lemma="יָם" strong="H32200" x-morph="He,Ncmpa" x-id="01NDH"\\w*\n' +
          '\\w וַ⁠יַּ֥רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="01LMC"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01bmr"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01cFc"\\w*־\\w טֽוֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="01r3H"\\w*׃'
      },
      {
        id: '01001011-uhb',
        usfm: '\\v 11\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01efe"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="013dr"\\w*\n' +
          '\\w תַּֽדְשֵׁ֤א|lemma="דָּשָׁא" strong="H18760" x-morph="He,Vhj3fs" x-id="01MbD"\\w*\n' +
          '\\w הָ⁠אָ֨רֶץ֙|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01Lvu"\\w*\n' +
          '\\w דֶּ֔שֶׁא|lemma="דֶּשֶׁא" strong="H18770" x-morph="He,Ncmsa" x-id="01izn"\\w*\n' +
          '\\w עֵ֚שֶׂב|lemma="עֶשֶׂב" strong="H62120" x-morph="He,Ncmsa" x-id="01De7"\\w*\n' +
          '\\w מַזְרִ֣יעַ|lemma="זָרַע" strong="H22320" x-morph="He,Vhrmsa" x-id="01gFZ"\\w*\n' +
          '\\w זֶ֔רַע|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsa" x-id="01884"\\w*\n' +
          '\\w עֵ֣ץ|lemma="עֵץ" strong="H60860" x-morph="He,Ncmsc" x-id="019M2"\\w*\n' +
          '\\w פְּרִ֞י|lemma="פְּרִי" strong="H65290" x-morph="He,Ncmsa" x-id="011Vb"\\w*\n' +
          '\\w עֹ֤שֶׂה|lemma="עָשָׂה" strong="H62131" x-morph="He,Vqrmsa" x-id="01lOU"\\w*\n' +
          '\\w פְּרִי֙|lemma="פְּרִי" strong="H65290" x-morph="He,Ncmsa" x-id="01x3N"\\w*\n' +
          '\\w לְ⁠מִינ֔⁠וֹ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3ms" x-id="01zoS"\\w*\n' +
          '\\w אֲשֶׁ֥ר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01lLC"\\w*\n' +
          '\\w זַרְע⁠וֹ|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsc:Sp3ms" x-id="01IVa"\\w*־\\w ב֖⁠וֹ|lemma="" strong="b" x-morph="He,R:Sp3ms" x-id="014CM"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01bun"\\w*־\\w הָ⁠אָ֑רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01bBF"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01HWI"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="01HCk"\\w*׃'
      },
      {
        id: '01001012-uhb',
        usfm: '\\v 12\n' +
          '\\w וַ⁠תּוֹצֵ֨א|lemma="יָצָא" strong="c:H33180" x-morph="He,C:Vhw3fs" x-id="01dgl"\\w*\n' +
          '\\w הָ⁠אָ֜רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01cW9"\\w*\n' +
          '\\w דֶּ֠שֶׁא|lemma="דֶּשֶׁא" strong="H18770" x-morph="He,Ncmsa" x-id="01Uso"\\w*\n' +
          '\\w עֵ֣שֶׂב|lemma="עֶשֶׂב" strong="H62120" x-morph="He,Ncmsa" x-id="01jXM"\\w*\n' +
          '\\w מַזְרִ֤יעַ|lemma="זָרַע" strong="H22320" x-morph="He,Vhrmsa" x-id="01iI4"\\w*\n' +
          '\\w זֶ֨רַע֙|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsa" x-id="01Jt7"\\w*\n' +
          '\\w לְ⁠מִינֵ֔⁠הוּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3ms" x-id="015HL"\\w*\n' +
          '\\w וְ⁠עֵ֧ץ|lemma="עֵץ" strong="c:H60860" x-morph="He,C:Ncmsa" x-id="018le"\\w*\n' +
          '\\w עֹֽשֶׂה|lemma="עָשָׂה" strong="H62131" x-morph="He,Vqrmsa" x-id="01xAM"\\w*־\\w פְּרִ֛י|lemma="פְּרִי" strong="H65290" x-morph="He,Ncmsa" x-id="0111o"\\w*\n' +
          '\\w אֲשֶׁ֥ר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01Z9l"\\w*\n' +
          '\\w זַרְע⁠וֹ|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsc:Sp3ms" x-id="01mBd"\\w*־\\w ב֖⁠וֹ|lemma="" strong="b" x-morph="He,R:Sp3ms" x-id="012i6"\\w*\n' +
          '\\w לְ⁠מִינֵ֑⁠הוּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3ms" x-id="01H4J"\\w*\n' +
          '\\w וַ⁠יַּ֥רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="01OAy"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01ZW4"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01fS5"\\w*־\\w טֽוֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="01Tm7"\\w*׃'
      },
      {
        id: '01001013-uhb',
        usfm: '\\v 13\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01qVg"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="01ImJ"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01Xo4"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="01Lyq"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="010s1"\\w*\n' +
          '\\w שְׁלִישִֽׁי|lemma="שְׁלִישִׁי" strong="H79920" x-morph="He,Aomsa" x-id="017Ip"\\w*׃פ'
      },
      {
        id: '01001014-uhb',
        usfm: '\\p\n' +
          '\\v 14\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01mRU"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01ChP"\\w*\n' +
          '\\w יְהִ֤י|lemma="הָיָה" strong="H19610" x-morph="He,Vqj3ms" x-id="01ylW"\\w*\n' +
          '\\w מְאֹרֹת֙|lemma="מָאוֹר" strong="H39740" x-morph="He,Ncmpa" x-id="01CWJ"\\w*\n' +
          '\\w בִּ⁠רְקִ֣יעַ|lemma="רָקִיעַ" strong="b:H75490" x-morph="He,R:Ncmsc" x-id="01le4"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֔יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="019Hj"\\w*\n' +
          '\\w לְ⁠הַבְדִּ֕יל|lemma="בָּדַל" strong="l:H09140" x-morph="He,R:Vhc" x-id="01EPz"\\w*\n' +
          '\\w בֵּ֥ין|lemma="בֵּין" strong="H09960" x-morph="He,R" x-id="01aO9"\\w*\n' +
          '\\w הַ⁠יּ֖וֹם|lemma="יוֹם" strong="d:H31170" x-morph="He,Td:Ncmsa" x-id="01I3w"\\w*\n' +
          '\\w וּ⁠בֵ֣ין|lemma="בֵּין" strong="c:H09960" x-morph="He,C:R" x-id="01QmP"\\w*\n' +
          '\\w הַ⁠לָּ֑יְלָה|lemma="לַיִל" strong="d:H39150" x-morph="He,Td:Ncmsa" x-id="01ewY"\\w*\n' +
          '\\w וְ⁠הָי֤וּ|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqq3cp" x-id="01gJq"\\w*\n' +
          '\\w לְ⁠אֹתֹת֙|lemma="אוֹת" strong="l:H02260" x-morph="He,R:Ncbpa" x-id="01jme"\\w*\n' +
          '\\w וּ⁠לְ⁠מ֣וֹעֲדִ֔ים|lemma="מוֹעֵד" strong="c:l:H41500" x-morph="He,C:R:Ncmpa" x-id="01ax9"\\w*\n' +
          '\\w וּ⁠לְ⁠יָמִ֖ים|lemma="יוֹם" strong="c:l:H31170" x-morph="He,C:R:Ncmpa" x-id="01PON"\\w*\n' +
          '\\w וְ⁠שָׁנִֽים|lemma="שָׁנָה" strong="c:H81410" x-morph="He,C:Ncfpa" x-id="01hUJ"\\w*׃'
      },
      {
        id: '01001015-uhb',
        usfm: '\\v 15\n' +
          '\\w וְ⁠הָי֤וּ|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqq3cp" x-id="019So"\\w*\n' +
          '\\w לִ⁠מְאוֹרֹת֙|lemma="מָאוֹר" strong="l:H39740" x-morph="He,R:Ncmpa" x-id="01hmE"\\w*\n' +
          '\\w בִּ⁠רְקִ֣יעַ|lemma="רָקִיעַ" strong="b:H75490" x-morph="He,R:Ncmsc" x-id="01S5y"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֔יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01Gh4"\\w*\n' +
          '\\w לְ⁠הָאִ֖יר|lemma="אוֹר" strong="l:H02150" x-morph="He,R:Vhc" x-id="01LpV"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="017Oh"\\w*־\\w הָ⁠אָ֑רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01JDD"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01qy3"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="01Mbm"\\w*׃'
      },
      {
        id: '01001016-uhb',
        usfm: '\\v 16\n' +
          '\\w וַ⁠יַּ֣עַשׂ|lemma="עָשָׂה" strong="c:H62131" x-morph="He,C:Vqw3ms" x-id="01c7s"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="014NW"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01KEp"\\w*־\\w שְׁנֵ֥י|lemma="שְׁנַיִם" strong="H81470" x-morph="He,Acmdc" x-id="01Bwa"\\w*\n' +
          '\\w הַ⁠מְּאֹרֹ֖ת|lemma="מָאוֹר" strong="d:H39740" x-morph="He,Td:Ncmpa" x-id="01UUu"\\w*\n' +
          '\\w הַ⁠גְּדֹלִ֑ים|lemma="גָּדוֹל" strong="d:H14191" x-morph="He,Td:Aampa" x-id="01zYk"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01auW"\\w*־\\w הַ⁠מָּא֤וֹר|lemma="מָאוֹר" strong="d:H39740" x-morph="He,Td:Ncmsa" x-id="01V0l"\\w*\n' +
          '\\w הַ⁠גָּדֹל֙|lemma="גָּדוֹל" strong="d:H14191" x-morph="He,Td:Aamsa" x-id="01aS1"\\w*\n' +
          '\\w לְ⁠מֶמְשֶׁ֣לֶת|lemma="מֶמְשָׁלָה" strong="l:H44750" x-morph="He,R:Ncbsc" x-id="01woA"\\w*\n' +
          '\\w הַ⁠יּ֔וֹם|lemma="יוֹם" strong="d:H31170" x-morph="He,Td:Ncmsa" x-id="010bu"\\w*\n' +
          '\\w וְ⁠אֶת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01W7Z"\\w*־\\w הַ⁠מָּא֤וֹר|lemma="מָאוֹר" strong="d:H39740" x-morph="He,Td:Ncmsa" x-id="01F9D"\\w*\n' +
          '\\w הַ⁠קָּטֹן֙|lemma="קָטָן" strong="d:H69962" x-morph="He,Td:Aamsa" x-id="01y9j"\\w*\n' +
          '\\w לְ⁠מֶמְשֶׁ֣לֶת|lemma="מֶמְשָׁלָה" strong="l:H44750" x-morph="He,R:Ncbsc" x-id="01gdx"\\w*\n' +
          '\\w הַ⁠לַּ֔יְלָה|lemma="לַיִל" strong="d:H39150" x-morph="He,Td:Ncmsa" x-id="01qLr"\\w*\n' +
          '\\w וְ⁠אֵ֖ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01HQc"\\w*\n' +
          '\\w הַ⁠כּוֹכָבִֽים|lemma="כּוֹכָב" strong="d:H35560" x-morph="He,Td:Ncmpa" x-id="01X2V"\\w*׃'
      },
      {
        id: '01001017-uhb',
        usfm: '\\v 17\n' +
          '\\w וַ⁠יִּתֵּ֥ן|lemma="נָתַן" strong="c:H54140" x-morph="He,C:Vqw3ms" x-id="01Mg9"\\w*\n' +
          '\\w אֹתָ֛⁠ם|lemma="אֵת" strong="H08530" x-morph="He,To:Sp3mp" x-id="01Az6"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01qyl"\\w*\n' +
          '\\w בִּ⁠רְקִ֣יעַ|lemma="רָקִיעַ" strong="b:H75490" x-morph="He,R:Ncmsc" x-id="010vc"\\w*\n' +
          '\\w הַ⁠שָּׁמָ֑יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01Qln"\\w*\n' +
          '\\w לְ⁠הָאִ֖יר|lemma="אוֹר" strong="l:H02150" x-morph="He,R:Vhc" x-id="01nM0"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01BC8"\\w*־\\w הָ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="018iK"\\w*׃'
      },
      {
        id: '01001018-uhb',
        usfm: '\\v 18\n' +
          '\\w וְ⁠לִ⁠מְשֹׁל֙|lemma="מָשַׁל" strong="c:l:H49100" x-morph="He,C:R:Vqc" x-id="01YuS"\\w*\n' +
          '\\w בַּ⁠יּ֣וֹם|lemma="יוֹם" strong="b:H31170" x-morph="He,Rd:Ncmsa" x-id="01ExS"\\w*\n' +
          '\\w וּ⁠בַ⁠לַּ֔יְלָה|lemma="לַיִל" strong="c:b:H39150" x-morph="He,C:Rd:Ncmsa" x-id="01H38"\\w*\n' +
          '\\w וּֽ⁠לֲ⁠הַבְדִּ֔יל|lemma="בָּדַל" strong="c:l:H09140" x-morph="He,C:R:Vhc" x-id="01kwR"\\w*\n' +
          '\\w בֵּ֥ין|lemma="בֵּין" strong="H09960" x-morph="He,R" x-id="01BVl"\\w*\n' +
          '\\w הָ⁠א֖וֹר|lemma="אוֹר" strong="d:H02160" x-morph="He,Td:Ncbsa" x-id="01nKf"\\w*\n' +
          '\\w וּ⁠בֵ֣ין|lemma="בֵּין" strong="c:H09960" x-morph="He,C:R" x-id="01hNG"\\w*\n' +
          '\\w הַ⁠חֹ֑שֶׁךְ|lemma="חֹשֶׁךְ" strong="d:H28220" x-morph="He,Td:Ncmsa" x-id="01ppX"\\w*\n' +
          '\\w וַ⁠יַּ֥רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="010gb"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01SYy"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01v2I"\\w*־\\w טֽוֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="01qkn"\\w*׃'
      },
      {
        id: '01001019-uhb',
        usfm: '\\v 19\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01SKV"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="01Xlb"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01XUV"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="012BE"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="01gSq"\\w*\n' +
          '\\w רְבִיעִֽי|lemma="רְבִיעִי" strong="H72430" x-morph="He,Aomsa" x-id="01rKL"\\w*׃פ'
      },
      {
        id: '01001020-uhb',
        usfm: '\\p\n' +
          '\\v 20\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="015cM"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01bCp"\\w*\n' +
          '\\w יִשְׁרְצ֣וּ|lemma="שָׁרַץ" strong="H83170" x-morph="He,Vqi3mp" x-id="0185d"\\w*\n' +
          '\\w הַ⁠מַּ֔יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01nsz"\\w*\n' +
          '\\w שֶׁ֖רֶץ|lemma="שֶׁרֶץ" strong="H83180" x-morph="He,Ncmsc" x-id="01Wyw"\\w*\n' +
          '\\w נֶ֣פֶשׁ|lemma="נֶפֶשׁ" strong="H53150" x-morph="He,Ncbsa" x-id="01WOj"\\w*\n' +
          '\\w חַיָּ֑ה|lemma="חַי" strong="H24161" x-morph="He,Aafsa" x-id="01uCV"\\w*\n' +
          '\\w וְ⁠עוֹף֙|lemma="עוֹף" strong="c:H57750" x-morph="He,C:Ncmsa" x-id="01Sj1"\\w*\n' +
          '\\w יְעוֹפֵ֣ף|lemma="עוּף" strong="H57741" x-morph="He,Voi3ms" x-id="01w6e"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="012CY"\\w*־\\w הָ⁠אָ֔רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01U2L"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="015Rw"\\w*־\\w פְּנֵ֖י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01Ort"\\w*\n' +
          '\\w רְקִ֥יעַ|lemma="רָקִיעַ" strong="H75490" x-morph="He,Ncmsc" x-id="01uZc"\\w*\n' +
          '\\w הַ⁠שָּׁמָֽיִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01ueK"\\w*׃'
      },
      {
        id: '01001021-uhb',
        usfm: '\\v 21\n' +
          '\\w וַ⁠יִּבְרָ֣א|lemma="בָּרָא" strong="c:H12541" x-morph="He,C:Vqw3ms" x-id="01vUO"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Itb"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="018X0"\\w*־\\w הַ⁠תַּנִּינִ֖ם|lemma="תַּנִּין" strong="d:H85772" x-morph="He,Td:Ncmpa" x-id="01BRT"\\w*\n' +
          '\\w הַ⁠גְּדֹלִ֑ים|lemma="גָּדוֹל" strong="d:H14191" x-morph="He,Td:Aampa" x-id="01yRi"\\w*\n' +
          '\\w וְ⁠אֵ֣ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="016TF"\\w*\n' +
          '\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="015FX"\\w*־\\w נֶ֣פֶשׁ|lemma="נֶפֶשׁ" strong="H53150" x-morph="He,Ncbsa" x-id="01okd"\\w*\n' +
          '\\w הַֽ⁠חַיָּ֣ה|lemma="חַי" strong="d:H24161" x-morph="He,Td:Aafsa" x-id="01tGG"\\w* ׀\n' +
          '\\w הָֽ⁠רֹמֶ֡שֶׂת|lemma="רָמַשׂ" strong="d:H74300" x-morph="He,Td:Vqrfsa" x-id="01s6N"\\w*\n' +
          '\\w אֲשֶׁר֩|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01KK1"\\w*\n' +
          '\\w שָׁרְצ֨וּ|lemma="שָׁרַץ" strong="H83170" x-morph="He,Vqp3cp" x-id="01L45"\\w*\n' +
          '\\w הַ⁠מַּ֜יִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="01or2"\\w*\n' +
          '\\w לְ⁠מִֽינֵ⁠הֶ֗ם|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3mp" x-id="01IKk"\\w*\n' +
          '\\w וְ⁠אֵ֨ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01T7N"\\w*\n' +
          '\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01WxX"\\w*־\\w ע֤וֹף|lemma="עוֹף" strong="H57750" x-morph="He,Ncmsa" x-id="01Wgz"\\w*\n' +
          '\\w כָּנָף֙|lemma="כָּנָף" strong="H36710" x-morph="He,Ncfsa" x-id="01w8F"\\w*\n' +
          '\\w לְ⁠מִינֵ֔⁠הוּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3ms" x-id="01FvY"\\w*\n' +
          '\\w וַ⁠יַּ֥רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="01qqf"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="011AR"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01vNM"\\w*־\\w טֽוֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="017Xf"\\w*׃'
      },
      {
        id: '01001022-uhb',
        usfm: '\\v 22\n' +
          '\\w וַ⁠יְבָ֧רֶךְ|lemma="בָּרַךְ" strong="c:H12880" x-morph="He,C:Vpw3ms" x-id="01eDI"\\w*\n' +
          '\\w אֹתָ֛⁠ם|lemma="אֵת" strong="H08530" x-morph="He,To:Sp3mp" x-id="01lcu"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01IZn"\\w*\n' +
          '\\w לֵ⁠אמֹ֑ר|lemma="אָמַר" strong="l:H05590" x-morph="He,R:Vqc" x-id="01Ny2"\\w*\n' +
          '\\w פְּר֣וּ|lemma="פָּרָה" strong="H65090" x-morph="He,Vqv2mp" x-id="01dxC"\\w*\n' +
          '\\w וּ⁠רְב֗וּ|lemma="רָבָה" strong="c:H72351" x-morph="He,C:Vqv2mp" x-id="019aJ"\\w*\n' +
          '\\w וּ⁠מִלְא֤וּ|lemma="מָלֵא" strong="c:H43900" x-morph="He,C:Vqv2mp" x-id="01Vai"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01es7"\\w*־\\w הַ⁠מַּ֨יִם֙|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="013HK"\\w*\n' +
          '\\w בַּ⁠יַּמִּ֔ים|lemma="יָם" strong="b:H32200" x-morph="He,Rd:Ncmpa" x-id="019ee"\\w*\n' +
          '\\w וְ⁠הָ⁠ע֖וֹף|lemma="עוֹף" strong="c:d:H57750" x-morph="He,C:Td:Ncmsa" x-id="01O2i"\\w*\n' +
          '\\w יִ֥רֶב|lemma="רָבָה" strong="H72351" x-morph="He,Vqj3ms" x-id="01Fny"\\w*\n' +
          '\\w בָּ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="b:H07760" x-morph="He,Rd:Ncbsa" x-id="017fn"\\w*׃'
      },
      {
        id: '01001023-uhb',
        usfm: '\\v 23\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01qN8"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="01XOk"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="017Ap"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="01l3s"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsa" x-id="016Ci"\\w*\n' +
          '\\w חֲמִישִֽׁי|lemma="חֲמִישִׁי" strong="H25490" x-morph="He,Aomsa" x-id="01v5G"\\w*׃פ'
      },
      {
        id: '01001024-uhb',
        usfm: '\\p\n' +
          '\\v 24\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01RVD"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Xbu"\\w*\n' +
          '\\w תּוֹצֵ֨א|lemma="יָצָא" strong="H33180" x-morph="He,Vhj3fs" x-id="01e1D"\\w*\n' +
          '\\w הָ⁠אָ֜רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01VnJ"\\w*\n' +
          '\\w נֶ֤פֶשׁ|lemma="נֶפֶשׁ" strong="H53150" x-morph="He,Ncbsa" x-id="015NH"\\w*\n' +
          '\\w חַיָּה֙|lemma="חַי" strong="H24161" x-morph="He,Aafsa" x-id="01Zmx"\\w*\n' +
          '\\w לְ⁠מִינָ֔⁠הּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3fs" x-id="01IKP"\\w*\n' +
          '\\w בְּהֵמָ֥ה|lemma="בְּהֵמָה" strong="H09290" x-morph="He,Ncfsa" x-id="011om"\\w*\n' +
          '\\w וָ⁠רֶ֛מֶשׂ|lemma="רֶמֶשׂ" strong="c:H74310" x-morph="He,C:Ncmsa" x-id="01220"\\w*\n' +
          '\\w וְ⁠חַֽיְתוֹ|lemma="חַי" strong="c:H24163" x-morph="He,C:Ncfsc" x-id="01EqL"\\w*־\\w אֶ֖רֶץ|lemma="אֶרֶץ" strong="H07760" x-morph="He,Ncbsa" x-id="01eNc"\\w*\n' +
          '\\w לְ⁠מִינָ֑⁠הּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3fs" x-id="01288"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01WI2"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="01wZD"\\w*׃'
      },
      {
        id: '01001025-uhb',
        usfm: '\\v 25\n' +
          '\\w וַ⁠יַּ֣עַשׂ|lemma="עָשָׂה" strong="c:H62131" x-morph="He,C:Vqw3ms" x-id="01CPa"\\w*\n' +
          '\\w אֱלֹהִים֩|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01pvK"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01IZe"\\w*־\\w חַיַּ֨ת|lemma="חַי" strong="H24163" x-morph="He,Ncfsc" x-id="01HMe"\\w*\n' +
          '\\w הָ⁠אָ֜רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01jpf"\\w*\n' +
          '\\w לְ⁠מִינָ֗⁠הּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3fs" x-id="01wIk"\\w*\n' +
          '\\w וְ⁠אֶת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01sZF"\\w*־\\w הַ⁠בְּהֵמָה֙|lemma="בְּהֵמָה" strong="d:H09290" x-morph="He,Td:Ncfsa" x-id="01TM3"\\w*\n' +
          '\\w לְ⁠מִינָ֔⁠הּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3fs" x-id="01Ywq"\\w*\n' +
          '\\w וְ⁠אֵ֛ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01mAo"\\w*\n' +
          '\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01Q5L"\\w*־\\w רֶ֥מֶשׂ|lemma="רֶמֶשׂ" strong="H74310" x-morph="He,Ncmsc" x-id="01YoS"\\w*\n' +
          '\\w הָֽ⁠אֲדָמָ֖ה|lemma="אֲדָמָה" strong="d:H01270" x-morph="He,Td:Ncfsa" x-id="01rpZ"\\w*\n' +
          '\\w לְ⁠מִינֵ֑⁠הוּ|lemma="מִין" strong="l:H43270" x-morph="He,R:Ncmsc:Sp3ms" x-id="01GSA"\\w*\n' +
          '\\w וַ⁠יַּ֥רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="018Qm"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01OWB"\\w*\n' +
          '\\w כִּי|lemma="כִּי" strong="H35881" x-morph="He,C" x-id="01Cgx"\\w*־\\w טֽוֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="01Bxn"\\w*׃'
      },
      {
        id: '01001026-uhb',
        usfm: '\\v 26\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01DyS"\\w*\n' +
          '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01VMe"\\w*\n' +
          '\\w נַֽעֲשֶׂ֥ה|lemma="עָשָׂה" strong="H62131" x-morph="He,Vqi1cp" x-id="01TqE"\\w*\n' +
          '\\w אָדָ֛ם|lemma="אָדָם" strong="H01200" x-morph="He,Ncmsa" x-id="01Wjf"\\w*\n' +
          '\\w בְּ⁠צַלְמֵ֖⁠נוּ|lemma="צֶלֶם" strong="b:H67540" x-morph="He,R:Ncmsc:Sp1cp" x-id="01wuf"\\w*\n' +
          '\\w כִּ⁠דְמוּתֵ֑⁠נוּ|lemma="דְּמוּת" strong="k:H18230" x-morph="He,R:Ncfsc:Sp1cp" x-id="01SeI"\\w*\n' +
          '\\w וְ⁠יִרְדּוּ֩|lemma="רָדָה" strong="c:H72871" x-morph="He,C:Vqj3mp" x-id="01CXX"\\w*\n' +
          '\\w בִ⁠דְגַ֨ת|lemma="דָּגָה" strong="b:H17100" x-morph="He,R:Ncfsc" x-id="01zdL"\\w*\n' +
          '\\w הַ⁠יָּ֜ם|lemma="יָם" strong="d:H32200" x-morph="He,Td:Ncmsa" x-id="013hM"\\w*\n' +
          '\\w וּ⁠בְ⁠ע֣וֹף|lemma="עוֹף" strong="c:b:H57750" x-morph="He,C:R:Ncmsc" x-id="01OBd"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֗יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="012Pi"\\w*\n' +
          '\\w וּ⁠בַ⁠בְּהֵמָה֙|lemma="בְּהֵמָה" strong="c:b:H09290" x-morph="He,C:Rd:Ncfsa" x-id="01T5M"\\w*\n' +
          '\\w וּ⁠בְ⁠כָל|lemma="כֹּל" strong="c:b:H36050" x-morph="He,C:R:Ncmsc" x-id="013Ka"\\w*־\\w הָ⁠אָ֔רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="011PR"\\w*\n' +
          '\\w וּ⁠בְ⁠כָל|lemma="כֹּל" strong="c:b:H36050" x-morph="He,C:R:Ncmsc" x-id="0156x"\\w*־\\w הָ⁠רֶ֖מֶשׂ|lemma="רֶמֶשׂ" strong="d:H74310" x-morph="He,Td:Ncmsa" x-id="01CfN"\\w*\n' +
          '\\w הָֽ⁠רֹמֵ֥שׂ|lemma="רָמַשׂ" strong="d:H74300" x-morph="He,Td:Vqrmsa" x-id="012tv"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="015tq"\\w*־\\w הָ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01Gpw"\\w*׃'
      },
      {
        id: '01001027-uhb',
        usfm: '\\v 27\n' +
          '\\w וַ⁠יִּבְרָ֨א|lemma="בָּרָא" strong="c:H12541" x-morph="He,C:Vqw3ms" x-id="01a88"\\w*\n' +
          '\\w אֱלֹהִ֤ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Wb4"\\w* ׀\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01JUq"\\w*־\\w הָֽ⁠אָדָם֙|lemma="אָדָם" strong="d:H01200" x-morph="He,Td:Ncmsa" x-id="01AvX"\\w*\n' +
          '\\w בְּ⁠צַלְמ֔⁠וֹ|lemma="צֶלֶם" strong="b:H67540" x-morph="He,R:Ncmsc:Sp3ms" x-id="01xNp"\\w*\n' +
          '\\w בְּ⁠צֶ֥לֶם|lemma="צֶלֶם" strong="b:H67540" x-morph="He,R:Ncmsc" x-id="01F63"\\w*\n' +
          '\\w אֱלֹהִ֖ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01CtG"\\w*\n' +
          '\\w בָּרָ֣א|lemma="בָּרָא" strong="H12541" x-morph="He,Vqp3ms" x-id="01nkl"\\w*\n' +
          '\\w אֹת֑⁠וֹ|lemma="אֵת" strong="H08530" x-morph="He,To:Sp3ms" x-id="01SqP"\\w*\n' +
          '\\w זָכָ֥ר|lemma="זָכָר" strong="H21450" x-morph="He,Aamsa" x-id="01rNR"\\w*\n' +
          '\\w וּ⁠נְקֵבָ֖ה|lemma="נְקֵבָה" strong="c:H53470" x-morph="He,C:Ncfsa" x-id="01GoR"\\w*\n' +
          '\\w בָּרָ֥א|lemma="בָּרָא" strong="H12541" x-morph="He,Vqp3ms" x-id="01MK3"\\w*\n' +
          '\\w אֹתָֽ⁠ם|lemma="אֵת" strong="H08530" x-morph="He,To:Sp3mp" x-id="018zT"\\w*׃'
      },
      {
        id: '01001028-uhb',
        usfm: '\\v 28\n' +
          '\\w וַ⁠יְבָ֣רֶךְ|lemma="בָּרַךְ" strong="c:H12880" x-morph="He,C:Vpw3ms" x-id="01irU"\\w*\n' +
          '\\w אֹתָ⁠ם֮|lemma="אֵת" strong="H08530" x-morph="He,To:Sp3mp" x-id="01QS7"\\w*\n' +
          '\\w אֱלֹהִים֒|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01u4R"\\w*\n' +
          '\\w וַ⁠יֹּ֨אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01xR2"\\w*\n' +
          '\\w לָ⁠הֶ֜ם|lemma="" strong="l" x-morph="He,R:Sp3mp" x-id="01g9S"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01XXv"\\w*\n' +
          '\\w פְּר֥וּ|lemma="פָּרָה" strong="H65090" x-morph="He,Vqv2mp" x-id="01ccu"\\w*\n' +
          '\\w וּ⁠רְב֛וּ|lemma="רָבָה" strong="c:H72351" x-morph="He,C:Vqv2mp" x-id="01nq3"\\w*\n' +
          '\\w וּ⁠מִלְא֥וּ|lemma="מָלֵא" strong="c:H43900" x-morph="He,C:Vqv2mp" x-id="01pce"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01pVe"\\w*־\\w הָ⁠אָ֖רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01rKw"\\w*\n' +
          '\\w וְ⁠כִבְשֻׁ֑⁠הָ|lemma="כָּבַשׁ" strong="c:H35330" x-morph="He,C:Vqv2mp:Sp3fs" x-id="017Vo"\\w*\n' +
          '\\w וּ⁠רְד֞וּ|lemma="רָדָה" strong="c:H72871" x-morph="He,C:Vqv2mp" x-id="01rey"\\w*\n' +
          '\\w בִּ⁠דְגַ֤ת|lemma="דָּגָה" strong="b:H17100" x-morph="He,R:Ncfsc" x-id="01Knl"\\w*\n' +
          '\\w הַ⁠יָּם֙|lemma="יָם" strong="d:H32200" x-morph="He,Td:Ncmsa" x-id="014eC"\\w*\n' +
          '\\w וּ⁠בְ⁠ע֣וֹף|lemma="עוֹף" strong="c:b:H57750" x-morph="He,C:R:Ncmsc" x-id="01Sge"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֔יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="0113h"\\w*\n' +
          '\\w וּ⁠בְ⁠כָל|lemma="כֹּל" strong="c:b:H36050" x-morph="He,C:R:Ncmsc" x-id="01Mod"\\w*־\\w חַיָּ֖ה|lemma="חַי" strong="H24161" x-morph="He,Ncbsa" x-id="01sfX"\\w*\n' +
          '\\w הָֽ⁠רֹמֶ֥שֶׂת|lemma="רָמַשׂ" strong="d:H74300" x-morph="He,Td:Vqrfsa" x-id="017pp"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01gU5"\\w*־\\w הָ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="014sm"\\w*׃'
      },
      {
        id: '01001029-uhb',
        usfm: '\\v 29\n' +
          '\\w וַ⁠יֹּ֣אמֶר|lemma="אָמַר" strong="c:H05590" x-morph="He,C:Vqw3ms" x-id="01xPy"\\w*\n' +
          '\\w אֱלֹהִ֗ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Dii"\\w*\n' +
          '\\w הִנֵּה֩|lemma="הִנֵּה" strong="H20090" x-morph="He,Tm" x-id="018ge"\\w*\n' +
          '\\w נָתַ֨תִּי|lemma="נָתַן" strong="H54140" x-morph="He,Vqp1cs" x-id="01tuP"\\w*\n' +
          '\\w לָ⁠כֶ֜ם|lemma="" strong="l" x-morph="He,R:Sp2mp" x-id="017AD"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01hrp"\\w*־\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01oRH"\\w*־\\w עֵ֣שֶׂב|lemma="עֶשֶׂב" strong="H62120" x-morph="He,Ncmsa" x-id="01UDc"\\w* ׀\n' +
          '\\w זֹרֵ֣עַ|lemma="זָרַע" strong="H22320" x-morph="He,Vqrmsa" x-id="01KN5"\\w*\n' +
          '\\w זֶ֗רַע|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsa" x-id="01Qj6"\\w*\n' +
          '\\w אֲשֶׁר֙|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01Tsq"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01nPI"\\w*־\\w פְּנֵ֣י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01S2C"\\w*\n' +
          '\\w כָל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01OYl"\\w*־\\w הָ⁠אָ֔רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01dYZ"\\w*\n' +
          '\\w וְ⁠אֶת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01DXu"\\w*־\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01f5W"\\w*־\\w הָ⁠עֵ֛ץ|lemma="עֵץ" strong="d:H60860" x-morph="He,Td:Ncmsa" x-id="01RSq"\\w*\n' +
          '\\w אֲשֶׁר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01Vu2"\\w*־\\w בּ֥⁠וֹ|lemma="" strong="b" x-morph="He,R:Sp3ms" x-id="01I5a"\\w*\n' +
          '\\w פְרִי|lemma="פְּרִי" strong="H65290" x-morph="He,Ncmsc" x-id="01n1d"\\w*־\\w עֵ֖ץ|lemma="עֵץ" strong="H60860" x-morph="He,Ncmsa" x-id="01g4U"\\w*\n' +
          '\\w זֹרֵ֣עַ|lemma="זָרַע" strong="H22320" x-morph="He,Vqrmsa" x-id="01wed"\\w*\n' +
          '\\w זָ֑רַע|lemma="זֶרַע" strong="H22330" x-morph="He,Ncmsa" x-id="010Sb"\\w*\n' +
          '\\w לָ⁠כֶ֥ם|lemma="" strong="l" x-morph="He,R:Sp2mp" x-id="01Tzo"\\w*\n' +
          '\\w יִֽהְיֶ֖ה|lemma="הָיָה" strong="H19610" x-morph="He,Vqi3ms" x-id="01pLO"\\w*\n' +
          '\\w לְ⁠אָכְלָֽה|lemma="אׇכְלָה" strong="l:H04020" x-morph="He,R:Ncfsa" x-id="01m00"\\w*׃'
      },
      {
        id: '01001030-uhb',
        usfm: '\\v 30\n' +
          '\\w וּֽ⁠לְ⁠כָל|lemma="כֹּל" strong="c:l:H36050" x-morph="He,C:R:Ncmsc" x-id="01dAl"\\w*־\\w חַיַּ֣ת|lemma="חַי" strong="H24163" x-morph="He,Ncfsc" x-id="01zCe"\\w*\n' +
          '\\w הָ֠⁠אָרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01qa0"\\w*\n' +
          '\\w וּ⁠לְ⁠כָל|lemma="כֹּל" strong="c:l:H36050" x-morph="He,C:R:Ncmsc" x-id="01e5q"\\w*־\\w ע֨וֹף|lemma="עוֹף" strong="H57750" x-morph="He,Ncmsc" x-id="017LJ"\\w*\n' +
          '\\w הַ⁠שָּׁמַ֜יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01zeh"\\w*\n' +
          '\\w וּ⁠לְ⁠כֹ֣ל|lemma="כֹּל" strong="c:l:H36050" x-morph="He,C:R:Ncmsc" x-id="01UBy"\\w* ׀\n' +
          '\\w רוֹמֵ֣שׂ|lemma="רָמַשׂ" strong="H74300" x-morph="He,Vqrmsa" x-id="01sPw"\\w*\n' +
          '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="013AR"\\w*־\\w הָ⁠אָ֗רֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01t5a"\\w*\n' +
          '\\w אֲשֶׁר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01gxx"\\w*־\\w בּ⁠וֹ֙|lemma="" strong="b" x-morph="He,R:Sp3ms" x-id="012l3"\\w*\n' +
          '\\w נֶ֣פֶשׁ|lemma="נֶפֶשׁ" strong="H53150" x-morph="He,Ncbsa" x-id="01IUc"\\w*\n' +
          '\\w חַיָּ֔ה|lemma="חַי" strong="H24161" x-morph="He,Aafsa" x-id="01byM"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01S7Z"\\w*־\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01sm4"\\w*־\\w יֶ֥רֶק|lemma="יֶרֶק" strong="H34180" x-morph="He,Ncmsa" x-id="01THL"\\w*\n' +
          '\\w עֵ֖שֶׂב|lemma="עֶשֶׂב" strong="H62120" x-morph="He,Ncmsa" x-id="014Rz"\\w*\n' +
          '\\w לְ⁠אָכְלָ֑ה|lemma="אׇכְלָה" strong="l:H04020" x-morph="He,R:Ncfsa" x-id="01RfT"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01n6a"\\w*־\\w כֵֽן|lemma="כֵּן" strong="H36513" x-morph="He,D" x-id="01vE1"\\w*׃'
      },
      {
        id: '01001031-uhb',
        usfm: '\\v 31\n' +
          '\\w וַ⁠יַּ֤רְא|lemma="רָאָה" strong="c:H72000" x-morph="He,C:Vqw3ms" x-id="013Lh"\\w*\n' +
          '\\w אֱלֹהִים֙|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01Bn8"\\w*\n' +
          '\\w אֶת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01JuP"\\w*־\\w כָּל|lemma="כֹּל" strong="H36050" x-morph="He,Ncmsc" x-id="01x0M"\\w*־\\w אֲשֶׁ֣ר|lemma="אֲשֶׁר" strong="H08341" x-morph="He,Tr" x-id="01EwD"\\w*\n' +
          '\\w עָשָׂ֔ה|lemma="עָשָׂה" strong="H62131" x-morph="He,Vqp3ms" x-id="01mWe"\\w*\n' +
          '\\w וְ⁠הִנֵּה|lemma="הִנֵּה" strong="c:H20090" x-morph="He,C:Tm" x-id="01eq6"\\w*־\\w ט֖וֹב|lemma="טוֹב" strong="H28961" x-morph="He,Aamsa" x-id="01hGs"\\w*\n' +
          '\\w מְאֹ֑ד|lemma="מְאֹד" strong="H39660" x-morph="He,D" x-id="01LSJ"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="015O0"\\w*־\\w עֶ֥רֶב|lemma="עֶרֶב" strong="H61530" x-morph="He,Ncmsa" x-id="01YWV"\\w*\n' +
          '\\w וַֽ⁠יְהִי|lemma="הָיָה" strong="c:H19610" x-morph="He,C:Vqw3ms" x-id="01sTh"\\w*־\\w בֹ֖קֶר|lemma="בֹּקֶר" strong="H12420" x-morph="He,Ncmsa" x-id="01RxP"\\w*\n' +
          '\\w י֥וֹם|lemma="יוֹם" strong="H31170" x-morph="He,Ncmsc" x-id="01Tpe"\\w*\n' +
          '\\w הַ⁠שִּׁשִּֽׁי|lemma="שִׁשִּׁי" strong="d:H83450" x-morph="He,Td:Aomsa" x-id="01AVx"\\w*׃פ'
      }
    ])
  })

  it('Revelation 22', async () => {
    const chapter = await doQuery(`
      chapter(bookId: 66, chapter: 22, versionId: "ugnt") {
        id
        usfm
      }
    `)

    chapter.should.eql([
      {
        id: '66022001-ugnt',
        usfm: '\\p\n' +
          '\\c 22\n' +
          '\\v 1\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66TOB"\\w*\n' +
          '\\w ἔδειξέν|lemma="δεικνύω" strong="G11660" x-morph="Gr,V,IAA3,,S," x-id="66FNk"\\w*\n' +
          '\\w μοι|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1D,S," x-id="66PXU"\\w*\n' +
          '\\w ποταμὸν|lemma="ποταμός" strong="G42150" x-morph="Gr,N,,,,,AMS," x-id="66Qqp"\\w*\n' +
          '\\w ὕδατος|lemma="ὕδωρ" strong="G52040" x-morph="Gr,N,,,,,GNS," x-id="667PP"\\w*\n' +
          '\\w ζωῆς|lemma="ζωή" strong="G22220" x-morph="Gr,N,,,,,GFS," x-id="66Urs"\\w*\n' +
          '\\w λαμπρὸν|lemma="λαμπρός" strong="G29860" x-morph="Gr,NS,,,,AMS," x-id="66qtk"\\w*\n' +
          '\\w ὡς|lemma="ὡς" strong="G56130" x-morph="Gr,CS,,,,,,,," x-id="669YK"\\w*\n' +
          '\\w κρύσταλλον|lemma="κρύσταλλος" strong="G29300" x-morph="Gr,N,,,,,AMS," x-id="66enz"\\w*,\n' +
          '\\w ἐκπορευόμενον|lemma="ἐκπορεύομαι" strong="G16070" x-morph="Gr,V,PPM,AMS," x-id="66H6b"\\w*\n' +
          '\\w ἐκ|lemma="ἐκ" strong="G15370" x-morph="Gr,P,,,,,G,,," x-id="66XJH"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="66xPi"\\w*\n' +
          '\\w θρόνου|lemma="θρόνος" strong="G23620" x-morph="Gr,N,,,,,GMS," x-id="66aoV"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="66jrZ"\\w*\n' +
          '\\w Θεοῦ|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,GMS," x-id="66CU8"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66yTv"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66Cgt"\\w*\n' +
          '\\w Ἀρνίου|lemma="ἀρνίον" strong="G07210" x-morph="Gr,N,,,,,GNSD" x-id="66sAu"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"666st","w":"καθαρον"},{"id":"66lao","w":"εδειξε"},"εδιξεν","εκπορευομενο¯","=θυ","υδατο%σ%","ζ%ωη%σ%","κρυσταλλον%","θρον%ου%","τ%ο%υ%","=θ^υ"],"critical":["WH,NA,SBL","RP:1-4,+1,5-18","ST:1,+2,3,+1,4-18","KJTR:1-3,+1,4-18"],"ancient":["01:1,+3,3-9,+4,11,13,12,+5,1,12,18","02:1-4,+6-7,7-8,+8,10-12,+9-11,1,12,18"]}\\zApparatusJson*'
      },
      {
        id: '66022002-ugnt',
        usfm: '\\v 2\n' +
          '\\w ἐν|lemma="ἐν" strong="G17220" x-morph="Gr,P,,,,,D,,," x-id="66ZLA"\\w*\n' +
          '\\w μέσῳ|lemma="μέσος" strong="G33190" x-morph="Gr,NS,,,,DNS," x-id="664rS"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66DU8"\\w*\n' +
          '\\w πλατείας|lemma="πλατεῖα" strong="G41130" x-morph="Gr,N,,,,,GFS," x-id="66mFV"\\w*\n' +
          '\\w αὐτῆς|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GFS," x-id="66udJ"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66q71"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="66VVA"\\w*\n' +
          '\\w ποταμοῦ|lemma="ποταμός" strong="G42150" x-morph="Gr,N,,,,,GMS," x-id="66sVU"\\w*,\n' +
          '\\w ἐντεῦθεν|lemma="ἐντεῦθεν" strong="G17820" x-morph="Gr,D,,,,,,,,," x-id="660WS"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66SDD"\\w*\n' +
          '\\w ἐκεῖθεν|lemma="ἐκεῖθεν" strong="G15640" x-morph="Gr,D,,,,,,,,," x-id="66w28"\\w*,\n' +
          '\\w ξύλον|lemma="ξύλον" strong="G35860" x-morph="Gr,N,,,,,NNS," x-id="66FMk"\\w*\n' +
          '\\w ζωῆς|lemma="ζωή" strong="G22220" x-morph="Gr,N,,,,,GFS," x-id="66iaq"\\w*\n' +
          '\\w ποιοῦν|lemma="ποιέω" strong="G41600" x-morph="Gr,V,PPA,NNS," x-id="66S1d"\\w*\n' +
          '\\w καρποὺς|lemma="καρπός" strong="G25900" x-morph="Gr,N,,,,,AMP," x-id="66PoW"\\w*\n' +
          '\\w δώδεκα|lemma="δώδεκα" strong="G14270" x-morph="Gr,EN,,,,AMPI" x-id="66EkO"\\w*,\n' +
          '\\w κατὰ|lemma="κατά" strong="G25960" x-morph="Gr,P,,,,,A,,," x-id="664Ai"\\w*\n' +
          '\\w μῆνα|lemma="μήν" strong="G33760" x-morph="Gr,N,,,,,AMS," x-id="66YoG"\\w*\n' +
          '\\w ἕκαστον|lemma="ἕκαστος" strong="G15380" x-morph="Gr,EQ,,,,AMS," x-id="66TP5"\\w*\n' +
          '\\w ἀποδιδούς|lemma="ἀποδίδωμι" strong="G05910" x-morph="Gr,V,PPA,ANS," x-id="66a6J"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="666TQ"\\w*\n' +
          '\\w καρποὺς|lemma="καρπός" strong="G25900" x-morph="Gr,N,,,,,AMP," x-id="668N9"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GNS," x-id="665fR"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66qFi"\\w*\n' +
          '\\w τὰ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNP," x-id="66HrR"\\w*\n' +
          '\\w φύλλα|lemma="φύλλον" strong="G54440" x-morph="Gr,N,,,,,NNP," x-id="66mYQ"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66AL0"\\w*\n' +
          '\\w ξύλου|lemma="ξύλον" strong="G35860" x-morph="Gr,N,,,,,GNS," x-id="66V14"\\w*\n' +
          '\\w εἰς|lemma="εἰς" strong="G15190" x-morph="Gr,P,,,,,A,,," x-id="66ffV"\\w*\n' +
          '\\w θεραπείαν|lemma="θεραπεία" strong="G23220" x-morph="Gr,N,,,,,AFS," x-id="66PYQ"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNP," x-id="66Tf2"\\w*\n' +
          '\\w ἐθνῶν|lemma="ἔθνος" strong="G14840" x-morph="Gr,N,,,,,GNP," x-id="660ep"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66ZiG","w":"αποδιδουν"},{"id":"66rV0","w":"τον"},{"id":"66yFP","w":"καρπον"},{"id":"66kGU","w":"εντευθεν"},{"id":"66Nvy","w":"ενα"},"ε¯","πλατιας","ενθεν","$ιβ","ξυλων","εμ","τη%ς","π%λατε^ι^α^σ^","ποταμου%","εντευθεν%","ποιων","μηναν","α%υτου","θερα%π%ε%ιαν%"],"critical":["WH,KJTR,NA,SBL:1-19,+1-3,23-32","RP:1-20,+2-3,23-32","ST:1-10,+4,12-18,+5,19,+1-3,23-32"],"ancient":["01:+6,2-3,+7,5-8,+8,6,14-15,+9,17-21,15,23,6,25-26,31,+10,29-30,32","02:+11,2,+12-13,5-7,+14-15,6,11-13,+16,15-17,+17,19,+1-3,+18,6,25-26,7,28-29,+19,31-32"]}\\zApparatusJson*'
      },
      {
        id: '66022003-ugnt',
        usfm: '\\v 3\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66r76"\\w*\n' +
          '\\w πᾶν|lemma="πᾶς" strong="G39560" x-morph="Gr,EQ,,,,NNS," x-id="66sf5"\\w*\n' +
          '\\w κατάθεμα|lemma="κατάθεμα" strong="G26520" x-morph="Gr,N,,,,,NNS," x-id="661Ds"\\w*\n' +
          '\\w οὐκ|lemma="οὐ" strong="G37560" x-morph="Gr,D,,,,,,,,," x-id="66DeY"\\w*\n' +
          '\\w ἔσται|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IFM3,,S," x-id="66l6Y"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="66QVJ"\\w*.\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66TTV"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66mE7"\\w*\n' +
          '\\w θρόνος|lemma="θρόνος" strong="G23620" x-morph="Gr,N,,,,,NMS," x-id="665Wp"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="66jgm"\\w*\n' +
          '\\w Θεοῦ|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,GMS," x-id="66UdN"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66Lhu"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66G8x"\\w*\n' +
          '\\w Ἀρνίου|lemma="ἀρνίον" strong="G07210" x-morph="Gr,N,,,,,GNSD" x-id="66Eys"\\w*\n' +
          '\\w ἐν|lemma="ἐν" strong="G17220" x-morph="Gr,P,,,,,D,,," x-id="664LI"\\w*\n' +
          '\\w αὐτῇ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3DFS," x-id="66f72"\\w*\n' +
          '\\w ἔσται|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IFM3,,S," x-id="66c0q"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66BBT"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66yKu"\\w*\n' +
          '\\w δοῦλοι|lemma="δοῦλος" strong="G14010" x-morph="Gr,N,,,,,NMP," x-id="66r2Z"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66NLz"\\w*\n' +
          '\\w λατρεύσουσιν|lemma="λατρεύω" strong="G30000" x-morph="Gr,V,IFA3,,P," x-id="66J88"\\w*\n' +
          '\\w αὐτῷ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3DMS," x-id="66QMS"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66IHv","w":"καταναθεμα"},"καταγμα","=θυ"],"critical":["WH,RP,KJTR,NA,SBL","ST:1-2,+1,4-23"],"ancient":["01:1-2,+2,4-5,1,9-10,+3,1,10,14-16,5,1,19-23","02:1-6,1,8-10,+3,1,10,14-16,5,1,19-23"]}\\zApparatusJson*'
      },
      {
        id: '66022004-ugnt',
        usfm: '\\v 4\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66S0e"\\w*\n' +
          '\\w ὄψονται|lemma="ὁράω" strong="G37080" x-morph="Gr,V,IFM3,,P," x-id="66nlz"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,ANS," x-id="66pkD"\\w*\n' +
          '\\w πρόσωπον|lemma="πρόσωπον" strong="G43830" x-morph="Gr,N,,,,,ANS," x-id="66MX3"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66hJ7"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="661eD"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66m1j"\\w*\n' +
          '\\w ὄνομα|lemma="ὄνομα" strong="G36860" x-morph="Gr,N,,,,,NNS," x-id="66Egk"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="663HP"\\w*\n' +
          '\\w ἐπὶ|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,G,,," x-id="669rm"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNP," x-id="66L9m"\\w*\n' +
          '\\w μετώπων|lemma="μέτωπον" strong="G33590" x-morph="Gr,N,,,,,GNP," x-id="66vBn"\\w*\n' +
          '\\w αὐτῶν|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMP," x-id="66PgA"\\w*.\n' +
          '\\zApparatusJson {"words":["οψο¯ται"],"critical":["WH,RP,ST,KJTR,NA,SBL"],"ancient":["01:1,+1,3-5,1,3,8,5,1,10-13","02:1,+1,3-5,1,3,8,5,10-13"]}\\zApparatusJson*'
      },
      {
        id: '66022005-ugnt',
        usfm: '\\v 5\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66j0v"\\w*\n' +
          '\\w νὺξ|lemma="νύξ" strong="G35710" x-morph="Gr,N,,,,,NFS," x-id="66ecZ"\\w*\n' +
          '\\w οὐκ|lemma="οὐ" strong="G37560" x-morph="Gr,D,,,,,,,,," x-id="666Jm"\\w*\n' +
          '\\w ἔσται|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IFM3,,S," x-id="66yIG"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="66waw"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66KLZ"\\w*\n' +
          '\\w οὐκ|lemma="οὐ" strong="G37560" x-morph="Gr,D,,,,,,,,," x-id="66kKr"\\w*\n' +
          '\\w ἔχουσιν|lemma="ἔχω" strong="G21920" x-morph="Gr,V,IPA3,,P," x-id="66Kje"\\w*\n' +
          '\\w χρείαν|lemma="χρεία" strong="G55320" x-morph="Gr,N,,,,,AFS," x-id="66hye"\\w*\n' +
          '\\w φωτὸς|lemma="φῶς" strong="G54570" x-morph="Gr,N,,,,,GNS," x-id="66hLW"\\w*\n' +
          '\\w λύχνου|lemma="λύχνος" strong="G30880" x-morph="Gr,N,,,,,GMS," x-id="66SX0"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66NbO"\\w*\n' +
          '\\w φωτὸς|lemma="φῶς" strong="G54570" x-morph="Gr,N,,,,,GNS," x-id="669Y4"\\w*\n' +
          '\\w ἡλίου|lemma="ἥλιος" strong="G22460" x-morph="Gr,N,,,,,GMS," x-id="66CoH"\\w*,\n' +
          '\\w ὅτι|lemma="ὅτι" strong="G37540" x-morph="Gr,CS,,,,,,,," x-id="661VT"\\w*\n' +
          '\\w Κύριος|lemma="κύριος" strong="G29620" x-morph="Gr,N,,,,,NMS," x-id="662Q7"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66BNd"\\w*\n' +
          '\\w Θεὸς|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,NMS," x-id="66Mht"\\w*\n' +
          '\\w φωτιεῖ|lemma="φωτίζω" strong="G54610" x-morph="Gr,V,IFA3,,S," x-id="66WIz"\\w*\n' +
          '\\w ἐπ’|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,A,,," x-id="66uN9"\\w*\n' +
          '\\w αὐτούς|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3AMP," x-id="66HGY"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66YaF"\\w*\n' +
          '\\w βασιλεύσουσιν|lemma="βασιλεύω" strong="G09360" x-morph="Gr,V,IFA3,,P," x-id="667SO"\\w*\n' +
          '\\w εἰς|lemma="εἰς" strong="G15190" x-morph="Gr,P,,,,,A,,," x-id="66mDU"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="66B1L"\\w*\n' +
          '\\w αἰῶνας|lemma="αἰών" strong="G01650" x-morph="Gr,N,,,,,AMP," x-id="669JI"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66XQD"\\w*\n' +
          '\\w αἰώνων|lemma="αἰών" strong="G01650" x-morph="Gr,N,,,,,GMP," x-id="66VdQ"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66mHJ","w":"φως"},{"id":"66qs0","w":"φωτισει"},{"id":"66uN9","w":"[επ]"},{"id":"66FlI","w":"εκει"},{"id":"66uBY","w":"εχουσι"},{"id":"66QXC","w":"φωτιζει"},"χρεια¯","ϗ","=κς","=θς","τω¯","ουχ","εξουσι¯","χριαν"],"critical":["WH:1-12,+1,14-18,+2-3,21-28","RP:1-4,+4,6,9,7-8,11-19,21-28","ST:1-4,+4,6,9,7,+5,11-18,+6,21-28","KJTR:1-4,+4,6,9,7-8,11-18,+6,21-28","NA:1-18,+2,20-28","SBL:1-12,+1,14-18,+2,20-28"],"ancient":["01:1-5,1,3,8,+7,10-11,+8,10,14-15,+9,17,+10,19-21,1,23-26,+11,28","02:1-5,1,+12-14,10-11,1,+1,14-15,+9,17,+10,+2,20-21,1,23-28"]}\\zApparatusJson*'
      },
      {
        id: '66022006-ugnt',
        usfm: '\\p\n' +
          '\\v 6\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66G0Z"\\w*\n' +
          '\\w εἶπέν|lemma="λέγω" strong="G30040" x-morph="Gr,V,IAA3,,S," x-id="665x4"\\w*\n' +
          '\\w μοι|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1D,S," x-id="66JGo"\\w*,\n' +
          '\\w οὗτοι|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,NMP," x-id="66xsx"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66jnC"\\w*\n' +
          '\\w λόγοι|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,NMP," x-id="6607L"\\w*\n' +
          '\\w πιστοὶ|lemma="πιστός" strong="G41030" x-morph="Gr,NS,,,,NMP," x-id="66fzw"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="666Nb"\\w*\n' +
          '\\w ἀληθινοί|lemma="ἀληθινός" strong="G02280" x-morph="Gr,NS,,,,NMP," x-id="6643K"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66vi8"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66Fg8"\\w*\n' +
          '\\w Κύριος|lemma="κύριος" strong="G29620" x-morph="Gr,N,,,,,NMS," x-id="66gBS"\\w*,\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66kpp"\\w*\n' +
          '\\w Θεὸς|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,NMS," x-id="66YkA"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNP," x-id="66vqo"\\w*\n' +
          '\\w πνευμάτων|lemma="πνεῦμα" strong="G41510" x-morph="Gr,N,,,,,GNP," x-id="664u8"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66mc3"\\w*\n' +
          '\\w προφητῶν|lemma="προφήτης" strong="G43960" x-morph="Gr,N,,,,,GMP," x-id="66lWS"\\w*,\n' +
          '\\w ἀπέστειλεν|lemma="ἀποστέλλω" strong="G06490" x-morph="Gr,V,IAA3,,S," x-id="66JII"\\w*\n' +
          '\\w τὸν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMS," x-id="66f8U"\\w*\n' +
          '\\w ἄγγελον|lemma="ἄγγελος" strong="G00320" x-morph="Gr,N,,,,,AMS," x-id="66I9l"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66JVn"\\w*,\n' +
          '\\w δεῖξαι|lemma="δεικνύω" strong="G11660" x-morph="Gr,V,NAA,,,,," x-id="66Fyb"\\w*\n' +
          '\\w τοῖς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DMP," x-id="66ivd"\\w*\n' +
          '\\w δούλοις|lemma="δοῦλος" strong="G14010" x-morph="Gr,N,,,,,DMP," x-id="66Xhw"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66Bn4"\\w*\n' +
          '\\w ἃ|lemma="ὅς" strong="G37390" x-morph="Gr,RR,,,,ANP," x-id="66UIc"\\w*\n' +
          '\\w δεῖ|lemma="δέω" strong="G12100" x-morph="Gr,V,IPA3,,S," x-id="66JCN"\\w*\n' +
          '\\w γενέσθαι|lemma="γίνομαι" strong="G10960" x-morph="Gr,V,NAM,,,,," x-id="66nlt"\\w*\n' +
          '\\w ἐν|lemma="ἐν" strong="G17220" x-morph="Gr,P,,,,,D,,," x-id="66O4G"\\w*\n' +
          '\\w τάχει|lemma="τάχος" strong="G50340" x-morph="Gr,N,,,,,DNS," x-id="66dkI"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66Tns","w":"λεγει"},{"id":"66A3K","w":"ειπε"},{"id":"66tOl","w":"αγιων"},{"id":"66Gsr","w":"απεστειλε"},"=κς","=θς","=πνατων","απεστιλε¯","με","διξαι","δι","αληθεινοι","x{�πεστειλεν}","{απεστειλεν}","αγγελο¯"],"critical":["WH,NA,SBL","RP:1,+1,3-10,12,11,14-31","ST:1,+2,3-10,12,11,14-15,+3,18,+4,20-31","KJTR:1-10,12,11,14-15,+3,18-31"],"ancient":["01:1-7,1,9,1,11,+5,11,+6,15,+7,15,18,+8-9,20-22,+10,24-25,22,27,+11,29-31","02:1-7,1,+12,1,11,+5,11,+6,15-16,15,18,+13-14,20,+15,22-25,22,27-31"]}\\zApparatusJson*'
      },
      {
        id: '66022007-ugnt',
        usfm: '\\v 7\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66Y96"\\w*\n' +
          '\\w ἰδοὺ|lemma="ὁράω" strong="G37080" x-morph="Gr,IDMAA2,,S," x-id="66FFk"\\w*,\n' +
          '\\w ἔρχομαι|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,IPM1,,S," x-id="66IzK"\\w*\n' +
          '\\w ταχύ|lemma="ταχύ" strong="G50350" x-morph="Gr,D,,,,,,,,," x-id="66tgD"\\w*.\n' +
          '\\w μακάριος|lemma="μακάριος" strong="G31070" x-morph="Gr,NP,,,,NMS," x-id="662Z1"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="66nTn"\\w*\n' +
          '\\w τηρῶν|lemma="τηρέω" strong="G50830" x-morph="Gr,V,PPA,NMS," x-id="66p3Y"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="66kVC"\\w*\n' +
          '\\w λόγους|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,AMP," x-id="663lK"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66v9n"\\w*\n' +
          '\\w προφητείας|lemma="προφητεία" strong="G43940" x-morph="Gr,N,,,,,GFS," x-id="66pkz"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66n5Y"\\w*\n' +
          '\\w βιβλίου|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,GNS," x-id="66TnF"\\w*\n' +
          '\\w τούτου|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,GNS," x-id="66w1i"\\w*.\n' +
          '\\zApparatusJson {"words":["τηρω¯","x{προφητασ}","{προφητι%ασ}"],"critical":["WH,RP,NA,SBL","ST,KJTR:2-14"],"ancient":["01:1-6,+1,8-10,+2-3,12-14","02"]}\\zApparatusJson*'
      },
      {
        id: '66022008-ugnt',
        usfm: '\\p\n' +
          '\\v 8\n' +
          '\\w κἀγὼ|lemma="κἀγώ" strong="G25040" x-morph="Gr,RP,,,1N,S," x-id="66JhR"\\w*\n' +
          '\\w Ἰωάννης|lemma="Ἰωάννης" strong="G24910" x-morph="Gr,N,,,,,NMS," x-id="66uGg"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="666dv"\\w*\n' +
          '\\w βλέπων|lemma="βλέπω" strong="G09910" x-morph="Gr,V,PPA,NMS," x-id="66q2W"\\w*\n' +
          '\\w ταῦτα|lemma="οὗτος" strong="G37780" x-morph="Gr,RD,,,,ANP," x-id="66yqT"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="669Bs"\\w*\n' +
          '\\w ἀκούων|lemma="ἀκούω" strong="G01910" x-morph="Gr,V,PPA,NMS," x-id="66wVb"\\w*.\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66qS3"\\w*\n' +
          '\\w ὅτε|lemma="ὅτε" strong="G37530" x-morph="Gr,CS,,,,,,,," x-id="66bMU"\\w*\n' +
          '\\w ἤκουσα|lemma="ἀκούω" strong="G01910" x-morph="Gr,V,IAA1,,S," x-id="66jGv"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="6625D"\\w*\n' +
          '\\w ἔβλεψα|lemma="βλέπω" strong="G09910" x-morph="Gr,V,IAA1,,S," x-id="66ZOy"\\w*,\n' +
          '\\w ἔπεσα|lemma="πίπτω" strong="G40980" x-morph="Gr,V,IAA1,,S," x-id="66cQZ"\\w*\n' +
          '\\w προσκυνῆσαι|lemma="προσκυνέω" strong="G43520" x-morph="Gr,V,NAA,,,,," x-id="66jwd"\\w*\n' +
          '\\w ἔμπροσθεν|lemma="ἔμπροσθεν" strong="G17150" x-morph="Gr,PI,,,,G,,," x-id="66nEm"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66MEM"\\w*\n' +
          '\\w ποδῶν|lemma="πούς" strong="G42280" x-morph="Gr,N,,,,,GMP," x-id="66bqy"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="66QA5"\\w*\n' +
          '\\w ἀγγέλου|lemma="ἄγγελος" strong="G00320" x-morph="Gr,N,,,,,GMS," x-id="66HEq"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,GMS," x-id="66zEd"\\w*\n' +
          '\\w δεικνύοντός|lemma="δεικνύω" strong="G11660" x-morph="Gr,V,PPA,GMS," x-id="66cdJ"\\w*\n' +
          '\\w μοι|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1D,S," x-id="66gPP"\\w*\n' +
          '\\w ταῦτα|lemma="οὗτος" strong="G37780" x-morph="Gr,RD,,,,ANP," x-id="66mQn"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"662IL","w":"επεσον"},{"id":"66Qkn","w":"και"},{"id":"66RHz","w":"εγω"},{"id":"66sgz","w":"και"},"δικνυντος","εβλεπον","προ","διγνυοντος"],"critical":["WH,NA,SBL:1-3,7,6,4-5,8-23","RP:1-3,7,6,4-5,8-12,+1,14-23","ST:+2-3,2-7,+4,9-23","KJTR"],"ancient":["01:1-4,6-7,5-6,9-10,6,12-19,18,+5,22,5","02:1-3,7,6,4-6,9-10,6,+6,13-14,+7,17-19,18,+8,22,5"]}\\zApparatusJson*'
      },
      {
        id: '66022009-ugnt',
        usfm: '\\v 9\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="669DD"\\w*\n' +
          '\\w λέγει|lemma="λέγω" strong="G30040" x-morph="Gr,V,IPA3,,S," x-id="66Ygo"\\w*\n' +
          '\\w μοι|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1D,S," x-id="66Bhf"\\w*,\n' +
          '\\w ὅρα|lemma="ὁράω" strong="G37080" x-morph="Gr,V,MPA2,,S," x-id="662ci"\\w*\n' +
          '\\w μή|lemma="μή" strong="G33610" x-morph="Gr,D,,,,,,,,," x-id="66Kc7"\\w*;\n' +
          '\\w σύνδουλός|lemma="σύνδουλος" strong="G48890" x-morph="Gr,N,,,,,NMS," x-id="66jCZ"\\w*\n' +
          '\\w σού|lemma="σύ" strong="G47710" x-morph="Gr,RP,,,2G,S," x-id="66R2Q"\\w*\n' +
          '\\w εἰμι|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IPA1,,S," x-id="66X4D"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66d30"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66j6Q"\\w*\n' +
          '\\w ἀδελφῶν|lemma="ἀδελφός" strong="G00800" x-morph="Gr,N,,,,,GMP," x-id="66tvh"\\w*\n' +
          '\\w σου|lemma="σύ" strong="G47710" x-morph="Gr,RP,,,2G,S," x-id="66A1g"\\w*,\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66lUx"\\w*\n' +
          '\\w προφητῶν|lemma="προφήτης" strong="G43960" x-morph="Gr,N,,,,,GMP," x-id="66Hqh"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66zY1"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,GMP," x-id="66pVW"\\w*\n' +
          '\\w τηρούντων|lemma="τηρέω" strong="G50830" x-morph="Gr,V,PPA,GMP," x-id="66ery"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="66xfb"\\w*\n' +
          '\\w λόγους|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,AMP," x-id="66gAy"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66RP7"\\w*\n' +
          '\\w βιβλίου|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,GNS," x-id="663qs"\\w*\n' +
          '\\w τούτου|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,GNS," x-id="667HL"\\w*.\n' +
          '\\w τῷ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DMS," x-id="66MBL"\\w*\n' +
          '\\w Θεῷ|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,DMS," x-id="66e4a"\\w*\n' +
          '\\w προσκύνησον|lemma="προσκυνέω" strong="G43520" x-morph="Gr,V,MAA2,,S," x-id="66WkO"\\w*!\n' +
          '\\zApparatusJson {"words":[{"id":"66oTS","w":"γαρ"},"τω¯","=θω","προφητω¯","προσκυνησ%ο%ν%"],"critical":["WH,RP,NA,SBL","ST,KJTR:1-7,+1,8-25"],"ancient":["01:1-8,1,+2,11,7,+2,14,1,10,17-23,+3,25","02:1-8,1,10-11,7,10,+4,1,10,17-23,+3,+5"]}\\zApparatusJson*'
      },
      {
        id: '66022010-ugnt',
        usfm: '\\p\n' +
          '\\v 10\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66GJ0"\\w*\n' +
          '\\w λέγει|lemma="λέγω" strong="G30040" x-morph="Gr,V,IPA3,,S," x-id="66l71"\\w*\n' +
          '\\w μοι|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1D,S," x-id="665jG"\\w*,\n' +
          '\\w μὴ|lemma="μή" strong="G33610" x-morph="Gr,D,,,,,,,,," x-id="66n5J"\\w*\n' +
          '\\w σφραγίσῃς|lemma="σφραγίζω" strong="G49720" x-morph="Gr,V,SAA2,,S," x-id="66A3O"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="66rgV"\\w*\n' +
          '\\w λόγους|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,AMP," x-id="66xjl"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66kE0"\\w*\n' +
          '\\w προφητείας|lemma="προφητεία" strong="G43940" x-morph="Gr,N,,,,,GFS," x-id="669hZ"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66jqU"\\w*\n' +
          '\\w βιβλίου|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,GNS," x-id="66Tru"\\w*\n' +
          '\\w τούτου|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,GNS," x-id="6682h"\\w*;\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66eXv"\\w*\n' +
          '\\w καιρὸς|lemma="καιρός" strong="G25400" x-morph="Gr,N,,,,,NMS," x-id="66Q5j"\\w*\n' +
          '\\w γὰρ|lemma="γάρ" strong="G10630" x-morph="Gr,CC,,,,,,,," x-id="66nD7"\\w*\n' +
          '\\w ἐγγύς|lemma="ἐγγύς" strong="G14510" x-morph="Gr,D,,,,,,,,," x-id="665q0"\\w*\n' +
          '\\w ἐστιν|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IPA3,,S," x-id="666kj"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"664t5","w":"οτι"},"x{τουτουσ}","{}","ενγυς","β%ι%β%λ%ι%ο%υ%","εστι¯"],"critical":["WH,RP,NA,SBL","ST,KJTR:1-12,+1,13-14,16-17"],"ancient":["01:1-7,+2-3,8-15,+4,17","02:1-10,+5,12-16,+6"]}\\zApparatusJson*'
      },
      {
        id: '66022011-ugnt',
        usfm: '\\v 11\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="66EKw"\\w*\n' +
          '\\w ἀδικῶν|lemma="ἀδικέω" strong="G00910" x-morph="Gr,V,PPA,NMS," x-id="66wps"\\w*,\n' +
          '\\w ἀδικησάτω|lemma="ἀδικέω" strong="G00910" x-morph="Gr,V,MAA3,,S," x-id="66X4M"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="66cym"\\w*;\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66XYM"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66mkF"\\w*\n' +
          '\\w ῥυπαρὸς|lemma="ῥυπαρός" strong="G45080" x-morph="Gr,NS,,,,NMS," x-id="66tVY"\\w*,\n' +
          '\\w ῥυπανθήτω|lemma="ῥυπαίνω" strong="G45100" x-morph="Gr,V,MAP3,,S," x-id="667f7"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="66boj"\\w*;\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66oiX"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66iHp"\\w*\n' +
          '\\w δίκαιος|lemma="δίκαιος" strong="G13420" x-morph="Gr,NS,,,,NMS," x-id="66Q8V"\\w*,\n' +
          '\\w δικαιοσύνην|lemma="δικαιοσύνη" strong="G13430" x-morph="Gr,N,,,,,AFS," x-id="66LZR"\\w*\n' +
          '\\w ποιησάτω|lemma="ποιέω" strong="G41600" x-morph="Gr,V,MAA3,,S," x-id="66suF"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="66JXV"\\w*;\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66hro"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66GbS"\\w*\n' +
          '\\w ἅγιος|lemma="ἅγιος" strong="G00400" x-morph="Gr,NS,,,,NMS," x-id="66O8j"\\w*,\n' +
          '\\w ἁγιασθήτω|lemma="ἁγιάζω" strong="G00370" x-morph="Gr,V,MAP3,,S," x-id="66Gww"\\w*\n' +
          '\\w ἔτι|lemma="ἔτι" strong="G20890" x-morph="Gr,D,,,,,,,,," x-id="665Vs"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66lYk","w":"ρυπαρευθητω"},{"id":"66vaO","w":"ρυπων"},{"id":"66h1x","w":"ρυπωσατω"},{"id":"66av6","w":"δικαιωθητω"}],"critical":["WH,NA","RP,SBL:1-7,+1,9-20","ST:1-6,+2-3,9-12,+4,15-20","KJTR:1-12,+4,15-20"],"ancient":["01:1-5,1,7-8,4-5,1,12-14,4-5,1,18-19,4","02:1-5,1,12-14,4-5,1,18-19,4"]}\\zApparatusJson*'
      },
      {
        id: '66022012-ugnt',
        usfm: '\\p\n' +
          '\\v 12\n' +
          '\\w ἰδοὺ|lemma="ὁράω" strong="G37080" x-morph="Gr,IDMAA2,,S," x-id="66JnF"\\w*,\n' +
          '\\w ἔρχομαι|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,IPM1,,S," x-id="66fQ4"\\w*\n' +
          '\\w ταχύ|lemma="ταχύ" strong="G50350" x-morph="Gr,D,,,,,,,,," x-id="66lGx"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66CrQ"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66i05"\\w*\n' +
          '\\w μισθός|lemma="μισθός" strong="G34080" x-morph="Gr,N,,,,,NMS," x-id="66Ge7"\\w*\n' +
          '\\w μου|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1G,S," x-id="66PZF"\\w*\n' +
          '\\w μετ’|lemma="μετά" strong="G33260" x-morph="Gr,P,,,,,G,,," x-id="66WZG"\\w*\n' +
          '\\w ἐμοῦ|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1G,S," x-id="66rhz"\\w*,\n' +
          '\\w ἀποδοῦναι|lemma="ἀποδίδωμι" strong="G05910" x-morph="Gr,V,NAA,,,,," x-id="66A4z"\\w*\n' +
          '\\w ἑκάστῳ|lemma="ἕκαστος" strong="G15380" x-morph="Gr,RI,,,,DMS," x-id="66Hr5"\\w*\n' +
          '\\w ὡς|lemma="ὡς" strong="G56130" x-morph="Gr,CS,,,,,,,," x-id="661WE"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66mTE"\\w*\n' +
          '\\w ἔργον|lemma="ἔργον" strong="G20410" x-morph="Gr,N,,,,,NNS," x-id="66rua"\\w*\n' +
          '\\w ἐστὶν|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IPA3,,S," x-id="66DzD"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66vMa"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"667Qj","w":"εσται"},{"id":"66oq7","w":"και"},"αποδοθηναι","εστι¯"],"critical":["WH,NA,SBL","RP:1-14,+1,16","ST,KJTR:+2,1-14,16,+1"],"ancient":["01:1-9,+3,11-14,+4,16","02"]}\\zApparatusJson*'
      },
      {
        id: '66022013-ugnt',
        usfm: '\\v 13\n' +
          '\\w ἐγὼ|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1N,S," x-id="66atE"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66Fz2"\\w*\n' +
          '\\w Ἄλφα|lemma="ἄλφα" strong="G00010" x-morph="Gr,N,,,,,NNSI" x-id="6638x"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66Fcy"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66UOn"\\w*\n' +
          '\\w Ὦ|lemma="ὦ" strong="G55980" x-morph="Gr,N,,,,,NNSI" x-id="669go"\\w*,\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66TId"\\w*\n' +
          '\\w πρῶτος|lemma="πρῶτος" strong="G44130" x-morph="Gr,NS,,,,NMS," x-id="66UcU"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66m2x"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66NGv"\\w*\n' +
          '\\w ἔσχατος|lemma="ἔσχατος" strong="G20780" x-morph="Gr,NS,,,,NMS," x-id="66bLc"\\w*,\n' +
          '\\w ἡ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NFS," x-id="66uWR"\\w*\n' +
          '\\w ἀρχὴ|lemma="ἀρχή" strong="G07460" x-morph="Gr,N,,,,,NFS," x-id="66hIx"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66a5Y"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66fL3"\\w*\n' +
          '\\w τέλος|lemma="τέλος" strong="G50560" x-morph="Gr,N,,,,,NNS," x-id="66B9s"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66C7O","w":"ειμι"},{"id":"66SjB","w":"α"},"ϗ"],"critical":["WH,RP,NA,SBL","ST:1,+1,2,+2,4-6,13,9,16,7-8,14,10-11","KJTR:1,+1,2-6,13,9,16,7-8,14,10-11"],"ancient":["01:1-4,2,6-8,+3,7,11-13,+3,2,16","02:1-4,2,6,8,4,11-13,4,2,16"]}\\zApparatusJson*'
      },
      {
        id: '66022014-ugnt',
        usfm: '\\p\n' +
          '\\v 14\n' +
          '\\w μακάριοι|lemma="μακάριος" strong="G31070" x-morph="Gr,NP,,,,NMP," x-id="66Itf"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMP," x-id="66IOz"\\w*\n' +
          '\\w πλύνοντες|lemma="πλύνω" strong="G41500" x-morph="Gr,V,PPA,NMP," x-id="66ZFU"\\w*\n' +
          '\\w τὰς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AFP," x-id="66tWl"\\w*\n' +
          '\\w στολὰς|lemma="στολή" strong="G47490" x-morph="Gr,N,,,,,AFP," x-id="66A8R"\\w*\n' +
          '\\w αὐτῶν|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMP," x-id="66f0U"\\w*,\n' +
          '\\w ἵνα|lemma="ἵνα" strong="G24430" x-morph="Gr,CS,,,,,,,," x-id="66Voq"\\w*\n' +
          '\\w ἔσται|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IFM3,,S," x-id="663Ox"\\w*\n' +
          '\\w ἡ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NFS," x-id="66JFg"\\w*\n' +
          '\\w ἐξουσία|lemma="ἐξουσία" strong="G18490" x-morph="Gr,N,,,,,NFS," x-id="669oP"\\w*\n' +
          '\\w αὐτῶν|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMP," x-id="665Sf"\\w*\n' +
          '\\w ἐπὶ|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,A,,," x-id="66GSN"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,ANS," x-id="66nHV"\\w*\n' +
          '\\w ξύλον|lemma="ξύλον" strong="G35860" x-morph="Gr,N,,,,,ANS," x-id="66AMp"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66cHh"\\w*\n' +
          '\\w ζωῆς|lemma="ζωή" strong="G22220" x-morph="Gr,N,,,,,GFS," x-id="66dRN"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66aL3"\\w*\n' +
          '\\w τοῖς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DMP," x-id="66VeK"\\w*\n' +
          '\\w πυλῶσιν|lemma="πυλών" strong="G44400" x-morph="Gr,N,,,,,DMP," x-id="66ePp"\\w*\n' +
          '\\w εἰσέλθωσιν|lemma="εἰσέρχομαι" strong="G15250" x-morph="Gr,V,SAA3,,P," x-id="66jO9"\\w*\n' +
          '\\w εἰς|lemma="εἰς" strong="G15190" x-morph="Gr,P,,,,,A,,," x-id="66wKj"\\w*\n' +
          '\\w τὴν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AFS," x-id="66DEC"\\w*\n' +
          '\\w πόλιν|lemma="πόλις" strong="G41720" x-morph="Gr,N,,,,,AFS," x-id="66Q6z"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66wNT","w":"ποιουντες"},{"id":"66yEo","w":"εντολας"},{"id":"664nm","w":"αυτου"},"αυτω¯","ως","δε","μακαρι%οι","σ%τ%ολας","αυτω%ν","πολι¯"],"critical":["WH,NA,SBL","RP,ST,KJTR:1-2,+1,4,+2-3,7-23"],"ancient":["01:1-10,+4-6,9-10,12-23","02:+7,2-4,+8,6-10,+9,12-22,+10"]}\\zApparatusJson*'
      },
      {
        id: '66022015-ugnt',
        usfm: '\\v 15\n' +
          '\\w ἔξω|lemma="ἔξω" strong="G18540" x-morph="Gr,D,,,,,,,,," x-id="66Cvb"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66naw"\\w*\n' +
          '\\w κύνες|lemma="κύων" strong="G29650" x-morph="Gr,N,,,,,NMP," x-id="66Smc"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66cz6"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66AIo"\\w*\n' +
          '\\w φάρμακοι|lemma="φάρμακος" strong="G53330" x-morph="Gr,N,,,,,NMP," x-id="66Ur7"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66muY"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66br6"\\w*\n' +
          '\\w πόρνοι|lemma="πόρνος" strong="G42050" x-morph="Gr,N,,,,,NMP," x-id="66RRJ"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66vXi"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66bAA"\\w*\n' +
          '\\w φονεῖς|lemma="φονεύς" strong="G54060" x-morph="Gr,N,,,,,NMP," x-id="66eRL"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66tpP"\\w*\n' +
          '\\w οἱ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMP," x-id="66Wdg"\\w*\n' +
          '\\w εἰδωλολάτραι|lemma="εἰδωλολάτρης" strong="G14960" x-morph="Gr,N,,,,,NMP," x-id="66mVt"\\w*,\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66H4r"\\w*\n' +
          '\\w πᾶς|lemma="πᾶς" strong="G39560" x-morph="Gr,RI,,,,NMS," x-id="66qKj"\\w*\n' +
          '\\w φιλῶν|lemma="φιλέω" strong="G53680" x-morph="Gr,V,PPA,NMS," x-id="66LzQ"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66HgJ"\\w*\n' +
          '\\w ποιῶν|lemma="ποιέω" strong="G41600" x-morph="Gr,V,PPA,NMS," x-id="66Kbg"\\w*\n' +
          '\\w ψεῦδος|lemma="ψεῦδος" strong="G55790" x-morph="Gr,N,,,,,ANS," x-id="66NPq"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66LcQ","w":"δε"},{"id":"66Ome","w":"ο"},"ιδωλολατραι"],"critical":["WH,RP,NA,SBL","ST,KJTR:1,+1,2-17,+2,18-21"],"ancient":["01:1-4,2,6,4,2,9,4,2,12,4,2,+3,4,17,20,4,18,21","02:1-4,2,6,4,2,9,4,2,12,4,2,+3,4,17-18,4,20-21"]}\\zApparatusJson*'
      },
      {
        id: '66022016-ugnt',
        usfm: '\\p\n' +
          '\\v 16\n' +
          '\\w ἐγὼ|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1N,S," x-id="66sxp"\\w*,\n' +
          '\\w Ἰησοῦς|lemma="Ἰησοῦς" strong="G24240" x-morph="Gr,N,,,,,NMS," x-id="66g0F"\\w*,\n' +
          '\\w ἔπεμψα|lemma="πέμπω" strong="G39920" x-morph="Gr,V,IAA1,,S," x-id="66N8N"\\w*\n' +
          '\\w τὸν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMS," x-id="66oSE"\\w*\n' +
          '\\w ἄγγελόν|lemma="ἄγγελος" strong="G00320" x-morph="Gr,N,,,,,AMS," x-id="66oO6"\\w*\n' +
          '\\w μου|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1G,S," x-id="66gaG"\\w*,\n' +
          '\\w μαρτυρῆσαι|lemma="μαρτυρέω" strong="G31400" x-morph="Gr,V,NAA,,,,," x-id="66OTm"\\w*\n' +
          '\\w ὑμῖν|lemma="σύ" strong="G47710" x-morph="Gr,RP,,,2D,P," x-id="66DBr"\\w*\n' +
          '\\w ταῦτα|lemma="οὗτος" strong="G37780" x-morph="Gr,RD,,,,ANP," x-id="66DmX"\\w*\n' +
          '\\w ἐπὶ|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,D,,," x-id="66l6r"\\w*\n' +
          '\\w ταῖς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DFP," x-id="66gti"\\w*\n' +
          '\\w ἐκκλησίαις|lemma="ἐκκλησία" strong="G15770" x-morph="Gr,N,,,,,DFP," x-id="66EZP"\\w*.\n' +
          '\\w ἐγώ|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1N,S," x-id="66t4O"\\w*\n' +
          '\\w εἰμι|lemma="εἰμί" strong="G15100" x-morph="Gr,V,IPA1,,S," x-id="66dSO"\\w*\n' +
          '\\w ἡ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NFS," x-id="66YQ7"\\w*\n' +
          '\\w ῥίζα|lemma="ῥίζα" strong="G44910" x-morph="Gr,N,,,,,NFS," x-id="66dWQ"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66dVc"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66ITr"\\w*\n' +
          '\\w γένος|lemma="γένος" strong="G10850" x-morph="Gr,N,,,,,NNS," x-id="66so9"\\w*\n' +
          '\\w Δαυείδ|lemma="Δαυείδ" strong="G11380" x-morph="Gr,N,,,,,GMSI" x-id="665i1"\\w*,\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="660oJ"\\w*\n' +
          '\\w ἀστὴρ|lemma="ἀστήρ" strong="G07920" x-morph="Gr,N,,,,,NMS," x-id="66FDU"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="6650K"\\w*\n' +
          '\\w λαμπρός|lemma="λαμπρός" strong="G29860" x-morph="Gr,AR,,,,NMS," x-id="66BDV"\\w*,\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66OQF"\\w*\n' +
          '\\w πρωϊνός|lemma="πρωϊνός" strong="G44070" x-morph="Gr,AR,,,,NMS," x-id="66mZH"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66OCp","w":"δαυιδ"},{"id":"66CrR","w":"του"},{"id":"66Qiz","w":"δαβιδ"},{"id":"66Kzi","w":"και"},{"id":"66i8U","w":"ορθρινος"},"=ις","το¯","=δαδ","εν","προινος"],"critical":["WH","RP,NA,SBL:1-19,+1,21-26","ST:1-19,+2-3,21-24,+4-5","KJTR:1-19,+1,21-24,+4-5"],"ancient":["01:1,+6,3,+7,5-12,1,14-19,+8,21-22,21,24,21,26","02:1,+6,3-9,+9,11-12,1,14-19,+8,21-22,21,24,17,21,+10"]}\\zApparatusJson*'
      },
      {
        id: '66022017-ugnt',
        usfm: '\\v 17\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66OJ3"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NNS," x-id="66cN3"\\w*\n' +
          '\\w Πνεῦμα|lemma="πνεῦμα" strong="G41510" x-morph="Gr,N,,,,,NNS," x-id="66Fi2"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66c7v"\\w*\n' +
          '\\w ἡ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NFS," x-id="66mba"\\w*\n' +
          '\\w νύμφη|lemma="νύμφη" strong="G35650" x-morph="Gr,N,,,,,NFS," x-id="6634G"\\w*\n' +
          '\\w λέγουσιν|lemma="λέγω" strong="G30040" x-morph="Gr,V,IPA3,,P," x-id="66nOJ"\\w*,\n' +
          '\\w ἔρχου|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,MPM2,,S," x-id="66y5s"\\w*!\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66QfK"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="66x40"\\w*\n' +
          '\\w ἀκούων|lemma="ἀκούω" strong="G01910" x-morph="Gr,V,PPA,NMS," x-id="66dfb"\\w*\n' +
          '\\w εἰπάτω|lemma="λέγω" strong="G30040" x-morph="Gr,V,MAA3,,S," x-id="66NeT"\\w*,\n' +
          '\\w ἔρχου|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,MPM2,,S," x-id="66Dz5"\\w*!\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66oSw"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="66zbF"\\w*\n' +
          '\\w διψῶν|lemma="διψάω" strong="G13720" x-morph="Gr,V,PPA,NMS," x-id="66UAs"\\w*\n' +
          '\\w ἐρχέσθω|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,MPM3,,S," x-id="66vQV"\\w*;\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="66AII"\\w*\n' +
          '\\w θέλων|lemma="θέλω" strong="G23090" x-morph="Gr,V,PPA,NMS," x-id="66CJM"\\w*\n' +
          '\\w λαβέτω|lemma="λαμβάνω" strong="G29830" x-morph="Gr,V,MAA3,,S," x-id="66ETu"\\w*\n' +
          '\\w ὕδωρ|lemma="ὕδωρ" strong="G52040" x-morph="Gr,N,,,,,ANS," x-id="66X08"\\w*\n' +
          '\\w ζωῆς|lemma="ζωή" strong="G22220" x-morph="Gr,N,,,,,GFS," x-id="66U3R"\\w*\n' +
          '\\w δωρεάν|lemma="δωρεάν" strong="G14320" x-morph="Gr,D,,,,,,,,," x-id="66q6t"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66iFN","w":"ελθε"},{"id":"66Pao","w":"ελθε"},{"id":"66aXo","w":"ελθετω"},{"id":"66Odo","w":"και"},{"id":"66S3Q","w":"λαμβανετω"},{"id":"66XyX","w":"το"},"x{=ππνα}","{=πνα}","λεγουσι¯","=πνα","θελω¯"],"critical":["WH,RP,NA,SBL","ST,KJTR:1-7,+1,9-12,+2,14-16,+3-4,18-19,+5-6,21-23"],"ancient":["01:1,+7-8,1,6,+9,8,1,10-12,8,1,10,16-17,10,19-23","02:1-2,+10,1,5-8,1,10-12,8,1,10,16-17,10,+11,20-23"]}\\zApparatusJson*'
      },
      {
        id: '66022018-ugnt',
        usfm: '\\p\n' +
          '\\v 18\n' +
          '\\w μαρτυρῶ|lemma="μαρτυρέω" strong="G31400" x-morph="Gr,V,IPA1,,S," x-id="662Yd"\\w*\n' +
          '\\w ἐγὼ|lemma="ἐγώ" strong="G14730" x-morph="Gr,RP,,,1N,S," x-id="66v65"\\w*\n' +
          '\\w παντὶ|lemma="πᾶς" strong="G39560" x-morph="Gr,RI,,,,DMS," x-id="66YM2"\\w*\n' +
          '\\w τῷ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,DMS," x-id="6609a"\\w*\n' +
          '\\w ἀκούοντι|lemma="ἀκούω" strong="G01910" x-morph="Gr,V,PPA,DMS," x-id="66jey"\\w*\n' +
          '\\w τοὺς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AMP," x-id="66pSx"\\w*\n' +
          '\\w λόγους|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,AMP," x-id="665Gv"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66xoq"\\w*\n' +
          '\\w προφητείας|lemma="προφητεία" strong="G43940" x-morph="Gr,N,,,,,GFS," x-id="66rj0"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66WP5"\\w*\n' +
          '\\w βιβλίου|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,GNS," x-id="66ywN"\\w*\n' +
          '\\w τούτου|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,GNS," x-id="66a49"\\w*:\n' +
          '\\w ἐάν|lemma="ἐάν" strong="G14370" x-morph="Gr,CS,,,,,,,," x-id="66vgB"\\w*\n' +
          '\\w τις|lemma="τις" strong="G51000" x-morph="Gr,RI,,,,NMS," x-id="66HOW"\\w*\n' +
          '\\w ἐπιθῇ|lemma="ἐπιτίθημι" strong="G20070" x-morph="Gr,V,SAA3,,S," x-id="66tJj"\\w*\n' +
          '\\w ἐπ’|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,A,,," x-id="66DbI"\\w*\n' +
          '\\w αὐτά|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3ANP," x-id="66Fe3"\\w*,\n' +
          '\\w ἐπιθήσει|lemma="ἐπιτίθημι" strong="G20070" x-morph="Gr,V,IFA3,,S," x-id="66DDV"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66rFr"\\w*\n' +
          '\\w Θεὸς|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,NMS," x-id="66R2H"\\w*\n' +
          '\\w ἐπ’|lemma="ἐπί" strong="G19090" x-morph="Gr,P,,,,,A,,," x-id="667Jg"\\w*\n' +
          '\\w αὐτὸν|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3AMS," x-id="66Sg0"\\w*\n' +
          '\\w τὰς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,AFP," x-id="667h7"\\w*\n' +
          '\\w πληγὰς|lemma="πληγή" strong="G41270" x-morph="Gr,N,,,,,AFP," x-id="66s4w"\\w*\n' +
          '\\w τὰς|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,AFP," x-id="660WW"\\w*\n' +
          '\\w γεγραμμένας|lemma="γράφω" strong="G11250" x-morph="Gr,V,PEP,AFP," x-id="660oR"\\w*\n' +
          '\\w ἐν|lemma="ἐν" strong="G17220" x-morph="Gr,P,,,,,D,,," x-id="6623Q"\\w*\n' +
          '\\w τῷ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DNS," x-id="667uA"\\w*\n' +
          '\\w βιβλίῳ|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,DNS," x-id="66ja3"\\w*\n' +
          '\\w τούτῳ|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,DNS," x-id="66g9F"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"668rK","w":"επιθησαι"},{"id":"66I4Q","w":"συμμαρτυρουμαι"},{"id":"66Ww2","w":"γαρ"},{"id":"66X9q","w":"επιτιθη"},{"id":"66UaE","w":"προς"},{"id":"66VTl","w":"ταυτα"},"η","=θς","ε¯","x{}","{επ","αυτω}"],"critical":["WH,NA,SBL","RP:1-17,+1,19-30","ST,KJTR:+2-3,3,5-14,+4-6,18-27,29-30"],"ancient":["01:+7,1-14,18,16,22,19,+8,23-24,23,26,+9,4,29-30","02:1-19,+8,+10-12,23-24,23,26-27,4,29-30"]}\\zApparatusJson*'
      },
      {
        id: '66022019-ugnt',
        usfm: '\\v 19\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66HTB"\\w*\n' +
          '\\w ἐάν|lemma="ἐάν" strong="G14370" x-morph="Gr,CS,,,,,,,," x-id="66K3E"\\w*\n' +
          '\\w τις|lemma="τις" strong="G51000" x-morph="Gr,RI,,,,NMS," x-id="66hja"\\w*\n' +
          '\\w ἀφέλῃ|lemma="ἀφαιρέω" strong="G08510" x-morph="Gr,V,SAA3,,S," x-id="66CMX"\\w*\n' +
          '\\w ἀπὸ|lemma="ἀπό" strong="G05750" x-morph="Gr,P,,,,,G,,," x-id="66bHE"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="662P5"\\w*\n' +
          '\\w λόγων|lemma="λόγος" strong="G30560" x-morph="Gr,N,,,,,GMP," x-id="664RY"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66mBh"\\w*\n' +
          '\\w βιβλίου|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,GNS," x-id="66MhY"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="665E2"\\w*\n' +
          '\\w προφητείας|lemma="προφητεία" strong="G43940" x-morph="Gr,N,,,,,GFS," x-id="66jB0"\\w*\n' +
          '\\w ταύτης|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,GFS," x-id="66Dvv"\\w*,\n' +
          '\\w ἀφελεῖ|lemma="ἀφαιρέω" strong="G08510" x-morph="Gr,V,IFA3,,S," x-id="66ITb"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NMS," x-id="66NK1"\\w*\n' +
          '\\w Θεὸς|lemma="θεός" strong="G23160" x-morph="Gr,N,,,,,NMS," x-id="66rRY"\\w*\n' +
          '\\w τὸ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,ANS," x-id="66rla"\\w*\n' +
          '\\w μέρος|lemma="μέρος" strong="G33130" x-morph="Gr,N,,,,,ANS," x-id="66mr2"\\w*\n' +
          '\\w αὐτοῦ|lemma="αὐτός" strong="G08460" x-morph="Gr,RP,,,3GMS," x-id="66nkj"\\w*\n' +
          '\\w ἀπὸ|lemma="ἀπό" strong="G05750" x-morph="Gr,P,,,,,G,,," x-id="663RH"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GNS," x-id="66vLY"\\w*\n' +
          '\\w ξύλου|lemma="ξύλον" strong="G35860" x-morph="Gr,N,,,,,GNS," x-id="66RUi"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="6640o"\\w*\n' +
          '\\w ζωῆς|lemma="ζωή" strong="G22220" x-morph="Gr,N,,,,,GFS," x-id="66hmm"\\w*\n' +
          '\\w καὶ|lemma="καί" strong="G25320" x-morph="Gr,CC,,,,,,,," x-id="66DLr"\\w*\n' +
          '\\w ἐκ|lemma="ἐκ" strong="G15370" x-morph="Gr,P,,,,,G,,," x-id="66KZu"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66df9"\\w*\n' +
          '\\w πόλεως|lemma="πόλις" strong="G41720" x-morph="Gr,N,,,,,GFS," x-id="66rSB"\\w*\n' +
          '\\w τῆς|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GFS," x-id="66hzZ"\\w*\n' +
          '\\w ἁγίας|lemma="ἅγιος" strong="G00400" x-morph="Gr,AR,,,,GFS," x-id="66dya"\\w*,\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,GNP," x-id="66vET"\\w*\n' +
          '\\w γεγραμμένων|lemma="γράφω" strong="G11250" x-morph="Gr,V,PEP,GNP," x-id="66Z2N"\\w*\n' +
          '\\w ἐν|lemma="ἐν" strong="G17220" x-morph="Gr,P,,,,,D,,," x-id="66vEL"\\w*\n' +
          '\\w τῷ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,DNS," x-id="66svT"\\w*\n' +
          '\\w βιβλίῳ|lemma="βιβλίον" strong="G09750" x-morph="Gr,N,,,,,DNS," x-id="66bvC"\\w*\n' +
          '\\w τούτῳ|lemma="οὗτος" strong="G37780" x-morph="Gr,ED,,,,DNS," x-id="664zJ"\\w*.\n' +
          '\\zApparatusJson {"words":[{"id":"66DAp","w":"αφελοι"},{"id":"66lNn","w":"αφαιρη"},{"id":"66yKq","w":"βιβλου"},{"id":"66gs7","w":"αφαιρησει"},{"id":"66by8","w":"βιβλου"},{"id":"66eik","w":"και"},"αν","τουτων","προφητιας","αφελι","=θς"],"critical":["WH,NA,SBL","RP:1-12,+1,14-35","ST:1-3,+2,5-7,+3,10-12,+4,14-19,+5,22-29,+6,30-32,34-35","KJTR:1-7,+3,10-19,+5,22-29,+6,30-32,34-35"],"ancient":["01:1,+7,3-7,+8,8-10,+9,12,+10,14,+11,16-18,5,8,21,10,23,1,25,10,27,10,29,6,31-35","02:1-14,+11,16-18,5,8,21,10,23,1,10,27,10,29,6,31-35"]}\\zApparatusJson*'
      },
      {
        id: '66022020-ugnt',
        usfm: '\\p\n' +
          '\\v 20\n' +
          '\\w λέγει|lemma="λέγω" strong="G30040" x-morph="Gr,V,IPA3,,S," x-id="66wLv"\\w*\n' +
          '\\w ὁ|lemma="ὁ" strong="G35880" x-morph="Gr,RD,,,,NMS," x-id="660OE"\\w*\n' +
          '\\w μαρτυρῶν|lemma="μαρτυρέω" strong="G31400" x-morph="Gr,V,PPA,NMS," x-id="66Agh"\\w*\n' +
          '\\w ταῦτα|lemma="οὗτος" strong="G37780" x-morph="Gr,RD,,,,ANP," x-id="66VrY"\\w*,\n' +
          '\\w ναί|lemma="ναί" strong="G34830" x-morph="Gr,IR,,,,,,,," x-id="66QjE"\\w*,\n' +
          '\\w ἔρχομαι|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,IPM1,,S," x-id="66oNH"\\w*\n' +
          '\\w ταχύ|lemma="ταχύ" strong="G50350" x-morph="Gr,D,,,,,,,,," x-id="66wsv"\\w*.\n' +
          '\\w ἀμήν|lemma="ἀμήν" strong="G02810" x-morph="Gr,IE,,,,,,,," x-id="66BAU"\\w*!\n' +
          '\\w ἔρχου|lemma="ἔρχομαι" strong="G20640" x-morph="Gr,V,MPM2,,S," x-id="66axu"\\w*,\n' +
          '\\w Κύριε|lemma="κύριος" strong="G29620" x-morph="Gr,N,,,,,VMS," x-id="66ceZ"\\w*\n' +
          '\\w Ἰησοῦ|lemma="Ἰησοῦς" strong="G24240" x-morph="Gr,N,,,,,VMS," x-id="66pq9"\\w*!\n' +
          '\\zApparatusJson {"words":[{"id":"666mN","w":"ναι"},"λεγι","ειναι","=κε","=ιηυ","=ιυ"],"critical":["WH,NA,SBL","RP,ST,KJTR:1-8,+1,9-11"],"ancient":["01:+2,2-4,+3,5-7,9,+4-5","02:1-9,+4,+6"]}\\zApparatusJson*'
      },
      {
        id: '66022021-ugnt',
        usfm: '\\p\n' +
          '\\v 21\n' +
          '\\w ἡ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,NFS," x-id="66Lpd"\\w*\n' +
          '\\w χάρις|lemma="χάρις" strong="G54850" x-morph="Gr,N,,,,,NFS," x-id="66rzv"\\w*\n' +
          '\\w τοῦ|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMS," x-id="661Qo"\\w*\n' +
          '\\w Κυρίου|lemma="κύριος" strong="G29620" x-morph="Gr,N,,,,,GMS," x-id="66lkr"\\w*\n' +
          '\\w Ἰησοῦ|lemma="Ἰησοῦς" strong="G24240" x-morph="Gr,N,,,,,GMS," x-id="665ja"\\w*\n' +
          '\\w μετὰ|lemma="μετά" strong="G33260" x-morph="Gr,P,,,,,G,,," x-id="66fTG"\\w*\n' +
          '\\w τῶν|lemma="ὁ" strong="G35880" x-morph="Gr,EA,,,,GMP," x-id="66sCX"\\w*\n' +
          '\\w ἁγίων|lemma="ἅγιος" strong="G00400" x-morph="Gr,NS,,,,GMP," x-id="66gBo"\\w*.\n' +
          '\\w ἀμήν|lemma="ἀμήν" strong="G02810" x-morph="Gr,IE,,,,,,,," x-id="66A93"\\w*!\n' +
          '\\zApparatusJson {"words":[{"id":"66Yuu","w":"[χριστου]"},{"id":"66Yuu","w":"χριστου"},{"id":"66Yyh","w":"παντων"},{"id":"66nG8","w":"ημων"},{"id":"66Yuu","w":"χριστου"},{"id":"6695b","w":"υμων"},{"id":"66Yuu","w":"χριστου"},"=κυ","=ιυ"],"critical":["WH:1-5,+1,6-8","RP:1-5,+2,6,+3,7-9","ST:1-4,+4,5,+5,6,+3,+6,9","KJTR:1-4,+4,5,+7,6,+3,+6,9","NA,SBL:1-6,+3"],"ancient":["01:1-3,+8-9,6-9","02:1-3,+8-9,6,+3"]}\\zApparatusJson*'
      }
    ])
  })

})