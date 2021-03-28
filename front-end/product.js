

const USP= new URLSearchParams(location.search)
let id = USP.get('id');


//------------------Construction des fiches produits------------------------//

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const prod = await(await fetch('http://localhost:3000/api/cameras/'+ id)).json()
        document.getElementById('product').innerHTML = 
        `
        <div class="product-camera">
        <img class="product-photo" src="${prod.imageUrl}">
        <h2 class="product-name">${prod.name}</h2>
        <h3 class="product-price">${prod.price/100},00€</h3>
        <p class="product-description">${prod.description}</p>
        <form class="personalized">
            <select id="select-option">
                <option class="option">${prod.lenses[0]}</option>
                <option class="option">${prod.lenses[1]}</option>
            </select>
        </form>
        <button class="cart-btn">Ajouter au panier</button>
        </div>;`
        let count=0;
        const cart = {
            name : prod.name,
            id : id, 
            image : prod.imageUrl, 
            price :prod.price/100, 
            description :prod.description, 
            quantity : 0
        };

        let carts = document.querySelectorAll('.cart-btn');
        for (let i=0; i < carts.length; i++){
            carts[i].addEventListener('click', () => {
                productNumbers(cart);
                totalPrice(cart);
            })
        }  
       
    } catch (error) {
        console.warn("error")
    }
})

//-----------------Affichage du nombre d'articles dans le panier-------//

function productAddedNumbers(){
    let productAdded = localStorage.getItem('productNumbers');
    if(productAdded){
        document.querySelector('.cart').textContent = productAdded;
    }
}

//-----------------Incrémentation et décrémentation------------------//

function productNumbers(cart, action){
    let productAdded = localStorage.getItem('productNumbers');
    productAdded = parseInt(productAdded);
    let productsAdded = localStorage.getItem('productsAdded');
    productsAdded = JSON.parse(productsAdded);

    if(action == "minus"){
        localStorage.setItem('productNumbers', productAdded - 1);
        document.querySelector('.cart').textContent = productAdded - 1;
    }else if(productAdded){
        localStorage.setItem('productNumbers', productAdded + 1)
        document.querySelector('.cart').textContent = productAdded + 1;
    }else{
        localStorage.setItem('productNumbers', 1);
        document.querySelector('.cart').textContent = 1;
    }

    setItems(cart);
}

//----------------------------Incrémentation des quantités par produit-------------------------//

function setItems(cart){
    let cartItems = localStorage.getItem('productsAdded');
    cartItems = JSON.parse(cartItems);
    

    if(cartItems != null){
        if(cartItems[cart.name] == undefined){
            cartItems = {
                ...cartItems,
                [cart.name]: cart
            }
        }
        cartItems[cart.name].quantity += 1;
    }else{
        cart.quantity = 1;
        cartItems = {
            [cart.name]: cart
        }
    }
    localStorage.setItem("productsAdded", JSON.stringify(cartItems));
}

//-----------------------------CALCUL DU PRIX TOTAL / LOCALSTORAGE----------------------//

function totalPrice(cart, action){
    let cartCost = localStorage.getItem('totalPrice');
    
    if(action == "minus"){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalPrice', cartCost - cart.price);
    }else if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalPrice", cartCost + cart.price);
    }else{
        localStorage.setItem("totalPrice", cart.price);
    }
}

productAddedNumbers();




 
