import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"; //named export are wrapped in curly braces and default export are not
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL:
        "https://add-to-cart-936a5-default-rtdb.asia-southeast1.firebasedatabase.app/", //my real time database refrence URL  from firebase for this project
};
const app = initializeApp(appSettings); //this code connect our project with fireabse
const database = getDatabase(app); //getting database from our app
const shoppingListInDB = ref(database, "shoppingList"); //setting reference

const addBtn = document.querySelector("#add-btn");
const inputField = document.querySelector("#input-field");
const shoppingListEl = document.querySelector("#shopping-list");
addBtn.addEventListener("click", function () {
    let inputValue = inputField.value;
    // Challenge: Use the Firebase function 'push' to push inputValue to the database
    // push(inputValue); //wrong
    push(
        shoppingListInDB,
        inputValue
    ); /*pushing input value in shoppingList reference 
                                       in real time databse using push function */

    //Append a new <li> with text content inputValue to the 'shopping-list' <ul>
    /*shoppingListEl.innerHTML+=`
                              <li>${inputValue}</li>
      ` */
    // Challenge: Refactor the line above into its own function.

    // appendNewInputList(inputValue) //part of bug resolved: it is already used in onValue function, no need here, it will create bug if don't remove

    //Clear the input field when button is pressed
    // inputValue=""; not working
    // inputField.value = ""; //working
    // Challenge: Refactor the line above of clearing into its own function.
    clearInput();

    console.log(inputValue);
});

/*
Call the onValue function with
shoppingListInDB as the first argument and
function(snapshot) {} as the second argument
*/
/* onValue function in Firebase is used to fetch data */ /* first Argument shoppingListInDB is used to tell function where to fetch data
 //snapshot is delivered updated content to all device if client change their data in particular data */
onValue (shoppingListInDB, function(snapshot){
    /*Change the onValue code so that it uses snapshot.exists() to show items when there are items
   in the database and if there are not displays the text 'No items here... yet'.*/
   /* this will solve the bug when we want to delte last items, it will render no item exist and render the code below indiside function  when
   snapshot exist  */
   if(snapshot.exists()){
                //Console log snapshot.val() to show all the items inside of shoppingList in the database
    // console.log(snapshot.val()); //object

   // Use Object.values() to convert snapshot.val() from an Object to an Array. Create a variable for this.
//    let shoppingArray= Object.values(snapshot.val()); //only values array
      let shoppingArray = Object.entries(snapshot.val()); //both keys and values in nested pair array
      //console.log(snapshotArray); //array
   
       clearShoppingListEl() /*part of bug that is resolved to avoiding multiple display of same thing
       bcz whenever we change any thing in database for lopps  run every, hence we have used it to clear first (dispalyed data on browser)  then run updated data from firebase*/
   
      //Write a for loop to iterate on shoppingArray and console log each item
     for(let i=0; i<shoppingArray.length;i++){
       let currentShoopingItem = shoppingArray[i];
       // console.log(currentShoopingItem); 
   
           // Make two let variables:
           // currentItemID and currentItemValue and use currentItem to set both of
           // them equal to the correct values.
           let currentItemID = currentShoopingItem[0];
           let currentItemValue = currentShoopingItem[1];
           // console.log(currentItemID);
           // console.log(currentItemValue);
   
   
       /*Use the appendItemToShoppingListEl(itemValue) function inside
        of the for loop to append item to the shopping list element for each iteration.*/
        appendNewInputList(currentShoopingItem);
   
   
        //!there is a bug when I delete any listed item in database it get displayed more than 1 times instead of deleting
        //Solution: bcz we are appending list items twice one when we add and another one is when we update our data and fetch with onValue() function
        //we have to remove to remove it from add to cart button
     } 
   } else {
    shoppingListEl.innerHTML = "No Item exist"
}
})

function clearShoppingListEl () {
    shoppingListEl.innerHTML = "";
}
function clearInput() {
    return (inputField.value = "");
  }
  function appendNewInputList(item) {
    let itemID = item[0];
    let itemValue = item[1];
//     return (shoppingListEl.innerHTML += `
//     <li>${newValue}</li>
// `);  
//innerHTML work for simple case, to use addEvent listener to their element, we need to use createElement
    let newEl = document.createElement("li"); //will create new li element
    newEl.textContent = itemValue; //will put textContent inside li element
    shoppingListEl.append(newEl); //will add newly created element inside ul element with id shopping-list

//Attach an event listener to newEl and make it so you console log the id of the item when it's pressed.
newEl.addEventListener("click", function(){
    // console.log(itemID);

    /*Make a let variable called 'exactLocationOfItemInDB' and set it equal to
     ref(database, something) where you substitute something with the code that will give you
      the exact location of the item in question.*/
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    //   console.log(exactLocationOfItemInDB);

    //Use the remove function to remove the item from the database
    remove(exactLocationOfItemInDB);
    //Bug 
    /* when we want remove the last item from list
    there is error==> @firebase/database: FIREBASE WARNING: 
    Exception was thrown by user callback. TypeError: Cannot 
    convert undefined or null to object
    Reason: when we delete last element of the list, then it also remove our refrence "shoppingList", which means when
    data changes and we know that whenever any changes in happen in database then onValue function run, but without without
     reference it get failed to run. hence no appending of updated happen in DOM to display. so in browser last listItem get not
     removed. 
    */
})

}