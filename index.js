// FIREBASE IMPORTS 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"

import { getDatabase, ref, push, onValue, remove, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-8ad13-default-rtdb.europe-west1.firebasedatabase.app/"
}


// FIREBASE INITITALIZATION
const app = initializeApp(appSettings)

const database = getDatabase(app)

const EndorsementInDB = ref(database, "EndorsementList")


// INITTIALIZATION
const textAreaFieldEl = document.getElementById("textarea-el")

const fromInputEl = document.getElementById("from-input-el")

const toInputEl = document.getElementById("to-input-el")

const publishBtn = document.getElementById("publish-btn")

const ulEl = document.getElementById("ul-el")



// PUBLISH BTN CLICK EVENTLISTENER
publishBtn.addEventListener("click", function() {
    const user = {
        fromUser: fromInputEl.value,
        toUser: toInputEl.value,
        message: textAreaFieldEl.value,
    }

    if (textAreaFieldEl.value !== "" && 
        fromInputEl.value !== "" && 
        toInputEl.value !== "") {
        // PUSH TEXT AREA VALUES IN FIREBASE DATABASE
        push(EndorsementInDB, user)
    
        // CLEAR TEXT AREA FIELD
        clearTextAreaFieldEl ()

        // CLEAR TO AND FROM INPUT FIELDS
        clearToAndFromInputFields()
    }

})


// ONVALUE FUNCTIONS THAT RUNS ANYTIME THERE IS A CHANGE TO THE REFERENCE DATABASE
onValue(EndorsementInDB, function(snapshot) {
    // ClEAR UL ELEMENT IN ORDER TO GET THE LATEST ITEM IN THE DATABASE
    clearUlElement()

    // CHECKING IF THERE'S AN ITEM IN REFERNCE DATABASE
    if (snapshot.exists()) {
    // TURNING REF DATABASE SNAPSHOT OBJECT INTO AN ARRAY
    let endorsementListArr = Object.entries(snapshot.val())


    // LOOPING THROUGH REF ARRAY TO DISPLAY DATABASE ITEMS
    for ( let i = 0; i < endorsementListArr.length; i++) {
        let currentEndorsementList = endorsementListArr[i]

        appendTextAreValuesToUlElement (currentEndorsementList)
    }
    } else {
        ulEl.innerHTML = `No endorsements yet!`
    }
     
})



// FUNCTION TO CLEAR TEXT AREA FIELD
function clearTextAreaFieldEl () {
    textAreaFieldEl.value = ""
}


// FUNCTION TO CLEAR TO AND FROM INPUT FIELDS
function clearToAndFromInputFields () {
    fromInputEl.value = ""
    toInputEl.value = ""
}

// FUNCTION TO CLEAR EL EMEMENT
function clearUlElement() {
    ulEl.innerHTML = ""
}


// FUNCTION TO APPEND TEXT AREA VALUES TO UL ELEMENT
function appendTextAreValuesToUlElement (item) {
    let itemID = item[0]
    let user = item[1]

    // CREATING NEW LI ELEMENT AND APPENDING TO UL ELEMENT
    let newEl = document.createElement("li")

    //  NEW ELEMENT TEXT CONTENT
    newEl.innerHTML = 
    `
        <p class="bold">To ${user.toUser}</p>
        <p>${user.message}</p>
        <div class="fromUser-btn-container">
            <p class="bold">From ${user.fromUser}</p>
            <span class="material-symbols-outlined delete-btn">delete</span>
        </div>
    `

    ulEl.append(newEl)

    // GETTING DELETE BTN FROM NEW LI ELEMENT
    const deleteBtn = newEl.querySelector(".delete-btn")

    // DELETE BTN CLICK EVENTLISTENER IN ORDER TO REMOVE ITEM FROM REFERENCE DATABASE
    deleteBtn.addEventListener("click", function(){
        // GETTING THE EXACT LOCATION AND ITEM ID IN REFERENCE DATABASE
        let exactLocationInDB = ref(database, `EndorsementList/${itemID}`)

        remove(exactLocationInDB)
    })

}
