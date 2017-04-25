function displayNames(user) {
    var temp
    var card = document.createElement("div");
    card.style.height = "300px"
    card.style.width = "200px"
    card.style.overflow = "scroll";
    card.style.border = "5px solid black"
    card.style.position = "absolute";
    var name = document.createElement("p");
    name.innerHTML = user.user
    card.appendChild(name);
    var total = document.createElement("p");
    for (i = 2; i < Object.keys(user.alltime).length; i++) {
        temp = document.createElement("p")
        temp.innerHTML = Object.keys(user.alltime)[i] + ": " + user.alltime[Object.keys(user.alltime)[i]]
        card.appendChild(temp)
    }
    grid.appendChild(card);
}

$(document).ready(function() {
    grid = document.getElementsByClassName("container")[0]
    $.get(window.location.href + "data", function(data, status){
        console.log(data.length)
        for(i in data) {
            if (i == data.length - 1) {
                setTimeout(function() {
                    $(".container").shapeshift({
                    animated: false,
                    enableDrag: false,
                    enableCrossDrop: false
                })
                },5)
            }
            displayNames(data[i])
        }
    })
});
        
