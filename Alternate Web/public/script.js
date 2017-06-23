var array = [];
function displayNames(user) {
    array = [];
    var temp;
    var card = document.createElement("div");
    var name = document.createElement("p");
    name.classList.add('name');
    name.innerHTML = user.user
    card.appendChild(name);
    var total = document.createElement("p");
    total.innerHTML = "Total: " + user.alltime.total
    total.style.fontWeight = "bold"
    card.appendChild(total);
    var UUID = document.createElement("p");
    UUID.innerHTML = "UUID: " + user.uuid
    UUID.style.fontWeight = "bold"
    UUID.style.fontSize = "10px"
    card.appendChild(UUID);
    for (i = 2; i < Object.keys(user.alltime).length; i++) {
        anObject = {}
        anObject[Object.keys(user.alltime)[i]] = (user.alltime[Object.keys(user.alltime)[i]])
        array.push(anObject);
        
        if ( i == Object.keys(user.alltime).length - 1) {
            array.sort(function(a, b) {
                return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]
            })
            for (x in array) { 
                temp = document.createElement("p")
                temp.innerHTML = Object.keys(array[x])[0] + ": " + array[x][Object.keys(array[x])[0]]
                card.appendChild(temp)
            }
        }
    grid.appendChild(card);
    }
}
$(document).ready(function () {
    grid = document.getElementsByClassName("container")[0]
    $.get(window.location.href + "data", function (data, status) {
        data = data["users"];
        console.log(data.length)
        for (i in data) {
            console.log(data)
            if (i == data.length - 1) {
                setTimeout(function () {
                    $(".container").shapeshift({
                        animated: false,
                        enableDrag: false,
                        enableCrossDrop: false
                    })
                }, 5)
            }
            displayNames(data[i])
        }
    })
});
