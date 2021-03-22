

// Construction de la liste de produits //

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
        document.getElementById('productslist').innerHTML = `
        ${cameras.map(cameraTemplate).join('')}`
    } catch (error) {
        console.warn("error")
    }
})








