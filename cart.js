//--------------Récupération des données en localstorage / Construction du panier----------------//



function startCart(){
    
    let cartItems = localStorage.getItem('productsAdded');
    cartItems = JSON.parse(cartItems);
    let total = localStorage.getItem('totalPrice');
    let productListContainer = document.querySelector(".products-list");

    if(cartItems && productListContainer){
        productListContainer.innerHTML ='';
        Object.values(cartItems).map((cart, index) => {
            productListContainer.innerHTML += `
                <div class="products-cart">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    <img class="cart-images" src=${cart.image}>
                    <span>${cart.name}</span>
                </div>
                <div class="products-price">${cart.price},00€</div>
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

//------------------------------Suppression des articles du panier----------------------//

function removeButtons(){
    
    let removeButtons = document.querySelectorAll('.products-cart i');
    let productNumbers = localStorage.getItem('productNumbers');
    let productCost = localStorage.getItem('totalPrice')
    productCost = parseInt(productCost);
    let productItems = localStorage.getItem('productsAdded');
    productItems = JSON.parse(productItems);
    let productName;

    for (let i = 0; i < removeButtons.length; i++){
        
        removeButtons[i].addEventListener('click', () => {
            productName = removeButtons[i].parentElement.textContent.trim();
            console.log("productName", productName);
            localStorage.setItem('productNumbers', productNumbers - productItems[productName].quantity);
            localStorage.setItem('totalPrice', productCost - (productItems[productName].price * productItems[productName].quantity));

            delete productItems[productName];
            localStorage.setItem('productsAdded', JSON.stringify(productItems));

            startCart();
            productAddedNumbers();
        });
    }
}


//-------------------Incrémentation et décrémentation--------------------------//

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




//--------------------Vérification des données du formulaire------------------------------//

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
        //e.preventDefault()
        }else{
            document.getElementById("adress").style.borderColor = 'green';
            count++;
      }
      if(count == 5){
          
          location.assign = 'home.html'; // c'est une fonction revoir la synthaxe
          //document.getElementById("confirmation").textContent = "Votre numéro de commande est le : " + "0" + number + " " + " " + "Merci pour votre achat et votre confiance !";
        
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
          fetch("http://localhost:3000/api/cameras/order", requestOptions)
            .then(res => res.json())
            .then(res => localStorage.setItem('order', JSON.stringify(res.orderId)))
            .catch(error => console.log('error', error));

            let backlink = document.querySelector("#backlink")
            let order = JSON.parse(localStorage.getItem('order'))
            let orders = document.querySelector(".orders")
            orders.innerHTML = `
                <p>Votre numéro de commande est le:</p> 
                <p>${order}</p>`

            orders.style.color = 'white';
            orders.style.margin = '4em';
            backlink.style.display = "flex";
            
            document.querySelector('.products-container').style.display = 'none';
            
        }
    } catch (e) {
      console.warn(e);
    } finally {
      btnSUb.style.display = 'block'
    }
})

startCart();
productAddedNumbers();

  

function toCancel(){
    var toCancel = document.querySelector('.products-container');
    toCancel.style.display ="none";
}


function productAddedNumbers(){
    let productAdded = localStorage.getItem('productNumbers');
    if(productAdded){
        document.querySelector('.cart').textContent = productAdded;
    }
}



//aller chercher les infos dans les input

//var myHeaders = new Headers();
//myHeaders.append("Content-Type", "application/json");

