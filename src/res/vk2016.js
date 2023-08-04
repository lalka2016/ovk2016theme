// Просьба не читать этот код
// Поберегите свою психику
$(document).on("click", ".accountBu", (e) => {
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

        initPage()
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
        e.currentTarget.innerHTML = theme_tr("show_information")
    } else {
        document.querySelector(".hiderr").style.display = "block"
        e.currentTarget.innerHTML = theme_tr("hide_information")
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

$(document).on("click", ".tab", (e) => {
    e.currentTarget.querySelector("a").click()
})

function setStatusEditorShown(shown) {
    if(document.getElementById("status_editor") == null) {
        console.log("dolb")
        return true;
    }

    document.getElementById("status_editor").style.display = shown ? "block" : "none";
    if(!document.status_popup_form.submit.style.width)
        document.status_popup_form.submit.style.width = document.status_popup_form.submit.offsetWidth + 4 + "px"
}

function removeMenus() {
    for(const el of document.querySelectorAll(".openingMenu")) {
        el.classList.remove("showed")
    }
}

$(document).on("click", event => {
    if(!event.target.closest("#status_editor") && !event.target.closest("#page_status_text"))
        setStatusEditorShown(false);
    console.log(event.target.parentNode.id != "openerActs")
    if(event.target.parentNode.id != "openerActs") {
        removeMenus()
    }
});

function initPage() {
    if(document.getElementById("page_status_text") != null) {
        document.getElementById("page_status_text").onclick = setStatusEditorShown.bind(this, true);
    }

    if(document.querySelector(".tabs") != null) {
        document.querySelector(".page_content").style.width = "543px"
    
        if(document.querySelector(".container_gray") != null) {
            document.querySelector(".container_gray").style.width = "543px"
        }
    }

    if(document.querySelector(".showFullInformation") != null) {
        document.querySelector(".showFullInformation").innerHTML = theme_tr("show_information")
    }
}

async function changeStatus() {
    const status = document.status_popup_form.status.value;

    document.status_popup_form.submit.innerHTML = "<div class=\"button-loading\"></div>";
    document.status_popup_form.submit.disabled = true;

    const formData = new FormData();
    formData.append("status", status);
    formData.append("hash", document.status_popup_form.hash.value);
    const response = await ky.post("/edit?act=status", {body: formData});

    if(!parseAjaxResponse(await response.text())) {
        document.status_popup_form.submit.innerHTML = tr("send");
        document.status_popup_form.submit.disabled = false;
        return;
    }

    if(document.status_popup_form.status.value === "") {
        document.querySelector("#page_status_text").innerHTML = `[ ${tr("change_status")} ]`;
        document.querySelector("#page_status_text").className = "edit_link page_status_edit_button";
    } else {
        document.querySelector("#page_status_text").innerHTML = status;
        document.querySelector("#page_status_text").className = "page_status page_status_edit_button";
    }

    setStatusEditorShown(false);
    document.status_popup_form.submit.innerHTML = tr("send");
    document.status_popup_form.submit.disabled = false;
}

$(document).on("click", ".minialbum", (e) => {
    moveToPage(e.currentTarget.dataset.href)
})

$(document).on("click", ".profile_link", (e) => {
    e.currentTarget.querySelector("a").click()
})

$(document).on("click", "#profile_link", (e) => {
    e.currentTarget.querySelector("a").click()
})

function theme_tr(string, ...args) {
    let output = window.theme_lang[string];
    if(args.length > 0) {
        if(typeof args[0] === "number") {
            const cardinal = args[0];
            let numberedString;

            switch(cardinal) {
                case 0: 
                    numberedString = string + "_zero";
                    break;
                case 1: 
                    numberedString = string + "_one";
                    break;
                default:
                    numberedString = string + (cardinal < 5 ? "_few" : "_other");
            }

            let newOutput = window.lang[numberedString];
            if(newOutput == null)
                newOutput = window.lang[string + "_other"];

            if(newOutput == null)
                newOutput = output;

            output = newOutput;
        }
    }

    if(output == null)
        return "@" + string;

    for(const [ i, element ] of Object.entries(args))
        output = output.replace(RegExp("(\\$" + (Number(i) + 1) + ")"), element);

    return output;
}


initPage()