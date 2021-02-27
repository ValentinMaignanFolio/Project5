
// Construction des div camera

function cameraTemplate(camera){
    return `
    <div class="product">
        <img class="camera-photo" src="${camera.imageUrl}">
        <h2 class="camera-name">${camera.name}</h2>
        <h3 class="camera-price">${camera.price/100 + ' ' + '€'}</h3>
        <p class="camera-description">${camera.description}</p>
        <p class="validate-link"><a href="productpage.html?id=${camera._id}">Ajouter</a></p>
    </div>;`
}

// récupération des données API et application de la fonction cameraTemplate()

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cameras = await(await fetch('http://localhost:3000/api/cameras')).json()
        console.log(cameras)
        document.getElementById('productslist').innerHTML = `
        ${cameras.map(cameraTemplate).join('')}`
    } catch (error) {
        console.warn("error")
    }
})


// FICHE PRODUIT INDIVIDUEL

// Ajouter un event 'click' sur le p de classe validate-link
// Au clic récupérer les infos de la div et les afficher + faire disparaitre les autres éléments de la page
// Au clic générer une nouvelle url intégrant l'id 
// Ajouter des options de personnalisation des lentilles avec l'utilisation d'un array
// Au clic sur ajouter --> passer les éléments en localStorage + incrémenter le panier
// Prévoir un lien de retour vers la page de présentation des produits








