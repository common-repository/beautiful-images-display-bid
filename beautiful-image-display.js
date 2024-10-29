/******************  Beautiful Images Display [By iWillFolo.com] **********************/
var items = document.body.getElementsByTagName("*"),
itemSrcs = [],
itemsClist = [],
preventDef = [],
overlay = null,
clsBtn = null,
rightBtn = null,
leftBtn = null,
leftArrow = null,
rightArrow = null,
currentSrc = null,
iframeIndex = [],
iframeOrImg = null,
arrowsTog = 0,
width = 0,
height = 0,
bidButonColor = "style='" + bidColor + "'";

function scalefun() {
        if ( (window.innerWidth > window.outerWidth) || (window.innerWidth < 100) || (window.innerWidth == null) ) {
            width = window.outerWidth;
            height = window.outerHeight;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }
}
scalefun();

for (var i=0; i<items.length; i++) {
        if (items[i].tagName == "IMG") {
                var parentCheck = items[i].parentElement;
                if ( parentCheck.tagName !== "A" ) {
                        while ( (parentCheck.tagName !== "BODY") && (parentCheck.tagName !== "A") ) {
                                parentCheck = parentCheck.parentElement;
                        }
                }
                if  ( (parentCheck.getAttribute("href")) && (parentCheck.getAttribute("href").search(/\.(jp(e|g|eg)|png|gif|svg)$/) > -1) ) {
                        itemSrcs.push( parentCheck.getAttribute("href") );
                        itemsClist.push(items[i]);
                        preventDef.push(items[i]);
                } else if (parentCheck.getAttribute("href") == null) {
                        itemSrcs.push( items[i].getAttribute("src") );
                        itemsClist.push(items[i]);
                }
        } else if (items[i].tagName == "IFRAME") {
                if ( (items[i].getAttribute("src")) && (items[i].getAttribute("src").indexOf("youtube.com/") > -1) ) {
                        itemSrcs.push( items[i].getAttribute("src") );
                        itemsClist.push(items[i]);
                        iframeIndex.push(itemSrcs.length - 1);                                          
                }
        }
}

function ifrmOrImg(currentSrc, event) {
        if (window.getComputedStyle(event.target, null).getPropertyValue("direction") == "rtl") {
                if (currentSrc > 0) {
                        leftArrow = "<div id='bid-left'><span class='bid-arrow' " + bidButonColor + ">></span></div>";
                } else {
                        leftArrow = null;
                }
                if (currentSrc < itemsClist.length - 1) {
                        rightArrow = "<div id='bid-right'><span class='bid-arrow' " + bidButonColor + "><</span></div>";
                } else {
                        rightArrow = null;
                }
        } else {
                if (currentSrc > 0) {
                        leftArrow = "<div id='bid-left'><span class='bid-arrow' " + bidButonColor + "><</span></div>";
                } else {
                        leftArrow = null;
                }
                if (currentSrc < itemsClist.length - 1) {
                        rightArrow = "<div id='bid-right'><span class='bid-arrow' " + bidButonColor + ">></span></div>";
                } else {
                        rightArrow = null;
                }
        }
        if (iframeIndex.indexOf(currentSrc) > -1) {
                iframeOrImg = "<iframe  id='bid-item' src='" + itemSrcs[currentSrc] + "' frameborder='0'></iframe><div id='bid-closebtn' " + bidButonColor + ">X</div>" + leftArrow + rightArrow;
        } else {
                iframeOrImg = "<img id='bid-item' src='" + itemSrcs[currentSrc] + "' /><div id='bid-closebtn' " + bidButonColor + ">X</div>" + leftArrow + rightArrow;
        }
}

// Creating the BID on click event
document.addEventListener("click", bidClick, true);
function bidClick(event) {
        if (event.button == 0) {
                if (preventDef.indexOf(event.target) > -1) {
                        event.preventDefault();
                }
                if ( (currentSrc === null) && (itemsClist.indexOf(event.target) > -1) ) {
                        scalefun();
                        currentSrc = itemsClist.indexOf(event.target);
                        ifrmOrImg(currentSrc, event);
                        overlay = document.createElement("DIV");
                        overlay.setAttribute("id", "bid-overlay");
                        overlay.innerHTML = iframeOrImg;
                        document.body.appendChild(overlay);
                        bidPlacement();
                        window.addEventListener("keydown", bidKey);
                        window.addEventListener("resize", bidResize);
                } else if (overlay !== null) {
                        if ( (event.target == overlay) || (event.target == clsBtn) ) {
                                bidBlose();
                        }
                        if ( (rightBtn) && ( (event.target == rightBtn) || (event.target == rightBtn.firstChild) ) ) {
                                bidRight(event);
                        }
                        if ( (leftBtn) && ( (event.target == leftBtn)  || (event.target == leftBtn.firstChild) ) ) {
                                bidLeft(event);
                        }
                }
        }
}

/*** Buttons functions:  ***/
// Close
function bidBlose() {
        window.removeEventListener("keydown", bidKey);
        window.removeEventListener("resize", bidResize);
        document.body.removeChild(overlay);
        currentSrc = null;
        arrowsTog = 0;
}
// Right
function bidRight(event) {
        if (currentSrc <= itemsClist.length - 2) {
                currentSrc += 1;
                ifrmOrImg(currentSrc, event);
                overlay.innerHTML = iframeOrImg;
                bidPlacement();
        }
}
// Left
function bidLeft(event) {
        if (currentSrc >= 1) {
                currentSrc -= 1;
                ifrmOrImg(currentSrc, event);
                overlay.innerHTML = iframeOrImg;
                bidPlacement();
        }
}

// Correctly place bid items
var itemWid = 0,
itemHeigh = 0,
bidLoaded = '',
bidItem = '',
itemRatio = 0,
sizeInterval = null;

function bidPlacement() {
        bidItem = overlay.firstChild;
        clsBtn = document.getElementById("bid-closebtn");
        rightBtn = document.getElementById("bid-right");
        leftBtn = document.getElementById("bid-left");

        if (bidItem.tagName == "IMG") {
                sizeInterval = setInterval(function() {
                        if ( (bidItem.offsetWidth > 0) && (bidItem.complete == true) ) {
                                clearInterval(sizeInterval);
                                itemWid = bidItem.naturalWidth;
                                itemHeigh = bidItem.naturalHeight;
                                bidSizing();
                        }
                }, 100);
        } else {
                itemWid = 1280;
                itemHeigh = 720;
                bidSizing();
        }
}

function bidSizing() {
        // Taking close button into account
        if ( (width < (itemWid + 35) ) || (height < (itemHeigh + 22) ) ) {
                itemRatio = itemWid / itemHeigh;
                if (width / height < itemRatio) {
                        itemWid = Math.min(itemWid - 35, width - 35);
                        itemHeigh = (itemWid / itemRatio);
                } else {
                        itemHeigh = Math.min(height, itemHeigh) - 45;
                        itemWid = itemHeigh * itemRatio - 35;
                }
        }
        
        bidItem.style.width = itemWid + "px";
        bidItem.style.height = itemHeigh + "px";
        bidItem.style.top = Math.max( 22,  ( (height - itemHeigh) / 2 ) ) + "px";
                
        clsBtn.style.right = "-" + Math.max(itemWid, 100) + "px";
        clsBtn.style.top = Math.max( 25,  ( (height - itemHeigh) / 2 ) ) - 15 + "px";
        bidItem.style.visibility = clsBtn.style.visibility = "visible";
        if (leftBtn) {
                leftBtn.style.top = Math.max( 22,  ( (height - itemHeigh) / 2 ) ) + "px";
                leftBtn.style.width = itemWid * 0.30 + "px";
                leftBtn.style.visibility = clsBtn.style.visibility;
                if (bidItem.tagName == "IMG") {
                        leftBtn.style.left = (width - itemWid) / 2 + "px";
                        leftBtn.style.height = itemHeigh + 22 + "px";
                } else {
                        leftBtn.style.left = (width - itemWid) / 2 - 11 + "px";
                        leftBtn.style.height = itemHeigh - 22 + "px";
                }
        }
        if (rightBtn) {
                rightBtn.style.top = Math.max( 22,  ( (height - itemHeigh) / 2 ) ) + "px";
                rightBtn.style.width = itemWid * 0.30 + "px";
                rightBtn.style.visibility = bidItem.style.visibility;
                if (bidItem.tagName == "IMG") {
                        rightBtn.style.right = (width - itemWid) / 2 + "px";
                        rightBtn.style.height = itemHeigh + 22 + "px";
                } else {
                        rightBtn.style.right = (width - itemWid - 22) / 2 + "px";
                        rightBtn.style.height = itemHeigh - 22 + "px";
                }
        }
}

// Keyboard navigation
function bidKey(event) {
        if (event.keyCode == 27) {
                bidBlose();
        } else if (event.keyCode == 37) {
                bidLeft(event);
        } else if (event.keyCode == 39) {
                bidRight(event);
        }
}

// Responsive BID
function bidResize() {
        scalefun();
        setTimeout(bidPlacement, 400);
}
/************************** / Beautiful Images Display ****************************/
