const { getWordHashes, getWordsHash } = require('@bibletags/bibletags-ui-helper')

const { doMutation } = require('./testUtils')

const getVerseSubmissionInfo = ({ verseText, loc }) => {

  const params = {
    usfm: `\\v 1\n${verseText}`,
  }

  const wordsHash = getWordsHash(params)
  const wordHashes = JSON.stringify(getWordHashes(params)).replace(/([{,])"([^"]+)"/g, '$1$2')

  return {
    wordsHash,
    input: `{ loc: "${loc}", versionId: "esv", wordsHash: "${wordsHash}", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", wordHashes: ${wordHashes}}`,
  }

}

const submitInitialESVVerse = async ({ verseText, loc }) => {

  const { wordsHash, input } = getVerseSubmissionInfo({ verseText, loc })
  const submitWordHashesSet = await doMutation(`
    submitWordHashesSet(input: ${input}) {
      id
      tags
      status
    }
  `)

  submitWordHashesSet.should.eql({
    id: `${loc}-esv-${wordsHash}`,
    tags: [],
    status: "automatch",
  })

}

const submitInitialESVVerses = async verses => {
  
  await doMutation(`
    submitWordHashesSets(input: [ ${verses.map(verse => getVerseSubmissionInfo(verse).input).join(', ')} ])
  `)

}

describe('Mutation: submitWordHashesSet', async () => {

  it('Genesis 1:1 esv', async () => {

    await submitInitialESVVerse({
      verseText: `In the beginning, God created the heavens and the earth.`,
      loc: `01001001`,
    })

  })

  it('Genesis 1:1 esv (second, unnecessary time)', async () => {

    await submitInitialESVVerse({
      verseText: `In the beginning, God created the heavens and the earth.`,
      loc: `01001001`,
    })

  })

  it('Genesis 1:2 esv', async () => {

    await submitInitialESVVerse({
      verseText: `The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.`,
      loc: `01001002`,
    })

  })

  it('Ruth esv', async () => {

    await submitInitialESVVerses([
      { loc: `08001001`, verseText: `In the days when the judges ruled there was a famine in the land, and a man of Bethlehem in Judah went to sojourn in the country of Moab, he and his wife and his two sons.` },
      { loc: `08001002`, verseText: `The name of the man was Elimelech and the name of his wife Naomi, and the names of his two sons were Mahlon and Chilion. They were Ephrathites from Bethlehem in Judah. They went into the country of Moab and remained there.` },
      { loc: `08001003`, verseText: `But Elimelech, the husband of Naomi, died, and she was left with her two sons.` },
      { loc: `08001004`, verseText: `These took Moabite wives; the name of the one was Orpah and the name of the other Ruth. They lived there about ten years,` },
      { loc: `08001005`, verseText: `and both Mahlon and Chilion died, so that the woman was left without her two sons and her husband.` },
      { loc: `08001006`, verseText: `Then she arose with her daughters-in-law to return from the country of Moab, for she had heard in the fields of Moab that the Lord had visited his people and given them food.` },
      { loc: `08001007`, verseText: `So she set out from the place where she was with her two daughters-in-law, and they went on the way to return to the land of Judah.` },
      { loc: `08001008`, verseText: `But Naomi said to her two daughters-in-law, “Go, return each of you to her mother’s house. May the Lord deal kindly with you, as you have dealt with the dead and with me.` },
      { loc: `08001009`, verseText: `The Lord grant that you may find rest, each of you in the house of her husband!” Then she kissed them, and they lifted up their voices and wept.` },
      { loc: `08001010`, verseText: `And they said to her, “No, we will return with you to your people.”` },
      { loc: `08001011`, verseText: `But Naomi said, “Turn back, my daughters; why will you go with me? Have I yet sons in my womb that they may become your husbands?` },
      { loc: `08001012`, verseText: `Turn back, my daughters; go your way, for I am too old to have a husband. If I should say I have hope, even if I should have a husband this night and should bear sons,` },
      { loc: `08001013`, verseText: `would you therefore wait till they were grown? Would you therefore refrain from marrying? No, my daughters, for it is exceedingly bitter to me for your sake that the hand of the Lord has gone out against me.”` },
      { loc: `08001014`, verseText: `Then they lifted up their voices and wept again. And Orpah kissed her mother-in-law, but Ruth clung to her.` },
      { loc: `08001015`, verseText: `And she said, “See, your sister-in-law has gone back to her people and to her gods; return after your sister-in-law.”` },
      { loc: `08001016`, verseText: `But Ruth said, “Do not urge me to leave you or to return from following you. For where you go I will go, and where you lodge I will lodge. Your people shall be my people, and your God my God.` },
      { loc: `08001017`, verseText: `Where you die I will die, and there will I be buried. May the Lord do so to me and more also if anything but death parts me from you.”` },
      { loc: `08001018`, verseText: `And when Naomi saw that she was determined to go with her, she said no more.` },
      { loc: `08001019`, verseText: `So the two of them went on until they came to Bethlehem. And when they came to Bethlehem, the whole town was stirred because of them. And the women said, “Is this Naomi?”` },
      { loc: `08001020`, verseText: `She said to them, “Do not call me Naomi; call me Mara, for the Almighty has dealt very bitterly with me.` },
      { loc: `08001021`, verseText: `I went away full, and the Lord has brought me back empty. Why call me Naomi, when the Lord has testified against me and the Almighty has brought calamity upon me?”` },
      { loc: `08001022`, verseText: `So Naomi returned, and Ruth the Moabite her daughter-in-law with her, who returned from the country of Moab. And they came to Bethlehem at the beginning of barley harvest.` },
      { loc: `08002001`, verseText: `Now Naomi had a relative of her husband’s, a worthy man of the clan of Elimelech, whose name was Boaz.` },
      { loc: `08002002`, verseText: `And Ruth the Moabite said to Naomi, “Let me go to the field and glean among the ears of grain after him in whose sight I shall find favor.” And she said to her, “Go, my daughter.”` },
      { loc: `08002003`, verseText: `So she set out and went and gleaned in the field after the reapers, and she happened to come to the part of the field belonging to Boaz, who was of the clan of Elimelech.` },
      { loc: `08002004`, verseText: `And behold, Boaz came from Bethlehem. And he said to the reapers, “The Lord be with you!” And they answered, “The Lord bless you.”` },
      { loc: `08002005`, verseText: `Then Boaz said to his young man who was in charge of the reapers, “Whose young woman is this?”` },
      { loc: `08002006`, verseText: `And the servant who was in charge of the reapers answered, “She is the young Moabite woman, who came back with Naomi from the country of Moab.` },
      { loc: `08002007`, verseText: `She said, ‘Please let me glean and gather among the sheaves after the reapers.’ So she came, and she has continued from early morning until now, except for a short rest.”` },
      { loc: `08002008`, verseText: `Then Boaz said to Ruth, “Now, listen, my daughter, do not go to glean in another field or leave this one, but keep close to my young women.` },
      { loc: `08002009`, verseText: `Let your eyes be on the field that they are reaping, and go after them. Have I not charged the young men not to touch you? And when you are thirsty, go to the vessels and drink what the young men have drawn.”` },
      { loc: `08002010`, verseText: `Then she fell on her face, bowing to the ground, and said to him, “Why have I found favor in your eyes, that you should take notice of me, since I am a foreigner?”` },
      { loc: `08002011`, verseText: `But Boaz answered her, “All that you have done for your mother-in-law since the death of your husband has been fully told to me, and how you left your father and mother and your native land and came to a people that you did not know before.` },
      { loc: `08002012`, verseText: `The Lord repay you for what you have done, and a full reward be given you by the Lord, the God of Israel, under whose wings you have come to take refuge!”` },
      { loc: `08002013`, verseText: `Then she said, “I have found favor in your eyes, my lord, for you have comforted me and spoken kindly to your servant, though I am not one of your servants.”` },
      { loc: `08002014`, verseText: `And at mealtime Boaz said to her, “Come here and eat some bread and dip your morsel in the wine.” So she sat beside the reapers, and he passed to her roasted grain. And she ate until she was satisfied, and she had some left over.` },
      { loc: `08002015`, verseText: `When she rose to glean, Boaz instructed his young men, saying, “Let her glean even among the sheaves, and do not reproach her.` },
      { loc: `08002016`, verseText: `And also pull out some from the bundles for her and leave it for her to glean, and do not rebuke her.”` },
      { loc: `08002017`, verseText: `So she gleaned in the field until evening. Then she beat out what she had gleaned, and it was about an ephah of barley.` },
      { loc: `08002018`, verseText: `And she took it up and went into the city. Her mother-in-law saw what she had gleaned. She also brought out and gave her what food she had left over after being satisfied.` },
      { loc: `08002019`, verseText: `And her mother-in-law said to her, “Where did you glean today? And where have you worked? Blessed be the man who took notice of you.” So she told her mother-in-law with whom she had worked and said, “The man’s name with whom I worked today is Boaz.”` },
      { loc: `08002020`, verseText: `And Naomi said to her daughter-in-law, “May he be blessed by the Lord, whose kindness has not forsaken the living or the dead!” Naomi also said to her, “The man is a close relative of ours, one of our redeemers.”` },
      { loc: `08002021`, verseText: `And Ruth the Moabite said, “Besides, he said to me, ‘You shall keep close by my young men until they have finished all my harvest.’”` },
      { loc: `08002022`, verseText: `And Naomi said to Ruth, her daughter-in-law, “It is good, my daughter, that you go out with his young women, lest in another field you be assaulted.”` },
      { loc: `08002023`, verseText: `So she kept close to the young women of Boaz, gleaning until the end of the barley and wheat harvests. And she lived with her mother-in-law.` },
      { loc: `08003001`, verseText: `Then Naomi her mother-in-law said to her, “My daughter, should I not seek rest for you, that it may be well with you?` },
      { loc: `08003002`, verseText: `Is not Boaz our relative, with whose young women you were? See, he is winnowing barley tonight at the threshing floor.` },
      { loc: `08003003`, verseText: `Wash therefore and anoint yourself, and put on your cloak and go down to the threshing floor, but do not make yourself known to the man until he has finished eating and drinking.` },
      { loc: `08003004`, verseText: `But when he lies down, observe the place where he lies. Then go and uncover his feet and lie down, and he will tell you what to do.”` },
      { loc: `08003005`, verseText: `And she replied, “All that you say I will do.”` },
      { loc: `08003006`, verseText: `So she went down to the threshing floor and did just as her mother-in-law had commanded her.` },
      { loc: `08003007`, verseText: `And when Boaz had eaten and drunk, and his heart was merry, he went to lie down at the end of the heap of grain. Then she came softly and uncovered his feet and lay down.` },
      { loc: `08003008`, verseText: `At midnight the man was startled and turned over, and behold, a woman lay at his feet!` },
      { loc: `08003009`, verseText: `He said, “Who are you?” And she answered, “I am Ruth, your servant. Spread your wings over your servant, for you are a redeemer.”` },
      { loc: `08003010`, verseText: `And he said, “May you be blessed by the Lord, my daughter. You have made this last kindness greater than the first in that you have not gone after young men, whether poor or rich.` },
      { loc: `08003011`, verseText: `And now, my daughter, do not fear. I will do for you all that you ask, for all my fellow townsmen know that you are a worthy woman.` },
      { loc: `08003012`, verseText: `And now it is true that I am a redeemer. Yet there is a redeemer nearer than I.` },
      { loc: `08003013`, verseText: `Remain tonight, and in the morning, if he will redeem you, good; let him do it. But if he is not willing to redeem you, then, as the Lord lives, I will redeem you. Lie down until the morning.”` },
      { loc: `08003014`, verseText: `So she lay at his feet until the morning, but arose before one could recognize another. And he said, “Let it not be known that the woman came to the threshing floor.”` },
      { loc: `08003015`, verseText: `And he said, “Bring the garment you are wearing and hold it out.” So she held it, and he measured out six measures of barley and put it on her. Then she went into the city.` },
      { loc: `08003016`, verseText: `And when she came to her mother-in-law, she said, “How did you fare, my daughter?” Then she told her all that the man had done for her,` },
      { loc: `08003017`, verseText: `saying, “These six measures of barley he gave to me, for he said to me, ‘You must not go back empty-handed to your mother-in-law.’”` },
      { loc: `08003018`, verseText: `She replied, “Wait, my daughter, until you learn how the matter turns out, for the man will not rest but will settle the matter today.”` },
      { loc: `08004001`, verseText: `Now Boaz had gone up to the gate and sat down there. And behold, the redeemer, of whom Boaz had spoken, came by. So Boaz said, “Turn aside, friend; sit down here.” And he turned aside and sat down.` },
      { loc: `08004002`, verseText: `And he took ten men of the elders of the city and said, “Sit down here.” So they sat down.` },
      { loc: `08004003`, verseText: `Then he said to the redeemer, “Naomi, who has come back from the country of Moab, is selling the parcel of land that belonged to our relative Elimelech.` },
      { loc: `08004004`, verseText: `So I thought I would tell you of it and say, ‘Buy it in the presence of those sitting here and in the presence of the elders of my people.’ If you will redeem it, redeem it. But if you will not, tell me, that I may know, for there is no one besides you to redeem it, and I come after you.” And he said, “I will redeem it.”` },
      { loc: `08004005`, verseText: `Then Boaz said, “The day you buy the field from the hand of Naomi, you also acquire Ruth the Moabite, the widow of the dead, in order to perpetuate the name of the dead in his inheritance.”` },
      { loc: `08004006`, verseText: `Then the redeemer said, “I cannot redeem it for myself, lest I impair my own inheritance. Take my right of redemption yourself, for I cannot redeem it.”` },
      { loc: `08004007`, verseText: `Now this was the custom in former times in Israel concerning redeeming and exchanging: to confirm a transaction, the one drew off his sandal and gave it to the other, and this was the manner of attesting in Israel.` },
      { loc: `08004008`, verseText: `So when the redeemer said to Boaz, “Buy it for yourself,” he drew off his sandal.` },
      { loc: `08004009`, verseText: `Then Boaz said to the elders and all the people, “You are witnesses this day that I have bought from the hand of Naomi all that belonged to Elimelech and all that belonged to Chilion and to Mahlon.` },
      { loc: `08004010`, verseText: `Also Ruth the Moabite, the widow of Mahlon, I have bought to be my wife, to perpetuate the name of the dead in his inheritance, that the name of the dead may not be cut off from among his brothers and from the gate of his native place. You are witnesses this day.”` },
      { loc: `08004011`, verseText: `Then all the people who were at the gate and the elders said, “We are witnesses. May the Lord make the woman, who is coming into your house, like Rachel and Leah, who together built up the house of Israel. May you act worthily in Ephrathah and be renowned in Bethlehem,` },
      { loc: `08004012`, verseText: `and may your house be like the house of Perez, whom Tamar bore to Judah, because of the offspring that the Lord will give you by this young woman.”` },
      { loc: `08004013`, verseText: `So Boaz took Ruth, and she became his wife. And he went in to her, and the Lord gave her conception, and she bore a son.` },
      { loc: `08004014`, verseText: `Then the women said to Naomi, “Blessed be the Lord, who has not left you this day without a redeemer, and may his name be renowned in Israel!` },
      { loc: `08004015`, verseText: `He shall be to you a restorer of life and a nourisher of your old age, for your daughter-in-law who loves you, who is more to you than seven sons, has given birth to him.”` },
      { loc: `08004016`, verseText: `Then Naomi took the child and laid him on her lap and became his nurse.` },
      { loc: `08004017`, verseText: `And the women of the neighborhood gave him a name, saying, “A son has been born to Naomi.” They named him Obed. He was the father of Jesse, the father of David.` },
      { loc: `08004018`, verseText: `Now these are the generations of Perez: Perez fathered Hezron,` },
      { loc: `08004019`, verseText: `Hezron fathered Ram, Ram fathered Amminadab,` },
      { loc: `08004020`, verseText: `Amminadab fathered Nahshon, Nahshon fathered Salmon,` },
      { loc: `08004021`, verseText: `Salmon fathered Boaz, Boaz fathered Obed,` },
      { loc: `08004022`, verseText: `Obed fathered Jesse, and Jesse fathered David.` },
    ])

  }).timeout(5000)

  it('Jonah esv', async () => {

    await submitInitialESVVerses([
      { loc: `32001001`, verseText: `Now the word of the Lord came to Jonah the son of Amittai, saying,` },
      { loc: `32001002`, verseText: `“Arise, go to Nineveh, that great city, and call out against it, for their evil has come up before me.”` },
      { loc: `32001003`, verseText: `But Jonah rose to flee to Tarshish from the presence of the Lord. He went down to Joppa and found a ship going to Tarshish. So he paid the fare and went down into it, to go with them to Tarshish, away from the presence of the Lord.` },
      { loc: `32001004`, verseText: `But the Lord hurled a great wind upon the sea, and there was a mighty tempest on the sea, so that the ship threatened to break up.` },
      { loc: `32001005`, verseText: `Then the mariners were afraid, and each cried out to his god. And they hurled the cargo that was in the ship into the sea to lighten it for them. But Jonah had gone down into the inner part of the ship and had lain down and was fast asleep.` },
      { loc: `32001006`, verseText: `So the captain came and said to him, “What do you mean, you sleeper? Arise, call out to your god! Perhaps the god will give a thought to us, that we may not perish.”` },
      { loc: `32001007`, verseText: `And they said to one another, “Come, let us cast lots, that we may know on whose account this evil has come upon us.” So they cast lots, and the lot fell on Jonah.` },
      { loc: `32001008`, verseText: `Then they said to him, “Tell us on whose account this evil has come upon us. What is your occupation? And where do you come from? What is your country? And of what people are you?”` },
      { loc: `32001009`, verseText: `And he said to them, “I am a Hebrew, and I fear the Lord, the God of heaven, who made the sea and the dry land.”` },
      { loc: `32001010`, verseText: `Then the men were exceedingly afraid and said to him, “What is this that you have done!” For the men knew that he was fleeing from the presence of the Lord, because he had told them.` },
      { loc: `32001011`, verseText: `Then they said to him, “What shall we do to you, that the sea may quiet down for us?” For the sea grew more and more tempestuous.` },
      { loc: `32001012`, verseText: `He said to them, “Pick me up and hurl me into the sea; then the sea will quiet down for you, for I know it is because of me that this great tempest has come upon you.”` },
      { loc: `32001013`, verseText: `Nevertheless, the men rowed hard to get back to dry land, but they could not, for the sea grew more and more tempestuous against them.` },
      { loc: `32001014`, verseText: `Therefore they called out to the Lord, “O Lord, let us not perish for this man’s life, and lay not on us innocent blood, for you, O Lord, have done as it pleased you.”` },
      { loc: `32001015`, verseText: `So they picked up Jonah and hurled him into the sea, and the sea ceased from its raging.` },
      { loc: `32001016`, verseText: `Then the men feared the Lord exceedingly, and they offered a sacrifice to the Lord and made vows.` },
      { loc: `32001017`, verseText: `And the Lord appointed a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.` },
      { loc: `32002001`, verseText: `Then Jonah prayed to the Lord his God from the belly of the fish,` },
      { loc: `32002002`, verseText: `saying, “I called out to the Lord, out of my distress, and he answered me; out of the belly of Sheol I cried, and you heard my voice.` },
      { loc: `32002003`, verseText: `For you cast me into the deep, into the heart of the seas, and the flood surrounded me; all your waves and your billows passed over me.` },
      { loc: `32002004`, verseText: `Then I said, ‘I am driven away from your sight; yet I shall again look upon your holy temple.’` },
      { loc: `32002005`, verseText: `The waters closed in over me to take my life; the deep surrounded me; weeds were wrapped about my head` },
      { loc: `32002006`, verseText: `at the roots of the mountains. I went down to the land whose bars closed upon me forever; yet you brought up my life from the pit, O Lord my God.` },
      { loc: `32002007`, verseText: `When my life was fainting away, I remembered the Lord, and my prayer came to you, into your holy temple.` },
      { loc: `32002008`, verseText: `Those who pay regard to vain idols forsake their hope of steadfast love.` },
      { loc: `32002009`, verseText: `But I with the voice of thanksgiving will sacrifice to you; what I have vowed I will pay. Salvation belongs to the Lord!”` },
      { loc: `32002010`, verseText: `And the Lord spoke to the fish, and it vomited Jonah out upon the dry land.` },
      { loc: `32003001`, verseText: `Then the word of the Lord came to Jonah the second time, saying,` },
      { loc: `32003002`, verseText: `“Arise, go to Nineveh, that great city, and call out against it the message that I tell you.”` },
      { loc: `32003003`, verseText: `So Jonah arose and went to Nineveh, according to the word of the Lord. Now Nineveh was an exceedingly great city, three days’ journey in breadth.` },
      { loc: `32003004`, verseText: `Jonah began to go into the city, going a day’s journey. And he called out, “Yet forty days, and Nineveh shall be overthrown!”` },
      { loc: `32003005`, verseText: `And the people of Nineveh believed God. They called for a fast and put on sackcloth, from the greatest of them to the least of them.` },
      { loc: `32003006`, verseText: `The word reached the king of Nineveh, and he arose from his throne, removed his robe, covered himself with sackcloth, and sat in ashes.` },
      { loc: `32003007`, verseText: `And he issued a proclamation and published through Nineveh, “By the decree of the king and his nobles: Let neither man nor beast, herd nor flock, taste anything. Let them not feed or drink water,` },
      { loc: `32003008`, verseText: `but let man and beast be covered with sackcloth, and let them call out mightily to God. Let everyone turn from his evil way and from the violence that is in his hands.` },
      { loc: `32003009`, verseText: `Who knows? God may turn and relent and turn from his fierce anger, so that we may not perish.”` },
      { loc: `32003010`, verseText: `When God saw what they did, how they turned from their evil way, God relented of the disaster that he had said he would do to them, and he did not do it.` },
      { loc: `32004001`, verseText: `But it displeased Jonah exceedingly, and he was angry.` },
      { loc: `32004002`, verseText: `And he prayed to the Lord and said, “O Lord, is not this what I said when I was yet in my country? That is why I made haste to flee to Tarshish; for I knew that you are a gracious God and merciful, slow to anger and abounding in steadfast love, and relenting from disaster.` },
      { loc: `32004003`, verseText: `Therefore now, O Lord, please take my life from me, for it is better for me to die than to live.”` },
      { loc: `32004004`, verseText: `And the Lord said, “Do you do well to be angry?”` },
      { loc: `32004005`, verseText: `Jonah went out of the city and sat to the east of the city and made a booth for himself there. He sat under it in the shade, till he should see what would become of the city.` },
      { loc: `32004006`, verseText: `Now the Lord God appointed a plant and made it come up over Jonah, that it might be a shade over his head, to save him from his discomfort. So Jonah was exceedingly glad because of the plant.` },
      { loc: `32004007`, verseText: `But when dawn came up the next day, God appointed a worm that attacked the plant, so that it withered.` },
      { loc: `32004008`, verseText: `When the sun rose, God appointed a scorching east wind, and the sun beat down on the head of Jonah so that he was faint. And he asked that he might die and said, “It is better for me to die than to live.”` },
      { loc: `32004009`, verseText: `But God said to Jonah, “Do you do well to be angry for the plant?” And he said, “Yes, I do well to be angry, angry enough to die.”` },
      { loc: `32004010`, verseText: `And the Lord said, “You pity the plant, for which you did not labor, nor did you make it grow, which came into being in a night and perished in a night.` },
      { loc: `32004011`, verseText: `And should not I pity Nineveh, that great city, in which there are more than 120,000 persons who do not know their right hand from their left, and also much cattle?”` },
    ])

  }).timeout(5000)

  it('Micah esv', async () => {

    await submitInitialESVVerses([
    { loc: `33001001`, verseText: `The word of the Lord that came to Micah of Moresheth in the days of Jotham, Ahaz, and Hezekiah, kings of Judah, which he saw concerning Samaria and Jerusalem.` },
    { loc: `33001002`, verseText: `Hear, you peoples, all of you; pay attention, O earth, and all that is in it, and let the Lord God be a witness against you, the Lord from his holy temple.` },
    { loc: `33001003`, verseText: `For behold, the Lord is coming out of his place, and will come down and tread upon the high places of the earth.` },
    { loc: `33001004`, verseText: `And the mountains will melt under him, and the valleys will split open, like wax before the fire, like waters poured down a steep place.` },
    { loc: `33001005`, verseText: `All this is for the transgression of Jacob and for the sins of the house of Israel. What is the transgression of Jacob? Is it not Samaria? And what is the high place of Judah? Is it not Jerusalem?` },
    { loc: `33001006`, verseText: `Therefore I will make Samaria a heap in the open country, a place for planting vineyards, and I will pour down her stones into the valley and uncover her foundations.` },
    { loc: `33001007`, verseText: `All her carved images shall be beaten to pieces, all her wages shall be burned with fire, and all her idols I will lay waste, for from the fee of a prostitute she gathered them, and to the fee of a prostitute they shall return.` },
    { loc: `33001008`, verseText: `For this I will lament and wail; I will go stripped and naked; I will make lamentation like the jackals, and mourning like the ostriches.` },
    { loc: `33001009`, verseText: `For her wound is incurable, and it has come to Judah; it has reached to the gate of my people, to Jerusalem.` },
    { loc: `33001010`, verseText: `Tell it not in Gath; weep not at all; in Beth-le-aphrah roll yourselves in the dust.` },
    { loc: `33001011`, verseText: `Pass on your way, inhabitants of Shaphir, in nakedness and shame; the inhabitants of Zaanan do not come out; the lamentation of Beth-ezel shall take away from you its standing place.` },
    { loc: `33001012`, verseText: `For the inhabitants of Maroth wait anxiously for good, because disaster has come down from the Lord to the gate of Jerusalem.` },
    { loc: `33001013`, verseText: `Harness the steeds to the chariots, inhabitants of Lachish; it was the beginning of sin to the daughter of Zion, for in you were found the transgressions of Israel.` },
    { loc: `33001014`, verseText: `Therefore you shall give parting gifts to Moresheth-gath; the houses of Achzib shall be a deceitful thing to the kings of Israel.` },
    { loc: `33001015`, verseText: `I will again bring a conqueror to you, inhabitants of Mareshah; the glory of Israel shall come to Adullam.` },
    { loc: `33001016`, verseText: `Make yourselves bald and cut off your hair, for the children of your delight; make yourselves as bald as the eagle, for they shall go from you into exile.` },
    { loc: `33002001`, verseText: `Woe to those who devise wickedness and work evil on their beds! When the morning dawns, they perform it, because it is in the power of their hand.` },
    { loc: `33002002`, verseText: `They covet fields and seize them, and houses, and take them away; they oppress a man and his house, a man and his inheritance.` },
    { loc: `33002003`, verseText: `Therefore thus says the Lord: behold, against this family I am devising disaster, from which you cannot remove your necks, and you shall not walk haughtily, for it will be a time of disaster.` },
    { loc: `33002004`, verseText: `In that day they shall take up a taunt song against you and moan bitterly, and say, “We are utterly ruined; he changes the portion of my people; how he removes it from me! To an apostate he allots our fields.”` },
    { loc: `33002005`, verseText: `Therefore you will have none to cast the line by lot in the assembly of the Lord.` },
    { loc: `33002006`, verseText: `“Do not preach”—thus they preach— “one should not preach of such things; disgrace will not overtake us.”` },
    { loc: `33002007`, verseText: `Should this be said, O house of Jacob? Has the Lord grown impatient? Are these his deeds? Do not my words do good to him who walks uprightly?` },
    { loc: `33002008`, verseText: `But lately my people have risen up as an enemy; you strip the rich robe from those who pass by trustingly with no thought of war.` },
    { loc: `33002009`, verseText: `The women of my people you drive out from their delightful houses; from their young children you take away my splendor forever.` },
    { loc: `33002010`, verseText: `Arise and go, for this is no place to rest, because of uncleanness that destroys with a grievous destruction.` },
    { loc: `33002011`, verseText: `If a man should go about and utter wind and lies, saying, “I will preach to you of wine and strong drink,” he would be the preacher for this people!` },
    { loc: `33002012`, verseText: `I will surely assemble all of you, O Jacob; I will gather the remnant of Israel; I will set them together like sheep in a fold, like a flock in its pasture, a noisy multitude of men.` },
    { loc: `33002013`, verseText: `He who opens the breach goes up before them; they break through and pass the gate, going out by it. Their king passes on before them, the Lord at their head.` },
    { loc: `33003001`, verseText: `And I said: Hear, you heads of Jacob and rulers of the house of Israel! Is it not for you to know justice?—` },
    { loc: `33003002`, verseText: `you who hate the good and love the evil, who tear the skin from off my people and their flesh from off their bones,` },
    { loc: `33003003`, verseText: `who eat the flesh of my people, and flay their skin from off them, and break their bones in pieces and chop them up like meat in a pot, like flesh in a cauldron.` },
    { loc: `33003004`, verseText: `Then they will cry to the Lord, but he will not answer them; he will hide his face from them at that time, because they have made their deeds evil.` },
    { loc: `33003005`, verseText: `Thus says the Lord concerning the prophets who lead my people astray, who cry “Peace” when they have something to eat, but declare war against him who puts nothing into their mouths.` },
    { loc: `33003006`, verseText: `Therefore it shall be night to you, without vision, and darkness to you, without divination. The sun shall go down on the prophets, and the day shall be black over them;` },
    { loc: `33003007`, verseText: `the seers shall be disgraced, and the diviners put to shame; they shall all cover their lips, for there is no answer from God.` },
    { loc: `33003008`, verseText: `But as for me, I am filled with power, with the Spirit of the Lord, and with justice and might, to declare to Jacob his transgression and to Israel his sin.` },
    { loc: `33003009`, verseText: `Hear this, you heads of the house of Jacob and rulers of the house of Israel, who detest justice and make crooked all that is straight,` },
    { loc: `33003010`, verseText: `who build Zion with blood and Jerusalem with iniquity.` },
    { loc: `33003011`, verseText: `Its heads give judgment for a bribe; its priests teach for a price; its prophets practice divination for money; yet they lean on the Lord and say, “Is not the Lord in the midst of us? No disaster shall come upon us.”` },
    { loc: `33003012`, verseText: `Therefore because of you Zion shall be plowed as a field; Jerusalem shall become a heap of ruins, and the mountain of the house a wooded height.` },
    { loc: `33004001`, verseText: `It shall come to pass in the latter days that the mountain of the house of the Lord shall be established as the highest of the mountains, and it shall be lifted up above the hills; and peoples shall flow to it,` },
    { loc: `33004002`, verseText: `and many nations shall come, and say: “Come, let us go up to the mountain of the Lord, to the house of the God of Jacob, that he may teach us his ways and that we may walk in his paths.” For out of Zion shall go forth the law, and the word of the Lord from Jerusalem.` },
    { loc: `33004003`, verseText: `He shall judge between many peoples, and shall decide for strong nations far away; and they shall beat their swords into plowshares, and their spears into pruning hooks; nation shall not lift up sword against nation, neither shall they learn war anymore;` },
    { loc: `33004004`, verseText: `but they shall sit every man under his vine and under his fig tree, and no one shall make them afraid, for the mouth of the Lord of hosts has spoken.` },
    { loc: `33004005`, verseText: `For all the peoples walk each in the name of its god, but we will walk in the name of the Lord our God forever and ever.` },
    { loc: `33004006`, verseText: `In that day, declares the Lord, I will assemble the lame and gather those who have been driven away and those whom I have afflicted;` },
    { loc: `33004007`, verseText: `and the lame I will make the remnant, and those who were cast off, a strong nation; and the Lord will reign over them in Mount Zion from this time forth and forevermore.` },
    { loc: `33004008`, verseText: `And you, O tower of the flock, hill of the daughter of Zion, to you shall it come, the former dominion shall come, kingship for the daughter of Jerusalem.` },
    { loc: `33004009`, verseText: `Now why do you cry aloud? Is there no king in you? Has your counselor perished, that pain seized you like a woman in labor?` },
    { loc: `33004010`, verseText: `Writhe and groan, O daughter of Zion, like a woman in labor, for now you shall go out from the city and dwell in the open country; you shall go to Babylon. There you shall be rescued; there the Lord will redeem you from the hand of your enemies.` },
    { loc: `33004011`, verseText: `Now many nations are assembled against you, saying, “Let her be defiled, and let our eyes gaze upon Zion.”` },
    { loc: `33004012`, verseText: `But they do not know the thoughts of the Lord; they do not understand his plan, that he has gathered them as sheaves to the threshing floor.` },
    { loc: `33004013`, verseText: `Arise and thresh, O daughter of Zion, for I will make your horn iron, and I will make your hoofs bronze; you shall beat in pieces many peoples; and shall devote their gain to the Lord, their wealth to the Lord of the whole earth.` },
    { loc: `33005001`, verseText: `Now muster your troops, O daughter of troops; siege is laid against us; with a rod they strike the judge of Israel on the cheek.` },
    { loc: `33005002`, verseText: `But you, O Bethlehem Ephrathah, who are too little to be among the clans of Judah, from you shall come forth for me one who is to be ruler in Israel, whose coming forth is from of old, from ancient days.` },
    { loc: `33005003`, verseText: `Therefore he shall give them up until the time when she who is in labor has given birth; then the rest of his brothers shall return to the people of Israel.` },
    { loc: `33005004`, verseText: `And he shall stand and shepherd his flock in the strength of the Lord, in the majesty of the name of the Lord his God. And they shall dwell secure, for now he shall be great to the ends of the earth.` },
    { loc: `33005005`, verseText: `And he shall be their peace. When the Assyrian comes into our land and treads in our palaces, then we will raise against him seven shepherds and eight princes of men;` },
    { loc: `33005006`, verseText: `they shall shepherd the land of Assyria with the sword, and the land of Nimrod at its entrances; and he shall deliver us from the Assyrian when he comes into our land and treads within our border.` },
    { loc: `33005007`, verseText: `Then the remnant of Jacob shall be in the midst of many peoples like dew from the Lord, like showers on the grass, which delay not for a man nor wait for the children of man.` },
    { loc: `33005008`, verseText: `And the remnant of Jacob shall be among the nations, in the midst of many peoples, like a lion among the beasts of the forest, like a young lion among the flocks of sheep, which, when it goes through, treads down and tears in pieces, and there is none to deliver.` },
    { loc: `33005009`, verseText: `Your hand shall be lifted up over your adversaries, and all your enemies shall be cut off.` },
    { loc: `33005010`, verseText: `And in that day, declares the Lord, I will cut off your horses from among you and will destroy your chariots;` },
    { loc: `33005011`, verseText: `and I will cut off the cities of your land and throw down all your strongholds;` },
    { loc: `33005012`, verseText: `and I will cut off sorceries from your hand, and you shall have no more tellers of fortunes;` },
    { loc: `33005013`, verseText: `and I will cut off your carved images and your pillars from among you, and you shall bow down no more to the work of your hands;` },
    { loc: `33005014`, verseText: `and I will root out your Asherah images from among you and destroy your cities.` },
    { loc: `33005015`, verseText: `And in anger and wrath I will execute vengeance on the nations that did not obey.` },
    { loc: `33006001`, verseText: `Hear what the Lord says: Arise, plead your case before the mountains, and let the hills hear your voice.` },
    { loc: `33006002`, verseText: `Hear, you mountains, the indictment of the Lord, and you enduring foundations of the earth, for the Lord has an indictment against his people, and he will contend with Israel.` },
    { loc: `33006003`, verseText: `“O my people, what have I done to you? How have I wearied you? Answer me!` },
    { loc: `33006004`, verseText: `For I brought you up from the land of Egypt and redeemed you from the house of slavery, and I sent before you Moses, Aaron, and Miriam.` },
    { loc: `33006005`, verseText: `O my people, remember what Balak king of Moab devised, and what Balaam the son of Beor answered him, and what happened from Shittim to Gilgal, that you may know the righteous acts of the Lord.”` },
    { loc: `33006006`, verseText: `“With what shall I come before the Lord, and bow myself before God on high? Shall I come before him with burnt offerings, with calves a year old?` },
    { loc: `33006007`, verseText: `Will the Lord be pleased with thousands of rams, with ten thousands of rivers of oil? Shall I give my firstborn for my transgression, the fruit of my body for the sin of my soul?”` },
    { loc: `33006008`, verseText: `He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?` },
    { loc: `33006009`, verseText: `The voice of the Lord cries to the city— and it is sound wisdom to fear your name: “Hear of the rod and of him who appointed it!` },
    { loc: `33006010`, verseText: `Can I forget any longer the treasures of wickedness in the house of the wicked, and the scant measure that is accursed?` },
    { loc: `33006011`, verseText: `Shall I acquit the man with wicked scales and with a bag of deceitful weights?` },
    { loc: `33006012`, verseText: `Your rich men are full of violence; your inhabitants speak lies, and their tongue is deceitful in their mouth.` },
    { loc: `33006013`, verseText: `Therefore I strike you with a grievous blow, making you desolate because of your sins.` },
    { loc: `33006014`, verseText: `You shall eat, but not be satisfied, and there shall be hunger within you; you shall put away, but not preserve, and what you preserve I will give to the sword.` },
    { loc: `33006015`, verseText: `You shall sow, but not reap; you shall tread olives, but not anoint yourselves with oil; you shall tread grapes, but not drink wine.` },
    { loc: `33006016`, verseText: `For you have kept the statutes of Omri, and all the works of the house of Ahab; and you have walked in their counsels, that I may make you a desolation, and your inhabitants a hissing; so you shall bear the scorn of my people.”` },
    { loc: `33007001`, verseText: `Woe is me! For I have become as when the summer fruit has been gathered, as when the grapes have been gleaned: there is no cluster to eat, no first-ripe fig that my soul desires.` },
    { loc: `33007002`, verseText: `The godly has perished from the earth, and there is no one upright among mankind; they all lie in wait for blood, and each hunts the other with a net.` },
    { loc: `33007003`, verseText: `Their hands are on what is evil, to do it well; the prince and the judge ask for a bribe, and the great man utters the evil desire of his soul; thus they weave it together.` },
    { loc: `33007004`, verseText: `The best of them is like a brier, the most upright of them a thorn hedge. The day of your watchmen, of your punishment, has come; now their confusion is at hand.` },
    { loc: `33007005`, verseText: `Put no trust in a neighbor; have no confidence in a friend; guard the doors of your mouth from her who lies in your arms;` },
    { loc: `33007006`, verseText: `for the son treats the father with contempt, the daughter rises up against her mother, the daughter-in-law against her mother-in-law; a man’s enemies are the men of his own house.` },
    { loc: `33007007`, verseText: `But as for me, I will look to the Lord; I will wait for the God of my salvation; my God will hear me.` },
    { loc: `33007008`, verseText: `Rejoice not over me, O my enemy; when I fall, I shall rise; when I sit in darkness, the Lord will be a light to me.` },
    { loc: `33007009`, verseText: `I will bear the indignation of the Lord because I have sinned against him, until he pleads my cause and executes judgment for me. He will bring me out to the light; I shall look upon his vindication.` },
    { loc: `33007010`, verseText: `Then my enemy will see, and shame will cover her who said to me, “Where is the Lord your God?” My eyes will look upon her; now she will be trampled down like the mire of the streets.` },
    { loc: `33007011`, verseText: `A day for the building of your walls! In that day the boundary shall be far extended.` },
    { loc: `33007012`, verseText: `In that day they will come to you, from Assyria and the cities of Egypt, and from Egypt to the River, from sea to sea and from mountain to mountain.` },
    { loc: `33007013`, verseText: `But the earth will be desolate because of its inhabitants, for the fruit of their deeds.` },
    { loc: `33007014`, verseText: `Shepherd your people with your staff, the flock of your inheritance, who dwell alone in a forest in the midst of a garden land; let them graze in Bashan and Gilead as in the days of old.` },
    { loc: `33007015`, verseText: `As in the days when you came out of the land of Egypt, I will show them marvelous things.` },
    { loc: `33007016`, verseText: `The nations shall see and be ashamed of all their might; they shall lay their hands on their mouths; their ears shall be deaf;` },
    { loc: `33007017`, verseText: `they shall lick the dust like a serpent, like the crawling things of the earth; they shall come trembling out of their strongholds; they shall turn in dread to the Lord our God, and they shall be in fear of you.` },
    { loc: `33007018`, verseText: `Who is a God like you, pardoning iniquity and passing over transgression for the remnant of his inheritance? He does not retain his anger forever, because he delights in steadfast love.` },
    { loc: `33007019`, verseText: `He will again have compassion on us; he will tread our iniquities underfoot. You will cast all our sins into the depths of the sea.` },
    { loc: `33007020`, verseText: `You will show faithfulness to Jacob and steadfast love to Abraham, as you have sworn to our fathers from the days of old.` },
    ])

  }).timeout(5000)

})