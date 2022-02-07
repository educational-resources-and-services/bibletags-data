const { doQuery } = require('./testUtils')

describe('Query: verse', async () => {

  it('Genesis 1:1', async () => {
    const verse = await doQuery(`
      verse(id: "01001001-uhb") {
        id
        usfm
      }
    `)

    verse.should.eql({
      id: "01001001-uhb",
      usfm: '\\p\n' +
        '\\w בְּ⁠רֵאשִׁ֖ית|lemma="רֵאשִׁית" strong="b:H72250" x-morph="He,R:Ncfsa" x-id="01h7N"\\w*\n' +
        '\\w בָּרָ֣א|lemma="בָּרָא" strong="H12541" x-morph="He,Vqp3ms" x-id="01RAp"\\w*\n' +
        '\\w אֱלֹהִ֑ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01cuO"\\w*\n' +
        '\\w אֵ֥ת|lemma="אֵת" strong="H08530" x-morph="He,To" x-id="01XDl"\\w*\n' +
        '\\w הַ⁠שָּׁמַ֖יִם|lemma="שָׁמַיִם" strong="d:H80640" x-morph="He,Td:Ncmpa" x-id="01vvO"\\w*\n' +
        '\\w וְ⁠אֵ֥ת|lemma="אֵת" strong="c:H08530" x-morph="He,C:To" x-id="01Q4j"\\w*\n' +
        '\\w הָ⁠אָֽרֶץ|lemma="אֶרֶץ" strong="d:H07760" x-morph="He,Td:Ncbsa" x-id="01VFX"\\w*׃'
    })
  })

  it('Revelation 22:1', async () => {
    const verse = await doQuery(`
      verse(id: "66022001-ugnt") {
        id
        usfm
      }
    `)

    verse.should.eql({
      id: '66022001-ugnt',
      usfm: '\\p\n' +
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
        '\\zApparatusJson {"words":[{"id":"666st","w":"καθαρον"},{"id":"66lao","w":"εδειξε"},"εδιξεν","υδατοσ","ζωησ","ωσ","εκπορευομενο¯","=θυ","υδατο%σ%","ζ%ωη%σ%","κρυσταλλον%","θρον%ου%","τ%ο%υ%","=θ^υ"],"critical":["WH,NA,SBL","RP:1-4,+1,5-18","ST:1,+2,3,+1,4-18","KJTR:1-3,+1,4-18"],"ancient":["01:1,+3,3-4,+4-5,7,+6,9,+7,11,13,12,+8,1,12,18","02:1-4,+9-10,7,+6,+11,10-12,+12-14,1,12,18"]}\\zApparatusJson*'
    })
  })

})