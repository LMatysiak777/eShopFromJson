let allProducts = JSON.parse(data);
let filteredProducts, basket, totalValueCart, filters = ['cat'];
sessionStorage.getItem('totalValueCart')?totalValueCart=sessionStorage.getItem('totalValueCart'):totalValueCart=0.00;
sessionStorage.getItem('filteredProducts')?filteredProducts=JSON.parse(sessionStorage.getItem('filteredProducts')):filteredProducts=allProducts;
sessionStorage.getItem('basket')?basket=JSON.parse(sessionStorage.getItem('basket')):basket=[0];
sessionStorage.getItem('totalValueCart')?document.querySelector("#basket-price-enabled").innerHTML=totalValueCart:null;
document.querySelector(".basket-item-single-name-two")?document.querySelector(".basket-item-single-name-two").innerHTML = "TOTAL VALUE ORDER: "+sessionStorage.getItem('totalPurchaseValue'):null;
generateProductList(filteredProducts);
generateFilterButtons();

function setInputForm() {
let inputs=document.querySelectorAll('.input-text'); 
inputs.forEach((btn)=>btn.addEventListener('input',inputForm))
}

// SHARED

function checkFreeShipment() {
  totalValueCart = sessionStorage.getItem('totalValueCart')
  if (500-totalValueCart>=0) {
  document.querySelector("#shipment-options").innerHTML = `<span>Select shipment option:&nbsp&nbsp</span>
  <select id="shipment-select">
    <option value=15>Standard: 15$</option>
    <option value=25>Express: 25$</option>
    <option value=50>Overseas: 50$</option>
  </select>
  <span>&nbsp&nbspFree shipment above 500$ missing:&nbsp${(500-totalValueCart).toFixed(2)}$`;
  document.querySelector('#shipment-select').addEventListener('change',shipmentValueInput);
  sessionStorage.setItem('shipmentValue',15);
  saveBasketQuick();
}
  else {
  document.querySelector("#shipment-options").innerHTML = `Shipment is free`;
  sessionStorage.setItem('shipmentValue',0)
  saveBasketQuick();
}

}

function shipmentValueInput(e) {
  if (!e) sessionStorage.setItem("shipmentValue",15) 
  else {
  sessionStorage.setItem("shipmentValue",e.target.value)
  
}
saveBasketQuick()}

function checkIfBasketEmpty() {
  if (!basket[1]) {
  document.querySelector('#empty-message').innerHTML += "EMPTY";
  document.querySelector('#shipment-options').style.visibility = "hidden";
  }}

function saveBasket() {
  sessionStorage.setItem('basket',JSON.stringify(basket));
}

function checkBasket(input) {
  for (let i = 1; i < basket.length; i++) {
    if (basket[i][0] == input[0] && basket[i][1] == input[1]) return i;
  }
  return false;
}

function refreshBasket(basket) {
  let totalValueCart;
  const priceContainer = document.querySelector("#basket-price-enabled");
  basket.forEach((x) => {
    let optionPrice;
    allProducts.forEach((y) => {
      y.ID == x[0] ? (optionPrice = y[`OPTION${x[1]}PRICE`]) : undefined;
      x[3] = optionPrice;
      x[4] = x[2] * x[3];
    });
  });
  totalValueCart = basket.reduce((acc, x) => {return acc + x[4];});
  totalValueCart = Number(totalValueCart).toFixed(2);
  priceContainer.textContent = totalValueCart;
  priceContainer.className = "basket-price-disabled";
  $(priceContainer).fadeIn(500).fadeOut(500).fadeIn(500);
  $(priceContainer)
    .promise()
    .done(function () {
      priceContainer.className = "basket-price-enabled";
    });
    sessionStorage.setItem('basket',JSON.stringify(basket));
    sessionStorage.setItem('totalValueCart',totalValueCart);
    saveBasket();
}

// INDEX.HTML SPECIFIC

function generateFilterButtons() {
  let allCategoriesOfProducts = [];
  for (let i=0;i<allProducts.length;i++) {
    allCategoriesOfProducts.includes(allProducts[i].TYPE)?null:allCategoriesOfProducts.push(allProducts[i].TYPE)
  }
 
  allCategoriesOfProducts.forEach(x=>{
    let button = document.createElement('button');
    button.innerHTML=x;
    button.value = x;
    button.className = "btn-type-filter-disabled filter-lvl2 btn-filter";
    document.querySelector("#nav-bar").insertBefore(button,document.querySelector("#insert-before-marker"));
    })
}

function generateProductList(filteredProducts) {
  let productList = document.querySelector("#product-list");
  productList.innerHTML = "";
  filteredProducts.forEach((x) => {
    x.FILTER == true ? generateProduct(x) : null;
  });
}

function generateProduct(prod) {
  let productList = document.querySelector("#product-list");
  let newDiv = document.createElement("div");
  let dropdown = document.createElement("select");
  let addButton = document.createElement("button");
  let image = document.createElement("img");
  let span = document.createElement("span");

  addButton.textContent = "TO CART";
  addButton.id = prod.ID;
  addButton.className = "add-btn-enabled";
  addButton.setAttribute("value", 1);
  addButton.addEventListener("click", addButtonClick);

  image.setAttribute("src", prod.PICTUREURL);
  image.className="product-picture";

  span.className="select-option";
  span.innerHTML="<br>select option:<br>";

  newDiv.id = "product" + prod.ID;
  newDiv.value = prod.ID;
  newDiv.className = "product-div";
  newDiv.innerHTML = "<span class=product-div-name>" + prod.NAME + "</span>";
  newDiv.appendChild(image);
  newDiv.appendChild(span);
  newDiv.appendChild(dropdown);
  newDiv.appendChild(addButton);

  dropdown.addEventListener("change", changeOption);
  dropdown.innerHTML = generateOptionDroplist(prod);

  productList.appendChild(newDiv);
  
}

function generateOptionDroplist(prod) {
  // max 5 options are expected (according to csv file structure)
  let sizeSelector, priceSelector;
  let injectionString = `<select id=${prod.ID}"-select">`;
  for (let i=1; i<=5; i++) {
    sizeSelector = "OPTION"+i+"SIZE";
    priceSelector = "OPTION"+i+"PRICE";
    if (prod[sizeSelector]!=false) {injectionString+=`<option value =${i}>${prod[sizeSelector]} ${prod[priceSelector]} $</option>` }
  }
  injectionString += `</select>`;
  return injectionString;
}

function changeOption(e) {
  console.log(e.target.id);
  let button = document.querySelector(`#${e.target.parentElement.value}`);
  button.setAttribute("value", e.target.value);
}

function addButtonClick(e) {
  const btn = document.querySelector(`#${e.target.id}`);
  basketInputObject = [e.target.id, e.target.value, 1];
  let check = checkBasket(basketInputObject);
  check !== false ? basket[check][2]++ : basket.push(basketInputObject);
  btn.textContent = "ADDED 1 PC TO CART";
  btn.disabled = true;
  btn.className = "add-btn-disabled";
  $(btn).fadeIn(500).fadeOut(500).fadeIn(500);
  $(btn)
    .promise()
    .done(function () {
      btn.className = "add-btn-enabled";
      btn.textContent = "TO CART";
      btn.disabled = false;
    });
  refreshBasket(basket);
}

//  INDEX.HTML elements event setting
let typeFilterButtons = document.querySelectorAll(".btn-filter");
typeFilterButtons.forEach((x) =>
  x.addEventListener("click", filterButtonClick)
);
 
document.querySelector("#filter-ascending").addEventListener("click",filterAscending);
document.querySelector("#filter-descending").addEventListener("click",filterDescending);
document.querySelector("#price-filter-ok-button").addEventListener("click",filterPrice);
document.querySelector("#input-name-filter").addEventListener("input",filterName);

function saveFilter() {
    sessionStorage.setItem('filteredProducts',JSON.stringify(filteredProducts));
}

function filterButtonClick(e) {
  let allFilterButtons = document.querySelectorAll(".btn-filter");
  allFilterButtons.forEach(x=>x.className=x.className.replace("btn-type-filter-enabled","btn-type-filter-disabled"))
  e.target.className=e.target.className.replace("btn-type-filter-disabled","btn-type-filter-enabled");
 
  if (e.target.value=="all") {
  filteredProducts.filter((x) => x.FILTER=true)
  }
  else {
  filters[1] = e.target.value;
  fiteredProducts = filteredProducts.forEach((x) => {
    x.TYPE == filters[1]
      ? (x.FILTER = true)
      : (x.FILTER = false);
  });}
  saveFilter();
  generateProductList(filteredProducts);
}

function filterAscending() {
  filteredProducts.sort(function(a,b){return a.OPTION1PRICE-b.OPTION1PRICE});
  saveFilter();
  generateProductList(filteredProducts);
}

function filterDescending() {
  filteredProducts.sort(function(a,b){return b.OPTION1PRICE-a.OPTION1PRICE});
  saveFilter();
  generateProductList(filteredProducts);
}

function filterPrice() {
  let min=document.querySelector("#price-filter-min").value;
  let max=document.querySelector('#price-filter-max').value;
  filteredProducts.forEach(x=>{(x.OPTION1PRICE>=min&&x.OPTION1PRICE<=max)?x.FILTER=true:x.FILTER=false;})
  saveFilter();
  generateProductList(filteredProducts);
}

function filterName(e){
  let currentInput = e.target.value;
  filteredProducts.forEach(x=>{x.NAME.toLowerCase().includes(currentInput.toLowerCase())?x.FILTER=true:x.FILTER=false});
  saveFilter();
  generateProductList(filteredProducts);
}

// BASKET.HTML SPECIFIC

function purchaseClick () {
  if (basket.length<=1) {alert('SHOPPING CART IS EMPTY')}
  else window.location.href="./purchase.html"
}

function generateBasketList () {
  checkIfBasketEmpty();
  checkFreeShipment();
  let basketList = document.querySelector('#basket-list');
  basketList.innerHTML = '';
  basket.forEach(x=>generateBasketItem(x));
  }
  
function generateBasketItem (basketItem){
  if (basketItem[0]==undefined||basketItem[0]==null) return ; 
  let basketList = document.querySelector('#basket-list');
  let newDiv = document.createElement("div");
  newDiv.className = "basket-item";
  newDiv.setAttribute("position",basket.indexOf(basketItem));
  let plusButton = document.createElement("button");
  plusButton.textContent = "+";
  plusButton.position=basket.indexOf(basketItem);
  plusButton.className = "plus-btn";
  plusButton.addEventListener("click",plusButtonClick);
  let minusButton = document.createElement("button");
  minusButton.textContent = "-";
  minusButton.position=basket.indexOf(basketItem);
  minusButton.id = basketItem[0];
  minusButton.className = "minus-btn";
  minusButton.addEventListener('click',minusButtonClick);
  let removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.position=basket.indexOf(basketItem);
  removeButton.id = basketItem[0];
  removeButton.className = "remove-btn";
  removeButton.addEventListener('click',removeButtonClick);
  let nameField = document.createElement("span");
  nameField.className ="basket-item-single-name";
  nameField.innerHTML = checkItemName(basketItem);
  let optionField = document.createElement("span");
  optionField.className ="basket-item-single-option"
  optionField.innerHTML = checkItemOption(basketItem);
  let amountField = document.createElement("span");
  amountField.className = "basket-item-single-amount";
  amountField.innerHTML = basketItem[2]+`<span style="color:black"> x</span>`;
  let unitPriceField = document.createElement("span");
  unitPriceField.className ="basket-item-single-price";
  unitPriceField.innerHTML = basketItem[3]+ "$";
   
  let image=document.createElement("img");
  image.setAttribute("src",checkURL(basketItem));
  image.className="product-picture-minature";
  newDiv.appendChild(nameField);
  newDiv.appendChild(optionField);
  newDiv.appendChild(image);
  newDiv.appendChild(amountField);
  newDiv.appendChild(unitPriceField);
  newDiv.appendChild(plusButton);
  newDiv.appendChild(minusButton);
  newDiv.appendChild(removeButton);
  basketList.appendChild(newDiv);
  saveBasketQuick();
}

function plusButtonClick (e){
  basket[e.target.position][2]++;
  saveBasketQuick();
  generateBasketList();
}
function minusButtonClick (e){
  if(basket[e.target.position][2]==1) return;
  basket[e.target.position][2]--;
  saveBasketQuick();
  generateBasketList();
}
function removeButtonClick (e){
  if (confirm('Do you want to remove this item from basket?')) {
  basket.splice(e.target.position,1);
  saveBasketQuick();
  generateBasketList();}
}

function checkItemName(basketItem) { 
  var result;
  allProducts.forEach((x)=>{if (x.ID==basketItem[0]) result=x.NAME});
  return result; 
}

function checkItemOption(basketItem) {
  var result;
 
  allProducts.forEach((x)=>{if (x.ID==basketItem[0]) {result="size: "+x[`OPTION${basketItem[1]}SIZE`]}})
   
  return result;
}
  
  function checkURL(basketItem) {
  var result;
  allProducts.forEach((x)=>{if (x.ID==basketItem[0]) result=x.PICTUREURL});
  return result;
}


function clearBasket() {
  if (confirm('Do you want to remove all items from cart?')) {
      basket = [];
      basket[0]=0;
      sessionStorage.setItem('totalValueCart','0.00');
      sessionStorage.setItem('basket',JSON.stringify(basket));
      saveBasketQuick(basket);
      generateBasketList(basket);
      
  }
}
  
  
  
  
  
  function saveBasketQuick() {
       
      const priceContainer = document.querySelector("#basket-price-enabled");
      basket.forEach((x) => {
        let optionPrice;
        allProducts.forEach((y) => {
          y.ID == x[0] ? (optionPrice = y[`OPTION${x[1]}PRICE`]) : undefined;
          x[3] = optionPrice;
          x[4] = x[2] * x[3];
        });
      });
      let totalValueCart = basket
        .reduce(function (acc, x) {
          return acc + x[4];
        })
        .toFixed(2);
      priceContainer.textContent = totalValueCart;
      let shipmentValue = sessionStorage.getItem('shipmentValue');
      
      let totalPurchaseValue = Number(shipmentValue)+Number(totalValueCart);
      document.querySelector('#totalValueCart').innerHTML= totalPurchaseValue.toFixed(2);
      sessionStorage.setItem('basket',JSON.stringify(basket));
      sessionStorage.setItem('totalValueCart',totalValueCart);
      sessionStorage.setItem('totalPurchaseValue',totalPurchaseValue);
  
   }
  

   function inputForm(e) {
 
sessionStorage.setItem(e.target.name,e.target.value);   
}

function generateSummary() {
  let name=sessionStorage.getItem('First Name');
  document.querySelector('#summary-text').innerHTML="Thank you for your purchase "+`${name}`+" :)";
 sessionStorage.clear() ;

}