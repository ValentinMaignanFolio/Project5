//--------------Récupération des données en localstorage / Construction du panier----------------//

var aLength = localStorage.length;
if(aLength == 0){
    document.querySelector('.cart').style.display = "none";
}

//document.querySelector('.cart').style.display = localStorage.length?"block":"none";
//--------------------Vérification des données du formulaire------------------------------//

startCart();
productAddedNumbers();
submitForm();