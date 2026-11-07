// ==== 1. DONNÉES DU JEU ====
// Ces scènes de démonstration permettent de travailler même sans importer de JSON.
// Le bouton "Importer" permet ensuite de choisir TON fichier corrigé.
let scenes = [
  {
    id: 'bowling_billard',
    tag: 'CHAPITRE 1 · BOWLING & BILLARD',
    title: 'Bowling & Billard',
    text: '',
    image: 'assets/scene_2.png',
    led: 'feu_de_bois',
    dialogues: [
      'Dialogue 1 : le début de notre rendez-vous...',
      'Dialogue 2 : un souvenir qui fait sourire...',
      'Dialogue 3 : et si ce n’était que le début ?'
    ],
    easter_eggs: []
  },
  {
    id: 'grande_roue',
    tag: 'CHAPITRE 1 · LA FOIRE',
    title: 'La grande roue',
    text: '',
    image: 'assets/scene_3.png',
    led: 'rose',
    dialogues: ['Premier dialogue à imaginer...', 'Deuxième dialogue à imaginer...'],
    easter_eggs: []
  }
];

let sceneActuelle = 0;
let dialogueActuel = 0;
const sauvegarde = localStorage.getItem("lovequest_progression");
const tableau = JSON.parse(sauvegarde || "[]");
const scenesTerminees = new Set(tableau);
const inventory = new Set();
restaurerInventaire();
afficherInventaire();
const couleurs = {
  rose: '#ff8cbd',
  bleu: '#78bafb',
  or: '#ffd27c',
  violet: '#b79afe',
  feu_de_bois: '#fb903e',
  eteint: '#656071'
};

// Petit raccourci pour sélectionner un élément HTML par son identifiant.
function element(id) {
  return document.getElementById(id);
}

// ==== 2. AFFICHER LES DONNÉES ====
function dialoguesDe(scene) {
 
  if (Array.isArray(scene.dialogues) && scene.dialogues.length > 0) {
    return scene.dialogues;
  }
  return [scene.text || 'Ce dialogue reste à écrire.'];
}

function afficher() {
  const scene = scenes[sceneActuelle];
  const dialogues = dialoguesDe(scene);

  element('titreScene').textContent = scene.title || 'Sans titre';
  element('tagScene').textContent = scene.tag || 'LOVE QUEST';
  element('texteDialogue').textContent = dialogues[dialogueActuel];
  element('compteurDialogue').textContent =
    `Dialogue ${dialogueActuel + 1} / ${dialogues.length}`;

  // Si l'image n'existe pas encore, on montre un décor provisoire.
  const imagesDisponibles = [
    'assets/scene_1.png', 'assets/scene_2.png', 'assets/scene_3.png'
  ];
  element('imageScene').src = imagesDisponibles.includes(scene.image)
    ? scene.image : 'assets/scene_2.png';

  const couleur = couleurs[scene.led] || couleurs.feu_de_bois;
  element('led').style.background = couleur;
  element('led').style.boxShadow = `0 0 14px 3px ${couleur}`;
  element('ledNom').textContent = `Ambiance : ${scene.led || 'feu_de_bois'}`;
  element('scenePicker').value = String(sceneActuelle);
  afficherSecrets(scene);
  afficherHotspots(scene);

  element('btnPasser').hidden =
    !scenesTerminees.has(scene.id) ||  sceneActuelle + 1 >= scenes.length;
}

function continuer() {
  const scene = scenes[sceneActuelle];
  const dialogues = dialoguesDe(scene)
  if(dialogueActuel + 1 < dialogues.length){
    dialogueActuel++;
  }
  else{
    scenesTerminees.add(scene.id);
    localStorage.setItem("lovequest_progression",JSON.stringify([...scenesTerminees]));
    
    if(sceneActuelle + 1 < scenes.length){
    sceneActuelle ++;
    dialogueActuel = 0; 
  }
  }
  sauvegarderPosition();
  afficher();
}
function retour() {
  
  if (sceneActuelle > 0) {
    sceneActuelle--;
    dialogueActuel = 0;
    
  }
  sauvegarderPosition();
  afficher();
  
}
function passerScene(){
  const scene = scenes[sceneActuelle];

  if(scenesTerminees.has(scene.id) && sceneActuelle + 1 < scenes.length){
    sceneActuelle ++;
    dialogueActuel = 0;
  }
  sauvegarderPosition();
  afficher();
}

function sauvegarderPosition() {
    const scene = scenes[sceneActuelle];

    const position = {
        sceneId: scene.id,
        dialogueIndex: dialogueActuel
    };

    localStorage.setItem(
        "lovequest_position",
        JSON.stringify(position)
    );
}

function restaurerPosition() {
    const sauvegarde = localStorage.getItem("lovequest_position");

    if (!sauvegarde) return;

    const position = JSON.parse(sauvegarde);

    const indice = scenes.findIndex(scene => scene.id === position.sceneId
    );

    if (indice !== -1) {
        sceneActuelle = indice;
        dialogueActuel = position.dialogueIndex;
        console.log("Restauration effectuée :", sceneActuelle, dialogueActuel);
    }
}

function restaurerInventaire() {
    const savedInventory = localStorage.getItem("lovequest_inventory");

    if (!savedInventory) return;

    const inventoryArray = JSON.parse(savedInventory);
    inventoryArray.forEach(id => {
      inventory.add(id);
    });
    console.log("Inventaire restauré :", Array.from(inventory));

}

function afficherInventaire() {
  const inventoryDisplay = element('inventoryDisplay');

  if (inventory.size === 0) {
    inventoryDisplay.textContent = "Aucun objet dans l'inventaire.";
  }
  else {
    const objets = Array.from(inventory).join(', ');

    inventoryDisplay.textContent =
      `Nombre d'objets : ${inventory.size} | Objets : ${objets}`;
  }
}
// ==== 4. CONTRÔLES ====
element('btnPasser').addEventListener('click', passerScene);
element('btnRetour').addEventListener('click', retour);
element('btnContinuer').addEventListener('click', continuer);
element('btnFermerDialoguePersonnage').addEventListener('click', () =>{
  element('dialoguePersonnage').hidden = true; 
});
element('btnMenu').addEventListener('click', () => {
  element('menuPanel').hidden = false;
});

element('btnFermerMenu').addEventListener('click', () => {
  element('menuPanel').hidden = true;
});

element('scenePicker').addEventListener('change', function () {
  sceneActuelle = Number(element('scenePicker').value);
  dialogueActuel = 0;
  sauvegarderPosition();
  afficher();
});

function remplirListe() {
  const select = element('scenePicker');
  select.innerHTML = '';
  scenes.forEach(function (scene, i) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i + 1} · ${scene.title || scene.id}`;
    select.appendChild(option);
  });
}

function ouvrirSecret(idSecret) {
    const scene = scenes[sceneActuelle];
    const secrets = scene.easter_eggs || [];

    const secret = secrets.find(
        s => s.id === idSecret
    );

    if (secret === undefined) {
        element('statut').textContent = "Secret introuvable !";
    }
    else {
        element('statut').textContent = secret.title + ":" + secret.text;
    }
}

function afficherSecrets(scene) {

    const zone = element('zoneSecrets');

    // Effacer les anciens boutons
    zone.innerHTML = "";

    // Récupérer les secrets
    const secrets = scene.easter_eggs || [];

    // Parcourir tous les secrets
    secrets.forEach(secret => {
        const secret_button = document.createElement("button");
        secret_button.textContent = "?"; 
        secret_button.className = "point-secret";
        secret_button.addEventListener('click', () => {
          ouvrirSecret(secret.id);

        });
        secret_button.style.left = `${secret.x}%`;
        secret_button.style.top = `${secret.y}%`;
        zone.appendChild(secret_button);

    });
}

function afficherHotspots(scene) {
  const zone = element('zoneHotspots');
  zone.innerHTML = "";

  const hotspots = scene.hotspots || [];

  hotspots.forEach(hotspot => {
    const hotspot_button = document.createElement("button");
    hotspot_button.textContent = ""; 
    hotspot_button.className = "point-hotspot";

    zone.appendChild(hotspot_button);

    hotspot_button.style.left = `${hotspot.x}%`;
    hotspot_button.style.top = `${hotspot.y}%`;
    hotspot_button.style.width = `${hotspot.width}%`;
    hotspot_button.style.height = `${hotspot.height}%`;
    
    hotspot_button.addEventListener('click', () => {

      if (hotspot.type === 'personnage') {
        openCharacterDialogue(hotspot);
      }

      else if (hotspot.type === 'objet') {
        element('statut').textContent =
          hotspot.text || "Cet objet est intéressant.";
          // TODO : ajouter l'objet à l'inventaire et mettre à jour l'affichage de l'inventaire.
          ajouterObjetInventaire(hotspot);
      }

      else if (hotspot.type === 'secret') {
        element('statut').textContent =
          hotspot.text || "Secret découvert !";
      }

      else if (hotspot.type === 'sortie') {
        element('statut').textContent =
          "Sortie verrouillée pour le moment.";
      }

    });
  });
}

function openCharacterDialogue(hotspot){
  element('dialoguePersonnage').hidden = false;
  element('nomPersonnage') = hotspot.title ; 
  element('textPersonnage') = hotspot.text ;

  const portrait = element('portraitPersonnage');
  if(hotspot.portrait){
    portrait.src = hotspot.portrait;
    portrait.hidden = false ; 
  }
  else{
    portrait.hidden = true;
  }
}

function ajouterObjetInventaire(hotspot) {

  if (!inventory.has(hotspot.id)) {
    inventory.add(hotspot.id);

    element('statut').textContent =
      `${hotspot.title} a été ajouté à l'inventaire !`;

      // TODO : sauvegarder l'inventaire dans le localStorage et mettre à jour l'affichage de l'inventaire.
      localStorage.setItem('lovequest_inventory', JSON.stringify(Array.from(inventory)));
      afficherInventaire();
  }
  else {
    element('statut').textContent =
      "Cet objet a déjà été ramassé.";
  }
}

// Import local : aucune connexion Internet requise.
// Les champs supplémentaires (dont easter_eggs) sont conservés.
element('jsonFile').addEventListener('change', async function (event) {
  const fichier = event.target.files[0];
  if (!fichier) return;
  try {
    const contenu = await fichier.text();
    const json = JSON.parse(contenu);
    const tableau = Array.isArray(json) ? json : json.scenes;
    if (!Array.isArray(tableau) || !tableau.length) {
      throw new Error('Aucun tableau "scenes" trouvé.');
    }
    if (tableau.some(s => !s || typeof s !== 'object')) {
      throw new Error('Une scène n’est pas un objet JSON valide.');
    }
    scenes = tableau;
    sceneActuelle = 0;
    dialogueActuel = 0;
    restaurerPosition();
    remplirListe();
    afficher();
    element('statut').textContent = `Import réussi : ${scenes.length} scènes. Choisis Bowling & Billard dans la liste.`;
  } catch (erreur) {
    element('statut').textContent = 'Import impossible : ' + erreur.message;
  }
});

remplirListe();
afficher();