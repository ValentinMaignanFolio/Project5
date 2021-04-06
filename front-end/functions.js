//-------------------------FUNCTIONS PRODUCTS--------------------------------//

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

function productsListCreation(){
    document.addEventListener('DOMContentLoaded', async () => {
    try {
        const cameras = await(await fetch('https://projet-orinoco.herokuapp.com/api/cameras')).json()
        document.getElementById('productslist').innerHTML = `
        ${cameras.map(cameraTemplate).join('')}`
    } catch (error) {
        console.warn("error")
    }
})
}

//--------------------------FUNCTIONS PRODUCTPAGE-------------------------------//

//Construction des fiches produits//

function productPageCreation(){
        document.addEventListener('DOMContentLoaded', async () => {
        try {
            const prod = await(await fetch('https://projet-orinoco.herokuapp.com/api/cameras/'+ id)).json()
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
            </div>`
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
}

//Affichage du nombre d'articles dans le panier//

function productAddedNumbers(){
    if(localStorage.length == 0){
        document.querySelector('.cart').textContent = "";
    }
    
    let productAdded = localStorage.getItem('productNumbers');
    if(productAdded){
        document.querySelector('.cart').textContent = productAdded;
    }
}

//Incrémentation et décrémentation//

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

//Incrémentation des quantités par produit//

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

//Calcul du prix total / Localstorage

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

//----------------------------------FUNCTIONS CART PAGE------------------------------//

function startCart(){
    let cartItems = localStorage.getItem('productsAdded');
    cartItems = JSON.parse(cartItems);
    let total = localStorage.getItem('totalPrice');
    let productListContainer = document.querySelector(".products-list");
    let form = document.querySelector(".form");
    let backlink = document.querySelector("#backlink");

    if(total == 0){
       document.querySelector(".product-header").style.display = "none";
       document.querySelector(".products-list").style.display = "none";
       localStorage.clear();
       backlink.style.display = "flex";
       backlink.style.marginTop = "10rem";
    }

    if(cartItems && productListContainer){
        productListContainer.innerHTML ='';
        Object.values(cartItems).map((cart, index) => {
            productListContainer.innerHTML += `
                <div class="products-cart">
                    <i class="fa fa-trash first-trash" aria-hidden="true"></i>
                    <img class="cart-images" src=${cart.image}>
                    <span>${cart.name}</span>
                    <i class="fa fa-trash second-trash" aria-hidden="true"></i>
                </div>
                <div class="products-price">
                    ${cart.price},00€</div>
                <div class="products-quantity">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    <span class="quantity-details">${cart.quantity}</span>
                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                </div>
                <div class="total-price">
                    ${cart.quantity * cart.price},00€
                </div>
            `    
             
        });
        productListContainer.innerHTML += `
        <div class="main-total">
            <h4 class="total-price-container">Total de la commande</h4>
            <h4 class="totalEuro">
                ${total},00€
            </h4>
        </div>`
        removeButtons();
        manageQuantity();
    }
    
}

//Suppression des articles du panier//

function removeButtons(){
    
    let removeButtons = document.getElementsByClassName('fa-trash');
    let productNumbers = localStorage.getItem('productNumbers');
    let productCost = localStorage.getItem('totalPrice')
    productCost = parseInt(productCost);
    let productItems = localStorage.getItem('productsAdded');
    productItems = JSON.parse(productItems);
    let productName;

    for (let i = 0; i < removeButtons.length; i++){
        removeButtons[i].addEventListener('click', () => {
            productName = removeButtons[i].parentElement.textContent.trim();
            localStorage.setItem('productNumbers', productNumbers - productItems[productName].quantity);
            localStorage.setItem('totalPrice', productCost - (productItems[productName].price * productItems[productName].quantity));

            delete productItems[productName];
            localStorage.setItem('productsAdded', JSON.stringify(productItems));

            startCart();
            productAddedNumbers();
            
        });
    }
}


//Incrémentation et décrémentation//

function manageQuantity(){
    let minusButtons = document.querySelectorAll('.fa-minus-circle');
    let plusButtons = document.querySelectorAll('.fa-plus-circle');
    let productsAdded = localStorage.getItem('productsAdded');
    productsAdded = JSON.parse(productsAdded);
    let actualQuantity = 0;
    let actualProduct = "";

    //------Décrémentation--------//

    for(let i=0; i < minusButtons.length; i++){
        minusButtons[i].addEventListener('click', () => {
            actualQuantity = minusButtons[i].parentElement.querySelector('span').textContent;
            actualProduct = minusButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.trim();
            
            if(productsAdded[actualProduct].quantity > 1){
                productsAdded[actualProduct].quantity = productsAdded[actualProduct].quantity - 1;
                productNumbers(productsAdded[actualProduct], "minus");
                totalPrice(productsAdded[actualProduct], "minus");
                localStorage.setItem('productsAdded', JSON.stringify(productsAdded));
                startCart();
            }

        });
    }

    //-----Incrémentation -------------//

    for(let i=0; i < plusButtons.length; i++){
        plusButtons[i].addEventListener('click', () => {
            actualQuantity = plusButtons[i].parentElement.querySelector('span').textContent;
            actualProduct = plusButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.trim();
            
            productsAdded[actualProduct].quantity = productsAdded[actualProduct].quantity + 1;
            productNumbers(productsAdded[actualProduct]);
            totalPrice(productsAdded[actualProduct]);
            localStorage.setItem('productsAdded', JSON.stringify(productsAdded));
            startCart();
        })
    }
}

//Vérification des informations du form + récupération numéro de commande

function submitForm(){
        document.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault()
        let btnSUb = document.querySelector('#send');
        let emailReg = new RegExp(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
        let email = document.getElementById('emailinput').value;
        let postalCode = document.getElementById("postalcode").value;
        let firstName = document.getElementById("firstname").value;
        let lastName= document.getElementById("lastname").value;
        let adress = document.getElementById("adress").value;
        let count = 0;

        try {
        if(emailReg.test(email)){
            const body = new FormData(document.querySelector('form'))
            count++;
            document.getElementById("emailinput").style.borderColor = 'green';
        }else{
            document.getElementById("emailinput").style.borderColor = 'red';
        }
        if(postalCode.length !== 5){
            document.getElementById("postalcode").style.borderColor = 'red';
            }else{
                document.getElementById("postalcode").style.borderColor = 'green';
                count++;
        }
        if(firstName.length < 3 || !isNaN(firstName)){
            document.getElementById("firstname").style.borderColor = 'red';
            }else{
                document.getElementById("firstname").style.borderColor = 'green';
                count++;
        }
        
        if(lastName.length < 3 || !isNaN(lastName)){
            document.getElementById("lastname").style.borderColor = 'red';
            }else{
                document.getElementById("lastname").style.borderColor = 'green';
                count++;
        }
        if(adress.length < 3){
            document.getElementById("adress").style.borderColor = 'red';
            }else{
                document.getElementById("adress").style.borderColor = 'green';
                count++;
        }
        if(count == 5){
            var ids = [];
            var productslist = JSON.parse(localStorage.getItem('productsAdded'));
            Object.values(productslist).forEach(val => ids.push(val.id));
            const user = {
                contact: {
                firstName: firstName,
                lastName: lastName,
                address: adress,
                city: postalCode,
                email: email
                },
                products: ids
            };
            
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(user),
                headers : {
                    'Content-Type': 'application/json'
                }
            }
            fetch("https://projet-orinoco.herokuapp.com/api/cameras/order", requestOptions)
                .then(res => {
                    console.log(res);
                    return res.json();
                })
                .then(res => {
                    if(res.orderId){
                        document.querySelector("#confirmation").textContent = JSON.stringify(res.orderId)
                        clearLocalStorage();
                        document.querySelector('.product-header').style.display = 'none';
                        document.querySelector('.products-list').style.display = 'none';
                        document.querySelector('.products-container').style.height = '700px';
                        document.querySelector('.cart').textContent = 0;
                
                    }else{
                        document.querySelector("#confirmation").textContent = "erreur";
                        console.warn("error");
                    }
                }).catch(error => console.log('error', error));

                let form = document.querySelector(".form")
                let backlink = document.querySelector("#backlink")
                let orders = document.querySelector(".orders")

                orders.style.display = 'block';
                backlink.style.display = "flex";
                form.style.display = 'none';  
            }
        } catch (e) {
        console.warn(e);
        } finally {
        btnSUb.style.display = 'block'
        }
    })
}

//Nettoyage du localStorage à la validation de la commande

function clearLocalStorage(){
    let backhome = document.querySelector("#backlink")
    backhome.addEventListener('click', e => {
        localStorage.clear();
    });
}
