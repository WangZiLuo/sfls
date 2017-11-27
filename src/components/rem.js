var screenWidth = document.documentElement.clientWidth;
if (screenWidth >= 640) {
    document.documentElement.style.fontSize = 640 / 7.5 + "px";
} else {
    document.documentElement.style.fontSize =
        document.documentElement.clientWidth / 7.5 + "px";
}
//document.documentElement.style.fontSize=document.documentElement.clientWidth/7.5+"px";
addEventListener("resize", function() {
    var screenWidth = document.documentElement.clientWidth;
    if (screenWidth >= 640) {
        document.documentElement.style.fontSize = 640 / 7.5 + "px";
    } else {
        document.documentElement.style.fontSize =
            document.documentElement.clientWidth / 7.5 + "px";
    }
});
