//On attends que le DOM soit prêt avant de faire quoi que ce soit a partir de javascript.
/*
   J'appelle jquery et je lui dit que dès qu'il est prêt et que le DOM est chargé.
   Lance moi la fonction fléché et me donnant ton instance jQuery dans la variable '$'.

   Si je précise bien le dollars c'est pour dans un premier cas rester dans la norme de jQuery
   et dans un second cas pour éviter tous effet de bord si une autre librairie modifierai l'instance
   de la variable '$' de jQuery sans le vouloir car elle même l'utiliserai.
 */
jQuery(($)=>{
    console.log('Le DOM est chargé.');

    //Je lance l'animation de mon carousel dans mon header. Elle se répétera toutes les 15 secondes.
    launchCarousel(15_000);

    //Je lance l'événement du scroll infini.
    infiniteScroll();
})

/**
 * J'ajoute un événement de focus sur mes input qui doivent-être des datetime-local.
 * @param {HTMLInputElement} element
 */
function focusInput(element) {
    $(element).attr('type', 'datetime-local');
}
/**
 * J'ajoute un événement de blur sur mes input qui doivent-être des datetime-local mais qui doit ré-affiché le placeholder si la valeur est vide.
 * @param {HTMLInputElement} element
 */
function blurInput(element){
    const $el = $(element);
    if($el.val().length === 0){
        $el.attr('type', 'text');
    }
}

/**
 * Carousel avec une animation de fade dans le header.
 * @param {number} duration - Vitesse de l'animation du carousel.
 */
function launchCarousel(duration) {
    /* Je récupère toutes les classes qui composera mon carousel */
    const carousel = $('.custom-carousel');
    /* Je récupère les deux enfants du carousel. */
    const first = carousel.children(':first-child');
    const last = carousel.children(':last-child');

    /* Je lance un timer qui dépendra de la duration et qui se répétera */
    setInterval(() => {
        /* Toutes les 15s je lance une animation sur l'opacité du premier élément. */
        animate(first, {opacity: 0}, 1000, ()=>{
            /* Je récupère l'état actuelle du scaleX de mon image en premier plan. */
            const currentScale = first.css('transform');
            /* Je donne le scaleX de l'image en arrière plan à mon image de premier plan et je remets son opacité à 1 */
            first.css({'transform': last.css('transform'), opacity: 1});
            /* Je change le scaleX de l'image en arrière plan pour la prochaine animation. */
            last.css({'transform': currentScale});
        })
    }, duration);
}

/**
 * Permet de placer des nouveaux articles si l'utilisateur arrive en bas de page.
 * J'en profite également pour changer la couleur du menu burger s'il se trouve en dessous du header.
 */
function infiniteScroll(){
    const $window = $(window);
    const burger = $('#burger');
    const main = $('main');
    let id = 5;
    $window.scroll(()=>{
        const scrollTop = $window.scrollTop();
        /* J'enlève ou je retire la couleur du menu burger s'il se trouve ou non en dessus du début de la balise main. */
        if(scrollTop >= main.offset().top){
            burger.addClass('text-dark');
        }else {
            burger.removeClass('text-dark');
        }
        // Je mets 2 pixels de sécurité pour avoir une petite sécurité suivant les navigateurs.
        if(scrollTop+2 >= ($(document).height() - $window.height())){
            //J'ajoute 4 nouveau véhicule à la page.
            for(let i = 0; i < 4; i++){
                addCar($('#cars'), getNextCarFakeAjax(), id);
                id++;
            }
            /*
                Je modifie le nombre de résultat sur la page grace à l'identifiant qui représente le nombre de voiture déjà disponible.
             */
            $('#resultCount').text(id-1);
        }
    });
}

/**
 * J'ajoute une nouvelle voiture a ma page.
 * @param {jQuery}  element - L'élément ou sera ajouté la voiture.
 * @param {$ObjMap} car     - L'objet de la nouvelle voiture.
 * @param {number}  id      - L'identifiant HTML pour le carousel de la voiture.
 */
function addCar(element, car, id){
    let images = "";
    let first = true;
    car.images.forEach((img) => {
        images += templateImgCar.replaceAll('{{imagePath}}', img)
            .replaceAll('{{active}}', first ? ' active' : '');
        first = false;
    })
    const newElement = $(templateCar
                            .replaceAll('{{images}}', images)
                            .replaceAll('{{id}}', id)
                            .replaceAll('{{name}}', car.name)
                            .replaceAll('{{description}}', car.description)
                            .replaceAll('{{price}}', car.price)
                        ).css('opacity', 0);
    element.append(newElement);
    animate(newElement, {opacity: 1}, 1000);
}

/**
 * Me permet de lancer une animation avec JQuery.
 * @param {jQuery} element      - Mon élément JQuery qui aura l'animation.
 * @param {$ObjMap} to          - Les propriété CSS qui seront nécessaire aux animations.
 * @param {number} speed        - La vitesse de l'animation.
 * @param {function=} callback  - La methode appelé une fois l'animation terminé.
 */
function animate(element, to, speed, callback = ()=>{}){
    element.animate(to, speed, callback);
}

/**
 * Je créer une fake requête AJAX pour ajouter des voiture.
 * @return {{images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string}}
 */
function getNextCarFakeAjax(){
    // Je sélectionne aléatoirement une voiture dans mon objet "cars".
    return cars[Math.floor(Math.random() * cars.length)];
}

/**
 * J'ai placé ici toutes mes variables cars elles sont assez grande et pourrait gêner la visibilité du code plus important en haut.
 */

/**
 * Mon objet de mes voitures.
 * @type {({images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string}|{images: string[], price: string, name: string, description: string})[]}
 */
const cars = [
    {
        name: 'Peugeot 208',
        description: 'Diesel, 5 portes GPS, AutoRadio, Forfait 1000 km (0,5k/km supplémentaire).',
        price: '999 € - Agence de Paris',
        images: [
            'assets/img/vehicule1.png',
            'assets/img/vehicule1.png',
            'assets/img/vehicule1.png'
        ]
    },
    {
        name: 'Ford Focus',
        description: 'Diesel, 5 portes GPS, AutoRadio, Forfait 1000 km (0,5k/km supplémentaire).',
        price: '999 €',
        images: [
            'assets/img/vehicule2.png',
            'assets/img/vehicule2.png',
            'assets/img/vehicule2.png'
        ]
    },
    {
        name: 'Audi A1',
        description: 'Diesel, 5 portes GPS, AutoRadio, Forfait 1000 km (0,55k/km supplémentaire).',
        price: '1100 € - Agence de Paris',
        images: [
            'assets/img/vehicule3.png',
            'assets/img/vehicule3.png',
            'assets/img/vehicule3.png'
        ]
    },
    {
        name: 'Opel Mokka',
        description: 'Diesel, 5 portes GPS, AutoRadio, Forfait 1000 km (0,4k/km supplémentaire).',
        price: '1150 € - Agence de Paris',
        images: [
            'assets/img/vehicule4.png',
            'assets/img/vehicule4.png',
            'assets/img/vehicule4.png'
        ]
    }
]

/**
  * Template HTML de mes voitures et mes image du carousel.
  */
const templateCar = `<div class="article row">
                        <div class="col-7 col-md-6 col-lg-4">
                            <div id="carouselArticle{{id}}" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    {{images}}
                                </div>
                                <a class="carousel-control-prev" href="#carouselArticle{{id}}" role="button" data-slide="prev">
                                    <i class="fas fa-caret-left" aria-hidden="true"></i>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselArticle{{id}}" role="button" data-slide="next">
                                    <i class="fas fa-caret-right" aria-hidden="true"></i>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                        <div class="col-5 col-md-6 col-lg-8">
                            <div class="d-flex flex-wrap h-100 justify-content-end align-items-center justify-content-lg-start align-items-lg-start align-content-lg-start">
                                <div class="article-misc d-none d-lg-block w-100">
                                    <h2>{{name}}</h2>
                                    <p>{{description}}</p>
                                    <p>{{price}}</p>
                                </div>
                                <div>
                                    <button class="btn btn-success">
                                        Réserver et Payer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;

const templateImgCar = `<div class="carousel-item{{active}}">
                            <img src="{{imagePath}}" class="d-block w-100" alt="Image de la voiture {{name}}">
                        </div>`