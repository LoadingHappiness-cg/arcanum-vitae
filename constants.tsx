
import { Album, WordFragment, VisualItem, ArchiveItem } from './types';

export const ANCHOR_PHRASES = [
  "Art is not decoration. It is position.",
  "Beauty without truth is noise.",
  "We do not bend the knee.",
  "Meaning still matters.",
  "This is not entertainment. This is testimony."
];

export const FICTION_DECLARATION = {
  main: "Arcanum Vitae is a digital fiction. A collective hallucination manifested through artificial intelligence and human intent.",
  details: "The names, voices, and presences within this space are artifacts of creation. They do not exist outside this frame. This is a work of presence, not a record of reality.",
  tagline: "Manifested construct. Human truth."
};

export const AI_DECLARATION = {
  main: "Arcanum Vitae is AI-generated music, guided and shaped by human intent.",
  body: [
    "This project is born from a dialogue.",
    "Artificial intelligence generates sound, structure, and variation.",
    "Humans decide meaning, direction, and responsibility.",
    "The machine has no conscience. No fear. No ethics.",
    "That weight remains human. Always."
  ],
  tagline: "AI-generated sound. Human meaning."
};

export const ARTISTIC_STATEMENT = {
  url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?q=80&w=1200&h=1200&auto=format&fit=crop&grayscale=true',
  text: "Meaning still matters.",
  subtext: "In the depth of the void, the light we hold is the only truth we own."
};

export const ALBUMS: Album[] = [
  {
    id: 'rivers-of-resistance',
    title: 'RIVERS OF RESISTANCE',
    year: '2024',
    concept: `WE DO NOT ASK FOR ROOM TO BREATHE. WE RECLAIM THE AIR.

RIVERS OF RESISTANCE IS A REFUSAL TO DISAPPEAR.
It is a sonic record of the lines drawn in blood and the spines that refused to snap. 

From the broken stones of Palestine to the unseen chains of the modern soul, this is a declaration of presence. 

WE ARE NOT HERE TO ENTERTAIN YOUR INDIFFERENCE.
WE ARE HERE TO WITNESS THE AWAKENING OF LIFE UNBOUND.

Every sound is a stone. 
Every lyric is a shield. 
Every silence is a heartbeat waiting to break the wall.`,
    context: `THE BONE REMEMBERS WHAT THE MAPS TRY TO FORGET.

In a world of velvet thrones and silent graves, Arcanum Vitae chooses the friction of truth. This work represents the intersection of machine-logic and human-agony. 

We utilize the machine not to replace the human, but to amplify the cry of the spirit that refuses to be owned. 

THIS IS NOT A PRODUCT. 
THIS IS NOT CONTENT. 
THIS IS A POSITION.

If you seek comfort, you have found the wrong frequency. 
If you seek the fire that gives birth to the dawn, welcome home.`,
    coverUrl: './album-art.png',
    tracks: [
      { 
        title: 'Rivers of Resistance', 
        lyrics: `In 1947, a line condemned,  
houses fell and lives would end.  
Keys on the doors, no place to stay,  
promises broken, swept away.  

In Palestine it flows without end,  
the blood of children, red to the sand.  

Behind the walls a generation grew,  
dreams kept small, the sky not true.  
A simple kite can be a crime,  
yet hope survives in every rhyme.  

The world looks away from pain,  
graves keep rising, again and again.  
Still the stones will speak, they say:  
“This land will not be torn away.”  

In Palestine it flows without end,  
the blood of children, red to the sand.  

Ya ard Falastin, nahnu lan namut.  
("O land of Palestine, we will never die.")  

As-sabru nahr, yajri dima’.  
("Patience is a river, it flows with blood.")  

Al-atfal yaghannun, sawt al-hurriyya.  
("The children are singing, the voice of freedom.")  

Wajh al-shams yarji‘u ilayna.  
("And the face of the sun will return to us.")  

In Palestine it flows without end,  
the blood of children, red to the sand.  
But one day freedom will reach this land,  
and Palestine will rise, will stand.  

History carved with fire and stone,  
voices silenced, but never gone.  
Every child’s cry becomes a flame,  
calling the world to speak their name.  

And Palestine will rise… will stand.`, 
        story: `MANIFESTO: A RECORD OF LINES

This work is not an opinion. It is a record.
A record of lines drawn without consent. Of doors locked with keys that no longer open. Of promises made by powers that never paid their price.

In 1947, a line was drawn. What followed was not peace. It was inheritance of loss.

This piece speaks of children who grow up behind walls, where even the sky is rationed and innocence is treated as a threat. Where a kite can be a crime. Where patience is demanded while blood is paid as interest.

The Arabic words in this piece are not decoration. They are testimony. They speak of land that refuses disappearance. Of patience that flows like a river — not because it is endless, but because it is forced.

This work was generated with artificial intelligence, guided by human conscience. We carry the moral weight. Standing is the only form of resistance left.`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
      },
      { 
        title: 'Children of Palestine', 
        lyrics: `Streets of stone, the sky is torn, 
Dreams are broken before they’re born. 
Tiny hands in the dust they play, 
Holding hope that won’t decay.

Children of Palestine, hear them sing, 
Through the sorrow, their laughter rings. 
Shadows fall but the light remains, 
Innocence dancing in chains.

Carrying weight no child should bear, 
Stories written in the smoke-filled air. 
Eyes too young have seen the fight, 
Still they shine with a fearless light.

Children of Palestine, hear them sing, 
Through the sorrow, their laughter rings. 
Shadows fall but the light remains, 
Innocence dancing in chains.

Atfaal Filasteen, isma‘oo al-ghinaa’
(Children of Palestine, hear them sing)

Min wasat al-huzn, ya‘loo ad-diyaa’
(Through the sorrow, their light rises)

Hatta law saqata adh-dhill, yabqaa an-noor
(Even if the shadow falls, the light remains)

Not numbers, not names, 
Not ashes in flames— 
They are kites in the wind, 
They are life to begin.

Children of Palestine, hear them sing, 
Through the sorrow, their laughter rings. 
Shadows fall but the light remains, 
Innocence dancing in chains.

Every child deserves the sky`, 
        story: `MANIFESTO: EVERY CHILD DESERVES THE SKY

This work is not about conflict. It is about childhood under siege. It speaks of streets made of stone where dreams fracture before they learn to walk, where play happens in dust, and hope survives because it refuses to decay.

The children heard here are not symbols. They are not statistics. Their laughter does not deny sorrow — it rises through it.

This piece holds a contradiction on purpose: innocence dancing in chains. Because children do not choose the weight they carry. They inherit it. They see smoke before they see distance. That light in their eyes is not naïveté. It is defiance without ideology.

Every child deserves the sky. Not tomorrow. Now. Because when innocence is chained, silence is not neutrality. It is participation.`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      { 
        title: 'Children of Palestine II', 
        lyrics: `Children laid in streets of stone,  
their toys are silent, their voices gone.  
A cradle broken, a mother’s cry,  
the world turns away, the children die.  

Through broken stones, through shattered years,  
we guard our hope with blood and tears.  

Children of Palestine, buried in the sand,  
their laughter stolen by another’s hand.  
Yet still they shine, unbroken, unheard,  
children of Palestine, the truth in every word.  

A kite in the sky becomes a crime,  
a prison built for a child’s rhyme.  
But every grave is carved with light,  
and every shadow learns to fight.  

We walk through fire, we bear the scars,  
yet hope still burns beneath the stars.  

Children of Palestine, buried in the sand,  
their laughter stolen by another’s hand.  
Yet still they shine, unbroken, unheard,  
children of Palestine, the truth in every word.  

Ya ard Falastin, damna yashhad.  
("O land of Palestine, our blood testifies.")  
Lan nakhsha al-mawt, fa’l-ḥaqq baqī.  
("We do not fear death, for truth remains.")  
Al-atfal yanhadun, sawt al-ḥurriyya.  
("The children rise, the voice of freedom.")  
Wa’l-shams sata‘ūd ilaynā.  
("And the sun will return to us.")  

Children of Palestine, their voices will not fade,  
through fire and through shadows, their hope will never break.  
Children of Palestine, the world must understand,  
one day they’ll be free, one day they’ll stand.  

Streets of fire, names in stone,  
we bury the young but we march on.  
Every cry is a wound unhealed,  
every song a weapon, every word a shield.  

And Palestine will rise… will stand.`, 
        story: `MANIFESTO — CHILDREN OF PALESTINE II

This work bears witness. It speaks of children laid on streets of stone, of toys gone silent, of cradles broken before lullabies could finish. It speaks of mothers who cry into a world that keeps walking.

This is not metaphor for effect. It is record. A record of years shattered, of hope guarded with blood and tears, of childhood compressed into graves and headlines. When a kite becomes a crime, when play is punished, when rhyme is met with walls, the moral failure is no longer abstract.

The children named here are not symbols. They are not numbers. They are not acceptable losses. Their laughter was taken. Their voices were buried. And still — against reason — their light remains. Not because suffering ennobles, but because innocence refuses erasure.

The Arabic words in this piece are not ornament. They are testimony. They speak of land that remembers blood. Of truth that remains when fear is exhausted. Of children who rise — not as soldiers, but as voices that will not be silenced.

This music is generated with artificial intelligence, guided and shaped by human intent. The machine assembles sound and structure. It does not understand graves. It does not weigh consequence. It does not carry responsibility. That burden remains human.

This piece does not ask for hatred. It refuses forgetting. It does not call for violence. It calls out indifference. Because when children are buried, neutrality is not distance — it is alignment with silence.

Children of Palestine is not a promise of victory. It is a refusal to accept that children should pay the price of history. Their voices will not fade. Their names will not dissolve into stone. And standing — sometimes — is the only form of truth left.`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      { 
        title: 'Ḥurriya (Freedom)', 
        lyrics: `I was born with chains unseen,  
but the sky whispered: “Rise.”  
Every wound became a door,  
every tear, a flight to light.  

No wall can bind the spirit,  
no hand can cage the flame.  
We are rivers seeking oceans,  
we are voices with no shame.  

ḥurriya… my soul takes flight  
taḥta ash-shams… bathed in light  
bilā quyūd… my heart is free  
ḥurriya… come sing with me  

I walk the desert of silence,  
where prophets carved their breath.  
The dust remembers footsteps,  
but my soul outlives the death.  

qalbī ṭāʾir… fawq al-jibāl  
(My heart is a bird… above the mountains)  

They wrote laws on our backs, but the ink will fade,  
We carry scars like maps, but we’re not afraid.  
Freedom is fire, it’s the song of the earth,  
From the ashes of silence, a new dawn gives birth.  

Freedom is not given by rulers or kings,  
it lives in the breath of every soul.  
Chains may bind the body,  
but the spirit forever walks unbound.  
  
ḥurriya… my soul takes flight  
taḥta ash-shams… bathed in light  
bilā quyūd… my heart is free  
ḥurriya… ḥurriya… sing with me`, 
        story: `MANIFESTO — ḤURRIYA

This work is not about freedom as a slogan. It is about freedom as an irreversible awakening. It speaks of chains that are not always visible, of wounds that do not only injure — they open. Here, pain does not end the journey. It becomes the door.

This is a declaration born from the inside. No wall can bind the spirit described here. No authority can grant it. No decree can remove it. Because freedom that depends on permission was never freedom to begin with.

The rivers invoked in this piece do not ask where they may flow. They move because they exist. So do voices that refuse shame. So does the flame that cannot be caged, even when the body is constrained.

The Arabic words in this song are not translation. They are invocation. Ḥurriya — freedom — not as an abstract ideal, but as breath, flight, heat, and movement. A soul that rises under the sun. A heart that moves without chains. A song that does not wait to be allowed.

This work walks through silence, through dust that remembers prophets and footsteps, through histories written on backs instead of paper. Laws may be written in ink, but ink fades. Scars remain — not as proof of defeat, but as maps of survival.

This music is generated using artificial intelligence, guided by human intent and responsibility. The machine creates structure and sound. It does not know what freedom costs. It does not feel fear, faith, or consequence. That meaning — and that weight — remain human.

This piece does not ask rulers for mercy. It does not negotiate dignity. It states something simpler, and harder: Freedom is not given. It is remembered. Chains may bind the body. They may slow it. They may wound it. But the spirit — once awake — walks unbound.

Ḥurriya is not a promise of arrival. It is the act of rising — again and again — under the same sun. And singing, not because it is safe, but because silence would be a lie.`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      { 
        title: 'I Will Not Bend the Knee', 
        lyrics: `Silken halls and velvet thrones,
Feasting while they starve our homes.
Golden crowns on hollow heads,
Their empire’s built on blood it sheds.

They want my silence, my fear, my faith —
But I won’t kneel, I won’t obey.

I will not bend the knee,
To tyrants, sycophants, and liars.
I would rather die standing,
Than live forever in their fires.

Silk-tongued saints with poisoned hands,
Preach of peace while burning lands.
Their banquet fed by stolen breath,
A masquerade of life and death.

You can chain my hands but not my tongue,
Carve your laws, but we’re not done.
Freedom’s not a gift, it’s a stand we take —
No master, no leash, no fate to fake.

I will not bend the knee,
To tyrants, sycophants, and liars.
I would rather die standing,
Than live forever in their fires.

“We will not kneel!”`, 
        story: `MANIFESTO — I WILL NOT BEND THE KNEE

This work is a declaration of refusal.
Refusal to kneel before power that feeds on hunger. Refusal to respect crowns built on silence. Refusal to mistake comfort for morality. It speaks of halls lined with silk, where feasts continue while homes collapse, where authority dresses itself in ceremony to hide the cost of its rule.

This piece does not attack belief. It confronts hypocrisy. It speaks of voices that preach peace with hands stained by fire. Of saints with silk tongues who bless destruction from a safe distance. It names the masquerade — where violence is justified, and obedience is sold as virtue.

The refusal declared here is not reckless. It is conscious. To not bend the knee is not to seek death — it is to refuse a life emptied of dignity. Standing is not martyrdom. It is the minimum requirement for self-respect when fear is used as governance.

This work does not call for chaos. It rejects submission. Chains may bind the body. They may slow hands. They may threaten breath. But silence is a choice — and this voice refuses it.

This music is generated using artificial intelligence, guided and shaped by human intent. The machine produces sound and structure. It does not understand tyranny. It does not weigh obedience against conscience. It does not fear consequences. That responsibility remains human.

Freedom is not a gift granted by rulers. It is a stance taken by those who refuse to be owned. No master. No leash. No borrowed morality.

“I will not bend the knee” is not a threat. It is a boundary. A line drawn where dignity ends and obedience is no longer an option. And standing — even alone — is sometimes the last act of truth available.`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
      },
      { 
        title: 'Bastards', 
        lyrics: 'They wear the suits of order while they feed on chaos. Bastards of the system, we see the cracks. Your borders are lines in the sand, and the wind is coming.', 
        story: 'Raw, aggressive, and industrial. A study on the systems that trade human life for efficiency.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
      },
      { 
        title: 'The Drop Returns', 
        lyrics: 'One drop is a gesture. Ten thousand is a flood. The stone is patient, but the water is eternal. We are the moisture in the air before the storm breaks.', 
        story: 'Exploring the persistence of small acts. Resistance is not always a wave; sometimes it is a drip.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
      },
      { 
        title: 'Legacy', 
        lyrics: 'What do we leave in the ashes? Not our possessions, but the shape of our defiance. Our children will not inherit our fear. They will inherit our fire.', 
        story: 'A somber look at what survives the conflict. A question of what remains when the music stops.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
      },
      { 
        title: 'Echoes Beyond the Flame', 
        lyrics: 'Burn the page, but the words stay in the smoke. We are the heat that power cannot cool. Silence is just the sound of us waiting.', 
        story: 'Survival through memory. The sound utilizes burning textures to create a sense of urgent endurance.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
      },
      { 
        title: 'The End of One Chapter (Bonus Track)', 
        lyrics: 'The silence after the storm is not peace. It is the preparation for the next breath. This is not the end. It is only the threshold.', 
        story: 'The closure of the initial manifest. A bridge to whatever fractures come next.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
      }
    ]
  }
];

export const FRAGMENTS: WordFragment[] = [
  { id: 'f1', text: 'Everything serves one purpose: to confront what it means to be human.' },
  { id: 'f2', text: 'Arcanum Vitae chooses depth, friction, and silence when silence carries weight.' },
  { id: 'f3', text: 'Growth does not come from affirmation. It comes from confrontation.', source: 'The Blueprint' },
  { id: 'f4', text: 'Beauty does not hide pain — it reveals it.' },
  { id: 'f5', text: 'Art is not decoration. It is position.', source: 'Official Manifesto' }
];

export const VISUALS: VisualItem[] = [
  { id: 'v1', url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&h=1000&auto=format&fit=crop&grayscale=true', title: 'The Void', description: 'Visual rhythm of the heartbeat.' },
  { id: 'v2', url: 'https://images.unsplash.com/photo-1490814525860-594e82bfd34a?q=80&w=800&h=800&auto=format&fit=crop&grayscale=true', title: 'Restraint', description: 'The weight of unsaid words.' },
  { id: 'v3', url: 'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?q=80&w=1000&h=600&auto=format&fit=crop&grayscale=true', title: 'Presence', description: 'An act of being here.' }
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'a1',
    type: 'text',
    author: 'K. Vane',
    title: 'Autopilot Death',
    content: 'The alarm clock is a metronome for the slowly dying. I refuse the rhythm.'
  },
  {
    id: 'a2',
    type: 'image',
    author: 'Elara',
    title: 'Fractured Geometry',
    content: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=800&h=800&auto=format&fit=crop&grayscale=true'
  },
  {
    id: 'a3',
    type: 'text',
    author: 'Anonymous',
    title: 'The Weight of Breath',
    content: 'They promised efficiency. I chose exhaustion and truth.'
  }
];
