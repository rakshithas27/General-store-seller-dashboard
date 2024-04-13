const form = document.querySelector('#formSubmit')

form.addEventListener('submit', function(event) {
    event.preventDefault()

    const itemName = event.target.itemName.value
    const description = event.target.description.value
    const price = event.target.price.value
    const quantity = event.target.quantity.value

    const obj = {
        itemName: itemName,
        description: description,
        price: price,
        quantity: quantity
    } 

    const newObj = JSON.stringify(obj)
    localStorage.setItem(itemName,newObj)

    axios
        .post("https://crudcrud.com/api/e2b31fc1fe1242749cce363b661295de/sellerDashboard",obj)
        .then((response) => {
            displayItemsOnScreen(response.data)
        })
        .catch((err) => console.log(err))

        event.target.reset()
})

function fetchAndDisplayItems() {
    axios.get("https://crudcrud.com/api/e2b31fc1fe1242749cce363b661295de/sellerDashboard")
        .then((response) => {
            response.data.forEach((itemData) => {
                displayItemsOnScreen(itemData);
            });
        })
        .catch((err) => console.log(err))
}

// Call the fetchAndDisplayItems function when the window loads
window.addEventListener('DOMContentLoaded', fetchAndDisplayItems);


function displayItemsOnScreen(obj) {
    const mainList = document.querySelector('#items');
    const list = document.createElement('li');
    list.innerHTML = `${obj.itemName} - ${obj.description} - ${obj.price} - <span id="${obj.itemName}-quantity">${obj.quantity}</span>`;
    mainList.appendChild(list);

    const buy1 = createBuyButton(obj, 1);
    const buy2 = createBuyButton(obj, 2);
    const buy3 = createBuyButton(obj, 3);

    list.appendChild(buy1);
    list.appendChild(buy2);
    list.appendChild(buy3);
}





function createBuyButton(obj, amount) {
    const button = document.createElement('button');
    button.textContent = `Buy${amount}`;
    button.addEventListener('click', function() {
        decreaseQuantity(obj, amount);
    });
    return button;
}

function decreaseQuantity(obj, amount) {
    // Parse quantity as integer
    obj.quantity = parseInt(obj.quantity);

    // Ensure quantity is a number
    if (isNaN(obj.quantity)) {
        obj.quantity = 0;
    }

    // Log the current quantity
    console.log("Current quantity:", obj.quantity);

    // Decrease quantity by the specified amount
    obj.quantity -= amount;

    // Ensure quantity doesn't go below 0
    if (obj.quantity < 0) {
        obj.quantity = 0;
    }

    // Log the updated quantity
    console.log("Updated quantity:", obj.quantity);

    // Update item in localStorage
    localStorage.setItem(obj.itemName, JSON.stringify(obj));

    // Update displayed quantity on the screen
    const quantitySpan = document.getElementById(`${obj.itemName}-quantity`);
    if (quantitySpan) {
        quantitySpan.textContent = obj.quantity;
    }

    // Update quantity in CRUD database
    const itemId = obj._id;
    axios.put(`https://crudcrud.com/api/e2b31fc1fe1242749cce363b661295de/sellerDashboard/${itemId}`, obj)
        .then((response) => {
            console.log("Quantity updated in CRUD:", response.data);
        })
        .catch((err) => console.log(err));
}




