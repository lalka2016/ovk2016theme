$(document).on("click", "#openerActs", (e) => {
    document.querySelector(".accountActions").classList.toggle("showed")
})

$(document).on("click", "ul li", (e) => {
    e.currentTarget.querySelector("a").click()
})

$(document).on("click", "#learnMore", (e) => {
    document.getElementById("learnMoreMenu").classList.toggle("showed")
})

$(document).on("click", ".notifs_container", (e) => {
    e.currentTarget.classList.toggle("toggled")
})

//ajaxifier

function moveToPage(link, writeHistory = true) {
    if(link == "") {
        console.info("Empty link, can't go")
        return 0;
    }

    let newLink = link;

    console.info("Going to " + newLink)

    let xhr = new XMLHttpRequest()

    xhr.open("GET", newLink)

    xhr.onloadstart = () => {
        
    }

    xhr.onloadend = () => {
        let html = xhr.responseText
            
        let parser = new DOMParser()

        let parsedHtml = parser.parseFromString(html, "text/html")

        let contentNode = parsedHtml.getElementsByClassName("layout")[0]
        let menuNode    = parsedHtml.getElementsByClassName("sidebar")[0]
        if(menuNode.querySelector("a").innerHTML != document.querySelector(".sidebar a").innerHTML) {
            document.querySelector(".sidebar").innerHTML = menuNode.innerHTML
        }
        

        document.title = parsedHtml.title
        document.querySelector(".page_body").innerHTML = contentNode.childNodes.item(7).innerHTML;

        if(writeHistory) {
            history.pushState({}, "", link)
        }

        if(document.querySelectorAll("video").length > 0) {
            bsdnHydrate()
        }

        scrollTo(0, 0)

        if(document.querySelector(".tabs") != null) {
            document.querySelector(".page_content").style.width = "543px"

            if(document.querySelector(".container_gray") != null) {
                document.querySelector(".container_gray").style.width = "543px"
            }
        }
    }
    
    xhr.onerror = () => {
        console.error("Error when ajaxing, skipping.")
    }
        
    xhr.send();

    u("body").removeClass("dimmed");
    u(".ovk-diag-cont").remove();
}

$(document).on("click", "a", function(e) {
    let link = e.currentTarget.href;

    if(link.indexOf("/like?hash=") != -1 || link.indexOf("javascript:") != -1 || link.indexOf("/admin") != -1 || link.indexOf(location.origin) == -1 || link.indexOf("/dev") != -1) {
        return e;
    }

    moveToPage(link)

    return e.preventDefault();
})

$(document).on("click", ".showFullInformation", function(e) {
    if(document.querySelector(".hiderr").style.display == "block") {
        document.querySelector(".hiderr").style.display = "none"
    } else {
        document.querySelector(".hiderr").style.display = "block"
    }
})

window.addEventListener('popstate', function(e) {
    moveToPage(e.target.location, false)
});

//

$(document).on("scroll", (e) => {
    e.preventDefault()
})

$(document).on("click", ".post-like-button", function(e) {
    e.preventDefault();
    
    var thisBtn = u(this).first();
    var link    = u(this).attr("href");
    var heart   = u(".heart", thisBtn);
    var counter = u(".likeCnt", thisBtn);
    var likes   = counter.text() === "" ? 0 : counter.text();
    var isLiked = heart.attr("id") === 'liked';
    
    ky(link);
    heart.attr("id", isLiked ? '' : 'liked');
    counter.text(parseInt(likes) + (isLiked ? -1 : 1));
    if (counter.text() === "0") {
        counter.text("");
    }
    
    return false;
});

if(document.querySelector(".tabs") != null) {
    document.querySelector(".page_content").style.width = "543px"

    if(document.querySelector(".container_gray") != null) {
        document.querySelector(".container_gray").style.width = "543px"
    }
}

$(document).on("click", ".tab", (e) => {
    e.currentTarget.querySelector("a").click()
})